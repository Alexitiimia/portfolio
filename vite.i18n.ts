import type { Plugin } from 'vite'
import { renderPage } from './src/i18n/html.ts'
import { renderRobots, renderSitemap } from './src/i18n/seo.ts'
import { DEFAULT_LANG, LANGS, pageFile, parsePath, type PageId } from './src/i18n/lang.ts'

/** Modelo de cada página (os arquivos de entrada do Vite) e o nome que ele ganha em `dist/`. */
const TEMPLATES: Readonly<Record<PageId, string>> = {
  home: 'index.html',
  quote: 'orcamento/index.html',
}

/** Marca de um `{{marcador}}` enquanto o Vite processa o HTML (ele não deve ver chaves duplas). */
const SENTINEL = '__I18N_'

function pageOfTemplate(path: string): PageId | null {
  const normalized = path.replace(/^\/+/, '').split('?')[0]
  for (const page of Object.keys(TEMPLATES) as PageId[]) {
    if (TEMPLATES[page] === normalized) return page
  }
  return null
}

/**
 * Gera uma página HTML por idioma a partir dos modelos `index.html` e `orcamento/index.html`:
 * `dist/pt/`, `dist/en/`, `dist/es/` (e `.../orcamento/`, `.../quote/`, `.../presupuesto/`).
 * Os arquivos na raiz (`dist/index.html`, `dist/orcamento/index.html`) ficam em português, como
 * reserva para quem chegar sem passar pelo redirecionamento do Worker.
 *
 * No servidor de desenvolvimento, `/en/`, `/es/`, `/pt/` e as páginas de orçamento abrem o modelo
 * certo, já no idioma da URL.
 */
export function i18nPages(): Plugin {
  return {
    name: 'i18n-pages',
    enforce: 'post',

    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        const url = new URL(request.url ?? '/', 'http://localhost')
        const parsed = parsePath(url.pathname)
        if (parsed !== null) request.url = `/${TEMPLATES[parsed.page]}${url.search}`
        next()
      })
    },

    transformIndexHtml: {
      order: 'pre',
      handler(html, context) {
        const page = pageOfTemplate(context.path)
        if (page === null) return html

        // Desenvolvimento: o idioma vem da URL pedida.
        if (context.server !== undefined) {
          const lang = parsePath(
            new URL(context.originalUrl ?? '/', 'http://localhost').pathname,
          )?.lang
          return renderPage(html, lang ?? DEFAULT_LANG, page)
        }

        // Build: protege os marcadores até `generateBundle`, onde saem uma página por idioma.
        return html
          .replace(/^(\s*)\{\{\s*(\w+)\s*\}\}\s*$/gm, `$1<!--${SENTINEL}$2__-->`)
          .replace(/\{\{\s*(\w+)\s*\}\}/g, `${SENTINEL}$1__`)
      },
    },

    generateBundle(_options, bundle) {
      for (const page of Object.keys(TEMPLATES) as PageId[]) {
        const template = bundle[TEMPLATES[page]]
        if (template?.type !== 'asset' || typeof template.source !== 'string') {
          throw new Error(`Modelo ${TEMPLATES[page]} não foi gerado pelo build.`)
        }
        const restored = template.source
          .replace(new RegExp(`<!--${SENTINEL}(\\w+?)__-->`, 'g'), '{{$1}}')
          .replace(new RegExp(`${SENTINEL}(\\w+?)__`, 'g'), '{{$1}}')

        for (const lang of LANGS) {
          this.emitFile({
            type: 'asset',
            fileName: pageFile(lang, page),
            source: renderPage(restored, lang, page),
          })
        }
        template.source = renderPage(restored, DEFAULT_LANG, page)
      }

      // Endereços para os buscadores: saem daqui para seguir o SITE_ORIGIN sem ninguém lembrar de mexer.
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: renderSitemap() })
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: renderRobots() })
    },
  }
}
