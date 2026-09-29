import { Bug, DatabaseZap, ScanSearch, ShieldCheck, type LucideIcon } from 'lucide-react'

/** O identificador também escolhe o desenho do diagrama (ver BoxDiagram). */
export type MethodologyId = 'black' | 'grey' | 'white'

export interface Methodology {
  readonly id: MethodologyId
  readonly name: string
  readonly translation: string
  /** Quanto se sabe do sistema antes de começar. */
  readonly knowledge: string
  readonly description: string
}

export const methodologies: readonly Methodology[] = [
  {
    id: 'black',
    name: 'Black Box',
    translation: 'Caixa preta',
    knowledge: 'Nenhum',
    description:
      'Sem acesso ao código nem à documentação. A análise parte de fora, como um atacante real faria.',
  },
  {
    id: 'grey',
    name: 'Grey Box',
    translation: 'Caixa cinzenta',
    knowledge: 'Parcial',
    description:
      'Conhecimento parcial do sistema, como contas de teste ou parte da arquitetura. Une a visão externa a um pouco de contexto interno.',
  },
  {
    id: 'white',
    name: 'White Box',
    translation: 'Caixa branca',
    knowledge: 'Total',
    description:
      'Acesso completo ao código, à configuração e à infraestrutura. É a análise mais profunda.',
  },
]

export interface Capability {
  /** Identificador único (minúsculas e hifens). */
  readonly id: string
  readonly title: string
  readonly description: string
  readonly icon: LucideIcon
}

export const capabilities: readonly Capability[] = [
  {
    id: 'auditoria',
    title: 'Auditoria de segurança',
    description: 'Revisão de sistemas para encontrar e corrigir falhas de segurança.',
    icon: ShieldCheck,
  },
  {
    id: 'banco-de-dados',
    title: 'Análise de banco de dados em tempo real',
    description:
      'Testes simulados para validar e corrigir falhas de segurança, bugs, integrações mal feitas e pontos de otimização.',
    icon: DatabaseZap,
  },
  {
    id: 'sql-injection',
    title: 'Noções de SQL Injection',
    description: 'Testes de injeção de SQL com o Burp Suite.',
    icon: Bug,
  },
  {
    id: 'engenharia-reversa',
    title: 'Engenharia reversa',
    description: 'Técnicas de engenharia reversa para entender o funcionamento de sistemas.',
    icon: ScanSearch,
  },
]
