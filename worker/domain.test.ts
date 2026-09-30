// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DOMAIN_SUFFIX } from '../src/lib/domainName.ts'
import { SELF_WORKER_NAME, clearListingCache, handleDomainCheck } from './domain.ts'
import type { Env, RateLimiter } from './env.ts'
import worker from './index.ts'

const ORIGIN = 'https://portfolio.axeldev.workers.dev'

const ASSETS = { fetch: () => Promise.resolve(new Response('site estático')) }

function env(overrides: Partial<Env> = {}): Env {
  return {
    CLOUDFLARE_ACCOUNT_ID: 'conta-de-teste',
    CLOUDFLARE_API_TOKEN: 'token-de-teste',
    ASSETS,
    ...overrides,
  }
}

function ask(name: string | null, init: RequestInit = {}): Request {
  const query = name === null ? '' : `?nome=${encodeURIComponent(name)}`
  return new Request(`${ORIGIN}/api/dominio${query}`, init)
}

/** Resposta da API da Cloudflare com estes Workers (cada um com `id` = nome, como na API real). */
function listing(...names: string[]): Response {
  return Response.json({ success: true, result: names.map((id) => ({ id })) })
}

function apiReturning(...names: string[]) {
  return vi.fn(() => Promise.resolve(listing(...names)))
}

async function json(response: Response): Promise<Record<string, unknown>> {
  return (await response.json()) as Record<string, unknown>
}

let logged: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  clearListingCache()
  logged = vi.spyOn(console, 'error').mockImplementation(() => undefined)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('verificação de domínio: resultado', () => {
  it('diz que o nome está livre quando nenhum Worker usa esse nome', async () => {
    const api = apiReturning(SELF_WORKER_NAME, 'f-cordeiro', 'vilacartola')

    const response = await handleDomainCheck(ask('minha-loja'), env(), { fetch: api })

    expect(response.status).toBe(200)
    expect(await json(response)).toEqual({ status: 'available', name: 'minha-loja' })
  })

  it('diz que o nome está em uso quando já existe um Worker com ele', async () => {
    const api = apiReturning(SELF_WORKER_NAME, 'f-cordeiro')

    const response = await handleDomainCheck(ask('f-cordeiro'), env(), { fetch: api })

    expect(await json(response)).toEqual({ status: 'taken', name: 'f-cordeiro' })
  })

  it('não diferencia maiúsculas de minúsculas, nem no pedido nem na lista', async () => {
    const api = apiReturning(SELF_WORKER_NAME, 'Vila-Cartola')

    const response = await handleDomainCheck(ask('  VILA-cartola '), env(), { fetch: api })

    expect(await json(response)).toEqual({ status: 'taken', name: 'vila-cartola' })
  })

  it('aceita a lista no formato novo da API, com o nome em `name`', async () => {
    const api = vi.fn(() =>
      Promise.resolve(
        Response.json({
          success: true,
          result: [
            { id: 'tag-abc', name: SELF_WORKER_NAME },
            { id: 'tag-def', name: 'gomininin' },
          ],
        }),
      ),
    )

    const taken = await handleDomainCheck(ask('gomininin'), env(), { fetch: api })
    expect(await json(taken)).toMatchObject({ status: 'taken' })
  })

  it('recusa nomes reservados sem nem consultar a Cloudflare', async () => {
    const api = apiReturning(SELF_WORKER_NAME)

    const response = await handleDomainCheck(ask('www'), env(), { fetch: api })

    expect(await json(response)).toEqual({ status: 'reserved', name: 'www' })
    expect(api).not.toHaveBeenCalled()
  })

  it.each(['', 'ab', 'a b', 'loja.com', '-loja', 'minha--loja', 'loja/../x', 'x'.repeat(40)])(
    'recusa o nome inválido %j sem consultar a Cloudflare',
    async (name) => {
      const api = apiReturning(SELF_WORKER_NAME)

      const response = await handleDomainCheck(ask(name), env(), { fetch: api })

      expect(response.status).toBe(400)
      expect(await json(response)).toMatchObject({ status: 'invalid' })
      expect(api).not.toHaveBeenCalled()
    },
  )

  it('trata a falta do parâmetro "nome" como nome vazio', async () => {
    const response = await handleDomainCheck(ask(null), env(), { fetch: apiReturning() })

    expect(response.status).toBe(400)
    expect(await json(response)).toMatchObject({ status: 'invalid' })
  })
})

