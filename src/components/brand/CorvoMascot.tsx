import { cx } from '@/lib/cx'
import styles from './CorvoMascot.module.css'

export type MascotVariant = 'carregando' | 'concluido' | 'recusado' | 'falha'

const LABELS: Record<MascotVariant, string> = {
  carregando: 'Carregando',
  concluido: 'Concluído',
  recusado: 'Recusado',
  falha: 'Falha',
}

const VARIANT_CLASS: Record<MascotVariant, string | undefined> = {
  carregando: styles.carregando,
  concluido: styles.concluido,
  recusado: styles.recusado,
  falha: styles.falha,
}

interface CorvoMascotProps {
  readonly variant: MascotVariant
  /** Texto lido por leitores de tela. Padrão: o nome do estado. */
  readonly label?: string
}

/**
 * Corvo animado em pixel art (sprite recortado por máscara CSS, então segue a cor do texto nos
 * dois temas). Estados: carregando, concluído, recusado e falha. A animação pausa para quem
 * prefere menos movimento. O estado "404" vive em public/404.html, fora do React.
 */
export function CorvoMascot({ variant, label }: CorvoMascotProps) {
  return (
    <span
      role="img"
      aria-label={label ?? LABELS[variant]}
      className={cx(styles.mascot, VARIANT_CLASS[variant])}
    />
  )
}
