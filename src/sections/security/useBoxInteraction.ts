import { useEffect, useRef, useState, type PointerEvent, type RefObject } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { REST_VIEW, TILE_SIZE, type BoxTilt, type BoxView, type Point } from './boxGeometry'

/** Fração do caminho percorrida a cada quadro: quanto menor, mais suave (e lento) o giro. */
const EASE = 0.14
const SETTLED = 0.002
/** Quanto a rolagem gira a caixa (a posição do mouse gira mais). */
const SCROLL_TURN = { x: 0.9, y: 0.35 } as const

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

interface BoxInteraction {
  readonly view: BoxView
  readonly cardRef: RefObject<HTMLLIElement | null>
  readonly svgRef: RefObject<SVGSVGElement | null>
  readonly handlers: {
    readonly onPointerEnter: (event: PointerEvent) => void
    readonly onPointerMove: (event: PointerEvent) => void
    readonly onPointerDown: (event: PointerEvent) => void
    readonly onPointerLeave: () => void
    readonly onPointerCancel: () => void
  }
}

/**
 * Faz a caixa reagir à pessoa:
 * - com o mouse (ou dedo) sobre o cartão, ela gira acompanhando o ponteiro e informa onde ele está;
 * - sem ponteiro, ela gira devagar conforme o cartão sobe na tela ao rolar a página.
 *
 * O giro é suavizado quadro a quadro; o resto (`active`, `light`) muda na hora. Com "reduzir
 * movimento" ligado, a caixa não gira (a lanterna da caixa cinza segue funcionando: é resposta
 * direta ao mouse, não movimento por conta própria).
 */
export function useBoxInteraction(): BoxInteraction {
  const reduceMotion = useReducedMotion()
  const cardRef = useRef<HTMLLIElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [view, setView] = useState<BoxView>(REST_VIEW)

  const goal = useRef<BoxTilt>({ x: 0, y: 0 })
  const shown = useRef<BoxTilt>({ x: 0, y: 0 })
  const pointerActive = useRef(false)
  const kick = useRef<() => void>(() => undefined)
  const readScroll = useRef<() => void>(() => undefined)

  // Giro suavizado: um laço de quadros que só roda enquanto a caixa ainda está se mexendo.
  useEffect(() => {
    let frame = 0

    function step() {
      frame = 0
      const target = reduceMotion ? { x: 0, y: 0 } : goal.current
      const dx = target.x - shown.current.x
      const dy = target.y - shown.current.y
      const settled = Math.abs(dx) < SETTLED && Math.abs(dy) < SETTLED
      shown.current = settled
        ? target
        : { x: shown.current.x + dx * EASE, y: shown.current.y + dy * EASE }

      const tilt = shown.current
      setView((previous) => ({ ...previous, tilt }))
      if (!settled) frame = requestAnimationFrame(step)
    }

    kick.current = () => {
      if (frame === 0) frame = requestAnimationFrame(step)
    }

    return () => {
      kick.current = () => undefined
      if (frame !== 0) cancelAnimationFrame(frame)
    }
  }, [reduceMotion])

  // Rolagem: enquanto não há ponteiro sobre o cartão, o giro segue a posição dele na tela.
  useEffect(() => {
    let first = true

    function update() {
      const card = cardRef.current
      if (card === null || pointerActive.current) return
      const rect = card.getBoundingClientRect()
      const half = (window.innerHeight || 1) / 2
      const progress = clamp((rect.top + rect.height / 2 - half) / half, -1, 1)
      goal.current = { x: progress * SCROLL_TURN.x, y: -progress * SCROLL_TURN.y }
      if (first) {
        // Primeira leitura: já nasce na posição certa, sem "balançar" ao carregar a página.
        shown.current = reduceMotion ? { x: 0, y: 0 } : goal.current
        first = false
      }
      kick.current()
    }

    let frame = 0
    function onScroll() {
      if (frame !== 0) return
      frame = requestAnimationFrame(() => {
        frame = 0
        update()
      })
    }

    readScroll.current = update
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      readScroll.current = () => undefined
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame !== 0) cancelAnimationFrame(frame)
    }
  }, [reduceMotion])

  function point(event: PointerEvent) {
    const card = cardRef.current
    if (card === null) return
    const rect = card.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return

    pointerActive.current = true
    goal.current = {
      x: clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1),
      y: clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1),
    }

    let light: Point | null = null
    const box = svgRef.current?.getBoundingClientRect()
    if (box !== undefined && box.width > 0 && box.height > 0) {
      light = {
        x: clamp(((event.clientX - box.left) / box.width) * TILE_SIZE, 0, TILE_SIZE),
        y: clamp(((event.clientY - box.top) / box.height) * TILE_SIZE, 0, TILE_SIZE),
      }
    }
    setView((previous) => ({ ...previous, active: true, light }))
    kick.current()
  }

  function release() {
    pointerActive.current = false
    setView((previous) => ({ ...previous, active: false, light: null }))
    // Sem ponteiro, a caixa volta ao giro da rolagem.
    readScroll.current()
  }

  return {
    view,
    cardRef,
    svgRef,
    handlers: {
      onPointerEnter: point,
      onPointerMove: point,
      onPointerDown: point,
      onPointerLeave: release,
      onPointerCancel: release,
    },
  }
}
