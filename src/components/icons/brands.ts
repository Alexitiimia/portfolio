import {
  siBurpsuite,
  siCloudflare,
  siCss,
  siDbeaver,
  siDiscord,
  siGithub,
  siGoogle,
  siHtml5,
  siInstagram,
  siJavascript,
  siMeta,
  siMysql,
  siNodedotjs,
  siPostgresql,
  siPostman,
  siPython,
  siReact,
  siSteam,
  siSupabase,
  siTypescript,
  siVercel,
  type SimpleIcon,
} from 'simple-icons'

/** O que o `BrandIcon` precisa: o nome e o desenho (path SVG em um viewBox 24×24). */
export type BrandIconData = Pick<SimpleIcon, 'title' | 'path'>

/*
  O Lovable ainda não existe no pacote "simple-icons". O desenho abaixo é a versão monocromática
  do logo, extraída de @lobehub/icons-static-svg 1.95.1 (MIT). A marca pertence ao Lovable.
  Quando o "simple-icons" incluir o Lovable, troque por `siLovable` e apague esta constante.
*/
const lovable: BrandIconData = {
  title: 'Lovable',
  path: 'M7.082 0c3.91 0 7.081 3.179 7.081 7.1v2.7h2.357c3.91 0 7.082 3.178 7.082 7.1 0 3.923-3.17 7.1-7.082 7.1H0V7.1C0 3.18 3.17 0 7.082 0z',
}

/**
 * Todas as marcas usadas no site, num só lugar. Ícones de marca são monocromáticos (usam
 * `currentColor`), então seguem o preto e branco do design. Para adicionar uma marca, importe-a
 * do "simple-icons" acima e registre-a aqui.
 */
export const brands = {
  burpSuite: siBurpsuite,
  cloudflare: siCloudflare,
  css: siCss,
  dbeaver: siDbeaver,
  discord: siDiscord,
  github: siGithub,
  google: siGoogle,
  html: siHtml5,
  instagram: siInstagram,
  javascript: siJavascript,
  lovable,
  meta: siMeta,
  mysql: siMysql,
  nodejs: siNodedotjs,
  postgresql: siPostgresql,
  postman: siPostman,
  python: siPython,
  react: siReact,
  steam: siSteam,
  supabase: siSupabase,
  typescript: siTypescript,
  vercel: siVercel,
} as const satisfies Record<string, BrandIconData>
