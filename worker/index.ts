import { detectLang, pagePath } from '../src/i18n/lang.ts'
import { handleDomainCheck } from './domain.ts'
import type { Env } from './env.ts'

/**
 * Worker do portfólio. O site é 100% estático e a Cloudflare o serve sozinha; este código só roda
 * nas rotas de `assets.run_worker_first` (wrangler.jsonc): /api/* e as entradas antigas ("/" e
 * "/orcamento/"), que levam cada pessoa à versão do site no idioma do navegador dela.
 */

/** Encaminha para a página do idioma indicado pelo cabeçalho `Accept-Language`. */
function redirectToLanguage(request: Request, page: 'home' | 'quote'): Response {
  const url = new URL(request.url)
  const target = new URL(pagePath(detectLang(request.headers.get('Accept-Language')), page), url)
  target.search = url.search
  return new Response(null, {
    status: 302,
    headers: {
      Location: target.href,
      // A resposta depende do idioma do navegador: nenhum cache pode reaproveitá-la para outro.
      Vary: 'Accept-Language',
      'Cache-Control': 'no-store',
    },
  })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url)

    if (pathname === '/api/dominio') return handleDomainCheck(request, env)

    // Outra rota /api/* não existe. Qualquer outro caminho volta aos arquivos do site.
    if (pathname.startsWith('/api/')) {
      return new Response(null, { status: 404, headers: { 'Cache-Control': 'no-store' } })
    }

    if (request.method === 'GET' || request.method === 'HEAD') {
      if (pathname === '/') return redirectToLanguage(request, 'home')
      // Endereço antigo do orçamento (já compartilhado): agora vive dentro de cada idioma.
      if (pathname === '/orcamento' || pathname === '/orcamento/') {
        return redirectToLanguage(request, 'quote')
      }
    }
    return env.ASSETS.fetch(request)
  },
}
