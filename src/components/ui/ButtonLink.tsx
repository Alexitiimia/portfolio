import type { MouseEventHandler, ReactNode } from 'react'
import type { HttpsUrl } from '@/lib/url'
import { cx } from '@/lib/cx'
import { ExternalLink } from './ExternalLink'
import styles from './ButtonLink.module.css'

interface BaseProps {
  readonly variant?: 'primary' | 'secondary'
  /** Seta exibida depois do texto. */
  readonly arrow?: '→' | '↓' | '↗'
  readonly onClick?: MouseEventHandler<HTMLAnchorElement>
  readonly children: ReactNode
}

interface InternalProps extends BaseProps {
  /** Âncora da própria página ("#contato") ou caminho de outra página do site ("/orcamento/"). */
  readonly href: `#${string}` | `/${string}`
  readonly external?: false
}

interface ExternalProps extends BaseProps {
  readonly href: HttpsUrl
  readonly external: true
}

type ButtonLinkProps = InternalProps | ExternalProps

/** Link com aparência de botão. Toda ação do site navega, então é um <a>, não um <button>. */
export function ButtonLink(props: ButtonLinkProps) {
  const { variant = 'primary', arrow, children, onClick } = props
  const className = cx(styles.button, variant === 'primary' ? styles.primary : styles.secondary)
  const content = (
    <>
      {children}
      {arrow ? <span aria-hidden="true">{arrow}</span> : null}
    </>
  )

  if (props.external) {
    return (
      <ExternalLink href={props.href} className={className} onClick={onClick}>
        {content}
      </ExternalLink>
    )
  }

  return (
    <a href={props.href} className={className} onClick={onClick}>
      {content}
    </a>
  )
}
