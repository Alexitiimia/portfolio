import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'
import { mockMatchMedia } from './matchMedia'

beforeEach(() => {
  // Padrão dos testes: sistema em tema escuro.
  mockMatchMedia(false)
})

afterEach(() => {
  // Os testes do Worker (worker/) rodam em Node, sem janela nem documento.
  if (typeof window === 'undefined') return
  cleanup()
  window.localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})
