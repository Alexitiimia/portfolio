import {
  siBurpsuite,
  siCloudflare,
  siCss,
  siDbeaver,
  siDebian,
  siDiscord,
  siGithub,
  siGoogle,
  siHtml5,
  siInstagram,
  siJavascript,
  siKalilinux,
  siMeta,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPostman,
  siPython,
  siReact,
  siSteam,
  siSupabase,
  siTypescript,
  siUbuntu,
  siVercel,
  siWhatsapp,
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

/*
  LinkedIn e Windows saíram do pacote "simple-icons" a pedido dos donos das marcas. Os desenhos
  abaixo são os logos monocromáticos oficiais em viewBox 24×24, que o pacote trazia antes de
  removê-los. As marcas pertencem à LinkedIn Corporation e à Microsoft.
*/
const linkedin: BrandIconData = {
  title: 'LinkedIn',
  path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
}

/* O logo da Microsoft (quatro quadrados) também não está no "simple-icons". Marca da Microsoft. */
const microsoft: BrandIconData = {
  title: 'Microsoft',
  path: 'M1 1h10v10H1zM13 1h10v10H13zM1 13h10v10H1zM13 13h10v10H13z',
}

const windows: BrandIconData = {
  title: 'Windows',
  path: 'M0 3.449 9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.8',
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
  debian: siDebian,
  discord: siDiscord,
  github: siGithub,
  google: siGoogle,
  html: siHtml5,
  instagram: siInstagram,
  javascript: siJavascript,
  kaliLinux: siKalilinux,
  linkedin,
  lovable,
  meta: siMeta,
  microsoft,
  mysql: siMysql,
  nextjs: siNextdotjs,
  nodejs: siNodedotjs,
  postgresql: siPostgresql,
  postman: siPostman,
  python: siPython,
  react: siReact,
  steam: siSteam,
  supabase: siSupabase,
  typescript: siTypescript,
  ubuntu: siUbuntu,
  vercel: siVercel,
  whatsapp: siWhatsapp,
  windows,
} as const satisfies Record<string, BrandIconData>
