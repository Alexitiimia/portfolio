import type { LucideIcon } from 'lucide-react'

interface LineIconProps {
  readonly icon: LucideIcon
  readonly size?: number
  readonly className?: string | undefined
}

/** Ícone de traço fino, com pontas e cantos retos como a identidade em pixel art. Decorativo. */
export function LineIcon({ icon: Icon, size = 16, className }: LineIconProps) {
  return (
    <Icon
      size={size}
      strokeWidth={1.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      className={className}
    />
  )
}
