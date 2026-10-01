import { readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import type { Plugin } from 'vite'
import { DEFAULT_LANG, LANGS, pageFile, type Lang, type PageId } from './src/i18n/lang.ts'

const PAGES: readonly PageId[] = ['home', 'quote']

/** Onde o HTML de cada página fica em `dist/` (as cópias na raiz são o português de reserva). */
const ROOT_FILE: Readonly<Record<PageId, string>> = {
  home: 'index.html',
  quote: 'orcamento/index.html',
}

const EMPTY_ROOT = '<div id="root"></div>'

interface ServerEntry {
  renderBody(lang: Lang, page: PageId): string
}

/**
 * Pré-renderiza as páginas: depois do build do servidor (`vite build --ssr`, ver o script "build"
 * do package.json), escreve o HTML de cada idioma dentro do `<div id="root">` dos arquivos que o
 * build normal já gerou em `dist/`. No navegador o React assume esse HTML (hidratação).
 */
export function prerenderPages(): Plugin {
  let outDir = ''
  let root = ''

  return {
    name: 'prerender-pages',
    apply: (_config, env) => env.isSsrBuild === true,

    configResolved(config) {
      root = config.root
      outDir = resolve(config.root, config.build.outDir)
    },

    async closeBundle() {
      const entry = (await import(
        pathToFileURL(join(outDir, 'entry-server.js')).href
      )) as ServerEntry
      const dist = resolve(root, 'dist')

      const jobs = PAGES.flatMap((page) => [
        ...LANGS.map((lang) => ({ file: pageFile(lang, page), lang, page })),
        { file: ROOT_FILE[page], lang: DEFAULT_LANG, page },
      ])
      for (const { file, lang, page } of jobs) {
        const path = join(dist, file)
        const html = await readFile(path, 'utf8')
        if (!html.includes(EMPTY_ROOT)) {
          throw new Error(
            `${file}: não achei ${EMPTY_ROOT} para preencher (rode o build normal antes).`,
          )
        }
        const body = entry.renderBody(lang, page)
        await writeFile(
          path,
          html.replace(EMPTY_ROOT, () => `<div id="root">${body}</div>`),
        )
      }
    },
  }
}
