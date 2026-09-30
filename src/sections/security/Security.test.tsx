import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { methodologies } from '@/content/security'
import { mockMatchMedia } from '@/test/matchMedia'
import { Security } from './Security'

const RECT = {
  left: 0,
  top: 0,
  right: 200,
  bottom: 200,
  width: 200,
  height: 200,
  x: 0,
  y: 0,
  toJSON: () => ({}),
}

/** O jsdom não faz layout: todo elemento mede 0×0. Damos a todos um quadrado de 200×200. */
beforeEach(() => {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(RECT)
})

afterEach(() => {
  vi.restoreAllMocks()
})

function cardOf(name: string): HTMLElement {
  const heading = screen.getByRole('heading', { name })
  const card = heading.closest('li')
  if (card === null) throw new Error(`Cartão de ${name} não encontrado`)
  return card
}

function diagramOf(card: HTMLElement): SVGSVGElement {
  const svg = card.querySelector('svg')
  if (svg === null) throw new Error('Sem diagrama')
  return svg
}

/** O contorno da caixa (o primeiro path do clipPath) muda quando a caixa gira. */
function outlineOf(svg: SVGSVGElement): string {
  return svg.querySelector('clipPath path')?.getAttribute('d') ?? ''
}

describe('Segurança: caixas interativas', () => {
  it('mostra os três níveis, cada um com seu diagrama decorativo', () => {
    render(<Security />)

    for (const method of methodologies) {
      const svg = diagramOf(cardOf(method.name))
      expect(svg).toHaveAttribute('aria-hidden', 'true')
    }
  })

  it('o mouse sobre o cartão ativa a caixa e ao sair ela volta ao repouso', () => {
    render(<Security />)
    const card = cardOf('Black Box')
    const svg = diagramOf(card)
    expect(svg).toHaveAttribute('data-active', 'false')

    fireEvent.pointerMove(card, { clientX: 150, clientY: 150 })
    expect(svg).toHaveAttribute('data-active', 'true')

    fireEvent.pointerLeave(card)
    expect(svg).toHaveAttribute('data-active', 'false')
  })

  it('a caixa gira acompanhando o mouse', async () => {
    render(<Security />)
    const card = cardOf('White Box')
    const svg = diagramOf(card)
    const before = outlineOf(svg)

    fireEvent.pointerMove(card, { clientX: 200, clientY: 0 })

    await waitFor(() => {
      expect(outlineOf(svg)).not.toBe(before)
    })
  })

  it('na caixa cinza, o mouse acende a lanterna e o "?" e as sondas ficam só na preta', () => {
    render(<Security />)
    const card = cardOf('Grey Box')
    const svg = diagramOf(card)
    expect(svg.querySelector('clipPath circle')).toBeNull()

    fireEvent.pointerMove(card, { clientX: 100, clientY: 100 })
    expect(svg.querySelector('clipPath circle')).not.toBeNull()

    fireEvent.pointerLeave(card)
    expect(svg.querySelector('clipPath circle')).toBeNull()

    expect(diagramOf(cardOf('Black Box')).textContent).toContain('?')
    expect(svg.textContent).not.toContain('?')
  })

  it('o medidor de visão vai de 0% a 100% conforme o conhecimento do sistema', () => {
    render(<Security />)

    expect(diagramOf(cardOf('Black Box')).textContent).toContain('VISÃO 0%')
    expect(diagramOf(cardOf('Grey Box')).textContent).toContain('VISÃO 50%')
    expect(diagramOf(cardOf('White Box')).textContent).toContain('VISÃO 100%')
  })

  it('com "reduzir movimento" a caixa não gira, mas a lanterna continua respondendo', async () => {
    mockMatchMedia(true)
    render(<Security />)
    const grey = cardOf('Grey Box')
    const greySvg = diagramOf(grey)
    const before = outlineOf(greySvg)

    fireEvent.pointerMove(grey, { clientX: 200, clientY: 0 })
    await new Promise((resolve) => setTimeout(resolve, 50))

    expect(outlineOf(greySvg)).toBe(before)
    expect(greySvg.querySelector('clipPath circle')).not.toBeNull()
  })
})
