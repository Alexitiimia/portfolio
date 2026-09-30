// @vitest-environment node
import { describe, expect, it } from 'vitest'
import type { Env } from './env.ts'
import worker from './index.ts'

const ORIGIN = 'https://portfolio.axeldev.workers.dev'
const ASSETS = { fetch: () => Promise.resolve(new Response('site estático')) }
const env: Env = { ASSETS }

function get(path: string, acceptLanguage?: string, method = 'GET'): Promise<Response> {
  const headers = acceptLanguage === undefined ? {} : { 'Accept-Language': acceptLanguage }
  return worker.fetch(new Request(`${ORIGIN}${path}`, { method, headers }), env)
}

describe('Worker: idioma na entrada do site', () => {
  it.each([
    ['en-US,en;q=0.9', '/en/'],
    ['es-AR,es;q=0.9,en;q=0.5', '/es/'],
    ['pt-BR,pt;q=0.9,en;q=0.8', '/pt/'],
    ['fr-FR,fr;q=0.9', '/en/'],
  ])('"/" com Accept-Language "%s" leva a %s', async (header, expected) => {
    const response = await get('/', header)

    expect(response.status).toBe(302)
    expect(response.headers.get('Location')).toBe(`${ORIGIN}${expected}`)
  })

  it('sem Accept-Language (robôs), vai para o português', async () => {
    const response = await get('/')

    expect(response.headers.get('Location')).toBe(`${ORIGIN}/pt/`)
  })

  it('a resposta depende do idioma: não pode ser guardada em cache', async () => {
    const response = await get('/', 'en')

    expect(response.headers.get('Vary')).toBe('Accept-Language')
    expect(response.headers.get('Cache-Control')).toBe('no-store')
  })

  it('o endereço antigo /orcamento/ vai para o orçamento do idioma certo', async () => {
    const english = await get('/orcamento/', 'en')
    const spanish = await get('/orcamento', 'es')
    const portuguese = await get('/orcamento/', 'pt-BR')

    expect(english.headers.get('Location')).toBe(`${ORIGIN}/en/quote/`)
    expect(spanish.headers.get('Location')).toBe(`${ORIGIN}/es/presupuesto/`)
    expect(portuguese.headers.get('Location')).toBe(`${ORIGIN}/pt/orcamento/`)
  })

  it('guarda a query string ao redirecionar', async () => {
    const response = await get('/?utm_source=bio', 'en')

    expect(response.headers.get('Location')).toBe(`${ORIGIN}/en/?utm_source=bio`)
  })

  it('não mexe em outros caminhos nem em métodos que não leem página', async () => {
    const page = await get('/en/', 'pt')
    const post = await get('/', 'en', 'POST')

    expect(page.status).toBe(200)
    expect(await page.text()).toBe('site estático')
    expect(post.status).toBe(200)
  })
})
