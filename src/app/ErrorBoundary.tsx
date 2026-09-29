import { Component, type ErrorInfo, type ReactNode } from 'react'
import { CorvoMascot } from '@/components/brand/CorvoMascot'
import { ExternalLink } from '@/components/ui/ExternalLink'
import { site } from '@/content/site'
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
  override state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Falha ao desenhar a página:', error, info.componentStack)
  }

  override render(): ReactNode {
    if (!this.state.hasError) return this.props.children

    return (
      <main className={styles.fallback}>
        <CorvoMascot variant="falha" label="Corvo com falha: algo quebrou" />
        <h1 className={styles.title}>Algo deu errado por aqui.</h1>
        <p className={styles.text}>
          Não foi possível exibir esta página. Recarregue o navegador ou acesse o perfil no GitHub.
        </p>
        <p>
          <ExternalLink href={site.links.github} showArrow>
            github.com/Alexitiimia
          </ExternalLink>
        </p>
      </main>
    )
  }
}
