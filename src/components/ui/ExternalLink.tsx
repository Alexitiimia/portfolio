import type { MouseEventHandler, ReactNode } from 'react'
import type { HttpsUrl } from '@/lib/url'
import { VisuallyHidden } from './VisuallyHidden'
import styles from './ExternalLink.module.css'

interface ExternalLinkProps {
  readonly href: HttpsUrl
  readonly children: ReactNode
  readonly className?: string | undefined
  readonly onClick?: MouseEventHandler<HTMLAnchorElement> | undefined
  /** Mostra a seta ↗ depois do texto. */
  readonly showArrow?: boolean
}

/**
 * Link para fora do site. Abre em nova aba com `noopener noreferrer`, que impede a página de
 * destino de controlar esta aba ou saber de onde a pessoa veio. Só aceita HTTPS (ver `HttpsUrl`).
 */
export function ExternalLink({
  href,
  children,
  className,
  onClick,
  showArrow = false,
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
    >
      {children}
      {showArrow ? (
        <span aria-hidden="true" className={styles.arrow}>
          ↗
        </span>
      ) : null}
      {/* O espaço fica fora do span: dentro dele seria aparado e o nome saía "GitHub(abre...)". */}{' '}
      <VisuallyHidden>(abre em nova aba)</VisuallyHidden>
    </a>
  )
}
