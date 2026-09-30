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
  siPhp,
  siPostman,
  siPython,
  siReact,
  siSteam,
  siSupabase,
  siTypescript,
  siUbuntu,
  siVercel,
  siWhatsapp,
  siWireshark,
  type SimpleIcon,
} from 'simple-icons'

/** O que o `BrandIcon` precisa: o nome e o desenho (path SVG em um viewBox 24×24). */
export interface BrandIconData extends Pick<SimpleIcon, 'title' | 'path' | 'hex'> {
  /** Logo de várias cores (Microsoft): cada pedaço com o seu próprio desenho e cor. */
  readonly parts?: readonly {
    readonly path: string
    readonly hex: string
    /** Transformação SVG do pedaço (ex.: reduzir o desenho dentro de um fundo). */
    readonly transform?: string
  }[]
  /** Logo em degradê (Lovable, Instagram), da base à ponta, em cores hexadecimais sem "#". */
  readonly gradient?: readonly string[]
}

/*
  O Lovable ainda não existe no pacote "simple-icons". O desenho abaixo é a versão monocromática
  do logo, extraída de @lobehub/icons-static-svg 1.95.1 (MIT). A marca pertence ao Lovable.
  Quando o "simple-icons" incluir o Lovable, troque por `siLovable` e apague esta constante.
*/
const lovable: BrandIconData = {
  title: 'Lovable',
  hex: 'FF5A5F',
  gradient: ['4B73FF', 'FF66F4', 'FE7B02'],
  path: 'M7.082 0c3.91 0 7.081 3.179 7.081 7.1v2.7h2.357c3.91 0 7.082 3.178 7.082 7.1 0 3.923-3.17 7.1-7.082 7.1H0V7.1C0 3.18 3.17 0 7.082 0z',
}

/*
  LinkedIn e Windows saíram do pacote "simple-icons" a pedido dos donos das marcas. Os desenhos
  abaixo são os logos monocromáticos oficiais em viewBox 24×24, que o pacote trazia antes de
  removê-los. As marcas pertencem à LinkedIn Corporation e à Microsoft.
*/
const linkedin: BrandIconData = {
  title: 'LinkedIn',
  hex: '0A66C2',
  path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
}

/* O logo da Microsoft (quatro quadrados) também não está no "simple-icons". Marca da Microsoft. */
const microsoft: BrandIconData = {
  title: 'Microsoft',
  hex: '5E5E5E',
  parts: [
    { path: 'M1 1h10v10H1z', hex: 'F25022' },
    { path: 'M13 1h10v10H13z', hex: '7FBA00' },
    { path: 'M1 13h10v10H1z', hex: '00A4EF' },
    { path: 'M13 13h10v10H13z', hex: 'FFB900' },
  ],
  path: 'M1 1h10v10H1zM13 1h10v10H13zM1 13h10v10H1zM13 13h10v10H13z',
}

/*
  DBeaver: o pacote "simple-icons" só traz a silhueta do castor. O logo de verdade é o castor
  escuro sobre um círculo branco: o círculo vem primeiro e a silhueta é reduzida para caber nele.
*/
const dbeaver: BrandIconData = {
  title: siDbeaver.title,
  hex: '362722',
  path: siDbeaver.path,
  parts: [
    { path: 'M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24Z', hex: 'FFFFFF' },
    {
      path: siDbeaver.path,
      hex: '362722',
      transform: 'translate(12 12) scale(0.74) translate(-12 -12)',
    },
  ],
}

/*
  Base44 não existe no "simple-icons". O desenho é o sol laranja com faixas do logo, refeito em
  vetor (círculo cortado por três faixas). A marca pertence à Base44.
*/
const base44: BrandIconData = {
  title: 'Base44',
  hex: 'FF631F',
  path: 'M0.05 13.08A12 12 0 1 1 23.95 13.08ZM0.25 14.42H23.75A12 12 0 0 1 23.09 16.58H0.91A12 12 0 0 1 0.25 14.42ZM1.51 17.83H22.49A12 12 0 0 1 20.71 20.25H3.29A12 12 0 0 1 1.51 17.83ZM19.64 21.25A12 12 0 0 1 4.36 21.25Z',
}

/*
  Nmap também não existe no "simple-icons". O desenho é uma versão simplificada do olho do logo
  (contorno, íris e mira central), em vetor. A marca pertence ao Nmap Project.
*/
const NMAP_OUTLINE =
  'M1 12C4 5.5 20 5.5 23 12C20 18.5 4 18.5 1 12ZM3.2 12C5.6 16.4 18.4 16.4 20.8 12C18.4 7.6 5.6 7.6 3.2 12Z'
const NMAP_IRIS =
  'M17 12A5 5 0 1 1 7 12A5 5 0 1 1 17 12ZM15.6 12A3.6 3.6 0 1 0 8.4 12A3.6 3.6 0 1 0 15.6 12Z'
const NMAP_SIGHT =
  'M11.6 7.2h.8v2.4h-.8ZM11.6 14.4h.8v2.4h-.8ZM7.2 11.6h2.4v.8H7.2ZM14.4 11.6h2.4v.8h-2.4ZM12 10.7A1.3 1.3 0 1 1 12 13.3A1.3 1.3 0 1 1 12 10.7Z'
const nmap: BrandIconData = {
  title: 'Nmap',
  hex: '4F94B5',
  parts: [
    { path: NMAP_OUTLINE, hex: '5FA3BF' },
    { path: NMAP_IRIS, hex: '7FBACE' },
    { path: NMAP_SIGHT, hex: '2F4F5F' },
  ],
  path: `${NMAP_OUTLINE}${NMAP_IRIS}${NMAP_SIGHT}`,
}

const windows: BrandIconData = {
  title: 'Windows',
  hex: '0078D4',
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
  base44,
  dbeaver,
  debian: siDebian,
  discord: siDiscord,
  github: siGithub,
  google: siGoogle,
  html: siHtml5,
  instagram: { ...siInstagram, gradient: ['FEDA75', 'FA7E1E', 'D62976', '962FBF', '4F5BD5'] },
  javascript: siJavascript,
  kaliLinux: siKalilinux,
  linkedin,
  lovable,
  meta: siMeta,
  microsoft,
  mysql: siMysql,
  nextjs: siNextdotjs,
  nodejs: siNodedotjs,
  nmap,
  php: siPhp,
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
  wireshark: siWireshark,
} as const satisfies Record<string, BrandIconData>
