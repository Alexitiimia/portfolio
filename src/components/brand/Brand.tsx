import type { MouseEventHandler } from 'react'
import { site } from '@/content/site'
import { BrandMark } from './BrandMark'
import styles from './Brand.module.css'

interface BrandProps {
  readonly href: `#${string}`
  readonly onClick?: MouseEventHandler<HTMLAnchorElement>
}

/** Logo completo: quadrado invertido com o corvo, nome e assinatura. Sempre leva ao topo. */
export function Brand({ href, onClick }: BrandProps) {
  return (
    <a href={href} className={styles.brand} aria-label={`${site.name}, início da página`} onClick={onClick}>
      <span className={styles.tile}>
        <BrandMark size={32} />
      </span>
      <span>
        <span className={styles.name}>{site.name}</span>
        <span className={styles.tag}>{site.tagline}</span>
      </span>
    </a>
  )
}
