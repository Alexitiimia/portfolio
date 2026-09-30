import { createRef } from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { site } from '@/content/site'
import { mockMatchMedia } from '@/test/matchMedia'
import { Brand } from './Brand'
import { CorvoIcon } from './CorvoIcon'
import { CorvoMascot, type MascotVariant } from './CorvoMascot'
import { CorvoSprite } from './CorvoSprite'
import { poseFor } from './crowPose'
import { FooterCrow } from './FooterCrow'

afterEach(() => {
  vi.useRealTimers()
})

/** O jsdom não tem AnimationEvent: o React escuta o nome com prefixo. Vale nos dois. */
const endAnimation = (element: Element) => {
  for (const name of ['animationend', 'webkitAnimationEnd']) {
    fireEvent(element, new Event(name, { bubbles: true }))
  }
}

function movePointer(clientX: number, pointerType?: string) {
  const event = new MouseEvent('pointermove', { clientX })
  if (pointerType !== undefined) Object.defineProperty(event, 'pointerType', { value: pointerType })
  act(() => {
    window.dispatchEvent(event)
  })
}

describe('Brand', () => {
  it('é um link com nome acessível, que leva ao destino informado', () => {
    render(<Brand href="#inicio" />)

    const link = screen.getByRole('link', { name: `${site.name}, início da página` })
    expect(link).toHaveAttribute('href', '#inicio')
  })

  it('mostra nome e assinatura em texto', () => {
    const { container } = render(<Brand href="#inicio" />)

    expect(site.name).toBe('The Crow')
    expect(container).toHaveTextContent(site.name)
    expect(container).toHaveTextContent(site.tagline)
  })

  it('com poleiro deixa o espaço do corvo vazio e entrega o elemento', () => {
    const slotRef = createRef<HTMLSpanElement>()
    const { container } = render(<Brand href="#inicio" slotRef={slotRef} />)

    expect(container.querySelector('[data-flying]')).toBeNull()
    expect(container.querySelector('[data-pose]')).toBeNull()
    expect(slotRef.current).toBeInstanceOf(HTMLSpanElement)
    expect(slotRef.current).toBeEmptyDOMElement()
  })
})

describe('CorvoSprite', () => {
  it('é decorativo e informa pose e movimento', () => {
    const { container } = render(<CorvoSprite pose="left" motion="flap" />)
    const sprite = container.firstElementChild

    expect(sprite).toHaveAttribute('aria-hidden', 'true')
    expect(sprite).toHaveAttribute('data-pose', 'left')
    expect(sprite).toHaveAttribute('data-motion', 'flap')
  })
})

describe('poseFor', () => {
  it.each([
    [300, 'right'],
    [56, 'right'],
    [55, 'front'],
    [0, 'front'],
    [-55, 'front'],
    [-56, 'left'],
    [-300, 'left'],
  ])('ponteiro a %ipx do centro: olha para %s', (dx, expected) => {
    expect(poseFor(dx)).toBe(expected)
  })
})

