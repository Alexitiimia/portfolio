import { describe, expect, it } from 'vitest'

/*
  Trava a acessibilidade da paleta: qualquer mudança em tokens.css que derrube o contraste abaixo
  do mínimo da WCAG 2.2 AA faz este teste falhar. O jsdom não mede cores, então lemos o CSS direto.
  Mínimos: 4,5:1 para texto; 3:1 para bordas de controles (WCAG 1.4.11).
*/
const files = import.meta.glob<string>('/src/styles/tokens.css', {
  query: '?raw',
  import: 'default',
  eager: true,
})
const css = files['/src/styles/tokens.css'] ?? ''

type Palette = Readonly<Record<string, string>>

function readPalette(block: string | undefined): Palette {
  const palette: Record<string, string> = {}
  for (const match of (block ?? '').matchAll(/(--color-[a-z-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    const [, name, value] = match
    if (name !== undefined && value !== undefined) palette[name] = value.toLowerCase()
  }
  return palette
}

const dark = readPalette(/:root\s*\{([^}]*)\}/.exec(css)?.[1])
const lightOverrides = readPalette(/:root\[data-theme='light'\]\s*\{([^}]*)\}/.exec(css)?.[1])
const light: Palette = { ...dark, ...lightOverrides }

function channel(value: number): number {
  const s = value / 255
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

function luminance(hex: string): number {
  const n = Number.parseInt(hex.slice(1), 16)
  return (
    0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255)
  )
}

function contrast(a: string, b: string): number {
  const [lighter = 0, darker = 0] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (lighter + 0.05) / (darker + 0.05)
}

function color(palette: Palette, name: string): string {
  const value = palette[name]
  if (value === undefined) throw new Error(`Token ${name} não encontrado em tokens.css`)
  return value
}

const TEXT_ON_SURFACES: readonly (readonly [string, string])[] = [
  ['--color-fg', '--color-bg'],
  ['--color-fg', '--color-surface'],
  ['--color-fg', '--color-surface-raised'],
  ['--color-fg-muted', '--color-bg'],
  ['--color-fg-muted', '--color-surface'],
  ['--color-fg-muted', '--color-surface-raised'],
  ['--color-fg-subtle', '--color-bg'],
  ['--color-fg-subtle', '--color-surface'],
  ['--color-fg-subtle', '--color-surface-raised'],
  // Elementos invertidos (botão principal, quadrado do logo, barra de status, palavra em destaque).
  ['--color-bg', '--color-fg'],
]

const CONTROL_BORDERS: readonly (readonly [string, string])[] = [
  ['--color-line-strong', '--color-bg'],
  ['--color-line-strong', '--color-surface'],
  // Bolinha verde "disponível": é decorativa, mas precisa aparecer nos dois temas.
  ['--color-online', '--color-bg'],
]

describe.each([
  ['escuro', dark],
  ['claro', light],
] as const)('contraste do tema %s', (_theme, palette) => {
  it('lê todos os tokens de cor', () => {
    expect(Object.keys(palette).length).toBeGreaterThanOrEqual(8)
  })

  it.each(TEXT_ON_SURFACES)('texto %s sobre %s tem ao menos 4,5:1', (foreground, background) => {
    expect(contrast(color(palette, foreground), color(palette, background))).toBeGreaterThanOrEqual(
      4.5,
    )
  })

  it.each(CONTROL_BORDERS)('borda %s sobre %s tem ao menos 3:1', (border, background) => {
    expect(contrast(color(palette, border), color(palette, background))).toBeGreaterThanOrEqual(3)
  })
})
