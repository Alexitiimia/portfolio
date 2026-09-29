import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { mockMatchMedia } from '@/test/matchMedia'
import { useTheme } from './useTheme'

function Probe() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button type="button" onClick={toggleTheme}>
      {theme}
    </button>
  )
}

const rootTheme = () => document.documentElement.getAttribute('data-theme')

describe('useTheme', () => {
  it('começa pelo tema do sistema quando não há escolha salva', () => {
    mockMatchMedia(true)
    render(<Probe />)

    expect(screen.getByRole('button')).toHaveTextContent('light')
    expect(rootTheme()).toBe('light')
  })

  it('alterna, aplica no <html> e salva a escolha', async () => {
    const user = userEvent.setup()
    render(<Probe />) // sistema escuro

    await user.click(screen.getByRole('button'))

    expect(screen.getByRole('button')).toHaveTextContent('light')
    expect(rootTheme()).toBe('light')
    expect(window.localStorage.getItem('theme')).toBe('light')

    await user.click(screen.getByRole('button'))
    expect(rootTheme()).toBe('dark')
    expect(window.localStorage.getItem('theme')).toBe('dark')
  })

  it('acompanha o sistema enquanto não há escolha salva', () => {
    const media = mockMatchMedia(false)
    render(<Probe />)
    expect(screen.getByRole('button')).toHaveTextContent('dark')

    act(() => {
      media.setMatches(true)
    })

    expect(screen.getByRole('button')).toHaveTextContent('light')
    expect(rootTheme()).toBe('light')
  })

  it('ignora mudanças do sistema depois que a pessoa escolheu', async () => {
    const user = userEvent.setup()
    const media = mockMatchMedia(true) // sistema claro
    render(<Probe />)

    await user.click(screen.getByRole('button')) // escolhe escuro
    expect(screen.getByRole('button')).toHaveTextContent('dark')

    act(() => {
      media.setMatches(true)
    })

    expect(screen.getByRole('button')).toHaveTextContent('dark')
    expect(rootTheme()).toBe('dark')
  })

  it('usa o tema que o script do <head> já aplicou', () => {
    document.documentElement.setAttribute('data-theme', 'light')
    render(<Probe />) // sistema escuro, mas o atributo manda

    expect(screen.getByRole('button')).toHaveTextContent('light')
  })
})