describe('CorvoIcon (logo do header)', () => {
  const find = (container: HTMLElement, selector: string) => {
    const element = container.querySelector(selector)
    if (element === null) throw new Error(`${selector} não encontrado`)
    return element
  }
  const box = (container: HTMLElement) => find(container, '[data-flying]')
  const sprite = (container: HTMLElement) => find(container, '[data-pose]')

  it('começa parado, olhando para a direita', () => {
    const { container } = render(<CorvoIcon />)

    expect(sprite(container)).toHaveAttribute('data-pose', 'right')
    expect(sprite(container)).toHaveAttribute('data-motion', 'still')
    expect(box(container)).toHaveAttribute('data-flying', 'false')
  })

  it('olha para o ponteiro do mouse: esquerda, frente ou direita', () => {
    const { container } = render(<CorvoIcon />)

    movePointer(-400)
    expect(sprite(container)).toHaveAttribute('data-pose', 'left')

    movePointer(10)
    expect(sprite(container)).toHaveAttribute('data-pose', 'front')

    movePointer(400)
    expect(sprite(container)).toHaveAttribute('data-pose', 'right')
  })

  it('ignora toques: no celular não há ponteiro para acompanhar', () => {
    const { container } = render(<CorvoIcon />)

    movePointer(-400, 'touch')

    expect(sprite(container)).toHaveAttribute('data-pose', 'right')
  })

  it('decola ao clicar (ou tocar) e pousa quando a trajetória termina', () => {
    const { container } = render(<CorvoIcon />)

    fireEvent.click(box(container))
    expect(box(container)).toHaveAttribute('data-flying', 'true')
    expect(sprite(container)).toHaveAttribute('data-motion', 'takeoff')

    const mover = find(container, '[data-flying] > span')
    endAnimation(sprite(container)) // fim da troca de quadros: não encerra o voo
    expect(box(container)).toHaveAttribute('data-flying', 'true')

    endAnimation(mover) // fim da trajetória
    expect(box(container)).toHaveAttribute('data-flying', 'false')
    expect(sprite(container)).toHaveAttribute('data-motion', 'still')
  })

  it('ignora cliques durante o voo', () => {
    vi.useFakeTimers()
    const { container } = render(<CorvoIcon />)

    fireEvent.click(box(container))
    fireEvent.click(box(container))
    expect(box(container)).toHaveAttribute('data-flying', 'true')

    act(() => {
      vi.advanceTimersByTime(6000)
    })
    expect(box(container)).toHaveAttribute('data-flying', 'false')
  })

  it('com "reduzir movimento" não voa', () => {
    mockMatchMedia(true)
    const { container } = render(<CorvoIcon />)

    fireEvent.click(box(container))

    expect(box(container)).toHaveAttribute('data-flying', 'false')
  })

  it('remove o ouvinte de mouse ao desmontar', () => {
    const remove = vi.spyOn(window, 'removeEventListener')
    const { unmount } = render(<CorvoIcon />)

    unmount()

    expect(remove).toHaveBeenCalledWith('pointermove', expect.any(Function))
  })
})

describe('FooterCrow', () => {
  function renderCrow() {
    const homeRef = createRef<HTMLSpanElement>()
    const view = render(
      <>
        <span ref={homeRef} />
        <FooterCrow homeRef={homeRef} />
      </>,
    )
    return { ...view, sky: view.container.querySelector('[aria-hidden="true"]') }
  }

  it('é uma camada decorativa, com o corvo pousado no poleiro', () => {
    const { sky } = renderCrow()

    expect(sky).not.toBeNull()
    expect(sky?.querySelector('[data-motion="still"]')).not.toBeNull()
    expect(sky?.querySelector('[data-motion="flap"]')).toBeNull()
  })

  it('decola, passeia e volta a pousar sozinho', () => {
    vi.useFakeTimers()
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const homeRef = createRef<HTMLSpanElement>()
    const { container } = render(
      <>
        <span ref={homeRef} />
        <FooterCrow homeRef={homeRef} />
      </>,
    )
    // O jsdom não tem layout: dá ao poleiro e ao céu um tamanho para o voo ser possível.
    const sky = container.querySelector<HTMLElement>('[aria-hidden="true"]')
    const perch = homeRef.current
    if (sky === null || perch === null) throw new Error('corvo não renderizou')
    sky.getBoundingClientRect = () => new DOMRect(0, 0, 1200, 600)
    perch.getBoundingClientRect = () => new DOMRect(40, 300, 72, 62)

    const sequence: string[] = []
    for (let i = 0; i < 60 * 80; i++) {
      act(() => {
        vi.advanceTimersByTime(16)
      })
      const motion = sky.querySelector('[data-motion]')?.getAttribute('data-motion') ?? ''
      if (sequence.at(-1) !== motion) sequence.push(motion)
    }

    // Pousado -> agacha -> voa -> pousa -> pousado de novo (e assim por diante).
    expect(sequence.join(',')).toContain('still,crouch,flap,land,still')
  })

  it('com "reduzir movimento" fica sempre pousado', () => {
    mockMatchMedia(true)
    vi.useFakeTimers()
    const { sky } = renderCrow()

    act(() => {
      vi.advanceTimersByTime(60_000)
    })

    expect(sky?.querySelector('[data-motion="still"]')).not.toBeNull()
  })

  it('para de animar ao sair de cena e ao desmontar', () => {
    const cancel = vi.spyOn(window, 'cancelAnimationFrame')
    const { unmount } = renderCrow()

    unmount()

    expect(cancel).toHaveBeenCalled()
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
