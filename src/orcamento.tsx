import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import '@/styles/index.css'
import { ErrorBoundary } from '@/app/ErrorBoundary'
import { QuotePage } from '@/app/QuotePage'

const container = document.getElementById('root')
if (container === null) {
  throw new Error('Elemento #root não encontrado em orcamento/index.html.')
}

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary>
      <QuotePage />
    </ErrorBoundary>
  </StrictMode>,
)
