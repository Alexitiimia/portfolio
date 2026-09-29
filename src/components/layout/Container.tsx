import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import styles from './Container.module.css'

interface ContainerProps {
  readonly children: ReactNode
  /** Aceita `undefined` porque classes de CSS Modules podem ser `string | undefined`. */
  readonly className?: string | undefined
}

/** Limita a largura do conteúdo e aplica as margens laterais. */
export function Container({ children, className }: ContainerProps) {
  return <div className={cx(styles.container, className)}>{children}</div>
}
