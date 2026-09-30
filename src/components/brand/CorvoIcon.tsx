import { cx } from '@/lib/cx'
import styles from './CorvoIcon.module.css'

interface CorvoIconProps {
  /** `false` congela o corvo com as asas abertas (ex.: no rodapé, onde não precisa chamar atenção). */
  readonly animated?: boolean
}

/**
 * O corvo voando, ícone da marca. Decorativo: o nome da marca sempre aparece em texto ao lado.
 * A animação (bater de asas) é só CSS e some para quem pediu menos movimento.
 */
export function CorvoIcon({ animated = true }: CorvoIconProps) {
  return <span className={cx(styles.icon, animated && styles.flying)} aria-hidden="true" />
}
