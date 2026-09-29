import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import '@/styles/index.css'
import { App } from '@/app/App'
import { ErrorBoundary } from '@/app/ErrorBoundary'

const container = document.getElementById('root')
if (container === null) {
  throw new Error('Elemento #root não encontrado em index.html.')
}

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
