import { renderToString } from 'react-dom/server'
import { App } from '@/app/App'
import { ErrorBoundary } from '@/app/ErrorBoundary'
import { QuotePage } from '@/app/QuotePage'
import type { Lang, PageId } from '@/i18n/lang'
import { LangProvider } from '@/i18n/LangProvider'

/*
  Entrada do build para o servidor (não roda no navegador): gera o HTML de cada página e idioma,
  para o conteúdo já vir no arquivo e não só depois do JavaScript (buscadores, prévias de link e
  robôs de IA não executam script). Quem chama é vite.prerender.ts, depois do build normal.
*/

/** HTML de dentro de `<div id="root">` para uma página, em um idioma. */
export function renderBody(lang: Lang, page: PageId): string {
  return renderToString(
    <LangProvider lang={lang}>
      <ErrorBoundary>{page === 'home' ? <App /> : <QuotePage />}</ErrorBoundary>
    </LangProvider>,
  )
}
