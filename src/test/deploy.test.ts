import { describe, expect, it } from 'vitest'
import { site } from '@/content/site'
import { THEME_STORAGE_KEY } from '@/lib/theme'

/*
  "Contrato de implantação": confere os arquivos estáticos que a Cloudflare serve, porque erros
  neles só aparecem em produção (uma CSP que bloqueia o próprio site, um ícone que dá 404...).
*/
const files = import.meta.glob<string>(
  [
    '/index.html',
    '/wrangler.jsonc',
    '/public/_headers',
    '/public/404.html',
    '/public/404.css',
    '/public/theme-init.js',
    '/src/styles/tokens.css',
  ],
  { query: '?raw', import: 'default', eager: true },
)
const publicFiles = new Set(
  Object.keys(import.meta.glob('/public/*')).map((path) => path.replace('/public/', '')),
)

function read(path: string): string {
  const content = files[path]
  if (content === undefined || content.length === 0) throw new Error(`${path} não foi lido`)
  return content
}

/** Primeiro grupo de uma regex que precisa existir: sem `undefined` escapando para o teste. */
function matchOrThrow(text: string, pattern: RegExp, what: string): string {
  const value = pattern.exec(text)?.[1]
  if (value === undefined) throw new Error(`Não encontrei ${what} com o padrão ${String(pattern)}`)
  return value
}

interface HeaderRule {
  /** Padrão do caminho, como a Cloudflare entende ("*" é curinga). */
  readonly pattern: string
  /** Nome do cabeçalho em minúsculas -> valor. */
  readonly headers: Map<string, string>
}

/**
 * Lê o _headers no formato da Cloudflare: linhas sem indentação abrem uma regra (o caminho) e
 * linhas indentadas são "Nome: valor" dela. Comentários (`#`) e linhas vazias são ignorados.
 */
function headerRules(): readonly HeaderRule[] {
  const rules: { pattern: string; headers: Map<string, string> }[] = []
  for (const raw of read('/public/_headers').split('\n')) {
    const line = raw.replace(/\r$/, '')
    if (line.trim() === '' || line.trim().startsWith('#')) continue
    if (!/^\s/.test(line)) {
      rules.push({ pattern: line.trim(), headers: new Map() })
      continue
    }
    const separator = line.indexOf(':')
    if (separator === -1) throw new Error(`Linha mal formada no _headers: "${line}"`)
    const current = rules.at(-1)
    if (current === undefined) throw new Error(`Cabeçalho antes de qualquer caminho: "${line}"`)
    current.headers.set(line.slice(0, separator).trim().toLowerCase(), line.slice(separator + 1).trim())
  }
  return rules
}

/* ---------- cabeçalhos ---------- */

function headerValue(name: string): string | undefined {
  const line = read('/public/_headers')
    .split('\n')
    .find((candidate) => candidate.trim().toLowerCase().startsWith(`${name.toLowerCase()}:`))
  return line?.slice(line.indexOf(':') + 1).trim()
}

function csp(): Map<string, string[]> {
  const directives = new Map<string, string[]>()
  for (const part of (headerValue('Content-Security-Policy') ?? '').split(';')) {
    const [name, ...values] = part.trim().split(/\s+/)
    if (name !== undefined && name !== '') directives.set(name, values)
  }
  return directives
}

const only = (directive: string, ...expected: string[]) =>
  JSON.stringify(csp().get(directive)) === JSON.stringify(expected)

describe('cabeçalhos de segurança (public/_headers)', () => {
  it('a CSP nega tudo por padrão e só libera o próprio site', () => {
    expect(only('default-src', "'none'")).toBe(true)
    expect(only('script-src', "'self'")).toBe(true)
    expect(only('style-src', "'self'")).toBe(true)
    expect(only('img-src', "'self'")).toBe(true)
    expect(only('font-src', "'self'")).toBe(true)
    expect(only('connect-src', "'self'")).toBe(true)
    expect(only('object-src', "'none'")).toBe(true)
    expect(only('base-uri', "'none'")).toBe(true)
    expect(only('form-action', "'none'")).toBe(true)
    expect(csp().has('upgrade-insecure-requests')).toBe(true)
  })

  it('não libera scripts inline, eval, data: nem curingas em lugar nenhum', () => {
    const policy = headerValue('Content-Security-Policy') ?? ''

    expect(policy).not.toMatch(/unsafe-inline|unsafe-eval|unsafe-hashes/)
    expect(policy).not.toMatch(/(^|\s)\*(\s|;|$)/)
    expect(policy).not.toMatch(/\bdata:/)
    expect(policy).not.toMatch(/\bhttp:/)
  })

  it('só o próprio site e o bio.site podem exibir a página dentro de um frame', () => {
    expect(csp().get('frame-ancestors')).toEqual(["'self'", 'https://bio.site'])
  })

  it('força HTTPS por pelo menos 1 ano e impede adivinhação de tipo de arquivo', () => {
    const maxAge = Number(/max-age=(\d+)/.exec(headerValue('Strict-Transport-Security') ?? '')?.[1])

    expect(maxAge).toBeGreaterThanOrEqual(31_536_000)
    expect(headerValue('X-Content-Type-Options')).toBe('nosniff')
    expect(headerValue('Referrer-Policy')).toBeDefined()
    expect(headerValue('Permissions-Policy')).toBeDefined()
  })

  it('guarda em cache "para sempre" apenas os arquivos com hash em /assets', () => {
    const rules = headerRules()
    const cacheable = rules.filter((rule) => rule.headers.has('cache-control'))

    expect(cacheable.map((rule) => rule.pattern)).toEqual(['/assets/*'])
    expect(cacheable[0]?.headers.get('cache-control')).toBe('public, max-age=31536000, immutable')
  })

  it('cada garantia exibida no rodapé tem evidência nestes cabeçalhos', () => {
    const evidence: Record<string, () => boolean> = {
      'HTTPS + HSTS': () =>
        Number(/max-age=(\d+)/.exec(headerValue('Strict-Transport-Security') ?? '')?.[1]) >=
        31_536_000,
      'CSP estrita': () => only('default-src', "'none'") && only('script-src', "'self'"),
      'Sem rastreadores': () => only('script-src', "'self'") && only('connect-src', "'self'"),
    }

    for (const fact of site.footer.securityFacts) {
      const check = evidence[fact]
      expect(check, `"${fact}" aparece no rodapé mas não tem evidência neste teste`).toBeDefined()
      expect(check?.(), `"${fact}" não é sustentada pelos cabeçalhos`).toBe(true)
    }
  })
})

