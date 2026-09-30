import { brands, type BrandIconData } from '@/components/icons/brands'
import type { ContactHref, HttpsUrl } from '@/lib/url'
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

/** Número do WhatsApp em formato internacional, só dígitos (55 + DDD + número). */
const WHATSAPP_NUMBER = '5547991275759'

/** Link que abre a conversa do WhatsApp já com a mensagem escrita. */
export function whatsappHref(message: string): HttpsUrl {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

/**
 * Canais de contato exibidos na seção "Contato" e no rodapé. Só entram aqui os que você quer
 * tornar públicos. Exemplos de `href`: 'https://wa.me/55DDDNUMERO',
 * 'https://instagram.com/usuario', 'mailto:voce@exemplo.com'.
 */
export const contactChannels: readonly ContactChannel[] = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    value: '(47) 99127-5759',
    href: whatsappHref('Olá! Vi seu portfólio e gostaria de pedir um orçamento.'),
    icon: brands.whatsapp,
  },
  {
    id: 'github',
    label: 'GitHub',
    value: '@Alexitiimia',
    href: site.links.github,
    icon: brands.github,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: 'endriky-657a89197',
    href: 'https://www.linkedin.com/in/endriky-657a89197/',
    icon: brands.linkedin,
  },
  {
    id: 'discord',
    label: 'Discord',
    value: 'ID 970456964406575164',
    href: 'https://discord.com/users/970456964406575164',
    icon: brands.discord,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    value: '@antigo.dont',
    href: 'https://www.instagram.com/antigo.dont/',
    icon: brands.instagram,
  },
]
