import { act, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { mockIntersectionObserver } from '@/test/intersectionObserver'
import { useActiveSection } from './useActiveSection'

const IDS = ['a', 'b', 'c'] as const

function Probe() {
  const active = useActiveSection(IDS)
  return <p>ativa: {active ?? 'nenhuma'}</p>
}

function renderPage() {
  return render(
    <>
      <section id="a" />
      <section id="b" />
      <section id="c" />
      <Probe />
    </>,
  )
}

function byId(id: string): Element {
  const element = document.getElementById(id)
  if (element === null) throw new Error(`#${id} não existe`)
  return element
}

describe('useActiveSection', () => {
  it('começa sem nenhuma seção ativa e observa todas', () => {
    const Observer = mockIntersectionObserver()
    renderPage()

    expect(screen.getByText('ativa: nenhuma')).toBeInTheDocument()
    expect(Observer.instances).toHaveLength(1)
    expect([...(Observer.instances[0]?.observed ?? [])].map((el) => el.id)).toEqual(IDS)
  })

  it('marca a seção que entra na faixa de leitura e troca quando ela sai', () => {
    const Observer = mockIntersectionObserver()
    renderPage()
    const observer = Observer.instances[0]

    act(() => {
      observer?.emit([{ target: byId('b'), isIntersecting: true }])
    })
    expect(screen.getByText('ativa: b')).toBeInTheDocument()

    act(() => {
      observer?.emit([
        { target: byId('b'), isIntersecting: false },
        { target: byId('c'), isIntersecting: true },
      ])
    })
    expect(screen.getByText('ativa: c')).toBeInTheDocument()

    act(() => {
      observer?.emit([{ target: byId('c'), isIntersecting: false }])
    })
    expect(screen.getByText('ativa: nenhuma')).toBeInTheDocument()
  })

  it('com duas seções na faixa, vence a primeira na ordem da página', () => {
    const Observer = mockIntersectionObserver()
    renderPage()

    act(() => {
      Observer.instances[0]?.emit([
        { target: byId('c'), isIntersecting: true },
        { target: byId('b'), isIntersecting: true },
      ])
    })

    expect(screen.getByText('ativa: b')).toBeInTheDocument()
  })

  it('para de observar ao desmontar', () => {
    const Observer = mockIntersectionObserver()
    const { unmount } = renderPage()

    unmount()

    expect(Observer.instances[0]?.disconnected).toBe(true)
  })

  it('ignora ids que não existem na página', () => {
    const Observer = mockIntersectionObserver()
    render(
      <>
        <section id="a" />
        <Probe />
      </>,
    )

    expect([...(Observer.instances[0]?.observed ?? [])].map((el) => el.id)).toEqual(['a'])
  })

  it('não quebra quando o navegador não tem IntersectionObserver', () => {
    vi.stubGlobal('IntersectionObserver', undefined)

    expect(() => renderPage()).not.toThrow()
    expect(screen.getByText('ativa: nenhuma')).toBeInTheDocument()
  })
})
