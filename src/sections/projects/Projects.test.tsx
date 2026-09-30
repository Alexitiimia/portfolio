import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { projects } from '@/content/projects'
import { Projects } from './Projects'
import css from './Projects.module.css?raw'

function cardOf(name: string): HTMLElement {
  const card = screen.getByRole('heading', { name }).closest('article')
  if (card === null) throw new Error(`Cartão de ${name} não encontrado`)
  return card
}

describe('Projetos', () => {
  it('mostra um cartão por projeto, na ordem da lista', () => {
    render(<Projects />)

    const headings = screen
      .getAllByRole('heading', { level: 3 })
      .map((heading) => heading.textContent)
    expect(headings).toEqual(projects.map((project) => project.name))
  })

  it('põe o favicon de cada projeto ao lado do nome, como imagem decorativa', () => {
    render(<Projects />)

    for (const project of projects) {
      const image = cardOf(project.name).querySelector('img')
      expect(image, `${project.id}: sem favicon`).not.toBeNull()
      expect(image).toHaveAttribute('src', project.icon)
      expect(image).toHaveAttribute('alt', '')
    }
  })

  it('padroniza o ícone: mesmo tamanho, cantos arredondados e sem borda', () => {
    const rule = /\.icon\s*\{([^}]*)\}/.exec(css)?.[1] ?? ''

    expect(rule).toMatch(/border-radius:\s*0\.75rem/)
    expect(rule).toMatch(/background:/)
    expect(rule).not.toMatch(/border:/)
  })

  it('mostra o link de cada projeto como botão que abre em nova aba, com segurança', () => {
    render(<Projects />)

    const store = within(cardOf('F Cordeiro Soluções 3D')).getByRole('link', { name: /Ver a loja/ })
    expect(store).toHaveAttribute('href', 'https://f-cordeiro.axeldev.workers.dev/')
    expect(store).toHaveAttribute('target', '_blank')
    expect(store.getAttribute('rel')?.split(' ')).toEqual(
      expect.arrayContaining(['noopener', 'noreferrer']),
    )
    // Botão de verdade (classe do ButtonLink), não um link solto no texto.
    expect(store.className).toMatch(/button/)
  })

  it('tem o bot do Discord dentro do projeto da loja, e não como projeto à parte', () => {
    render(<Projects />)

    expect(screen.queryByRole('heading', { name: /Bot do Discord/ })).toBeNull()
    expect(cardOf('F Cordeiro Soluções 3D')).toHaveTextContent(/comunidade automatizada/i)
  })

  it('não lista os projetos retirados', () => {
    render(<Projects />)

    for (const name of ['Allmaretro', 'Operação Arvoredo', 'Este portfólio']) {
      expect(screen.queryByRole('heading', { name })).toBeNull()
    }
  })
})
