import type { MouseEventHandler, RefObject } from 'react'
import { site } from '@/content/site'
import { cx } from '@/lib/cx'
import { CorvoIcon } from './CorvoIcon'
import styles from './Brand.module.css'

interface BrandProps {
  /** Âncora da própria página (`#inicio`) ou caminho do site (`/`). */
  readonly href: `#${string}` | `/${string}`
  readonly onClick?: MouseEventHandler<HTMLAnchorElement>
  /**
   * Sem isto, o logo tem o corvo interativo (olha para o mouse e voa ao clicar). Com isto, deixa só
   * o espaço dele vazio e entrega o elemento: é o poleiro de um corvo que vive em outro lugar.
   */
  readonly slotRef?: RefObject<HTMLSpanElement | null>
  /**
   * `false`: clicar no corvo só o faz voar, sem seguir o link (o nome ao lado continua levando ao
   * destino). Serve para páginas em que o link recarregaria a página e cortaria o voo.
   */
  readonly iconNavigates?: boolean
}

/** Logo completo: corvo, nome e assinatura. Sempre leva ao topo da página. */
export function Brand({ href, onClick, slotRef, iconNavigates = true }: BrandProps) {
  return (
    <a
      href={href}
      className={styles.brand}
      aria-label={`${site.name}, início da página`}
      onClick={onClick}
    >
      {slotRef === undefined ? (
        <span
          className={styles.icon}
          onClick={(event) => {
            if (!iconNavigates) event.preventDefault()
          }}
        >
          <CorvoIcon />
        </span>
      ) : (
        <span ref={slotRef} className={cx(styles.icon, styles.slot)} />
      )}
      <span>
        <span className={styles.name}>{site.name}</span>
        <span className={styles.tag}>{site.tagline}</span>
      </span>
    </a>
  )
}
