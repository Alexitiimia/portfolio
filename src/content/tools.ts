import { brands, type BrandIconData } from '@/components/icons/brands'
import type { HttpsUrl } from '@/lib/url'

export interface Tool {
  /** Identificador único (minúsculas e hifens). */
  readonly id: string
  readonly name: string
  readonly icon: BrandIconData
  /** Site oficial da ferramenta. */
  readonly href: HttpsUrl
  /** Observação curta sob o nome, como o nível de conhecimento. */
  readonly note?: string
}

export interface ToolGroup {
  readonly id: string
  readonly title: string
  readonly tools: readonly Tool[]
}

export const toolGroups: readonly ToolGroup[] = [
  {
    id: 'linguagens',
    title: 'Linguagens e frameworks',
    tools: [
      {
        id: 'typescript',
        name: 'TypeScript',
        icon: brands.typescript,
        href: 'https://www.typescriptlang.org/',
      },
      {
        id: 'javascript',
        name: 'JavaScript',
        icon: brands.javascript,
        href: 'https://developer.mozilla.org/docs/Web/JavaScript',
      },
      {
        id: 'python',
        name: 'Python',
        icon: brands.python,
        href: 'https://www.python.org/',
      },
      { id: 'php', name: 'PHP', icon: brands.php, href: 'https://www.php.net/' },
      {
        id: 'html',
        name: 'HTML',
        icon: brands.html,
        href: 'https://developer.mozilla.org/docs/Web/HTML',
      },
      {
        id: 'css',
        name: 'CSS',
        icon: brands.css,
        href: 'https://developer.mozilla.org/docs/Web/CSS',
      },
      { id: 'react', name: 'React', icon: brands.react, href: 'https://react.dev/' },
      { id: 'nextjs', name: 'Next.js', icon: brands.nextjs, href: 'https://nextjs.org/' },
      { id: 'nodejs', name: 'Node.js', icon: brands.nodejs, href: 'https://nodejs.org/' },
    ],
  },
  {
    id: 'plataformas',
    title: 'Plataformas e deploy',
    tools: [
      { id: 'supabase', name: 'Supabase', icon: brands.supabase, href: 'https://supabase.com/' },
      {
        id: 'cloudflare',
        name: 'Cloudflare',
        icon: brands.cloudflare,
        href: 'https://www.cloudflare.com/',
      },
      { id: 'vercel', name: 'Vercel', icon: brands.vercel, href: 'https://vercel.com/' },
      { id: 'github', name: 'GitHub', icon: brands.github, href: 'https://github.com/' },
      { id: 'lovable', name: 'Lovable', icon: brands.lovable, href: 'https://lovable.dev/' },
      { id: 'base44', name: 'Base44', icon: brands.base44, href: 'https://base44.com/' },
      {
        id: 'mongodb-atlas',
        name: 'MongoDB Atlas',
        icon: brands.mongodb,
        href: 'https://www.mongodb.com/atlas',
      },
      {
        id: 'amazon-dynamodb',
        name: 'Amazon DynamoDB',
        icon: brands.dynamodb,
        href: 'https://aws.amazon.com/dynamodb/',
      },
      {
        id: 'firebase-firestore',
        name: 'Firebase Firestore',
        icon: brands.firestore,
        href: 'https://firebase.google.com/products/firestore',
      },
    ],
  },
  {
    id: 'sistemas',
    title: 'Sistemas operacionais',
    tools: [
      {
        id: 'ubuntu',
        name: 'Ubuntu',
        icon: brands.ubuntu,
        href: 'https://ubuntu.com/',
        note: 'Linux',
      },
      {
        id: 'debian',
        name: 'Debian',
        icon: brands.debian,
        href: 'https://www.debian.org/',
        note: 'Linux',
      },
      {
        id: 'kali-linux',
        name: 'Kali Linux',
        icon: brands.kaliLinux,
        href: 'https://www.kali.org/',
        note: 'Linux',
      },
      {
        id: 'windows-server',
        name: 'Windows Server',
        icon: brands.windows,
        href: 'https://www.microsoft.com/windows-server',
      },
    ],
  },
  {
    id: 'dados',
    title: 'Bancos de dados',
    tools: [
      {
        id: 'postgresql',
        name: 'PostgreSQL',
        icon: brands.postgresql,
        href: 'https://www.postgresql.org/',
      },
      { id: 'mysql', name: 'MySQL', icon: brands.mysql, href: 'https://www.mysql.com/' },
      { id: 'dbeaver', name: 'DBeaver', icon: brands.dbeaver, href: 'https://dbeaver.io/' },
    ],
  },
  {
    id: 'seguranca',
    title: 'Segurança e testes de API',
    tools: [
      {
        id: 'burp-suite',
        name: 'Burp Suite',
        icon: brands.burpSuite,
        href: 'https://portswigger.net/burp',
      },
      { id: 'postman', name: 'Postman', icon: brands.postman, href: 'https://www.postman.com/' },
      { id: 'nmap', name: 'Nmap', icon: brands.nmap, href: 'https://nmap.org/' },
      {
        id: 'wireshark',
        name: 'Wireshark',
        icon: brands.wireshark,
        href: 'https://www.wireshark.org/',
      },
    ],
  },
  {
    id: 'marketing',
    title: 'Marketing digital',
    tools: [
      {
        id: 'instagram-ads',
        name: 'Instagram Ads',
        icon: brands.instagram,
        href: 'https://business.instagram.com/',
      },
      {
        id: 'meta-ads',
        name: 'Meta Ads',
        icon: brands.meta,
        href: 'https://www.facebook.com/business/ads',
      },
      {
        id: 'microsoft-ads',
        name: 'Microsoft Ads',
        icon: brands.microsoft,
        href: 'https://ads.microsoft.com/',
      },
    ],
  },
]
