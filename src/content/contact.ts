import { brands, type BrandIconData } from '@/components/icons/brands'
import type { ContactHref } from '@/lib/url'
import { site } from './site'

export interface ContactChannel {
  /** Identificador único (minúsculas e hifens). */
  readonly id: string
  readonly label: string
  /** O que aparece ao lado do nome (usuário, número ou e-mail). */
  readonly value: string
  readonly href: ContactHref
  readonly icon: BrandIconData
}

/**
 * Canais de contato exibidos na seção "Contato" e no rodapé. Só entram aqui os que você quer
 * tornar públicos. Exemplos de `href`: 'https://wa.me/55DDDNUMERO',
 * 'https://instagram.com/usuario', 'mailto:voce@exemplo.com'.
 */
export const contactChannels: readonly ContactChannel[] = [
  {
    id: 'github',
    label: 'GitHub',
    value: '@Alexitiimia',
    href: site.links.github,
    icon: brands.github,
  },
]
