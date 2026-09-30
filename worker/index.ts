import { handleDomainCheck } from './domain.ts'
import type { Env } from './env.ts'

/**
 * Worker do portfólio. O site é 100% estático e a Cloudflare o serve sozinha; este código só roda
 * nas rotas de `assets.run_worker_first` (wrangler.jsonc), hoje apenas /api/*.
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url)

    if (pathname === '/api/dominio') return handleDomainCheck(request, env)

    // Outra rota /api/* não existe. Qualquer outro caminho volta aos arquivos do site.
    if (pathname.startsWith('/api/')) {
      return new Response(null, { status: 404, headers: { 'Cache-Control': 'no-store' } })
    }
    return env.ASSETS.fetch(request)
  },
}
