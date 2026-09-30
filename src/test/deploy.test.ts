import { describe, expect, it } from 'vitest'
import { site } from '@/content/site'
import { renderPage } from '@/i18n/html'
import { LANGS, SITE_ORIGIN, pagePath, type Lang, type PageId } from '@/i18n/lang'
import { THEME_STORAGE_KEY } from '@/lib/theme'
import { SELF_WORKER_NAME } from '../../worker/domain.ts'

/*
  "Contrato de implantação": confere os arquivos estáticos que a Cloudflare serve, porque erros
  neles só aparecem em produção (uma CSP que bloqueia o próprio site, um ícone que dá 404...).
*/
const files = import.meta.glob<string>(
  [
    '/index.html',
    '/orcamento/index.html',
    '/vite.config.ts',
    '/wrangler.jsonc',
    '/public/_headers',
    '/public/404.html',
    '/public/404.css',
    '/public/theme-init.js',
    '/public/site.webmanifest',
    '/public/robots.txt',
    '/src/styles/tokens.css',
  ],
  { query: '?raw', import: 'default', eager: true },
)
const publicFiles = new Set(
  Object.keys(import.meta.glob('/public/*')).map((path) => path.replace('/public/', '')),
)

/** Os dois HTML da raiz são modelos com {{marcadores}}: `read` os entrega já em português. */
const TEMPLATE_PAGES: Readonly<Record<string, PageId>> = {
  '/index.html': 'home',
  '/orcamento/index.html': 'quote',
}

function readRaw(path: string): string {
  const content = files[path]
  if (content === undefined || content.length === 0) throw new Error(`${path} não foi lido`)
  return content
}

/** Página pronta, no idioma pedido (só vale para os dois modelos). */
function readPage(path: string, lang: Lang): string {
  const page = TEMPLATE_PAGES[path]
  if (page === undefined) throw new Error(`${path} não é um modelo de página`)
  return renderPage(readRaw(path), lang, page)
}

function read(path: string): string {
  return TEMPLATE_PAGES[path] === undefined ? readRaw(path) : readPage(path, 'pt')
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
    current.headers.set(
      line.slice(0, separator).trim().toLowerCase(),
      line.slice(separator + 1).trim(),
    )
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

    for (const { label } of site.footer.securityFacts) {
      const check = evidence[label]
      expect(check, `"${label}" aparece no rodapé mas não tem evidência neste teste`).toBeDefined()
      expect(check?.(), `"${label}" não é sustentada pelos cabeçalhos`).toBe(true)
    }
  })
})

/* ---------- páginas ---------- */

function resourceUrls(html: string): string[] {
  const tags = [...html.matchAll(/<(?:script|link)\b[^>]*>/gi)]
    .map((match) => match[0])
    // O canônico e as versões em outros idiomas (hreflang) só dizem qual é a URL de cada página:
    // o navegador não baixa nada deles.
    .filter((tag) => !/\brel="(?:canonical|alternate)"/i.test(tag))
  return tags.flatMap((tag) => {
    const url = /\b(?:src|href)\s*=\s*"([^"]+)"/i.exec(tag)?.[1]
    return url === undefined ? [] : [url]
  })
}

describe.each([
  ['index.html', '/index.html'],
  ['404.html', '/public/404.html'],
  ['orcamento/index.html', '/orcamento/index.html'],
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
    // Sem favicon.svg de propósito: o navegador preferiria o SVG e ignoraria o .ico com o corvo novo.
    expect(html).not.toMatch(/favicon\.svg/)
    expect(html).toMatch(/rel="icon" href="\/favicon\.ico"/)
    expect(html).toMatch(/rel="apple-touch-icon" href="\/apple-touch-icon\.png"/)
    expect(html).toMatch(/rel="manifest" href="\/site\.webmanifest"/)
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
    const dark = matchOrThrow(
      tokens,
      /:root\s*\{[^}]*--color-bg:\s*(#[0-9a-f]{6})/i,
      'o --color-bg escuro',
    )
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
    const sprite = matchOrThrow(
      read('/public/404.css'),
      /url\(\/([\w.-]+\.png)\)/,
      'o sprite do corvo',
    )

    expect(publicFiles.has(sprite)).toBe(true)
  })

  it('theme-init.js lê a mesma chave que o React grava', () => {
    const script = read('/public/theme-init.js')

    expect(script).toContain(`getItem('${THEME_STORAGE_KEY}')`)
    expect(script).toContain('data-theme')
  })

  it('wrangler.jsonc aponta para o Worker "portfolio" e para a pasta do build', () => {
    const config = wranglerConfig()

    expect(config.name).toBe('portfolio')
    expect(config.assets.directory).toBe('./dist')
    expect(config.assets.not_found_handling).toBe('404-page')
    expect(publicFiles.has('404.html')).toBe(true)
  })
})

/* ---------- Worker da verificação de domínio ---------- */

interface WranglerConfig {
  name: string
  main?: string
  assets: {
    directory: string
    not_found_handling: string
    binding?: string
    run_worker_first?: string[] | boolean
  }
  ratelimits?: { name: string; simple: { limit: number; period: number } }[]
}

