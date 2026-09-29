import styles from './SkipLink.module.css'

/** Primeiro item da tabulação: pula o menu e vai direto ao conteúdo (WCAG 2.4.1). */
export function SkipLink() {
  return (
    <a href="#conteudo" className={styles.skip}>
      Ir para o conteúdo
    </a>
  )
}
