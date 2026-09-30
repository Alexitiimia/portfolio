import { LANG_INFO, LANGS, SITE_ORIGIN, pageAlternates, pagePath, type PageId } from './lang.ts'

/*
  Arquivos para os buscadores (Google, Bing...): `sitemap.xml` lista todas as páginas de cada idioma e
  `robots.txt` libera a entrada e aponta para o sitemap. O Vite grava os dois em `dist/` (ver vite.i18n.ts).
  Só funções puras, para o teste conferir o texto sem rodar o build.
*/

const PAGES: readonly PageId[] = ['home', 'quote']

/** Uma `<url>` por página e idioma, cada uma listando as versões nos outros idiomas (hreflang). */
export function renderSitemap(): string {
  const entries = PAGES.flatMap((page) => {
    const alternates = [
      ...pageAlternates(page).map(
        ({ lang, path }) =>
          `    <xhtml:link rel="alternate" hreflang="${LANG_INFO[lang].htmlLang}" href="${SITE_ORIGIN}${path}"/>`,
      ),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}${pagePath('pt', page)}"/>`,
    ].join('\n')
    return LANGS.map(
      (lang) =>
        `  <url>\n    <loc>${SITE_ORIGIN}${pagePath(lang, page)}</loc>\n${alternates}\n  </url>`,
    )
  })
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n')
}

/** Todos os robôs podem entrar (inclusive os de prévia de link, que precisam ler a página e a imagem). */
export function renderRobots(): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`
}
