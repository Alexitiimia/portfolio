import { cx } from '@/lib/cx'
import type { CrowPose } from './crowPose'
import styles from './CorvoSprite.module.css'

export type CrowMotion = 'still' | 'takeoff' | 'flap' | 'crouch' | 'land'

const POSE_CLASS: Record<CrowPose, string | undefined> = {
  right: undefined,
  left: styles.left,
  front: styles.front,
}

const MOTION_CLASS: Record<CrowMotion, string | undefined> = {
  still: undefined,
  takeoff: styles.takeoff,
  flap: styles.flap,
  crouch: styles.crouch,
  land: styles.land,
}

interface CorvoSpriteProps {
  /** Para onde o corvo parado olha. Ignorado enquanto houver movimento. */
  readonly pose?: CrowPose
  /** `takeoff`: decola, bate asas e pousa (uma vez). `flap`: bate asas sem parar.
   * `crouch` e `land`: quadros parados de antes de decolar e de logo depois de pousar. */
  readonly motion?: CrowMotion
  readonly className?: string | undefined
}

/**
 * O corvo em pixel art, fundo transparente. Decorativo: o nome da marca sempre aparece em texto.
 * Os movimentos são só CSS e desaparecem para quem pediu menos movimento (o corvo fica parado).
 */
export function CorvoSprite({ pose = 'right', motion = 'still', className }: CorvoSpriteProps) {
  return (
    <span
      className={cx(styles.sprite, POSE_CLASS[pose], MOTION_CLASS[motion], className)}
      data-pose={pose}
      data-motion={motion}
      aria-hidden="true"
    />
  )
}
