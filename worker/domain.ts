import {
  DOMAIN_SUFFIX,
  isReservedName,
  validateName,
  type DomainCheck,
} from '../src/lib/domainName.ts'
import type { Env } from './env.ts'

/**
 * Nome deste próprio Worker. Precisa ser igual ao `name` do wrangler.jsonc (um teste confere).
 * Serve de "prova de vida" da consulta: se a lista de Workers da conta não trouxer o próprio
 * portfólio, a resposta da API não é confiável e nenhum nome é dado como livre.
 */
export const SELF_WORKER_NAME = 'portfolio'

/** Por quanto tempo a lista de Workers fica guardada na memória antes de consultar de novo. */
const LIST_TTL_MS = 60_000
const API_TIMEOUT_MS = 5_000
const MAX_PAGES = 10
const API_ROOT = 'https://api.cloudflare.com/client/v4'

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>

interface Listing {
  readonly names: ReadonlySet<string>
  readonly loadedAt: number
}

let cached: Listing | null = null

/** Só para os testes: esquece a lista guardada. */
export function clearListingCache(): void {
  cached = null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Lê uma página da lista de Workers. Qualquer coisa fora do formato esperado lança erro: é melhor
 * dizer "não consegui verificar" do que dar um nome como livre por engano.
 */
function readPage(body: unknown): { names: string[]; totalPages: number } {
  if (!isRecord(body) || body.success !== true || !Array.isArray(body.result)) {
    throw new Error('resposta da API da Cloudflare fora do formato esperado')
  }

  const names: string[] = []
  for (const item of body.result as unknown[]) {
    if (!isRecord(item)) throw new Error('item da lista de Workers fora do formato esperado')
    // A API antiga usa `id` como nome do Worker; a nova, `name`. Vale qualquer um dos dois.
    for (const key of ['id', 'name']) {
      const value = item[key]
      if (typeof value === 'string') names.push(value.toLowerCase())
    }
  }

  const info = body.result_info
  const pages = isRecord(info) ? info.total_pages : undefined
  return {
    names,
    totalPages: typeof pages === 'number' && pages > 1 ? Math.min(pages, MAX_PAGES) : 1,
  }
}

async function loadNames(env: Env, doFetch: FetchLike): Promise<ReadonlySet<string>> {
  const account = env.CLOUDFLARE_ACCOUNT_ID
  const token = env.CLOUDFLARE_API_TOKEN
  if (account === undefined || account === '' || token === undefined || token === '') {
    throw new Error('CLOUDFLARE_ACCOUNT_ID ou CLOUDFLARE_API_TOKEN não configurado')
  }

  const names = new Set<string>()
  let totalPages = 1
  for (let page = 1; page <= totalPages; page += 1) {
    const url = `${API_ROOT}/accounts/${encodeURIComponent(account)}/workers/scripts?page=${String(page)}`
    const response = await doFetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    })
    if (!response.ok) throw new Error(`API da Cloudflare respondeu ${String(response.status)}`)

    const parsed = readPage(await response.json())
    for (const name of parsed.names) names.add(name)
    totalPages = parsed.totalPages
  }

  if (!names.has(SELF_WORKER_NAME)) {
    throw new Error(`a lista de Workers não inclui "${SELF_WORKER_NAME}": token ou conta errados`)
  }
  return names
}

async function existingNames(
  env: Env,
  doFetch: FetchLike,
  now: number,
): Promise<ReadonlySet<string>> {
  if (cached !== null && now - cached.loadedAt < LIST_TTL_MS) return cached.names
  const names = await loadNames(env, doFetch)
  cached = { names, loadedAt: now }
  return names
}

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  // Resposta sobre o estado atual da conta: nunca reaproveitar de um cache do navegador ou da CDN.
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
} as const

function reply(body: DomainCheck, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...JSON_HEADERS, ...extra } })
}

interface Dependencies {
  readonly fetch?: FetchLike
  readonly now?: () => number
}

/** Rota GET /api/dominio?nome=... : diz se `nome.axeldev.workers.dev` está livre. */
export async function handleDomainCheck(
  request: Request,
  env: Env,
  dependencies: Dependencies = {},
): Promise<Response> {
  if (request.method !== 'GET') {
    return reply({ status: 'unavailable' }, 405, { Allow: 'GET' })
  }

  if (env.DOMAIN_LIMITER !== undefined) {
    const client = request.headers.get('CF-Connecting-IP') ?? 'desconhecido'
    const { success } = await env.DOMAIN_LIMITER.limit({ key: client })
    if (!success) return reply({ status: 'rate_limited' }, 429, { 'Retry-After': '60' })
  }

  const validation = validateName(new URL(request.url).searchParams.get('nome') ?? '')
  if (!validation.ok) return reply({ status: 'invalid', message: validation.message }, 400)

  const { name } = validation
  if (isReservedName(name)) return reply({ status: 'reserved', name })

  try {
    const now = (dependencies.now ?? Date.now)()
    const taken = (await existingNames(env, dependencies.fetch ?? fetch, now)).has(name)
    return reply({ status: taken ? 'taken' : 'available', name })
  } catch (error) {
    // O motivo fica no log do Worker; a pessoa só vê "indisponível" (nada de detalhes da conta).
    console.error(`Falha ao verificar ${name}.${DOMAIN_SUFFIX}:`, error)
    return reply({ status: 'unavailable' }, 503)
  }
}
