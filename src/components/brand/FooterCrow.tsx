import { CorvoSprite } from './CorvoSprite'
import styles from './FooterCrow.module.css'

/**
 * Corvo que patrulha o rodapé de um lado ao outro, bate as asas e vira (espelhado) nas pontas.
 * Camada decorativa atrás do conteúdo: transparente, sem capturar cliques e fora dos leitores de
 * tela. Com "reduzir movimento", fica pousado no canto.
 */
export function FooterCrow() {
  return (
    <div className={styles.sky} aria-hidden="true">
      <div className={styles.mover}>
        <CorvoSprite motion="flap" />
      </div>
    </div>
  )
}
