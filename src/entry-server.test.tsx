import { describe, expect, it } from 'vitest'
import { projects } from '@/content/projects'
import { SECTION_IDS } from '@/content/sections'
import { LANGS, type PageId } from '@/i18n/lang'
import { renderBody } from './entry-server'

/*
  O HTML pré-renderizado é o que buscadores, prévias de link e robôs de IA enxergam (eles não rodam
  JavaScript). Aqui só se garante que ele sai com o conteúdo de verdade, em cada idioma e página.
*/
describe('renderBody (HTML pré-renderizado)', () => {
  it.each(LANGS)('o portfólio em %s traz seções, projetos e contatos já no HTML', (lang) => {
    const html = renderBody(lang, 'home')

    expect(html).toContain('<main')
    for (const section of SECTION_IDS) {
      expect(html).toContain(`id="${section}"`)
    }
    for (const project of projects) expect(html).toContain(project.name)
    expect(html).toContain('github.com/Alexitiimia')
  })

  it.each(LANGS)('a página de orçamento em %s traz o painel já no HTML', (lang) => {
    const html = renderBody(lang, 'quote')

    expect(html).toContain('<main')
    expect(html).toContain('<fieldset')
  })

  it.each(LANGS)('não gera estilo nem evento inline em %s (a CSP do site bloquearia)', (lang) => {
    for (const page of ['home', 'quote'] as const) {
      const html = renderBody(lang, page)
      expect(html).not.toMatch(/\sstyle\s*=/i)
      expect(html).not.toMatch(/<style\b|<script\b/i)
      expect(html).not.toMatch(/\son[a-z]+\s*=/i)
    }
  })

  it('as páginas saem diferentes por idioma', () => {
    const pages: PageId[] = ['home', 'quote']
    for (const page of pages) {
      const outputs = new Set(LANGS.map((lang) => renderBody(lang, page)))
      expect(outputs.size).toBe(LANGS.length)
    }
  })
})
