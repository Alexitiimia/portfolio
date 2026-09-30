export interface Point {
  readonly x: number
  readonly y: number
}

/** Inclinação da caixa: cada eixo vai de -1 a 1 (0 = posição de repouso). */
export type BoxTilt = Point

/** O que a pessoa está fazendo com a caixa. */
export interface BoxView {
  readonly tilt: BoxTilt
  /** Onde o mouse está, em coordenadas do desenho (0 a TILE_SIZE). `null` sem mouse por perto. */
  readonly light: Point | null
  /** Mouse (ou dedo) sobre o cartão. */
  readonly active: boolean
}

export const REST_VIEW: BoxView = { tilt: { x: 0, y: 0 }, light: null, active: false }

/** Lado do desenho (viewBox quadrado). */
export const TILE_SIZE = 160

/*
  Caixa em projeção oblíqua: um quadrado da frente (fixo) e outro atrás, deslocado para cima e para
  a direita. Mudar esse deslocamento "gira" a caixa. É o desenho clássico de caixa transparente:
  as arestas de trás não se confundem com as da frente. O núcleo é a mesma caixa, menor, no centro.
*/
const FRONT = { x: 30, y: 58, size: 72 } as const
const CORE_SIZE = 24
/** Quanto o fundo se afasta na horizontal e na vertical em repouso, e o quanto isso varia. */
const DEPTH_X = { rest: 32, range: 10 } as const
const DEPTH_Y = { rest: 28, range: 8 } as const
/** Proporção da profundidade que o núcleo usa (a caixa dele é menor). */
const CORE_DEPTH = 0.4

export interface BoxGeometry {
  readonly silhouette: string
  readonly faceFront: string
  readonly faceTop: string
  readonly faceRight: string
  readonly frontEdges: string
  readonly backEdges: string
  readonly coreEdges: string
  readonly coreFront: string
  readonly links: string
  /** Centro da caixa, onde fica o núcleo. */
  readonly center: Point
  /** Centro da face da direita, onde bate a sonda da caixa preta. */
  readonly rightFaceCenter: Point
}

const round = (value: number) => Math.round(value * 100) / 100
const clamp = (value: number) => Math.min(1, Math.max(-1, value))
const corner = (x: number, y: number): Point => ({ x, y })
const move = (from: Point, dx: number, dy: number): Point => corner(from.x + dx, from.y + dy)

const coordinates = (point: Point) => `${String(round(point.x))} ${String(round(point.y))}`
const points = (...list: Point[]) =>
  list.map((point) => `${String(round(point.x))},${String(round(point.y))}`).join(' ')
const open = (...list: Point[]) => `M${list.map(coordinates).join('L')}`
const closed = (...list: Point[]) => `${open(...list)}Z`

/** Os quatro cantos de um quadrado, em ordem: topo-esquerda, topo-direita, base-direita, base-esquerda. */
function square(topLeft: Point, size: number): [Point, Point, Point, Point] {
  return [topLeft, move(topLeft, size, 0), move(topLeft, size, size), move(topLeft, 0, size)]
}

export function boxGeometry(tilt: BoxTilt): BoxGeometry {
  const depthX = DEPTH_X.rest + DEPTH_X.range * clamp(tilt.x)
  const depthY = DEPTH_Y.rest + DEPTH_Y.range * clamp(tilt.y)

  const [frontTopLeft, frontTopRight, frontBottomRight, frontBottomLeft] = square(
    corner(FRONT.x, FRONT.y),
    FRONT.size,
  )
  const [backTopLeft, backTopRight, backBottomRight, backBottomLeft] = [
    frontTopLeft,
    frontTopRight,
    frontBottomRight,
    frontBottomLeft,
  ].map((front) => move(front, depthX, -depthY)) as [Point, Point, Point, Point]

  const center = corner(
    FRONT.x + FRONT.size / 2 + depthX / 2,
    FRONT.y + FRONT.size / 2 - depthY / 2,
  )
  const coreShift = CORE_DEPTH / 2
  const [coreFrontTopLeft, coreFrontTopRight, coreFrontBottomRight, coreFrontBottomLeft] = square(
    corner(
      center.x - CORE_SIZE / 2 - depthX * coreShift,
      center.y - CORE_SIZE / 2 + depthY * coreShift,
    ),
    CORE_SIZE,
  )
  const [coreBackTopLeft, coreBackTopRight, coreBackBottomRight, coreBackBottomLeft] = [
    coreFrontTopLeft,
    coreFrontTopRight,
    coreFrontBottomRight,
    coreFrontBottomLeft,
  ].map((front) => move(front, depthX * CORE_DEPTH, -depthY * CORE_DEPTH)) as [
    Point,
    Point,
    Point,
    Point,
  ]

  return {
    silhouette: closed(
      frontTopLeft,
      backTopLeft,
      backTopRight,
      backBottomRight,
      frontBottomRight,
      frontBottomLeft,
    ),
    faceFront: points(frontTopLeft, frontTopRight, frontBottomRight, frontBottomLeft),
    faceTop: points(frontTopLeft, backTopLeft, backTopRight, frontTopRight),
    faceRight: points(frontTopRight, backTopRight, backBottomRight, frontBottomRight),
    frontEdges:
      closed(frontTopLeft, frontTopRight, frontBottomRight, frontBottomLeft) +
      open(frontTopLeft, backTopLeft, backTopRight, frontTopRight) +
      open(backTopRight, backBottomRight, frontBottomRight),
    backEdges:
      open(backBottomLeft, backTopLeft) +
      open(backBottomLeft, backBottomRight) +
      open(backBottomLeft, frontBottomLeft),
    coreEdges:
      closed(coreFrontTopLeft, coreFrontTopRight, coreFrontBottomRight, coreFrontBottomLeft) +
      closed(coreBackTopLeft, coreBackTopRight, coreBackBottomRight, coreBackBottomLeft) +
      open(coreFrontTopLeft, coreBackTopLeft) +
      open(coreFrontTopRight, coreBackTopRight) +
      open(coreFrontBottomRight, coreBackBottomRight) +
      open(coreFrontBottomLeft, coreBackBottomLeft),
    coreFront: closed(
      coreFrontTopLeft,
      coreFrontTopRight,
      coreFrontBottomRight,
      coreFrontBottomLeft,
    ),
    links:
      open(frontTopLeft, coreFrontTopLeft) +
      open(frontTopRight, coreFrontTopRight) +
      open(frontBottomRight, coreFrontBottomRight) +
      open(frontBottomLeft, coreFrontBottomLeft) +
      open(backTopLeft, coreBackTopLeft) +
      open(backTopRight, coreBackTopRight) +
      open(backBottomRight, coreBackBottomRight) +
      open(backBottomLeft, coreBackBottomLeft),
    center,
    rightFaceCenter: corner(
      FRONT.x + FRONT.size + depthX / 2,
      FRONT.y + FRONT.size / 2 - depthY / 2,
    ),
  }
}
