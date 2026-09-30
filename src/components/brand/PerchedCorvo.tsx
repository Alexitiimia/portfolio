import { useEffect, useState, type AnimationEvent } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import styles from './PerchedCorvo.module.css'

type Pose = 'right' | 'front' | 'left' | 'flying'

/** Poses paradas, em rotação: olha para a direita, de frente, para a esquerda, de frente... */
const IDLE_POSES = ['right', 'front', 'left', 'front'] as const

const TURN_MIN_MS = 4500
const TURN_SPREAD_MS = 3500
/** Rede de segurança: se o navegador não avisar o fim do voo, o corvo pousa sozinho. */
const FLIGHT_FALLBACK_MS = 5000

/**
 * Corvo pousado que reage à pessoa:
 * 1. parado, vira de direção de tempos em tempos;
 * 2. com o mouse (ou foco) em cima, vira para a esquerda, olhando para o texto;
 * 3. ao clicar, decola, sai voando pelo lado do quadrado e volta pousando.
 *
 * Duas camadas: `mover` percorre a trajetória (transform) e `sprite` troca os quadros da folha
 * (máscara). Tudo é CSS; o React só decide qual pose está ativa (`data-pose`).
 * Com "reduzir movimento" ligado, não há giro automático nem voo.
 */
export function PerchedCorvo() {
  const reduceMotion = useReducedMotion()
  const [idleStep, setIdleStep] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [flying, setFlying] = useState(false)

  // Giro ocasional enquanto está parado.
  useEffect(() => {
    if (reduceMotion || flying) return undefined
    const timer = window.setTimeout(
      () => {
        setIdleStep((step) => step + 1)
      },
      TURN_MIN_MS + Math.random() * TURN_SPREAD_MS,
    )
    return () => {
      window.clearTimeout(timer)
    }
  }, [idleStep, flying, reduceMotion])

  useEffect(() => {
    if (!flying) return undefined
    const timer = window.setTimeout(() => {
      setFlying(false)
    }, FLIGHT_FALLBACK_MS)
    return () => {
      window.clearTimeout(timer)
    }
  }, [flying])

  const idlePose = IDLE_POSES[idleStep % IDLE_POSES.length] ?? 'right'
  const pose: Pose = flying ? 'flying' : hovered ? 'left' : idlePose

  const takeOff = () => {
    if (!reduceMotion && !flying) setFlying(true)
  }

  const handleAnimationEnd = (event: AnimationEvent<HTMLSpanElement>) => {
    // Só o fim da trajetória conta; o fim da troca de quadros (filho) chega aqui por borbulhamento.
    if (event.target === event.currentTarget) setFlying(false)
  }

  return (
    <button
      type="button"
      className={styles.stage}
      data-pose={pose}
      aria-label="Fazer o corvo voar"
      aria-disabled={flying}
      onClick={takeOff}
      onMouseEnter={() => {
        setHovered(true)
      }}
      onMouseLeave={() => {
        setHovered(false)
      }}
      onFocus={() => {
        setHovered(true)
      }}
      onBlur={() => {
        setHovered(false)
      }}
    >
      <span className={styles.mover} onAnimationEnd={handleAnimationEnd}>
        <span className={styles.sprite} />
      </span>
      <span className={styles.hint} aria-hidden="true">
        clique no corvo
      </span>
    </button>
  )
}
