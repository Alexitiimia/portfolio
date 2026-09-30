import type { MouseEventHandler } from 'react'
import { site } from '@/content/site'
import { CorvoIcon } from './CorvoIcon'
import { CorvoSprite } from './CorvoSprite'
import styles from './Brand.module.css'

interface BrandProps {
  readonly href: `#${string}`
  readonly onClick?: MouseEventHandler<HTMLAnchorElement>
  /** `true`: o corvo olha para o mouse e voa ao clicar. `false`: fica parado. */
  readonly interactive?: boolean
}

/** Logo completo: corvo, nome e assinatura. Sempre leva ao topo da página. */
export function Brand({ href, onClick, interactive = true }: BrandProps) {
  return (
    <a
      href={href}
      className={styles.brand}
      aria-label={`${site.name}, início da página`}
      onClick={onClick}
    >
      <span className={styles.icon}>{interactive ? <CorvoIcon /> : <CorvoSprite />}</span>
      <span>
        <span className={styles.name}>{site.name}</span>
        <span className={styles.tag}>{site.tagline}</span>
      </span>
    </a>
  )
}
