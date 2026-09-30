/**
 * Voo do corvo do rodapé: só contas (sem DOM), para o componente apenas desenhar o resultado.
 * O céu é "redondo": quem sai por uma borda aparece pela oposta.
 */

/** Velocidade de cruzeiro, em px/s. */
export const CRUISE_SPEED = 120
/** Subida/descida máxima enquanto passeia, em px/s. */
const MAX_CLIMB = 50
/** Dentro dessa distância do poleiro, o corvo desacelera e mira direto nele. */
const APPROACH_RADIUS = 60
/** Distância a partir da qual ele já está "em casa". */
export const ARRIVAL_PX = 2

export interface Flight {
  x: number
  y: number
  vx: number
  vy: number
  /** Velocidade vertical desejada; a real acompanha aos poucos. */
  climb: number
  /** Segundos até escolher outro rumo vertical. */
  retarget: number
  /** Para onde olha: 1 = direita, -1 = esquerda. */
  heading: 1 | -1
}

export interface Point {
  readonly x: number
  readonly y: number
}

/** Área onde a posição (canto superior esquerdo) pode ficar, e o tamanho do corvo. */
export interface Sky {
  readonly roomX: number
  readonly roomY: number
  readonly birdW: number
  readonly birdH: number
}

export function newFlight(from: Point, heading: 1 | -1): Flight {
  return { x: from.x, y: from.y, vx: 0, vy: 0, climb: 0, retarget: 0, heading }
}

/** Mantém `pos` em [-size, room): passou de uma borda, entra pela outra. */
export function wrapAxis(pos: number, room: number, size: number): number {
  const period = room + size
  return ((((pos + size) % period) + period) % period) - size
}

/** Menor caminho de `from` até `to`, contando que se pode atravessar a borda. */
export function shortestDelta(from: number, to: number, room: number, size: number): number {
  const period = room + size
  const delta = (((to - from) % period) + period) % period
  return delta > period / 2 ? delta - period : delta
}

/** Aproxima `current` de `target` de forma suave (independe da taxa de quadros). */
export function approach(current: number, target: number, rate: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-rate * dt))
}

/** Passeio: vai reto, muda de altura ao acaso e, às vezes, dá meia-volta. */
export function wander(flight: Flight, dt: number, rng: () => number): void {
  flight.retarget -= dt
  if (flight.retarget <= 0) {
    flight.climb = (rng() * 2 - 1) * MAX_CLIMB
    flight.retarget = 0.8 + rng() * 1.6
    if (rng() < 0.18) flight.heading = flight.heading === 1 ? -1 : 1
  }
  flight.vx = approach(flight.vx, flight.heading * CRUISE_SPEED, 1.5, dt)
  flight.vy = approach(flight.vy, flight.climb, 1.5, dt)
}

/** Volta para o poleiro pelo caminho mais curto (mesmo que seja atravessando a borda). */
export function returnHome(flight: Flight, home: Point, sky: Sky, dt: number): number {
  const dx = shortestDelta(flight.x, home.x, sky.roomX, sky.birdW)
  const dy = shortestDelta(flight.y, home.y, sky.roomY, sky.birdH)
  const distance = Math.hypot(dx, dy)
  if (distance === 0) return 0

  if (Math.abs(dx) > 8) flight.heading = dx > 0 ? 1 : -1

  if (distance > APPROACH_RADIUS) {
    flight.vx = approach(flight.vx, (dx / distance) * CRUISE_SPEED, 3, dt)
    flight.vy = approach(flight.vy, (dy / distance) * CRUISE_SPEED, 3, dt)
  } else {
    // Perto: mira direto e desacelera, sem passar do ponto.
    const speed = Math.min(CRUISE_SPEED, Math.max(30, distance * 2.2))
    flight.vx = (dx / distance) * speed
    flight.vy = (dy / distance) * speed
  }
  return distance
}

/** Anda `dt` segundos na velocidade atual, atravessando as bordas. */
export function move(flight: Flight, dt: number, sky: Sky): void {
  flight.x = wrapAxis(flight.x + flight.vx * dt, sky.roomX, sky.birdW)
  flight.y = wrapAxis(flight.y + flight.vy * dt, sky.roomY, sky.birdH)
}

/** Número aleatório em [min, max). */
export function between(min: number, max: number, rng: () => number): number {
  return min + rng() * (max - min)
}