describe('verificação de domínio: consulta à Cloudflare', () => {
  it('pede a lista de Workers da conta com o token no cabeçalho, nunca na URL', async () => {
    const api = apiReturning(SELF_WORKER_NAME)

    await handleDomainCheck(ask('minha-loja'), env(), { fetch: api })

    expect(api).toHaveBeenCalledTimes(1)
    const [url, init] = api.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toMatch(
      /^https:\/\/api\.cloudflare\.com\/client\/v4\/accounts\/conta-de-teste\/workers\/scripts/,
    )
    expect(url).not.toContain('token-de-teste')
    expect(init.headers).toMatchObject({ Authorization: 'Bearer token-de-teste' })
    expect(init.signal).toBeInstanceOf(AbortSignal)
  })

  it('guarda a lista por um minuto e consulta de novo depois disso', async () => {
    const api = apiReturning(SELF_WORKER_NAME)
    let now = 1_000_000
    const deps = { fetch: api, now: () => now }

    await handleDomainCheck(ask('loja-um'), env(), deps)
    await handleDomainCheck(ask('loja-dois'), env(), deps)
    expect(api).toHaveBeenCalledTimes(1)

    now += 59_000
    await handleDomainCheck(ask('loja-tres'), env(), deps)
    expect(api).toHaveBeenCalledTimes(1)

    now += 2_000
    await handleDomainCheck(ask('loja-quatro'), env(), deps)
    expect(api).toHaveBeenCalledTimes(2)
  })

  it('lê todas as páginas da lista quando a API pagina', async () => {
    const api = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json({
          success: true,
          result: [{ id: SELF_WORKER_NAME }],
          result_info: { total_pages: 2 },
        }),
      )
      .mockResolvedValueOnce(
        Response.json({
          success: true,
          result: [{ id: 'loja-da-pagina-dois' }],
          result_info: { total_pages: 2 },
        }),
      )

    const response = await handleDomainCheck(ask('loja-da-pagina-dois'), env(), { fetch: api })

    expect(api).toHaveBeenCalledTimes(2)
    expect(await json(response)).toMatchObject({ status: 'taken' })
  })
})

describe('verificação de domínio: falhas nunca viram "livre"', () => {
  async function expectUnavailable(response: Response) {
    expect(response.status).toBe(503)
    expect(await json(response)).toEqual({ status: 'unavailable' })
  }

  it('sem o ID da conta ou o token configurados', async () => {
    const api = apiReturning(SELF_WORKER_NAME)

    await expectUnavailable(
      await handleDomainCheck(ask('minha-loja'), env({ CLOUDFLARE_API_TOKEN: '' }), { fetch: api }),
    )
    clearListingCache()
    const semConta = { ASSETS, CLOUDFLARE_API_TOKEN: 'token-de-teste' }
    await expectUnavailable(await handleDomainCheck(ask('minha-loja'), semConta, { fetch: api }))
    expect(api).not.toHaveBeenCalled()
  })

  it.each([401, 403, 429, 500, 502])('quando a API responde %i', async (status) => {
    const api = vi.fn(() => Promise.resolve(new Response('erro', { status })))

    await expectUnavailable(await handleDomainCheck(ask('minha-loja'), env(), { fetch: api }))
  })

  it('quando a rede falha ou estoura o tempo', async () => {
    const api = vi.fn(() => Promise.reject(new TypeError('rede fora do ar')))

    await expectUnavailable(await handleDomainCheck(ask('minha-loja'), env(), { fetch: api }))
  })

  it('quando a resposta não é JSON', async () => {
    const api = vi.fn(() => Promise.resolve(new Response('<html>oops</html>')))

    await expectUnavailable(await handleDomainCheck(ask('minha-loja'), env(), { fetch: api }))
  })

  it.each([
    ['success falso', { success: false, result: [{ id: SELF_WORKER_NAME }] }],
    ['sem result', { success: true }],
    ['result que não é lista', { success: true, result: { id: SELF_WORKER_NAME } }],
    ['item que não é objeto', { success: true, result: ['portfolio'] }],
    ['lista vazia (token sem acesso aos Workers)', { success: true, result: [] }],
    [
      'lista sem o próprio portfólio (conta ou token errados)',
      { success: true, result: [{ id: 'outro' }] },
    ],
    ['corpo que não é objeto', 'ok'],
  ])('quando a resposta vem fora do formato: %s', async (_case, body) => {
    const api = vi.fn(() => Promise.resolve(Response.json(body)))

    await expectUnavailable(await handleDomainCheck(ask('minha-loja'), env(), { fetch: api }))
  })

  it('não guarda no cache uma consulta que falhou', async () => {
    const api = vi
      .fn()
      .mockResolvedValueOnce(new Response('erro', { status: 500 }))
      .mockResolvedValueOnce(listing(SELF_WORKER_NAME))

    await expectUnavailable(await handleDomainCheck(ask('minha-loja'), env(), { fetch: api }))
    const retry = await handleDomainCheck(ask('minha-loja'), env(), { fetch: api })

    expect(await json(retry)).toMatchObject({ status: 'available' })
  })

  it('registra o motivo no log do Worker, mas não o mostra na resposta', async () => {
    const api = vi.fn(() => Promise.resolve(new Response('erro', { status: 403 })))

    const response = await handleDomainCheck(ask('minha-loja'), env(), { fetch: api })

    expect(logged).toHaveBeenCalled()
    expect(JSON.stringify(await json(response))).not.toMatch(/403|token|conta/i)
  })
})

