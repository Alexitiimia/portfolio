import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './IconButton.module.css'

interface IconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'className' | 'type' | 'aria-label'
> {
  /** Nome acessível do botão. Obrigatório: o botão só tem um ícone. */
  readonly label: string
  readonly children: ReactNode
}

export function IconButton({ label, children, ...rest }: IconButtonProps) {
  return (
    <button type="button" className={styles.button} aria-label={label} {...rest}>
      {children}
    </button>
  )
}
