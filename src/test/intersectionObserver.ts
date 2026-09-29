import { vi } from 'vitest'

interface FakeEntry {
  readonly target: Element
  readonly isIntersecting: boolean
}

type FakeCallback = (entries: FakeEntry[]) => void

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
    this.callback([...entries])
  }
}

/** Instala o mock global. Chame no início do teste; o Vitest desfaz sozinho (`unstubGlobals`). */
export function mockIntersectionObserver(): typeof FakeIntersectionObserver {
  FakeIntersectionObserver.instances = []
  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)
  return FakeIntersectionObserver
}
