/** Limitador de requisições da Cloudflare (binding "ratelimits" do wrangler.jsonc). */
export interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>
}

/** Arquivos estáticos do site (binding "assets" do wrangler.jsonc). */
export interface AssetFetcher {
  fetch(request: Request): Promise<Response>
}

/**
 * Tudo que o Worker recebe do ambiente. Os dois segredos são opcionais no tipo de propósito: se
 * faltarem, a verificação responde "indisponível" em vez de quebrar a página.
 */
export interface Env {
  /** Segredo (`wrangler secret put`). ID da conta Cloudflare. */
  readonly CLOUDFLARE_ACCOUNT_ID?: string
  /** Segredo (`wrangler secret put`). Token só com "Workers Scripts: Read". */
  readonly CLOUDFLARE_API_TOKEN?: string
  readonly DOMAIN_LIMITER?: RateLimiter
  readonly ASSETS: AssetFetcher
}
