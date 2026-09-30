import {
  FolderCode,
  Layers,
  MessageCircle,
  ScrollText,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

/**
 * Seções da página, na ordem em que aparecem. Esta lista é a fonte única de três coisas:
 * o menu, o número exibido ao lado de cada título ("01", "02"...) e os `id` das âncoras.
 */
export const SECTION_IDS = [
  'projetos',
  'ferramentas',
  'servicos',
  'seguranca',
  'condicoes',
  'contato',
] as const

export type SectionId = (typeof SECTION_IDS)[number]

/** A seção que o botão de destaque do menu ("contato --24h →") leva a visitar. */
export const CTA_SECTION_ID: SectionId = 'contato'

interface SectionMeta {
  /** Título da seção. */
  readonly label: string
  /** Texto no menu, em minúsculas, no estilo de terminal. */
  readonly navLabel: string
  /** Frase curta exibida sob o título. */
  readonly lead: string
  /** Ícone ao lado do nome da seção nos links do rodapé. */
  readonly icon: LucideIcon
}

export const sections: Readonly<Record<SectionId, SectionMeta>> = {
  projetos: {
    label: 'Projetos',
    navLabel: 'projetos',
    lead: 'Alguns dos trabalhos que desenvolvi.',
    icon: FolderCode,
  },
  ferramentas: {
    label: 'Ferramentas',
    navLabel: 'ferramentas',
    lead: 'Tecnologias e plataformas com as quais trabalho.',
    icon: Wrench,
  },
  servicos: {
    label: 'Serviços',
    navLabel: 'serviços',
    lead: 'O que posso construir e manter para o seu negócio.',
    icon: Layers,
  },
  seguranca: {
    label: 'Segurança',
    navLabel: 'segurança',
    lead: 'Análise de segurança em três níveis de conhecimento do sistema.',
    icon: ShieldCheck,
  },
  condicoes: {
    label: 'Condições',
    navLabel: 'condições',
    lead: 'O que você recebe ao contratar.',
    icon: ScrollText,
  },
  contato: {
    label: 'Contato',
    navLabel: 'contato --24h',
    lead: 'Monte o orçamento e envie pelo WhatsApp, ou fale por outro canal.',
    icon: MessageCircle,
  },
}

interface NavItem {
  readonly id: SectionId
  readonly label: string
  /** Item de destaque do menu (borda e seta). */
  readonly isCta: boolean
}

export const navItems: readonly NavItem[] = SECTION_IDS.map((id) => ({
  id,
  label: sections[id].navLabel,
  isCta: id === CTA_SECTION_ID,
}))

/** Número exibido ao lado do título da seção, sempre derivado da ordem em `SECTION_IDS`. */
export function sectionNumber(id: SectionId): string {
  return String(SECTION_IDS.indexOf(id) + 1).padStart(2, '0')
}