/* ---------- páginas ---------- */

function resourceUrls(html: string): string[] {
  const tags = [...html.matchAll(/<(?:script|link)\b[^>]*>/gi)].map((match) => match[0])
  return tags.flatMap((tag) => {
    const url = /\b(?:src|href)\s*=\s*"([^"]+)"/i.exec(tag)?.[1]
    return url === undefined ? [] : [url]
  })
}

describe.each([
  ['index.html', '/index.html'],
  ['404.html', '/public/404.html'],
] as const)('%s', (_name, path) => {
  const html = read(path)

  it('não tem script, estilo nem evento inline (a CSP bloquearia em produção)', () => {
    for (const [, attributes = ''] of html.matchAll(/<script\b([^>]*)>/gi)) {
      expect(attributes, 'todo <script> precisa de src').toMatch(/\bsrc\s*=/)
    }
    expect(html).not.toMatch(/<style\b/i)
    expect(html).not.toMatch(/\sstyle\s*=/i)
    expect(html).not.toMatch(/\son[a-z]+\s*=/i)
  })

  it('só carrega arquivos do próprio site, e todos existem em public/', () => {
    for (const url of resourceUrls(html)) {
      if (url.startsWith('/src/')) continue // entrada do Vite: só existe antes do build
      expect(url, 'recurso externo bloqueado pela CSP').toMatch(/^\//)
      expect(publicFiles.has(url.slice(1)), `${url} não existe em public/`).toBe(true)
    }
  })

  it('declara idioma, ícones da identidade e tema', () => {
    expect(html).toMatch(/<html lang="pt-BR">/)
    expect(html).toMatch(/rel="icon" href="\/favicon\.svg"/)
    expect(html).toMatch(/rel="apple-touch-icon" href="\/apple-touch-icon\.png"/)
    expect(html).toMatch(/<script src="\/theme-init\.js"><\/script>/)
  })
})

describe('index.html: metadados', () => {
  const html = read('/index.html')

  it('usa a marca no título e repete título e descrição nas prévias de link', () => {
    const title = matchOrThrow(html, /<title>([^<]+)<\/title>/, 'o <title>')
    const ogTitle = matchOrThrow(html, /property="og:title"\s+content="([^"]+)"/, 'og:title')

    expect(title).toContain(site.name)
    expect(ogTitle).toBe(title)
    expect(html).toMatch(/name="description"\s+content="[^"]{60,200}"/)
  })

  it('usa em theme-color as mesmas cores de fundo dos temas (tokens.css)', () => {
    const tokens = read('/src/styles/tokens.css')
    const dark = matchOrThrow(tokens, /:root\s*\{[^}]*--color-bg:\s*(#[0-9a-f]{6})/i, 'o --color-bg escuro')
    const light = matchOrThrow(
      tokens,
      /data-theme='light'\]\s*\{[^}]*--color-bg:\s*(#[0-9a-f]{6})/i,
      'o --color-bg claro',
    )

    expect(html).toContain(`content="${dark}" media="(prefers-color-scheme: dark)"`)
    expect(html).toContain(`content="${light}" media="(prefers-color-scheme: light)"`)
  })
})

describe('arquivos de suporte', () => {
  it('a página 404 usa o sprite do corvo que existe em public/', () => {
    const sprite = matchOrThrow(read('/public/404.css'), /url\(\/([\w.-]+\.png)\)/, 'o sprite do corvo')

    expect(publicFiles.has(sprite)).toBe(true)
  })

  it('theme-init.js lê a mesma chave que o React grava', () => {
    const script = read('/public/theme-init.js')

    expect(script).toContain(`getItem('${THEME_STORAGE_KEY}')`)
    expect(script).toContain('data-theme')
  })

  it('wrangler.jsonc aponta para o Worker "portfolio" e para a pasta do build', () => {
    const config = JSON.parse(read('/wrangler.jsonc').replace(/^\s*\/\/.*$/gm, '')) as {
      name: string
      assets: { directory: string; not_found_handling: string }
    }

    expect(config.name).toBe('portfolio')
    expect(config.assets.directory).toBe('./dist')
    expect(config.assets.not_found_handling).toBe('404-page')
    expect(publicFiles.has('404.html')).toBe(true)
  })
})