function wranglerConfig(): WranglerConfig {
  return JSON.parse(read('/wrangler.jsonc').replace(/^\s*\/\/.*$/gm, '')) as WranglerConfig
}

describe('Worker da verificação de domínio', () => {
  it('só /api/* e as entradas sem idioma passam pelo Worker antes dos arquivos estáticos', () => {
    const { assets } = wranglerConfig()

    // Assim o site inteiro continua sendo servido direto, com os cabeçalhos do _headers.
    expect(assets.run_worker_first).toEqual(['/api/*', '/', '/orcamento', '/orcamento/'])
    expect(assets.binding).toBe('ASSETS')
  })

  it('o nome do Worker no código é o mesmo do wrangler.jsonc', () => {
    // A verificação usa este nome como prova de que a resposta da Cloudflare é confiável.
    expect(SELF_WORKER_NAME).toBe(wranglerConfig().name)
  })

  it('aponta para o arquivo do Worker, que existe', () => {
    const workerFiles = Object.keys(import.meta.glob('/worker/index.ts'))

    expect(wranglerConfig().main).toBe('worker/index.ts')
    expect(workerFiles).toEqual(['/worker/index.ts'])
  })

  it('limita as consultas por IP', () => {
    const limiter = wranglerConfig().ratelimits?.find((item) => item.name === 'DOMAIN_LIMITER')

    expect(limiter, 'falta o limitador DOMAIN_LIMITER').toBeDefined()
    expect(limiter?.simple.limit).toBeLessThanOrEqual(60)
    expect([10, 60]).toContain(limiter?.simple.period)
  })

  it('não guarda segredo nem ID da conta no arquivo público', () => {
    const raw = read('/wrangler.jsonc')

    expect(raw).not.toMatch(/\b[0-9a-f]{32}\b/i)
    expect(raw).not.toMatch(/"vars"/)
    expect(raw).not.toMatch(/"account_id"/)
  })

  it('a página só chama o próprio site: a CSP não libera nenhum outro destino de rede', () => {
    expect(headerValue('Content-Security-Policy')).toMatch(/connect-src 'self'(;|$)/)
  })
})

describe('página /orcamento/', () => {
  const html = read('/orcamento/index.html')

  it('tem título com a marca, descrição e as mesmas prévias de link do portfólio', () => {
    const title = matchOrThrow(html, /<title>([^<]+)<\/title>/, 'o <title>')
    const ogTitle = matchOrThrow(html, /property="og:title"\s+content="([^"]+)"/, 'og:title')

    expect(title).toContain(site.name)
    expect(title).not.toBe(matchOrThrow(read('/index.html'), /<title>([^<]+)<\/title>/, 'título'))
    expect(ogTitle).toBe(title)
    expect(html).toMatch(/name="description"\s+content="[^"]{60,200}"/)
  })

  it('carrega o script da própria página, que existe', () => {
    const entry = matchOrThrow(html, /<script type="module" src="([^"]+)"/, 'o script da página')

    expect(Object.keys(import.meta.glob('/src/orcamento.tsx'))).toEqual([entry])
  })

  it('está na lista de páginas do build (senão some do site publicado)', () => {
    const config = read('/vite.config.ts')

    expect(config).toContain("'./index.html'")
    expect(config).toContain("'./orcamento/index.html'")
  })
})

