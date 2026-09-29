import { CORVO_PATH } from './corvoPath'

interface BrandMarkProps {
  readonly size?: number
  readonly className?: string | undefined
}

/**
 * O corvo em pixel art (grade 32×32), na cor do texto. `crispEdges` mantém os pixels nítidos em
 * qualquer tamanho. Decorativo: o nome da marca sempre aparece em texto ao lado.
 */
export function BrandMark({ size = 32, className }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path fill="currentColor" d={CORVO_PATH} />
    </svg>
  )
}
