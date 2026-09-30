import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockMatchMedia } from '@/test/matchMedia'
import { PerchedCorvo } from './PerchedCorvo'

const button = () => screen.getByRole('button', { name: 'Fazer o corvo voar' })
const pose = () => button().getAttribute('data-pose')
const mover = () => {
  const element = button().firstElementChild
  if (element === null) throw new Error('mover não encontrado')
  return element
}

const sprite = () => {
  const element = mover().firstElementChild
  if (element === null) throw new Error('sprite não encontrado')
  return element
}

/**
 * Dispara o fim de uma animação. O jsdom não tem `AnimationEvent`, então o React passa a escutar o
 * nome com prefixo (`webkitAnimationEnd`); nos navegadores reais vale o `animationend` padrão.
 */
const endAnimation = (element: Element) => {
  for (const name of ['animationend', 'webkitAnimationEnd']) {
    fireEvent(element, new Event(name, { bubbles: true }))
  }
}

afterEach(() => {
  vi.useRealTimers()
})

describe('PerchedCorvo', () => {
  it('começa pousado olhando para a direita, com nome acessível', () => {
    render(<PerchedCorvo />)

    expect(pose()).toBe('right')
    expect(button()).toHaveAttribute('aria-disabled', 'false')
  })

  it('vira para a esquerda com o mouse em cima e volta ao tirar', async () => {
    const user = userEvent.setup()
    render(<PerchedCorvo />)

    await user.hover(button())
    expect(pose()).toBe('left')

    await user.unhover(button())
    expect(pose()).toBe('right')
  })

  it('também vira ao receber foco pelo teclado', async () => {
    const user = userEvent.setup()
    render(<PerchedCorvo />)

    await user.tab()

    expect(button()).toHaveFocus()
    expect(pose()).toBe('left')
  })

  it('muda de direção sozinho de tempos em tempos', () => {
    vi.useFakeTimers()
    render(<PerchedCorvo />)

    act(() => {
      vi.advanceTimersByTime(8100)
    })
    expect(pose()).toBe('front')

    act(() => {
      vi.advanceTimersByTime(8100)
    })
    expect(pose()).toBe('left')
  })

  it('decola ao clicar, ignora cliques durante o voo e pousa quando a trajetória termina', async () => {
    const user = userEvent.setup()
    render(<PerchedCorvo />)

    await user.click(button())
    expect(pose()).toBe('flying')
    expect(button()).toHaveAttribute('aria-disabled', 'true')

    await user.click(button()) // ignorado
    expect(pose()).toBe('flying')

    // O fim da troca de quadros (filho) não pode encerrar o voo...
    endAnimation(sprite())
    expect(pose()).toBe('flying')

    // ...só o da trajetória.
    endAnimation(mover())
    expect(pose()).not.toBe('flying')
    expect(button()).toHaveAttribute('aria-disabled', 'false')
  })

  it('pousa sozinho se o navegador nunca avisar o fim do voo', () => {
    vi.useFakeTimers()
    render(<PerchedCorvo />)

    fireEvent.click(button())
    expect(pose()).toBe('flying')

    act(() => {
      vi.advanceTimersByTime(5100)
    })
    expect(pose()).not.toBe('flying')
  })

  it('com "reduzir movimento" não gira sozinho nem voa', () => {
    vi.useFakeTimers()
    mockMatchMedia(true) // o mock responde `true` para qualquer consulta, inclusive movimento
    render(<PerchedCorvo />)

    fireEvent.click(button())
    act(() => {
      vi.advanceTimersByTime(20000)
    })

    expect(pose()).toBe('right')
  })

  it('não deixa timers pendentes ao desmontar', () => {
    vi.useFakeTimers()
    const { unmount } = render(<PerchedCorvo />)

    unmount()

    expect(vi.getTimerCount()).toBe(0)
  })
})
