import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import styles from './ButtonLink.module.css'

interface ButtonProps {
  readonly children: ReactNode
  readonly variant?: 'primary' | 'secondary'
  readonly disabled?: boolean
}

/**
 * Botão que envia um formulário. Igual ao `ButtonLink` no visual (usa o mesmo CSS), mas é um
 * <button>: ações que navegam são links, ações que enviam dados são botões.
 */
export function Button({ children, variant = 'primary', disabled = false }: ButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={cx(styles.button, variant === 'primary' ? styles.primary : styles.secondary)}
    >
      {children}
    </button>
  )
}
