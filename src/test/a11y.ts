import axe, { type Result } from 'axe-core'

/**
 * Roda o axe-core (motor de acessibilidade usado por Lighthouse e outras ferramentas) e devolve as
 * violações encontradas. O jsdom não calcula layout nem cores, então o contraste é desligado aqui
 * e conferido no navegador de verdade (ver docs/ARCHITECTURE.md).
 */
export async function findA11yViolations(context: Element): Promise<Result[]> {
  const results = await axe.run(context, {
    rules: { 'color-contrast': { enabled: false } },
  })
  return results.violations
}

/** Resume as violações em texto legível para a mensagem de falha do teste. */
export function describeViolations(violations: readonly Result[]): string {
  return violations
    .map((violation) => {
      const targets = violation.nodes.map((node) => node.target.join(' ')).join(', ')
      return `${violation.id}: ${violation.help} (${targets})`
    })
    .join('\n')
}
