import { vi } from 'vitest'

interface FakeEntry {
  readonly target: Element
  readonly isIntersecting: boolean
  /** Fração visível (0 a 1). Se omitida: 1 quando intersecta, 0 quando não. */
  readonly intersectionRatio?: number
}

interface FakeReportedEntry extends FakeEntry {
  readonly intersectionRatio: number
}

type FakeCallback = (entries: FakeReportedEntry[]) => void

/** IntersectionObserver controlável: o teste decide quando cada elemento "entra" ou "sai". */
export class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = []

  readonly observed = new Set<Element>()
  disconnected = false
  private readonly callback: FakeCallback

  constructor(callback: FakeCallback) {
    this.callback = callback
    FakeIntersectionObserver.instances.push(this)
  }

  observe(element: Element): void {
    this.observed.add(element)
  }

  unobserve(element: Element): void {
    this.observed.delete(element)
  }

  disconnect(): void {
    this.disconnected = true
    this.observed.clear()
  }

  takeRecords(): [] {
    return []
  }

  /** Dispara o callback como o navegador faria. */
  emit(entries: readonly FakeEntry[]): void {
    this.callback(
      entries.map((entry) => ({
        ...entry,
        intersectionRatio: entry.intersectionRatio ?? (entry.isIntersecting ? 1 : 0),
      })),
    )
  }
}

/** Instala o mock global. Chame no início do teste; o Vitest desfaz sozinho (`unstubGlobals`). */
export function mockIntersectionObserver(): typeof FakeIntersectionObserver {
  FakeIntersectionObserver.instances = []
  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)
  return FakeIntersectionObserver
}
