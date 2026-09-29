import { describe, expect, it, vi } from 'vitest'
import { mockMatchMedia } from '@/test/matchMedia'
import {
  THEME_STORAGE_KEY,
  applyTheme,
  getSystemTheme,
  isTheme,
  readStoredTheme,
  resolveInitialTheme,
  storeTheme,
} from './theme'

describe('isTheme', () => {
  it('aceita apenas "light" e "dark"', () => {
    expect(isTheme('light')).toBe(true)
    expect(isTheme('dark')).toBe(true)
    expect(isTheme('sepia')).toBe(false)
    expect(isTheme('')).toBe(false)
    expect(isTheme(null)).toBe(false)
    expect(isTheme(undefined)).toBe(false)
  })
})

describe('readStoredTheme e storeTheme', () => {
  it('lê o que foi salvo', () => {
    storeTheme('light')
    expect(readStoredTheme()).toBe('light')
  })

  it('ignora valores inválidos no armazenamento', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'neon')
    expect(readStoredTheme()).toBeNull()
  })

  it('não quebra quando o armazenamento está bloqueado', () => {
    const blocked = () => {
      throw new DOMException('bloqueado', 'SecurityError')
    }
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(blocked)
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(blocked)

    expect(readStoredTheme()).toBeNull()
    expect(() => {
      storeTheme('dark')
    }).not.toThrow()
  })
})

describe('getSystemTheme', () => {
  it('retorna "light" quando o sistema prefere claro', () => {
    mockMatchMedia(true)
    expect(getSystemTheme()).toBe('light')
  })

  it('retorna "dark" caso contrário', () => {
    mockMatchMedia(false)
    expect(getSystemTheme()).toBe('dark')
  })
})

describe('resolveInitialTheme', () => {
  it('respeita a prioridade: já aplicado > salvo > sistema', () => {
    mockMatchMedia(true)
    expect(resolveInitialTheme()).toBe('light') // só o sistema

    storeTheme('dark')
    expect(resolveInitialTheme()).toBe('dark') // o salvo vence o sistema

    applyTheme('light')
    expect(resolveInitialTheme()).toBe('light') // o já aplicado vence o salvo
  })
})
