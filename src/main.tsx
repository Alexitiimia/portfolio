import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import '@/styles/index.css'
import { App } from '@/app/App'
import { ErrorBoundary } from '@/app/ErrorBoundary'
import { langFromPath } from '@/i18n/lang'
import { LangProvider } from '@/i18n/LangProvider'

const container = document.getElementById('root')
if (container === null) {
  throw new Error('Elemento #root não encontrado em index.html.')
}

const app = (
  <StrictMode>
    <LangProvider lang={langFromPath(window.location.pathname)}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </LangProvider>
  </StrictMode>
)

// O build já deixa o conteúdo pronto no HTML (src/entry-server.tsx): o React só o assume. No
// servidor de desenvolvimento a página chega vazia, então ele desenha do zero.
if (container.hasChildNodes()) hydrateRoot(container, app)
else createRoot(container).render(app)
