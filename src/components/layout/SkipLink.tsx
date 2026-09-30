import { useUi } from '@/i18n/useI18n'
import styles from './SkipLink.module.css'

/** Primeiro item da tabulação: pula o menu e vai direto ao conteúdo (WCAG 2.4.1). */
export function SkipLink() {
  const ui = useUi()

  return (
    <a href="#conteudo" className={styles.skip}>
      {ui.skipToContent}
    </a>
  )
}
