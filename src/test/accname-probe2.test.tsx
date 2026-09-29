import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from '@/app/App'

describe('papéis no App', () => {
  it('lista banners', () => {
    render(<App />)
    const banners = screen.queryAllByRole('banner')
    console.log('BANNERS', banners.length, banners.map((b) => b.className).join(' | '))
    for (const b of banners) console.log('BANNER HTML', b.outerHTML.slice(0, 120))
    expect(banners.length).toBeGreaterThan(0)
  })
})
