import { priceFromHours } from '@/lib/pricing'

/**
 * Seu valor por hora, em reais (número, sem "R$"). É a única coisa a preencher para o painel de
 * orçamento ter preços: cada item custa `horas × valor da hora`, arredondado para R$ 10.
 * Enquanto for `null`, o painel mostra "sob consulta" e o total aparece como "a combinar".
 * Nenhum valor é inventado.
 */
export const HOURLY_RATE: number | null = null

/**
 * Catálogo do painel de orçamento (seção Contato). As horas de cada item são estimativas de
 * trabalho sozinho, com testes e publicação: ajuste-as ao seu ritmo. Elas não aparecem para o
 * cliente, só o preço que sai delas.
 */
export interface QuoteItem {
  /** Identificador único (minúsculas e hifens). */
  readonly id: string
  readonly label: string
  readonly description: string
  /** Horas de trabalho estimadas. Ausente = sem estimativa (o item fica "sob consulta"). */
  readonly hours?: number
  /** Preço em reais (`horas × HOURLY_RATE`), ou `null` para "sob consulta". */
  readonly price: number | null
}

export interface QuoteCatalog {
  /** O cliente escolhe UM. */
  readonly projects: readonly QuoteItem[]
  /** O cliente escolhe quantos quiser. */
  readonly extras: readonly QuoteItem[]
  readonly deadlines: readonly { readonly id: string; readonly label: string }[]
}

function item(id: string, label: string, description: string, hours: number | null): QuoteItem {
  return {
    id,
    label,
    description,
    ...(hours === null ? {} : { hours }),
    price: hours === null ? null : priceFromHours(hours, HOURLY_RATE),
  }
}

export const quoteCatalog: QuoteCatalog = {
  projects: [
    item(
      'site-institucional',
      'Site institucional',
      'Apresenta você ou sua empresa: serviços, projetos e contato.',
      24,
    ),
    item('loja-virtual', 'Loja virtual', 'Venda de produtos online, com catálogo e carrinho.', 60),
    item(
      'sistema-financeiro',
      'Sistema de gestão financeira',
      'Vendas, custo, lucro e faturamento semanal, mensal e anual.',
      60,
    ),
    item(
      'automacao-de-dados',
      'Automação de dados',
      'Scripts para manutenção, armazenamento e atualização de dados.',
      16,
    ),
    // Sem horas de propósito: cada "outro projeto" é único e precisa de conversa antes do preço.
    item('outro', 'Outro projeto', 'Algo diferente: descreva no campo abaixo.', null),
  ],
  extras: [
    item('login-social', 'Login rápido e seguro', 'Google, Discord, GitHub e Steam.', 8),
    item('verificacao-email', 'Verificação de e-mail', 'Confirma o e-mail de quem se cadastra.', 6),
    item(
      'verificacao-telefone',
      'Verificação de telefone',
      'Confirma o número, apenas números brasileiros.',
      8,
    ),
    item(
      'frete',
      'Frete e localização',
      'Cálculo pelo site ou pelo canal que preferir, no Brasil todo ou só local.',
      16,
    ),
    item('pagamentos', 'Sistema de pagamento', 'Pagamento real, para vendas físicas e online.', 20),
    item(
      'gerenciamento',
      'Gerenciamento de dados',
      'Cadastro e gestão de clientes ou funcionários.',
      20,
    ),
    item(
      'previa-de-design',
      'Prévia de design',
      'Protótipo visual para aprovar antes de programar.',
      12,
    ),
    item('criacao-de-logo', 'Criação de logo', 'Logo e identidade visual simples.', 8),
    item(
      'automacao-de-sistemas',
      'Automação de sistemas',
      'Automação de processos e integração entre ferramentas.',
      16,
    ),
    item(
      'auditoria-de-seguranca',
      'Auditoria de segurança',
      'Revisão do sistema para achar e corrigir falhas.',
      24,
    ),
    item(
      'mentoria',
      'Mentoria de portabilidade',
      'Ajuda para migrar o projeto entre plataformas e hospedagens.',
      6,
    ),
  ],
  deadlines: [
    { id: 'sem-pressa', label: 'Sem pressa' },
    { id: 'ate-1-mes', label: 'Em até 1 mês' },
    { id: 'urgente', label: 'Urgente' },
  ],
}
