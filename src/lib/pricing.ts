/** Os preços do orçamento são arredondados para múltiplos de R$ 10: "R$ 1.230", não "R$ 1.234". */
const ROUND_TO = 10

/**
 * Preço de um item a partir das horas estimadas e do seu valor por hora (em reais).
 * Devolve `null` quando falta o valor da hora ou as horas: o painel mostra "sob consulta" em vez
 * de inventar um preço.
 */
export function priceFromHours(hours: number, hourlyRate: number | null): number | null {
  if (hourlyRate === null || !Number.isFinite(hourlyRate) || hourlyRate <= 0) return null
  if (!Number.isFinite(hours) || hours <= 0) return null
  return Math.round((hours * hourlyRate) / ROUND_TO) * ROUND_TO
}
