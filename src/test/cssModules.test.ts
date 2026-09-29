import { describe, expect, it } from 'vitest'

/*
  CSS Modules não avisam quando `styles.botao` não existe: o estilo some sem erro nenhum.
  Este teste lê os arquivos e garante que toda classe usada no .tsx está definida no .module.css.
  Convenção do projeto: usar sempre `styles.nomeDaClasse` (camelCase), nunca desestruturar `styles`.
*/
const sources = import.meta.glob<string>('/src/**/*.tsx', {
  query: '?raw',
  import: 'default',
  eager: true,
})
const stylesheets = import.meta.glob<string>('/src/**/*.module.css', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const IMPORT_PATTERN = /import\s+styles\s+from\s+'(\.[^']+\.module\.css)'/
const USAGE_PATTERN = /\bstyles\.([A-Za-z_]\w*)|\bstyles\['([^']+)'\]/g
const CLASS_PATTERN = /\.([A-Za-z_][\w-]*)/g

function withoutComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '')
}

function resolveSibling(from: string, relative: string): string {
  return new URL(relative, `file://${from}`).pathname
}

function classesDefinedIn(css: string): Set<string> {
  const names = new Set<string>()
  for (const match of withoutComments(css).matchAll(CLASS_PATTERN)) {
    if (match[1] !== undefined) names.add(match[1])
  }
  return names
}

function classesUsedIn(source: string): string[] {
  return [...source.matchAll(USAGE_PATTERN)].flatMap((match) => {
    const name = match[1] ?? match[2]
    return name === undefined ? [] : [name]
  })
}

const consumers = Object.entries(sources).flatMap(([path, source]) => {
  if (path.endsWith('.test.tsx')) return []
  const relative = IMPORT_PATTERN.exec(source)?.[1]
  if (relative === undefined) return []
  return [{ path, source, cssPath: resolveSibling(path, relative) }]
})

describe('CSS Modules', () => {
  it('o teste está lendo os arquivos de verdade (e não textos vazios)', () => {
    expect(consumers.length).toBeGreaterThan(15)
    for (const [path, css] of Object.entries(stylesheets)) {
      expect(css.trim().length, `${path} veio vazio`).toBeGreaterThan(0)
    }
  })

  it.each(consumers.map((consumer) => [consumer.path, consumer] as const))(
    '%s só usa classes definidas no seu CSS Module',
    (_path, { path, source, cssPath }) => {
      const css = stylesheets[cssPath]
      expect(css, `${cssPath} não foi encontrado (importado por ${path})`).toBeDefined()

      const defined = classesDefinedIn(css ?? '')
      for (const name of classesUsedIn(source)) {
        expect(defined.has(name), `styles.${name} não existe em ${cssPath}`).toBe(true)
      }
    },
  )

  it('todo arquivo .module.css é usado por algum componente', () => {
    const used = new Set(consumers.map((consumer) => consumer.cssPath))
    for (const cssPath of Object.keys(stylesheets)) {
      expect(used.has(cssPath), `${cssPath} não é importado por nenhum .tsx`).toBe(true)
    }
  })

  it('só define classes em camelCase, para poderem ser usadas como styles.nomeDaClasse', () => {
    for (const [path, css] of Object.entries(stylesheets)) {
      const invalid = [...classesDefinedIn(css)].filter((name) => name.includes('-'))
      expect(invalid, `${path}: renomeie para camelCase`).toEqual([])
    }
  })
})
