import { useId, type RefObject } from 'react'
import type { MethodologyId } from '@/content/security'
import { useUi } from '@/i18n/useI18n'
import { cx } from '@/lib/cx'
import { boxGeometry, TILE_SIZE, type BoxView } from './boxGeometry'
import styles from './BoxDiagram.module.css'

const VARIANT_CLASS: Record<MethodologyId, string | undefined> = {
  black: styles.black,
  grey: styles.grey,
  white: styles.white,
}

/** Quanto do interior cada nível enxerga, em décimos (0 a 10), e o texto do medidor. */
const VISIBILITY: Record<MethodologyId, number> = { black: 0, grey: 5, white: 10 }
const CELLS = Array.from({ length: 10 }, (_, index) => index)

/** Raio da "lanterna" da caixa cinza, no mesmo sistema de coordenadas do desenho. */
const LENS_RADIUS = 30

interface BoxDiagramProps {
  readonly variant: MethodologyId
  readonly view: BoxView
  readonly svgRef: RefObject<SVGSVGElement | null>
}

/**
 * A mesma "caixa" (um sistema com perímetro e núcleo) vista com três níveis de conhecimento.
 * Preta: fechada; sondas de fora batem na superfície e nada se vê por dentro. Cinza: só parte do
 * interior aparece, e a pessoa escolhe qual com o mouse, como uma lanterna. Branca: tudo visível,
 * com dados fluindo até o núcleo. A caixa gira com o mouse e com a rolagem (ver useBoxInteraction).
 * Decorativo: o texto ao lado já descreve cada nível. Sem movimento, o desenho fica parado e completo.
 */
export function BoxDiagram({ variant, view, svgRef }: BoxDiagramProps) {
  const uid = useId()
  const ui = useUi()
  const silhouetteClip = `${uid}-caixa`
  const revealClip = `${uid}-lanterna`

  const box = boxGeometry(view.tilt)
  const visible = VISIBILITY[variant]

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${String(TILE_SIZE)} ${String(TILE_SIZE)}`}
      aria-hidden="true"
      focusable="false"
      data-active={view.active}
      className={cx(styles.diagram, VARIANT_CLASS[variant])}
    >
      <defs>
        <clipPath id={silhouetteClip}>
          <path d={box.silhouette} />
        </clipPath>
        <clipPath id={revealClip}>
          {view.light === null ? (
            <rect x="0" y="0" width="80" height={TILE_SIZE} />
          ) : (
            <circle cx={view.light.x} cy={view.light.y} r={LENS_RADIUS} />
          )}
        </clipPath>
      </defs>

      <rect className={styles.frame} x="0.5" y="0.5" width="159" height="159" />

      <g>
        <polygon className={styles.face} points={box.faceFront} />
        <polygon className={styles.face} points={box.faceTop} />
        <polygon className={styles.face} points={box.faceRight} />
        <polygon className={styles.lit} points={box.faceTop} />
        <polygon className={styles.shadow} points={box.faceRight} />
        <path className={styles.edge} d={box.frontEdges} />
      </g>

      {variant === 'black' ? (
        <>
          <text
            className={styles.question}
            x="66"
            y="96"
            textAnchor="middle"
            dominantBaseline="central"
          >
            ?
          </text>

          <g>
            <rect className={styles.origin} x="4" y="93" width="6" height="6" />
            <path className={styles.probe} d="M10 96H29" />
            <circle className={styles.ripple} cx="30" cy="96" r="3" />

            <rect
              className={styles.origin}
              x="152"
              y={box.rightFaceEdge.y - 3}
              width="6"
              height="6"
            />
            <path
              className={cx(styles.probe, styles.later)}
              d={`M152 ${String(box.rightFaceEdge.y)}H${String(box.rightFaceEdge.x + 1)}`}
            />
            <circle
              className={cx(styles.ripple, styles.later)}
              cx={box.rightFaceEdge.x}
              cy={box.rightFaceEdge.y}
              r="3"
            />
          </g>
        </>
      ) : null}

      {variant === 'grey' ? (
        <>
          <g className={cx(styles.xray, styles.faint, styles.dashed)}>
            <path d={box.backEdges} />
            <path d={box.links} />
            <path d={box.coreEdges} />
          </g>
          <g className={styles.xray} clipPath={`url(#${revealClip})`}>
            <path d={box.backEdges} />
            <path d={box.links} />
            <path d={box.coreEdges} />
          </g>
          {view.light === null ? null : (
            <circle className={styles.lens} cx={view.light.x} cy={view.light.y} r={LENS_RADIUS} />
          )}
          <g clipPath={`url(#${silhouetteClip})`}>
            <rect className={styles.scan} x="30" y="14" width="100" height="16" />
          </g>
        </>
      ) : null}

      {variant === 'white' ? (
        <>
          <g className={styles.xray}>
            <path d={box.backEdges} />
            <path d={box.links} />
            <path className={styles.core} d={box.coreFront} />
            <path d={box.coreEdges} />
          </g>
          <path className={styles.flow} d={box.links} />
          <circle className={styles.heart} cx={box.center.x} cy={box.center.y} r="4" />
        </>
      ) : null}

      <g>
        <text className={styles.readout} x="8" y="14">
          {ui.security.vision(visible * 10)}
        </text>
        {CELLS.map((cell) => (
          <rect
            key={cell}
            className={cx(styles.cell, cell < visible && styles.cellOn)}
            x={8 + cell * 8}
            y="146"
            width="5"
            height="5"
          />
        ))}
      </g>
    </svg>
  )
}
