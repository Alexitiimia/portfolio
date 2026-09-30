import { describe, expect, it } from 'vitest'
import { boxGeometry, TILE_SIZE } from './boxGeometry'

/** Todos os números de um trecho de path ou de uma lista de pontos. */
function numbersIn(text: string): number[] {
  return [...text.matchAll(/-?\d+(?:\.\d+)?/g)].map((match) => Number(match[0]))
}

const EXTREMES = [-1, 0, 1]

describe('boxGeometry', () => {
  it('em repouso, a frente da caixa não muda e o fundo fica para cima e para a direita', () => {
    const rest = boxGeometry({ x: 0, y: 0 })

    expect(rest.faceFront).toBe('30,58 102,58 102,130 30,130')
    expect(rest.faceTop).toBe('30,58 62,30 134,30 102,58')
  })

  it('girar muda o fundo, mas nunca a frente', () => {
    const rest = boxGeometry({ x: 0, y: 0 })
    const turned = boxGeometry({ x: 1, y: -1 })

    expect(turned.faceFront).toBe(rest.faceFront)
    expect(turned.faceTop).not.toBe(rest.faceTop)
    expect(turned.silhouette).not.toBe(rest.silhouette)
  })

  it('mantém a caixa e o núcleo dentro do desenho em qualquer inclinação', () => {
    for (const x of EXTREMES) {
      for (const y of EXTREMES) {
        const box = boxGeometry({ x, y })
        const drawing = [
          box.silhouette,
          box.frontEdges,
          box.backEdges,
          box.coreEdges,
          box.links,
        ].flatMap(numbersIn)

        for (const value of drawing) {
          expect(value, `x=${String(x)} y=${String(y)}`).toBeGreaterThanOrEqual(0)
          expect(value, `x=${String(x)} y=${String(y)}`).toBeLessThanOrEqual(TILE_SIZE)
        }
      }
    }
  })

  it('ignora inclinações fora do intervalo de -1 a 1', () => {
    expect(boxGeometry({ x: 50, y: -50 })).toEqual(boxGeometry({ x: 1, y: -1 }))
  })

  it('o centro da face da direita fica dentro da face, para a sonda bater na caixa', () => {
    for (const x of EXTREMES) {
      for (const y of EXTREMES) {
        const { rightFaceCenter, center } = boxGeometry({ x, y })

        expect(rightFaceCenter.x).toBeGreaterThan(102)
        expect(rightFaceCenter.x).toBeLessThan(TILE_SIZE - 10)
        expect(center.x).toBeGreaterThan(30)
        expect(center.y).toBeLessThan(130)
      }
    }
  })
})
