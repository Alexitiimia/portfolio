import type { ReactNode } from 'react'
import { isMailtoUrl, type ContactHref } from '@/lib/url'
import { ExternalLink } from './ExternalLink'

interface ContactLinkProps {
  readonly href: ContactHref
  readonly children: ReactNode
  readonly className?: string | undefined
}

/** Link de um canal de contato: e-mail abre o app de e-mail; site abre em nova aba, com segurança. */
export function ContactLink({ href, children, className }: ContactLinkProps) {
  if (isMailtoUrl(href)) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }

  return (
    <ExternalLink href={href} className={className}>
      {children}
    </ExternalLink>
  )
}
