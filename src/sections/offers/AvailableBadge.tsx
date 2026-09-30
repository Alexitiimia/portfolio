import type { CSSProperties } from 'react'
import styles from './AvailableBadge.module.css'

/** Faíscas que saem do selo: ângulo (graus) e distância (rem), em ordem. */
const SPARKS: readonly (readonly [number, number])[] = [
  [0, 2.4],
  [45, 2.1],
  [90, 2.4],
  [135, 2.1],
  [180, 2.4],
  [225, 2.1],
  [270, 2.4],
  [315, 2.1],
]

/**
 * Selo animado de "nome livre": o círculo se abre, o visto é desenhado, um anel se espalha e
 * pequenas faíscas quadradas (como os pixels do corvo) saem em volta. Decorativo: quem lê a tela
 * recebe o texto do resultado. Com "reduzir movimento", aparece pronto e parado.
 */
export function AvailableBadge() {
  return (
    <span className={styles.badge} aria-hidden="true" data-testid="available-badge">
      <span className={styles.ring} />
      {SPARKS.map(([angle, distance]) => (
        <span
          key={angle}
          className={styles.spark}
          style={
            {
              '--angle': `${String(angle)}deg`,
              '--distance': `${String(distance)}rem`,
            } as CSSProperties
          }
        />
      ))}
      <svg viewBox="0 0 24 24" className={styles.mark}>
        <circle cx="12" cy="12" r="10" className={styles.circle} pathLength={1} />
        <path d="M7 12.5l3.5 3.5L17 9" className={styles.check} pathLength={1} />
      </svg>
    </span>
  )
}
