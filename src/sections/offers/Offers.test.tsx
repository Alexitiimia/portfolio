import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { offers } from '@/content/offers'
import { Offers } from './Offers'

describe('Condições', () => {
  it('destaca, em faixa própria, que o suporte é grátis nos primeiros 30 dias', () => {
    render(<Offers />)

    const callout = screen.getByText(
      'Nos primeiros 30 dias depois da compra, o suporte técnico é grátis.',
    )
    // Fica fora do parágrafo de descrição, para poder ter estilo próprio.
    expect(callout.tagName).toBe('P')
    expect(callout.parentElement).toContainElement(
      screen.getByRole('heading', { name: '24 horas por dia' }),
    )
  })

  it('mostra um cartão por condição', () => {
    render(<Offers />)

    for (const offer of offers) {
      expect(screen.getByRole('heading', { name: offer.highlight })).toBeInTheDocument()
    }
  })
})
