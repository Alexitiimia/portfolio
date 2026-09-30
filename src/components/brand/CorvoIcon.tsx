import { useEffect, useRef, useState, type AnimationEvent } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { CorvoSprite } from './CorvoSprite'
import { poseFor, type CrowPose } from './crowPose'
import styles from './CorvoIcon.module.css'

/** Igual à duração da decolagem em CorvoSprite.module.css. */
const FLIGHT_MS = 2810
/** Rede de segurança: se o navegador não avisar o fim do voo, o corvo pousa sozinho. */
const FLIGHT_FALLBACK_MS = FLIGHT_MS + 2000
/**
 * Corvo do logo. Parado, olha para o ponteiro do mouse; ao clicar (ou tocar), decola, bate as asas
 * e pousa. No celular não há ponteiro, então ele fica olhando para a frente e só reage ao toque.
 * Fica dentro do link do logo, então o clique também leva ao topo da página, como antes.
 */
export function CorvoIcon() {
  const reduceMotion = useReducedMotion()
  const [pose, setPose] = useState<CrowPose>('right')
  const [flying, setFlying] = useState(false)
  const box = useRef<HTMLSpanElement>(null)

  // Segue o mouse. Toque não gera "ponteiro parado", então no celular a pose não muda.
  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || box.current === null) return
      const rect = box.current.getBoundingClientRect()
      setPose(poseFor(event.clientX - (rect.left + rect.width / 2)))
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [])

  useEffect(() => {
    if (!flying) return undefined
    const timer = window.setTimeout(() => {
      setFlying(false)
    }, FLIGHT_FALLBACK_MS)
    return () => {
      window.clearTimeout(timer)
    }
  }, [flying])

  const takeOff = () => {
    if (!reduceMotion && !flying) setFlying(true)
  }

  const handleAnimationEnd = (event: AnimationEvent<HTMLSpanElement>) => {
    // Só o fim da trajetória conta; o da troca de quadros (filho) chega aqui por borbulhamento.
    if (event.target === event.currentTarget) setFlying(false)
  }

  return (
    <span ref={box} className={styles.box} data-flying={flying} onClick={takeOff}>
      <span className={styles.mover} onAnimationEnd={handleAnimationEnd}>
        <CorvoSprite pose={pose} motion={flying ? 'takeoff' : 'still'} />
      </span>
    </span>
  )
}
