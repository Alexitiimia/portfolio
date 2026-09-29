import type { LucideIcon } from 'lucide-react'
import styles from './IconBox.module.css'

/**
 * Ícone genérico (não é marca) dentro de um quadrado com contorno. Decorativo.
 * Pontas e cantos retos combinam com a identidade em pixel art.
 */
export function IconBox({ icon: Icon }: { readonly icon: LucideIcon }) {
  return (
    <span className={styles.box}>
      <Icon size={20} strokeWidth={1.5} strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true" />
    </span>
  )
}
