import { useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { CorvoSprite, type CrowMotion } from './CorvoSprite'
import type { CrowPose } from './crowPose'
import {
  ARRIVAL_PX,
  between,
  move,
  newFlight,
  returnHome,
  wander,
  type Sky,
} from './crowFlight'
import styles from './FooterCrow.module.css'

type Phase = 'perched' | 'crouch' | 'flying' | 'land'

const MOTION_OF: Record<Phase, CrowMotion> = {
  perched: 'still',
  crouch: 'crouch',
  flying: 'flap',
  land: 'land',
}

const POSES: readonly CrowPose[] = ['right', 'left', 'front']

/** Um passo maior que isso (aba em segundo plano) vira só 50 ms, para o corvo não "teleportar". */
const MAX_STEP_S = 0.05

/** O corvo só começa a se mexer quando pelo menos essa fração dele está na tela. */
const VISIBLE_RATIO = 0.6

/** Tempo entre o corvo aparecer na tela e decolar (1,5 segundo). */
const FIRST_TAKEOFF_S = 1.5

interface FooterCrowProps {
  /** O espaço do logo: é o "poleiro" onde o corvo pousa e de onde decola. */
  readonly homeRef: RefObject<HTMLElement | null>
}

/**
 * O corvo do rodapé é o próprio logo: fica pousado no lugar dele, olhando ao redor, e de tempos em
 * tempos decola, passeia sem rumo (sai por uma borda e volta pela outra), retorna ao poleiro e
 * pousa. Camada decorativa atrás do conteúdo: sem cliques e fora dos leitores de tela.
 *
 * Posição padrão: pousado no lugar do logo. Só começa a se mexer depois que a pessoa rola até
 * vê-lo (pelo menos 60 % dele na tela) e decola 1,5 s depois. Se ela rolar para longe, ele volta
 * ao poleiro e espera de novo. Com "reduzir movimento", fica pousado, parado, no lugar do logo.
 */
export function FooterCrow({ homeRef }: FooterCrowProps) {
  const reduceMotion = useReducedMotion()
  const skyRef = useRef<HTMLDivElement>(null)
  const moverRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<Phase>('perched')
  const [pose, setPose] = useState<CrowPose>('right')

  useLayoutEffect(() => {
    const skyEl = skyRef.current
    const mover = moverRef.current
    const homeEl = homeRef.current
    if (skyEl === null || mover === null || homeEl === null) return undefined

    setPhase('perched')
    setPose('right')
    let current: Phase = 'perched'
    let facing: 1 | -1 = 1
    let waitS = FIRST_TAKEOFF_S // até a primeira decolagem
    let lookS = between(2, 4, Math.random) // até olhar para outro lado
    let wanderS = 0
    let returning = false
    let applied = ''
    let last: number | null = null
    let raf = 0
    const flight = newFlight({ x: 0, y: 0 }, 1)

    const enter = (next: Phase) => {
      current = next
      setPhase(next)
    }

    /** Onde o poleiro está agora, medido no céu (o layout pode mudar: fonte, janela, quebra de linha). */
    const measure = (): { sky: Sky; home: { x: number; y: number } } => {
      const skyBox = skyEl.getBoundingClientRect()
      const homeBox = homeEl.getBoundingClientRect()
      const birdW = homeBox.width
      const birdH = homeBox.height
      mover.style.width = `${birdW.toFixed(2)}px`
      return {
        sky: {
          roomX: skyBox.width - birdW,
          roomY: skyBox.height - birdH,
          birdW,
          birdH,
        },
        home: { x: homeBox.left - skyBox.left, y: homeBox.top - skyBox.top },
      }
    }

    const place = (flip: 1 | -1) => {
      const transform = `translate3d(${flight.x.toFixed(1)}px, ${flight.y.toFixed(1)}px, 0) scaleX(${String(flip)})`
      if (transform === applied) return
      applied = transform
      mover.style.transform = transform
    }

    const perchAt = (home: { x: number; y: number }) => {
      flight.x = home.x
      flight.y = home.y
    }

    const tick = (now: number) => {
      const dt = last === null ? 0 : Math.min((now - last) / 1000, MAX_STEP_S)
      last = now
      const { sky, home } = measure()
      const canFly = !reduceMotion && sky.roomX > sky.birdW && sky.roomY > sky.birdH

      if (current === 'perched') {
        perchAt(home)
        place(1)
        if (canFly) {
          lookS -= dt
          waitS -= dt
          if (lookS <= 0) {
            setPose(POSES[Math.floor(Math.random() * POSES.length)] ?? 'right')
            lookS = between(2, 5, Math.random)
          }
          if (waitS <= 0) {
            facing = Math.random() < 0.5 ? 1 : -1
            waitS = 0.35
            enter('crouch')
          }
        }
      } else if (current === 'crouch') {
        perchAt(home)
        place(facing)
        waitS -= dt
        if (waitS <= 0) {
          flight.heading = facing
          flight.vx = facing * 40
          flight.vy = -70
          flight.climb = -20
          flight.retarget = 1
          wanderS = between(14, 26, Math.random)
          returning = false
          enter('flying')
        }
      } else if (current === 'flying') {
        wanderS -= dt
        if (wanderS <= 0) returning = true

        let landed = false
        if (returning) {
          const distance = returnHome(flight, home, sky, dt)
          if (distance <= ARRIVAL_PX) {
            perchAt(home)
            facing = flight.heading
            waitS = 0.4
            landed = true
            enter('land')
          }
        } else {
          wander(flight, dt, Math.random)
        }
        if (!landed) {
          move(flight, dt, sky)
          if (flight.vx !== 0) facing = flight.vx > 0 ? 1 : -1
        }
        place(facing)
      } else {
        perchAt(home)
        place(facing)
        waitS -= dt
        if (waitS <= 0) {
          setPose(facing === 1 ? 'right' : 'left')
          waitS = between(7, 15, Math.random)
          lookS = between(2, 4, Math.random)
          enter('perched')
        }
      }

      raf = window.requestAnimationFrame(tick)
    }

    const start = () => {
      if (raf !== 0) return
      last = null
      raf = window.requestAnimationFrame(tick)
    }
    const stop = () => {
      window.cancelAnimationFrame(raf)
      raf = 0
    }
    /** Sai de cena: volta ao poleiro, parado, e recomeça a contagem quando for visto de novo. */
    const park = () => {
      stop()
      if (current !== 'perched') enter('perched')
      setPose('right')
      facing = 1
      returning = false
      waitS = FIRST_TAKEOFF_S
      lookS = between(2, 4, Math.random)
      perchAt(measure().home)
      place(1)
    }

    // Posição inicial já no primeiro desenho: o corvo nunca aparece fora do poleiro.
    const first = measure()
    perchAt(first.home)
    place(1)

    if (typeof IntersectionObserver === 'undefined') {
      start()
      return stop
    }
    // Observa o próprio corvo (o poleiro), não o rodapé: ele só conta como "visto" de verdade.
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries.at(-1)
        if (entry === undefined) return
        if (entry.intersectionRatio >= VISIBLE_RATIO) start()
        else if (!entry.isIntersecting) park()
      },
      { threshold: [0, VISIBLE_RATIO] },
    )
    observer.observe(homeEl)
    return () => {
      observer.disconnect()
      stop()
    }
  }, [homeRef, reduceMotion])

  return (
    <div ref={skyRef} className={styles.sky} aria-hidden="true">
      <div ref={moverRef} className={styles.mover}>
        <CorvoSprite pose={pose} motion={MOTION_OF[phase]} />
      </div>
    </div>
  )
}
