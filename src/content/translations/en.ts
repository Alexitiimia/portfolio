import type { Translations } from './types'

export const en: Translations = {
  site: {
    statusBar: {
      left: 'SECURE CHANNEL · TLS 1.3 · HSTS',
      prompt: 'operator@thecrow:~$',
      command: 'status --all',
      result: 'ok',
    },
    hero: {
      command: 'whoami',
      role: 'full stack · information security',
      headline: ['Secure ', { mark: 'web systems' }, ', from the database to the interface.'],
      lead: 'I build online stores, financial management systems and automations, with security analysis. Front end and back end, from prototype to 24/7 support.',
    },
    footer: {
      about: 'Secure web development and security analysis. Auditable code, zero noise.',
      securityFacts: ['HTTPS + HSTS', 'Strict CSP', 'No trackers'],
      closing: '$ echo "nevermore"',
    },
  },
  sections: {
    projetos: {
      label: 'Projects',
      navLabel: 'projects',
      lead: 'Some of the work I have built.',
    },
    ferramentas: {
      label: 'Tools',
      navLabel: 'tools',
      lead: 'Technologies and platforms I work with.',
    },
    servicos: {
      label: 'Services',
      navLabel: 'services',
      lead: 'What I can build and maintain for your business.',
    },
    seguranca: {
      label: 'Security',
      navLabel: 'security',
      lead: 'Security analysis at three levels of knowledge of the system.',
    },
    condicoes: {
      label: 'Terms',
      navLabel: 'terms',
      lead: 'What you get when you hire me.',
    },
    contato: {
      label: 'Contact',
      navLabel: 'contact --24h',
      lead: 'Build a quote and send it on WhatsApp, or reach me through another channel.',
    },
  },
  offers: {
    dominio: {
      label: 'Domain',
      highlight: 'Free for 1 year',
      description:
        'A free address for the first year, in the format yourname.axeldev.workers.dev. Check if the name you want is available.',
      actionLabel: 'check name',
    },
    hospedagem: {
      label: 'Hosting',
      highlight: 'Free for 3 months',
      description: 'After the 3 months, the price is calculated according to demand.',
    },
    suporte: {
      label: 'Technical support',
      highlight: '24 hours a day',
      description:
        'Bug fixes and answers to technical help requests about your site or system, at any hour.',
      callout: 'In the first 30 days after purchase, technical support is free.',
    },
  },
  projects: {
    'f-cordeiro': {
      summary:
        "Online store for 3D-printed parts: cart, favorites, customer account, payment through Mercado Pago, shipping through Melhor Envio and custom-made quote requests. It has an admin panel with finances, pricing and PDF quotes. It includes an automated Discord community, through a bot: it links the customer's account to the server, gives automatic roles (linked, buyer, affiliate) and runs giveaways only for linked accounts.",
      links: ['Visit the store'],
    },
    'vila-cartola': {
      summary:
        'Minecraft community with play across Java and Bedrock. The site has Discord login, a live 3D map, ranking, a store and a supporter subscription with Mercado Pago. Behind it: a Docker server with backups, custom Java plugins (economy, social and verification), a welcome bot and an admin panel.',
      links: ['Visit the site'],
    },
    'pure-tone-check': {
      summary:
        'Free online hearing screening, in English: it plays pure tones at five frequencies, one ear at a time, and delivers a chart with the result, which can be downloaded as a PDF. A Worker stores the history by email and blocks spam with an invisible trap and a list of disposable emails.',
      links: ['Take the test'],
    },
  },
  tools: {
    groups: {
      linguagens: 'Languages and frameworks',
      plataformas: 'Platforms and deployment',
      sistemas: 'Operating systems',
      dados: 'Databases',
      seguranca: 'Security and API testing',
      marketing: 'Digital marketing',
    },
    notes: {
      ubuntu: 'Linux',
      debian: 'Linux',
      'kali-linux': 'Linux',
      'burp-suite': 'SQL Injection basics',
    },
  },
  services: {
    lojas: {
      title: 'Online stores and sales',
      description: 'Websites to sell products, with real payment, shipping and location.',
    },
    financeiro: {
      title: 'Financial management',
      description:
        'Control of sales, cost price and profit, with weekly, monthly and yearly revenue calculation.',
    },
    frete: {
      title: 'Shipping and location',
      description:
        'Shipping and location calculation through the site or the channel you prefer, for all of Brazil or just locally.',
    },
    login: {
      title: 'Secure sign-up and login',
      description: 'Quick and secure sign-up and login with Google, Discord, GitHub and Steam.',
    },
    'verificacao-email': {
      title: 'Email verification',
      description: 'A system to confirm the email of the people who sign up.',
    },
    'verificacao-telefone': {
      title: 'Phone verification',
      description: 'A system to confirm phone numbers, for Brazilian numbers only.',
    },
    gerenciamento: {
      title: 'Data management',
      description: 'Registration and management of customer or employee data.',
    },
    pagamentos: {
      title: 'Payments',
      description: 'A real payment system, for physical and online sales.',
    },
    automacao: {
      title: 'Data automation',
      description:
        'Automated, effective scripts for maintaining, handling, storing and updating data.',
    },
    'previa-de-design': {
      title: 'Design preview',
      description:
        'A visual prototype of the site or system before coding, so you can approve layout, colors and texts with confidence.',
    },
    'criacao-de-logo': {
      title: 'Logo creation',
      description:
        'A simple logo and visual identity for your business, ready for the web and social media.',
    },
    'automacao-de-sistemas': {
      title: 'Systems automation',
      description:
        'Automation of virtual systems, from internal processes to integration between tools.',
    },
    seo: {
      title: 'SEO for websites',
      description:
        'Authentic, effective SEO optimized for your site, so it is easier to find in searches.',
    },
    mentoria: {
      title: 'Portability mentoring',
      description: 'Guidance to migrate and port projects between platforms and hosting providers.',
    },
  },
  security: {
    methodologies: {
      black: {
        translation: 'Outside view',
        knowledge: 'None',
        description:
          'No access to the code or the documentation. The analysis starts from the outside, the way a real attacker would.',
      },
      grey: {
        translation: 'Partial view',
        knowledge: 'Partial',
        description:
          'Partial knowledge of the system, such as test accounts or part of the architecture. It joins the outside view with a little inside context.',
      },
      white: {
        translation: 'Inside view',
        knowledge: 'Full',
        description:
          'Full access to the code, the configuration and the infrastructure. It is the deepest analysis.',
      },
    },
    capabilities: {
      auditoria: {
        title: 'Security audit',
        description: 'Review of systems to find and fix security flaws.',
      },
      'banco-de-dados': {
        title: 'Real-time database analysis',
        description:
          'Simulated tests to validate and fix security flaws, bugs, poorly made integrations and optimization points.',
      },
      'sql-injection': {
        title: 'SQL Injection basics',
        description: 'SQL injection tests with Burp Suite.',
      },
      'engenharia-reversa': {
        title: 'Reverse engineering',
        description: 'Reverse engineering techniques to understand how systems work.',
      },
    },
  },
  quote: {
    items: {
      'site-institucional': {
        label: 'Business website',
        description: 'Presents you or your company: services, projects and contact.',
      },
      'loja-virtual': {
        label: 'Online store',
        description: 'Selling products online, with a catalog and cart.',
      },
      'sistema-financeiro': {
        label: 'Financial management system',
        description: 'Sales, cost, profit and weekly, monthly and yearly revenue.',
      },
      'automacao-de-dados': {
        label: 'Data automation',
        description: 'Scripts to maintain, store and update data.',
      },
      outro: {
        label: 'Another project',
        description: 'Something different: describe it in the field below.',
      },
      'login-social': {
        label: 'Quick and secure login',
        description: 'Google, Discord, GitHub and Steam.',
      },
      'verificacao-email': {
        label: 'Email verification',
        description: 'Confirms the email of the people who sign up.',
      },
      'verificacao-telefone': {
        label: 'Phone verification',
        description: 'Confirms the number, Brazilian numbers only.',
      },
      frete: {
        label: 'Shipping and location',
        description:
          'Calculation through the site or the channel you prefer, all of Brazil or just local.',
      },
      pagamentos: {
        label: 'Payment system',
        description: 'Real payment, for physical and online sales.',
      },
      gerenciamento: {
        label: 'Data management',
        description: 'Registration and management of customers or employees.',
      },
      'previa-de-design': {
        label: 'Design preview',
        description: 'A visual prototype to approve before coding.',
      },
      'criacao-de-logo': {
        label: 'Logo creation',
        description: 'A simple logo and visual identity.',
      },
      'automacao-de-sistemas': {
        label: 'Systems automation',
        description: 'Process automation and integration between tools.',
      },
      'auditoria-de-seguranca': {
        label: 'Security audit',
        description: 'Review of the system to find and fix flaws.',
      },
      mentoria: {
        label: 'Portability mentoring',
        description: 'Help to migrate the project between platforms and hosting providers.',
      },
    },
    deadlines: {
      'sem-pressa': 'No rush',
      'ate-1-mes': 'Within 1 month',
      urgente: 'Urgent',
    },
  },
}
