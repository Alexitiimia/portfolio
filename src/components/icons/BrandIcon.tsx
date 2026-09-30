import { useId } from 'react'
import type { CSSProperties } from 'react'
import type { BrandIconData } from './brands'
import styles from './BrandIcon.module.css'

interface BrandIconProps {
  readonly icon: BrandIconData
  readonly size?: number
  readonly className?: string | undefined
  /** Usa as cores oficiais da marca em vez da cor do texto. */
  readonly colored?: boolean
}

/** Luminância relativa (0 a 1) de uma cor hexadecimal sem "#", como no WCAG. */
function luminance(hex: string): number {
  const [r = 0, g = 0, b = 0] = [0, 2, 4].map((start) => {
    const channel = parseInt(hex.slice(start, start + 2), 16) / 255
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Logo de marca em SVG. Por padrão usa a cor do texto (`currentColor`); com `colored` usa as cores
 * oficiais. Marcas quase pretas (GitHub, Vercel, Next.js) somem no tema escuro, então nele voltam
 * para a cor do texto. É decorativo: o nome da marca sempre aparece em texto ao lado, então
 * leitores de tela ignoram o desenho.
 */
export function BrandIcon({ icon, size = 24, className, colored = false }: BrandIconProps) {
  const gradientId = useId()
  const gradient = colored ? icon.gradient : undefined
  const classes = [
    colored && gradient === undefined && icon.parts === undefined ? styles.colored : undefined,
    colored && luminance(icon.hex) < 0.05 ? styles.dark : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={classes || undefined}
      style={colored ? ({ '--brand': `#${icon.hex}` } as CSSProperties) : undefined}
    >
      {gradient !== undefined ? (
        <>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
              {gradient.map((hex, index, all) => (
                <stop
                  key={hex}
                  offset={all.length === 1 ? 0 : index / (all.length - 1)}
                  stopColor={`#${hex}`}
                />
              ))}
            </linearGradient>
          </defs>
          <path d={icon.path} fill={`url(#${gradientId})`} />
        </>
      ) : colored && icon.parts !== undefined ? (
        icon.parts.map((part) => (
          <path key={part.path} d={part.path} fill={`#${part.hex}`} transform={part.transform} />
        ))
      ) : (
        <path d={icon.path} />
      )}
    </svg>
  )
}
