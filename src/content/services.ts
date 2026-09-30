import {
  ChartNoAxesCombined,
  Bug,
  Cpu,
  CreditCard,
  GraduationCap,
  KeyRound,
  MailCheck,
  PenTool,
  SearchCheck,
  Shapes,
  ShoppingCart,
  Smartphone,
  Truck,
  Users,
  Webhook,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import { brands, type BrandIconData } from '@/components/icons/brands'

export interface Service {
  /** Identificador único (minúsculas e hifens). */
  readonly id: string
  readonly title: string
  readonly description: string
  readonly icon: LucideIcon
  /** Id do item do orçamento que o botão "pedir orçamento" já deixa marcado (ausente = só abre a página). */
  readonly quoteItem?: string
  /** Marcas mostradas junto ao serviço, como os provedores de login. */
  readonly brands?: readonly BrandIconData[]
}

export const services: readonly Service[] = [
  {
    id: 'lojas',
    quoteItem: 'loja-virtual',
    title: 'Lojas e vendas online',
    description: 'Sites para venda de produtos, com pagamento real, frete e localização.',
    icon: ShoppingCart,
  },
  {
    id: 'financeiro',
    quoteItem: 'sistema-financeiro',
    title: 'Gestão financeira',
    description:
      'Controle de vendas, preço de custo e lucro, com cálculo de faturamento semanal, mensal e anual.',
    icon: ChartNoAxesCombined,
  },
  {
    id: 'frete',
    quoteItem: 'frete',
    title: 'Frete e localização',
    description:
      'Cálculo de frete e localização pelo site ou pelo canal de sua preferência, para todo o Brasil ou apenas local.',
    icon: Truck,
  },
  {
    id: 'login',
    quoteItem: 'login-social',
    title: 'Cadastro e login seguros',
    description: 'Registro e login rápidos e seguros com Google, Discord, GitHub e Steam.',
    icon: KeyRound,
    brands: [brands.google, brands.discord, brands.github, brands.steam],
  },
  {
    id: 'verificacao-email',
    quoteItem: 'verificacao-email',
    title: 'Verificação de e-mail',
    description: 'Sistema para confirmar o e-mail de quem se cadastra.',
    icon: MailCheck,
  },
  {
    id: 'verificacao-telefone',
    quoteItem: 'verificacao-telefone',
    title: 'Verificação de telefone',
    description: 'Sistema para confirmar o número de telefone, apenas para números brasileiros.',
    icon: Smartphone,
  },
  {
    id: 'gerenciamento',
    quoteItem: 'gerenciamento',
    title: 'Gerenciamento de dados',
    description: 'Cadastro e gestão dos dados de clientes ou funcionários.',
    icon: Users,
  },
  {
    id: 'pagamentos',
    quoteItem: 'pagamentos',
    title: 'Pagamentos',
    description: 'Sistema de pagamento real, para vendas físicas e online.',
    icon: CreditCard,
  },
  {
    id: 'automacao',
    quoteItem: 'automacao-de-dados',
    title: 'Automação de dados',
    description:
      'Scripts automatizados e eficazes para manutenção, manuseio, armazenamento e atualização de dados.',
    icon: Workflow,
  },
  {
    id: 'previa-de-design',
    quoteItem: 'previa-de-design',
    title: 'Prévia de design',
    description:
      'Protótipo visual do site ou sistema antes de programar, para você aprovar layout, cores e textos com clareza.',
    icon: PenTool,
  },
  {
    id: 'criacao-de-logo',
    quoteItem: 'criacao-de-logo',
    title: 'Criação de logo',
    description: 'Logo e identidade visual simples para o seu negócio, prontos para site e redes.',
    icon: Shapes,
  },
  {
    id: 'automacao-de-sistemas',
    quoteItem: 'automacao-de-sistemas',
    title: 'Automação de sistemas',
    description:
      'Automação de sistemas virtuais, do processo interno à integração entre ferramentas.',
    icon: Cpu,
  },
  {
    id: 'integracao-de-apis',
    quoteItem: 'integracao-de-apis',
    title: 'Integração de APIs',
    description: 'Integração de APIs de qualquer tipo em qualquer sistema.',
    icon: Webhook,
  },
  {
    id: 'correcao-e-debug',
    quoteItem: 'correcao-de-sistema',
    title: 'Correção e debug de sistemas',
    description:
      'Correção de falhas e debug otimizado, de forma avançada e eficaz, para o sistema voltar a funcionar e rodar melhor.',
    icon: Bug,
  },
  {
    id: 'seo',
    title: 'SEO para sites',
    description:
      'SEO autêntico, eficaz e otimizado para o seu site, para ser encontrado com mais facilidade nas buscas.',
    icon: SearchCheck,
  },
  {
    id: 'mentoria',
    quoteItem: 'mentoria',
    title: 'Mentoria de portabilidade',
    description: 'Acompanhamento para migrar e portar projetos entre plataformas e hospedagens.',
    icon: GraduationCap,
  },
]
