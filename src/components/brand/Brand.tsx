import type { MouseEventHandler } from 'react'
import { site } from '@/content/site'
import { CorvoIcon } from './CorvoIcon'
import styles from './Brand.module.css'

interface BrandProps {
  readonly href: `#${string}`
  readonly onClick?: MouseEventHandler<HTMLAnchorElement>
  /** O corvo bate as asas. Desligue onde a animação não faz falta. */
  readonly animated?: boolean
}

/** Logo completo: quadro claro com o corvo voando, nome e assinatura. Sempre leva ao topo. */
export function Brand({ href, onClick, animated = true }: BrandProps) {
  return (
    <a href={href} className={styles.brand} aria-label={`${site.name}, início da página`} onClick={onClick}>
      <span className={styles.tile}>
        <CorvoIcon animated={animated} />
      </span>
      <span>
        <span className={styles.name}>{site.name}</span>
        <span className={styles.tag}>{site.tagline}</span>
      </span>
    </a>
  )
}