describe('ícones e manifesto do site', () => {
  const manifest = JSON.parse(read('/public/site.webmanifest')) as {
    name: string
    short_name: string
    start_url: string
    theme_color: string
    background_color: string
    icons: { src: string; sizes: string; type: string }[]
  }

  it('o manifesto usa o nome da marca e as cores do tema escuro', () => {
    const tokens = read('/src/styles/tokens.css')
    const dark = matchOrThrow(
      tokens,
      /:root\s*\{[^}]*--color-bg:\s*(#[0-9a-f]{6})/i,
      'o --color-bg escuro',
    )

    expect(manifest.name).toBe(site.name)
    expect(manifest.short_name).toBe(site.name)
    expect(manifest.start_url).toBe('/')
    expect(manifest.theme_color).toBe(dark)
    expect(manifest.background_color).toBe(dark)
  })

  it('todo ícone do manifesto existe em public/ e é PNG do tamanho declarado no nome', () => {
    expect(manifest.icons.length).toBeGreaterThan(0)
    for (const icon of manifest.icons) {
      expect(publicFiles.has(icon.src.slice(1)), `${icon.src} não existe em public/`).toBe(true)
      expect(icon.type).toBe('image/png')
      const side = matchOrThrow(icon.sizes, /^(\d+)x\1$/, 'tamanho quadrado')
      expect(icon.src, 'o nome do arquivo diz o tamanho').toContain(side)
    }
    expect(manifest.icons.map((icon) => icon.sizes)).toEqual(
      expect.arrayContaining(['192x192', '512x512']),
    )
  })

  it('tem todos os arquivos de ícone que as páginas citam', () => {
    for (const file of ['favicon.ico', 'apple-touch-icon.png', 'site.webmanifest']) {
      expect(publicFiles.has(file), `${file} não existe em public/`).toBe(true)
    }
    expect(publicFiles.has('favicon-32.png'), 'ícone antigo sobrando').toBe(false)
    expect(publicFiles.has('favicon.svg'), 'o SVG antigo sobrepõe o .ico novo').toBe(false)
  })
})

/* ---------- prévia do link (WhatsApp, Instagram, Discord, X/Twitter...) ---------- */

/** Conteúdo de `<meta property|name="chave" content="...">`, mesmo com a tag em várias linhas. */
function metaContent(html: string, key: string): string {
  return matchOrThrow(
    html,
    new RegExp(`<meta\\s+(?:property|name)="${key}"\\s+content="([^"]*)"`),
    `a meta ${key}`,
  )
}

/** Tamanho em bytes e dimensões de um PNG lido como data URL base64 (`?inline`). */
function pngInfo(dataUrl: string): { bytes: number; width: number; height: number } {
  const base64 = matchOrThrow(dataUrl, /^data:image\/png;base64,(.+)$/, 'o PNG em base64')
  const binary = atob(base64)
  const word = (offset: number) =>
    (binary.charCodeAt(offset) << 24) |
    (binary.charCodeAt(offset + 1) << 16) |
    (binary.charCodeAt(offset + 2) << 8) |
    binary.charCodeAt(offset + 3)
  return { bytes: binary.length, width: word(16), height: word(20) }
}

const previewImages = import.meta.glob<string>('/public/og-*.png', {
  query: '?inline',
  import: 'default',
  eager: true,
})

const previewPages = LANGS.flatMap((lang) => [
  {
    name: `${lang}/home`,
    file: '/index.html',
    lang,
    path: pagePath(lang, 'home'),
    image: 'og-image.png',
  },
  {
    name: `${lang}/quote`,
    file: '/orcamento/index.html',
    lang,
    path: pagePath(lang, 'quote'),
    image: 'og-orcamento.png',
  },
])

describe.each(previewPages)('prévia do link: $name', ({ file, lang, path, image }) => {
  const html = readPage(file, lang)
  const url = new URL(metaContent(html, 'og:url'))

  it('tem endereço absoluto em HTTPS, igual ao canônico e ao caminho da página', () => {
    expect(url.protocol).toBe('https:')
    expect(url.pathname).toBe(path)
    expect(matchOrThrow(html, /<link rel="canonical" href="([^"]+)"/, 'o canonical')).toBe(url.href)
  })

  it('aponta para uma imagem do próprio site que existe em public/', () => {
    const imageUrl = new URL(metaContent(html, 'og:image'))

    expect(imageUrl.origin).toBe(url.origin)
    expect(imageUrl.pathname).toBe(`/${image}`)
    expect(publicFiles.has(image)).toBe(true)
    expect(metaContent(html, 'twitter:image')).toBe(imageUrl.href)
  })

  it('declara a imagem 1200x630 e o arquivo realmente é assim, leve o bastante para o WhatsApp', () => {
    expect(metaContent(html, 'og:image:width')).toBe('1200')
    expect(metaContent(html, 'og:image:height')).toBe('630')
    expect(metaContent(html, 'og:image:type')).toBe('image/png')

    const data = previewImages[`/public/${image}`]
    if (data === undefined) throw new Error(`${image} não foi lido`)
    const info = pngInfo(data)
    expect(info.width).toBe(1200)
    expect(info.height).toBe(630)
    expect(info.bytes, 'o WhatsApp descarta imagens acima de ~300 KB').toBeLessThan(300 * 1024)
  })

  it('descreve a imagem em texto (acessibilidade) e repete título e descrição no cartão do X/Twitter', () => {
    expect(metaContent(html, 'og:image:alt').length).toBeGreaterThan(30)
    expect(metaContent(html, 'twitter:image:alt')).toBe(metaContent(html, 'og:image:alt'))
    expect(metaContent(html, 'twitter:card')).toBe('summary_large_image')
    expect(metaContent(html, 'twitter:title')).toBe(metaContent(html, 'og:title'))
    expect(metaContent(html, 'twitter:description')).toBe(metaContent(html, 'og:description'))
  })
})

describe('prévia do link: o site inteiro', () => {
  it('todas as páginas usam o mesmo domínio (ao trocar de domínio, troque SITE_ORIGIN)', () => {
    const origins = previewPages.map(
      ({ file, lang }) => new URL(metaContent(readPage(file, lang), 'og:url')).origin,
    )

    expect([...new Set(origins)]).toEqual([SITE_ORIGIN])
  })

  it('o robots.txt deixa os robôs de prévia entrarem', () => {
    const robots = read('/public/robots.txt')

    expect(robots).toMatch(/^User-agent:\s*\*/m)
    expect(robots).not.toMatch(/^Disallow:\s*\/\s*$/m)
  })
})
