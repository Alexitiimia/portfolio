import { describe, expect, it } from 'vitest'
import {
  ARRIVAL_PX,
  CRUISE_SPEED,
  move,
  newFlight,
  returnHome,
  shortestDelta,
  wander,
  wrapAxis,
  type Sky,
} from './crowFlight'

const SKY: Sky = { roomX: 1000, roomY: 400, birdW: 72, birdH: 62 }

describe('wrapAxis', () => {
  it.each([
    [500, 500],
    [-72, -72],
    [1000, -72],
    [1001, -71],
    [-73, 999],
    [1077, 5],
  ])('posição %i vira %i', (pos, expected) => {
    expect(wrapAxis(pos, 1000, 72)).toBe(expected)
  })
})

describe('shortestDelta', () => {
  it('vai direto quando é mais perto', () => {
    expect(shortestDelta(100, 300, 1000, 72)).toBe(200)
    expect(shortestDelta(300, 100, 1000, 72)).toBe(-200)
  })

  it('atravessa a borda quando é mais perto', () => {
    expect(shortestDelta(1000, 20, 1000, 72)).toBe(92)
    expect(shortestDelta(20, 1000, 1000, 72)).toBe(-92)
  })
})

describe('wander', () => {
  it('escolhe outro rumo de tempos em tempos e acelera até a velocidade de cruzeiro', () => {
    const flight = newFlight({ x: 0, y: 0 }, 1)
    const values = [0.9, 0.5, 0.99]
    let call = 0
    const rng = () => values[call++ % values.length] ?? 0

    for (let i = 0; i < 200; i++) wander(flight, 0.016, rng)

    expect(flight.vx).toBeGreaterThan(CRUISE_SPEED * 0.9)
    expect(flight.retarget).toBeGreaterThan(0)
  })

  it('pode dar meia-volta', () => {
    const flight = newFlight({ x: 0, y: 0 }, 1)
    // 1º sorteio: rumo vertical; 2º: duração; 3º (< 0,18): meia-volta.
    const values = [0.5, 0.5, 0.05]
    let call = 0

    wander(flight, 0.016, () => values[call++] ?? 0)

    expect(flight.heading).toBe(-1)
  })
})

describe('returnHome', () => {
  it('chega ao poleiro, mesmo atravessando a borda, e não passa dele', () => {
    const home = { x: 30, y: 200 }
    const flight = newFlight({ x: 990, y: 50 }, 1)
    flight.vx = CRUISE_SPEED

    let arrived = false
    for (let i = 0; i < 60 * 30 && !arrived; i++) {
      const distance = returnHome(flight, home, SKY, 0.016)
      if (distance <= ARRIVAL_PX) arrived = true
      else move(flight, 0.016, SKY)
    }

    expect(arrived).toBe(true)
    expect(Math.hypot(flight.x - home.x, flight.y - home.y)).toBeLessThanOrEqual(ARRIVAL_PX + 2)
  })

  it('vira para o lado do poleiro', () => {
    const flight = newFlight({ x: 500, y: 100 }, 1)

    returnHome(flight, { x: 100, y: 100 }, SKY, 0.016)

    expect(flight.heading).toBe(-1)
  })
})
