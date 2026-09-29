import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { site } from '@/content/site'
import { ErrorBoundary } from './ErrorBoundary'

function Bomb(): never {
  throw new Error('explosão de teste')
}

describe('ErrorBoundary', () => {
  it('renderiza os filhos quando está tudo bem', () => {
    render(
      <ErrorBoundary>
        <p>conteúdo normal</p>
      </ErrorBoundary>,
    )

    expect(screen.getByText('conteúdo normal')).toBeInTheDocument()
  })

  it('mostra o corvo em falha e um caminho de saída quando um filho quebra', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    )

    expect(screen.getByRole('heading', { level: 1, name: /algo deu errado/i })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /corvo com falha/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /github\.com\/Alexitiimia/ })).toHaveAttribute(
      'href',
      site.links.github,
    )
    expect(consoleError).toHaveBeenCalledWith(
      'Falha ao desenhar a página:',
      expect.objectContaining({ message: 'explosão de teste' }),
      expect.any(String),
    )
  })
})
