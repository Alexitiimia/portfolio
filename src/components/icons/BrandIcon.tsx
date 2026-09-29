import type { BrandIconData } from './brands'

interface BrandIconProps {
  readonly icon: BrandIconData
  readonly size?: number
  readonly className?: string | undefined
}

/**
 * Logo de marca em SVG, na cor do texto (`currentColor`). É decorativo: o nome da marca sempre
 * aparece em texto ao lado, então leitores de tela ignoram o desenho.
 */
export function BrandIcon({ icon, size = 24, className }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={icon.path} />
    </svg>
  )
}
