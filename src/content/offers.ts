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
    description: 'Domínio grátis durante o primeiro ano.',
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
    label: 'Suporte',
    highlight: '24 horas por dia',
    description: 'Manutenção de bugs e solicitações de ajuda 24 horas por dia.',
    icon: LifeBuoy,
  },
  {
    id: 'primeiros-30-dias',
    label: 'Primeiros 30 dias',
    highlight: 'Grátis na compra',
    description: 'Os primeiros 30 dias são grátis ao realizar uma compra.',
    icon: CalendarCheck,
  },
]
