/**
 * Catálogo do painel de orçamento (seção Contato). Os preços são SEUS: preencha `price` com o
 * valor em reais (número, sem "R$"). Enquanto estiver `null`, o painel mostra "sob consulta" e o
 * total aparece como "a combinar". Nenhum valor é inventado.
 */
export interface QuoteItem {
  /** Identificador único (minúsculas e hifens). */
  readonly id: string
  readonly label: string
  readonly description: string
  /** Preço em reais, ou `null` para "sob consulta". */
  readonly price: number | null
}

export interface QuoteCatalog {
  /** O cliente escolhe UM. */
  readonly projects: readonly QuoteItem[]
  /** O cliente escolhe quantos quiser. */
  readonly extras: readonly QuoteItem[]
  readonly deadlines: readonly { readonly id: string; readonly label: string }[]
}

export const quoteCatalog: QuoteCatalog = {
  projects: [
    {
      id: 'site-institucional',
      label: 'Site institucional',
      description: 'Apresenta você ou sua empresa: serviços, projetos e contato.',
      price: null,
    },
    {
      id: 'loja-virtual',
      label: 'Loja virtual',
      description: 'Venda de produtos online, com catálogo e carrinho.',
      price: null,
    },
    {
      id: 'sistema-financeiro',
      label: 'Sistema de gestão financeira',
      description: 'Vendas, custo, lucro e faturamento semanal, mensal e anual.',
      price: null,
    },
    {
      id: 'automacao-de-dados',
      label: 'Automação de dados',
      description: 'Scripts para manutenção, armazenamento e atualização de dados.',
      price: null,
    },
    {
      id: 'outro',
      label: 'Outro projeto',
      description: 'Algo diferente: descreva no campo abaixo.',
      price: null,
    },
  ],
  extras: [
    {
      id: 'login-social',
      label: 'Login rápido e seguro',
      description: 'Google, Discord, GitHub e Steam.',
      price: null,
    },
    {
      id: 'verificacao-email',
      label: 'Verificação de e-mail',
      description: 'Confirma o e-mail de quem se cadastra.',
      price: null,
    },
    {
      id: 'verificacao-telefone',
      label: 'Verificação de telefone',
      description: 'Confirma o número, apenas números brasileiros.',
      price: null,
    },
    {
      id: 'frete',
      label: 'Frete e localização',
      description: 'Cálculo pelo site ou pelo canal que preferir, no Brasil todo ou só local.',
      price: null,
    },
    {
      id: 'pagamentos',
      label: 'Sistema de pagamento',
      description: 'Pagamento real, para vendas físicas e online.',
      price: null,
    },
    {
      id: 'gerenciamento',
      label: 'Gerenciamento de dados',
      description: 'Cadastro e gestão de clientes ou funcionários.',
      price: null,
    },
    {
      id: 'previa-de-design',
      label: 'Prévia de design',
      description: 'Protótipo visual para aprovar antes de programar.',
      price: null,
    },
    {
      id: 'criacao-de-logo',
      label: 'Criação de logo',
      description: 'Logo e identidade visual simples.',
      price: null,
    },
    {
      id: 'automacao-de-sistemas',
      label: 'Automação de sistemas',
      description: 'Automação de processos e integração entre ferramentas.',
      price: null,
    },
    {
      id: 'auditoria-de-seguranca',
      label: 'Auditoria de segurança',
      description: 'Revisão do sistema para achar e corrigir falhas.',
      price: null,
    },
    {
      id: 'mentoria',
      label: 'Mentoria de portabilidade',
      description: 'Ajuda para migrar o projeto entre plataformas e hospedagens.',
      price: null,
    },
  ],
  deadlines: [
    { id: 'sem-pressa', label: 'Sem pressa' },
    { id: 'ate-1-mes', label: 'Em até 1 mês' },
    { id: 'urgente', label: 'Urgente' },
  ],
}