describe('verificação de domínio: proteção contra abuso', () => {
  function limiter(success: boolean): RateLimiter & { limit: ReturnType<typeof vi.fn> } {
    return { limit: vi.fn(() => Promise.resolve({ success })) }
  }

  it('responde 429 quando o limitador bloqueia, sem consultar a Cloudflare', async () => {
    const api = apiReturning(SELF_WORKER_NAME)

    const response = await handleDomainCheck(
      ask('minha-loja', { headers: { 'CF-Connecting-IP': '203.0.113.9' } }),
      env({ DOMAIN_LIMITER: limiter(false) }),
      { fetch: api },
    )

    expect(response.status).toBe(429)
    expect(response.headers.get('Retry-After')).toBe('60')
    expect(await json(response)).toEqual({ status: 'rate_limited' })
    expect(api).not.toHaveBeenCalled()
  })

  it('limita por endereço IP de quem pergunta', async () => {
    const limit = vi.fn(() => Promise.resolve({ success: true }))

    await handleDomainCheck(
      ask('minha-loja', { headers: { 'CF-Connecting-IP': '203.0.113.9' } }),
      env({ DOMAIN_LIMITER: { limit } }),
      { fetch: apiReturning(SELF_WORKER_NAME) },
    )

    expect(limit).toHaveBeenCalledWith({ key: '203.0.113.9' })
  })

  it.each(['POST', 'PUT', 'DELETE', 'PATCH'])('só aceita GET (recusa %s)', async (method) => {
    const response = await handleDomainCheck(ask('minha-loja', { method }), env(), {
      fetch: apiReturning(SELF_WORKER_NAME),
    })

    expect(response.status).toBe(405)
    expect(response.headers.get('Allow')).toBe('GET')
  })
})

describe('verificação de domínio: cabeçalhos da resposta', () => {
  it('é JSON, não vai para cache e não deixa o navegador adivinhar o tipo', async () => {
    const response = await handleDomainCheck(ask('minha-loja'), env(), {
      fetch: apiReturning(SELF_WORKER_NAME),
    })

    expect(response.headers.get('Content-Type')).toMatch(/^application\/json/)
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')
    expect(response.headers.get('Access-Control-Allow-Origin')).toBeNull()
  })
})

describe('Worker: rotas', () => {
  it('atende /api/dominio', async () => {
    vi.stubGlobal('fetch', apiReturning(SELF_WORKER_NAME))

    const response = await worker.fetch(ask('minha-loja'), env())

    expect(await json(response)).toEqual({ status: 'available', name: 'minha-loja' })
    vi.unstubAllGlobals()
  })

  it('devolve 404 para qualquer outra rota /api/', async () => {
    const response = await worker.fetch(new Request(`${ORIGIN}/api/segredos`), env())

    expect(response.status).toBe(404)
  })

  it('entrega os arquivos do site para as demais rotas', async () => {
    const response = await worker.fetch(new Request(`${ORIGIN}/favicon.svg`), env())

    expect(await response.text()).toBe('site estático')
  })
})

describe('endereço oferecido', () => {
  it('usa o domínio da conta axeldev nos Workers', () => {
    expect(DOMAIN_SUFFIX).toBe('axeldev.workers.dev')
  })
})
