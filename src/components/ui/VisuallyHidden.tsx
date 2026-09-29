import type { ReactNode } from 'react'
import styles from './VisuallyHidden.module.css'

/** Texto lido por leitores de tela, invisível na tela. */
export function VisuallyHidden({ children }: { readonly children: ReactNode }) {
  return <span className={styles.hidden}>{children}</span>
}
