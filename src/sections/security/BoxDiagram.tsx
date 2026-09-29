import type { MethodologyId } from '@/content/security'
import { cx } from '@/lib/cx'
import styles from './BoxDiagram.module.css'

const VARIANT_CLASS: Record<MethodologyId, string | undefined> = {
  black: styles.black,
  grey: styles.grey,
  white: styles.white,
}

/**
 * A mesma "caixa" (um sistema com perímetro, conexões e núcleo) vista com três níveis de
 * conhecimento: preta não mostra nada por dentro, cinza mostra o perímetro e o núcleo pela metade,
 * branca mostra tudo. Decorativo: o texto ao lado já descreve cada nível.
 */
export function BoxDiagram({ variant }: { readonly variant: MethodologyId }) {
  return (
    <svg
      viewBox="0 0 160 160"
      aria-hidden="true"
      focusable="false"
      className={cx(styles.diagram, VARIANT_CLASS[variant])}
    >
      <rect className={styles.frame} x="0.5" y="0.5" width="159" height="159" />

      {variant === 'black' ? (
        <text
          className={styles.question}
          x="80"
          y="82"
          textAnchor="middle"
          dominantBaseline="central"
        >
          ?
        </text>
      ) : (
        <g className={styles.lines}>
          <rect x="28" y="28" width="104" height="104" />
          <path d="M80 28V54M80 106V132M28 80H54M106 80H132" />
          <rect className={cx(variant === 'grey' && styles.dashed)} x="54" y="54" width="52" height="52" />
          {variant === 'white' ? <circle className={styles.dot} cx="80" cy="80" r="7" /> : null}
        </g>
      )}
    </svg>
  )
}
