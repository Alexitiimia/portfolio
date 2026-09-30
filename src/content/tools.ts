import { brands, type BrandIconData } from '@/components/icons/brands'

export interface Tool {
  /** Identificador único (minúsculas e hifens). */
  readonly id: string
  readonly name: string
  readonly icon: BrandIconData
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
      { id: 'typescript', name: 'TypeScript', icon: brands.typescript },
      { id: 'javascript', name: 'JavaScript', icon: brands.javascript },
      { id: 'python', name: 'Python', icon: brands.python, note: 'Avançado' },
      { id: 'html', name: 'HTML', icon: brands.html },
      { id: 'css', name: 'CSS', icon: brands.css },
      { id: 'react', name: 'React', icon: brands.react },
      { id: 'nextjs', name: 'Next.js', icon: brands.nextjs },
      { id: 'nodejs', name: 'Node.js', icon: brands.nodejs },
    ],
  },
  {
    id: 'plataformas',
    title: 'Plataformas e deploy',
    tools: [
      { id: 'supabase', name: 'Supabase', icon: brands.supabase },
      { id: 'cloudflare', name: 'Cloudflare', icon: brands.cloudflare },
      { id: 'vercel', name: 'Vercel', icon: brands.vercel },
      { id: 'github', name: 'GitHub', icon: brands.github },
      { id: 'lovable', name: 'Lovable', icon: brands.lovable },
    ],
  },
  {
    id: 'sistemas',
    title: 'Sistemas operacionais',
    tools: [
      { id: 'ubuntu', name: 'Ubuntu', icon: brands.ubuntu, note: 'Linux' },
      { id: 'debian', name: 'Debian', icon: brands.debian, note: 'Linux' },
      { id: 'kali-linux', name: 'Kali Linux', icon: brands.kaliLinux, note: 'Linux' },
      { id: 'windows-server', name: 'Windows Server', icon: brands.windows },
    ],
  },
  {
    id: 'dados',
    title: 'Bancos de dados',
    tools: [
      { id: 'postgresql', name: 'PostgreSQL', icon: brands.postgresql },
      { id: 'mysql', name: 'MySQL', icon: brands.mysql },
      { id: 'dbeaver', name: 'DBeaver', icon: brands.dbeaver },
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
        note: 'Noções de SQL Injection',
      },
      { id: 'postman', name: 'Postman', icon: brands.postman },
    ],
  },
  {
    id: 'marketing',
    title: 'Marketing digital',
    tools: [
      { id: 'instagram-ads', name: 'Instagram Ads', icon: brands.instagram },
      { id: 'meta-ads', name: 'Meta Ads', icon: brands.meta },
      { id: 'microsoft-ads', name: 'Microsoft Ads', icon: brands.microsoft },
    ],
  },
]
