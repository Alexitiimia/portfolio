import { CalendarCheck, Globe, LifeBuoy, Server, type LucideIcon } from 'lucide-react'

export interface Offer {
  /** Identificador único (minúsculas e hifens). */
  readonly id: string
  /** Rótulo curto (ex.: "Domínio"). */
  readonly label: string
  /** Destaque (ex.: "Grátis por 1 ano"). Aparece também no topo da página. */
  readonly highlight: string
  readonly description: string
  readonly icon: LucideIcon
}

export const offers: readonly Offer[] = [
  {
    id: 'dominio',
    label: 'Domínio',
    highlight: 'Grátis por 1 ano',
    description:
      'Endereço grátis durante o primeiro ano, no formato seunome.axeldev.workers.dev. Confira abaixo se o nome que você quer está livre.',
    icon: Globe,
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
    icon: LifeBuoy,
  },
  {
    id: 'primeiros-30-dias',
    label: 'Primeiros 30 dias',
    highlight: 'Suporte técnico grátis',
    description: 'Depois da compra, os primeiros 30 dias de suporte técnico não têm custo.',
    icon: CalendarCheck,
  },
]
