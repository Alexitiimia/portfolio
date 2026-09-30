import { pageTokens } from './meta.ts'
import type { Lang, PageId } from './lang.ts'

const ESCAPES: Readonly<Record<string, string>> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"]/g, (char) => ESCAPES[char] ?? char)
}

/** Marcadores que já trazem HTML pronto (e por isso não são escapados). */
const RAW_TOKENS: ReadonlySet<string> = new Set(['alternates', 'ogLocaleAlternates', 'jsonLd'])

/**
 * Preenche os `{{marcadores}}` de um modelo de página (index.html ou orcamento/index.html) com os
 * textos de um idioma. Marcador desconhecido é erro: assim um typo não vai parar em produção.
 */
export function renderPage(template: string, lang: Lang, page: PageId): string {
  const tokens = pageTokens(lang, page)
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_match, name: string) => {
    const value = tokens[name]
    if (value === undefined) throw new Error(`Marcador desconhecido no HTML: {{${name}}}`)
    return RAW_TOKENS.has(name) ? value : escapeHtml(value)
  })
}
