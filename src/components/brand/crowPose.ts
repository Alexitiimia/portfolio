export type CrowPose = 'right' | 'left' | 'front'

/** Dentro dessa distância horizontal do corvo, o ponteiro está "à frente" dele. */
export const FRONT_ZONE_PX = 56

/** Para onde o corvo olha, dado o quanto o ponteiro está à esquerda (-) ou à direita (+) dele. */
export function poseFor(dx: number): CrowPose {
  if (Math.abs(dx) < FRONT_ZONE_PX) return 'front'
  return dx < 0 ? 'left' : 'right'
}
