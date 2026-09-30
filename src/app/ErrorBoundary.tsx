import { Component, type ErrorInfo, type ReactNode } from 'react'
import { CorvoMascot } from '@/components/brand/CorvoMascot'
import { ExternalLink } from '@/components/ui/ExternalLink'
import { site } from '@/content/site'
import type { Lang } from '@/i18n/lang'
import { LangContext } from '@/i18n/langContext'
import { ui } from '@/i18n/ui'
import styles from './ErrorBoundary.module.css'

interface ErrorBoundaryProps {
  readonly children: ReactNode
}

interface ErrorBoundaryState {
  readonly hasError: boolean
}

/**
 * Última linha de defesa: se algo quebrar ao desenhar a página, mostra o corvo em "falha" e uma
 * mensagem simples em vez de uma tela em branco.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static override contextType = LangContext
  declare context: Lang

  override state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Falha ao desenhar a página:', error, info.componentStack)
  }

  override render(): ReactNode {
    if (!this.state.hasError) return this.props.children

    const { error } = ui[this.context]

    return (
      <main className={styles.fallback}>
        <CorvoMascot variant="falha" label={error.mascot} />
        <h1 className={styles.title}>{error.title}</h1>
        <p className={styles.text}>{error.text}</p>
        <p>
          <ExternalLink href={site.links.github} showArrow>
            github.com/Alexitiimia
          </ExternalLink>
        </p>
      </main>
    )
  }
}
