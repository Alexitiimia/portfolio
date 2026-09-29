import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { site } from '@/content/site'
import { Brand } from './Brand'
import { BrandMark } from './BrandMark'
import { CorvoMascot, type MascotVariant } from './CorvoMascot'
import { CORVO_PATH } from './corvoPath'

describe('BrandMark', () => {
  it('desenha o corvo da identidade, decorativo e com pixels nítidos', () => {
    const { container } = render(<BrandMark size={64} />)
    const svg = container.querySelector('svg')
    const path = container.querySelector('path')

    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveAttribute('viewBox', '0 0 32 32')
    expect(svg).toHaveAttribute('shape-rendering', 'crispEdges')
    expect(svg).toHaveAttribute('width', '64')
    expect(path).toHaveAttribute('d', CORVO_PATH)
    expect(path).toHaveAttribute('fill', 'currentColor')
  })

  it('usa uma grade 32×32 de retângulos de 1px de altura', () => {
    const rectangles = CORVO_PATH.match(/M\d+ \d+h\d+v1h-\d+z/g) ?? []

    expect(rectangles.length).toBeGreaterThan(30)
    // Nada além de retângulos: se sobrar texto, o desenho foi editado à mão ou corrompido.
    expect(rectangles.join('')).toBe(CORVO_PATH)
  })
})

describe('Brand', () => {
  it('é um link com nome acessível, que leva ao destino informado', () => {
    render(<Brand href="#inicio" />)

    const link = screen.getByRole('link', { name: `${site.name}, início da página` })
    expect(link).toHaveAttribute('href', '#inicio')
  })

  it('mostra nome e assinatura em texto', () => {
    const { container } = render(<Brand href="#inicio" />)

    expect(container).toHaveTextContent(site.name)
    expect(container).toHaveTextContent(site.tagline)
  })
})

describe('CorvoMascot', () => {
  it.each<[MascotVariant, string]>([
    ['carregando', 'Carregando'],
    ['concluido', 'Concluído'],
    ['recusado', 'Recusado'],
    ['falha', 'Falha'],
  ])('o estado "%s" é uma imagem com nome "%s"', (variant, name) => {
    render(<CorvoMascot variant={variant} />)

    expect(screen.getByRole('img', { name })).toBeInTheDocument()
  })

  it('aceita um texto alternativo próprio', () => {
    render(<CorvoMascot variant="falha" label="Algo quebrou" />)

    expect(screen.getByRole('img', { name: 'Algo quebrou' })).toBeInTheDocument()
  })
})
