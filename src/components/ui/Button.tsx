import type { MouseEventHandler, ReactNode } from 'react'
import { cx } from '@/lib/cx'
import styles from './ButtonLink.module.css'

interface ButtonProps {
  readonly children: ReactNode
  readonly variant?: 'primary' | 'secondary'
  readonly disabled?: boolean
  /** `button`: só dispara `onClick` (ex.: abrir um popup), sem enviar formulário. */
  readonly type?: 'submit' | 'button'
  readonly onClick?: MouseEventHandler<HTMLButtonElement>
  /** Avisa leitores de tela que o botão abre um popup. */
  readonly haspopup?: 'dialog'
}

/**
 * Botão que envia um formulário. Igual ao `ButtonLink` no visual (usa o mesmo CSS), mas é um
 * <button>: ações que navegam são links, ações que enviam dados ou abrem um popup são botões.
 */
export function Button({
  children,
  variant = 'primary',
  disabled = false,
  type = 'submit',
  onClick,
  haspopup,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-haspopup={haspopup}
      className={cx(styles.button, variant === 'primary' ? styles.primary : styles.secondary)}
    >
      {children}
    </button>
  )
}
