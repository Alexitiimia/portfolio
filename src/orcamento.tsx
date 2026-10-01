import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import '@/styles/index.css'
import { ErrorBoundary } from '@/app/ErrorBoundary'
import { langFromPath } from '@/i18n/lang'
import { LangProvider } from '@/i18n/LangProvider'
import { QuotePage } from '@/app/QuotePage'

const container = document.getElementById('root')
if (container === null) {
  throw new Error('Elemento #root não encontrado em orcamento/index.html.')
}

// Aqui o React redesenha a página em vez de assumir o HTML pré-renderizado: o painel lê ?item= da URL
// (vindo dos cartões de Serviços), coisa que o HTML do build não tem, e a hidratação reclamaria.
createRoot(container).render(
  <StrictMode>
    <LangProvider lang={langFromPath(window.location.pathname)}>
      <ErrorBoundary>
        <QuotePage />
      </ErrorBoundary>
    </LangProvider>
  </StrictMode>,
)
