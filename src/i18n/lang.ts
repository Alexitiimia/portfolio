/*
  Idiomas do site e suas rotas. Só funções puras e tipos, sem DOM nem React: o Vite (build das
  páginas), o Worker (redirecionamento de "/") e a página importam este mesmo arquivo.
*/

export const LANGS = ['pt', 'en', 'es'] as const
export type Lang = (typeof LANGS)[number]

/** Idioma original do site e o usado quando nada indica outro. */
export const DEFAULT_LANG: Lang = 'pt'

/** Endereço público do site, sem barra no fim. Ao trocar de domínio, troque só aqui. */
export const SITE_ORIGIN = 'https://portfolio.axeldev.workers.dev'

interface LangInfo {
  /** Valor do atributo `lang` do <html> e do `hreflang`. */
  readonly htmlLang: string
  /** Valor de `og:locale`. */
  readonly ogLocale: string
  /** Nome do idioma escrito no próprio idioma, para o seletor. */
  readonly name: string
  /** Sigla de dois caracteres exibida no botão do seletor. */
  readonly short: string
}

export const LANG_INFO: Readonly<Record<Lang, LangInfo>> = {
  pt: { htmlLang: 'pt-BR', ogLocale: 'pt_BR', name: 'Português', short: 'PT' },
  en: { htmlLang: 'en', ogLocale: 'en_US', name: 'English', short: 'EN' },
  es: { htmlLang: 'es', ogLocale: 'es_ES', name: 'Español', short: 'ES' },
}

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (LANGS as readonly string[]).includes(value)
}

/** As páginas do site. */
export type PageId = 'home' | 'quote'

/** Nome da pasta da página do orçamento em cada idioma (`/pt/orcamento/`, `/en/quote/`...). */
const QUOTE_SLUG: Readonly<Record<Lang, string>> = {
  pt: 'orcamento',
  en: 'quote',
  es: 'presupuesto',
}

/** Caminho público de uma página: `/pt/`, `/en/quote/`... Sempre com barra no fim. */
export function pagePath(lang: Lang, page: PageId): `/${string}` {
  return page === 'home' ? `/${lang}/` : `/${lang}/${QUOTE_SLUG[lang]}/`
}

/** Onde o arquivo da página fica dentro de `dist/`: `pt/index.html`, `en/quote/index.html`... */
export function pageFile(lang: Lang, page: PageId): string {
  return `${pagePath(lang, page).slice(1)}index.html`
}

export interface ParsedPath {
  readonly lang: Lang
  readonly page: PageId
}

/** Descobre idioma e página pelo caminho da URL. `null` se não for uma página do site. */
export function parsePath(pathname: string): ParsedPath | null {
  const parts = pathname.split('/').filter((part) => part !== '')
  const [first, second, ...rest] = parts
  if (!isLang(first) || rest.length > 0) return null
  if (second === undefined) return { lang: first, page: 'home' }
  return second === QUOTE_SLUG[first] ? { lang: first, page: 'quote' } : null
}

/** Idioma da URL atual; sem prefixo de idioma (ex.: servidor de desenvolvimento em "/"), o padrão. */
export function langFromPath(pathname: string): Lang {
  return parsePath(pathname)?.lang ?? DEFAULT_LANG
}

/** Todas as versões de uma página, para os `hreflang` e para o seletor. */
export function pageAlternates(
  page: PageId,
): readonly { readonly lang: Lang; readonly path: string }[] {
  return LANGS.map((lang) => ({ lang, path: pagePath(lang, page) }))
}

interface WeightedLang {
  readonly tag: string
  readonly weight: number
}

function parseAcceptLanguage(header: string): WeightedLang[] {
  return header.split(',').flatMap((part, index) => {
    const [rawTag = '', ...params] = part.trim().split(';')
    const tag = rawTag.trim().toLowerCase()
    if (tag === '') return []
    const quality = params
      .map((param) => /^\s*q\s*=\s*([\d.]+)\s*$/i.exec(param)?.[1])
      .find(Boolean)
    const weight = quality === undefined ? 1 : Number(quality)
    // Empate: vale a ordem em que o navegador listou.
    return Number.isFinite(weight) && weight > 0 ? [{ tag, weight: weight - index * 1e-6 }] : []
  })
}

/**
 * Escolhe o idioma a partir do cabeçalho `Accept-Language`. Sem cabeçalho (robôs, por exemplo),
 * o padrão. Com cabeçalho mas nenhum dos três idiomas aceito, inglês: é o que mais gente lê.
 */
export function detectLang(acceptLanguage: string | null): Lang {
  if (acceptLanguage === null || acceptLanguage.trim() === '') return DEFAULT_LANG
  const ranked = parseAcceptLanguage(acceptLanguage).sort((a, b) => b.weight - a.weight)
  for (const { tag } of ranked) {
    const primary = tag.split('-')[0]
    if (isLang(primary)) return primary
  }
  return 'en'
}
