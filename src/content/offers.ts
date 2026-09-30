import { Globe, LifeBuoy, Server, type LucideIcon } from 'lucide-react'

export interface Offer {
  /** Identificador único (minúsculas e hifens). */
  readonly id: string
  /** Rótulo curto (ex.: "Domínio"). */
  readonly label: string
  /** Destaque (ex.: "Grátis por 1 ano"). Aparece também no topo da página. */
  readonly highlight: string
  readonly description: string
  /** Frase de destaque, exibida numa faixa de cores invertidas dentro do cartão. */
  readonly callout?: string
  readonly icon: LucideIcon
  /** Botão extra no cartão. `domain-check` abre o popup que confere se um nome está livre. */
  readonly action?: { readonly kind: 'domain-check'; readonly label: string }
}

export const offers: readonly Offer[] = [
  {
    id: 'dominio',
    label: 'Domínio',
    highlight: 'Grátis por 1 ano',
    description:
      'Endereço grátis durante o primeiro ano, no formato seunome.axeldev.workers.dev. Confira se o nome que você quer está livre.',
    icon: Globe,
    action: { kind: 'domain-check', label: 'verificar nome' },
  },
  {
    id: 'hospedagem',
    label: 'Hospedagem',
    highlight: 'Grátis por 3 meses',
    description: 'Depois dos 3 meses, o valor é calculado de acordo com a demanda.',
    icon: Server,
  },
  {
    id: 'suporte',
    label: 'Suporte técnico',
    highlight: '24 horas por dia',
    description:
      'Correção de bugs e atendimento de pedidos de ajuda técnica com o seu site ou sistema, a qualquer hora.',
    callout: 'Nos primeiros 30 dias depois da compra, o suporte técnico é grátis.',
    icon: LifeBuoy,
  },
]
