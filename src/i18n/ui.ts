import type { NameProblem } from '@/lib/domainName'
import type { QuoteText } from '@/lib/quote'
import type { Lang } from './lang'

/*
  Textos da interface (botões, rótulos, avisos) nos três idiomas. Os textos de conteúdo (projetos,
  serviços, condições...) ficam em src/content/, com as traduções em src/content/translations/.
  O TypeScript obriga os três idiomas a ter exatamente as mesmas chaves.
*/

export interface Ui {
  skipToContent: string
  /** Nome acessível do link do logo. */
  brandLabel: (name: string) => string
  externalLinkHint: string
  theme: { toLight: string; toDark: string }
  language: {
    /** Nome acessível do botão do seletor. */
    label: string
    menuLabel: string
  }
  header: { navLabel: string; menu: string }
  hero: {
    age: (years: number) => string
    seeProjects: string
    talkToMe: string
  }
  projects: { technologies: string; nextProject: string; requestQuote: string }
  security: {
    knowledge: (level: string) => string
    vision: (percent: number) => string
  }
  footer: {
    navLabel: string
    navigate: string
    security: string
    contact: string
    sourceCode: string
    rights: string
  }
  contact: {
    statement: string
    quoteTitle: string
    quoteText: string
    quoteButton: string
    preferDirect: string
    /** Mensagem pronta do botão de WhatsApp do contato geral. */
    whatsappGreeting: string
  }
  domain: {
    dialogTitle: string
    /** Exemplo de nome no endereço: seunome.axeldev.workers.dev. */
    nameExample: string
    leadBefore: string
    leadAfter: string
    fieldLabel: string
    placeholder: string
    verify: string
    verifying: string
    hint: (min: number, max: number) => string
    close: string
    checking: (address: string) => string
    available: (address: string) => string
    taken: (address: string) => string
    reserved: (name: string) => string
    rateLimited: string
    unavailable: string
    problems: Record<NameProblem, (min: number, max: number) => string>
    talkOnWhatsApp: string
    buildQuote: string
    whatsappMessage: (address: string) => string
  }
  quotePage: {
    eyebrow: string
    title: string
    lead: string
    backToPortfolio: string
    howItWorks: string
    steps: readonly { readonly title: string; readonly text: string }[]
  }
  quotePanel: {
    stepProject: string
    stepExtras: string
    stepDeadline: string
    stepName: string
    stepDetails: string
    namePlaceholder: string
    detailsPlaceholder: string
    summary: string
    empty: string
    estimate: string
    note: string
    sendWhatsApp: string
    sendInstagram: string
    required: string
    progress: (done: number, total: number) => string
    progressDone: string
    jumpToSummary: string
    copied: string
    ready: string
    missing: (fields: string) => string
    preview: string
    privacy: string
    text: QuoteText
  }
  error: { mascot: string; title: string; text: string }
}

const pt: Ui = {
  skipToContent: 'Ir para o conteúdo',
  brandLabel: (name) => `${name}, início da página`,
  externalLinkHint: '(abre em nova aba)',
  theme: { toLight: 'Ativar tema claro', toDark: 'Ativar tema escuro' },
  language: { label: 'Idioma', menuLabel: 'Escolher idioma' },
  header: { navLabel: 'Principal', menu: 'menu' },
  hero: {
    age: (years) => `${String(years)} anos`,
    seeProjects: 'ver projetos',
    talkToMe: 'falar comigo',
  },
  projects: {
    technologies: 'Tecnologias',
    nextProject: 'O próximo projeto pode ser o seu.',
    requestQuote: 'solicitar orçamento',
  },
  security: {
    knowledge: (level) => `Conhecimento do sistema: ${level}`,
    vision: (percent) => `VISÃO ${String(percent)}%`,
  },
  footer: {
    navLabel: 'Rodapé',
    navigate: 'Navegar',
    security: 'Segurança',
    contact: 'Contato',
    sourceCode: 'Código-fonte',
    rights: 'todos os direitos reservados',
  },
  contact: {
    statement: 'Vamos tirar o seu projeto do papel.',
    quoteTitle: 'Monte o orçamento do seu projeto',
    quoteText:
      'Escolha o que precisa, veja a estimativa e envie o resumo pronto para o meu WhatsApp. Sem cadastro e sem pagar nada agora.',
    quoteButton: 'montar orçamento',
    preferDirect: 'Prefere conversar direto? Escolha um canal:',
    whatsappGreeting: 'Olá! Vi seu portfólio e gostaria de pedir um orçamento.',
  },
  domain: {
    dialogTitle: 'Confira se o nome do seu site está livre',
    nameExample: 'seunome',
    leadBefore: 'O endereço grátis do primeiro ano tem o formato ',
    leadAfter: '. A consulta é feita na hora, direto na conta da Cloudflare.',
    fieldLabel: 'Nome desejado',
    placeholder: 'minha-loja',
    verify: 'verificar',
    verifying: 'verificando…',
    hint: (min, max) =>
      `De ${String(min)} a ${String(max)} caracteres: letras sem acento, números e hífen.`,
    close: 'Fechar',
    checking: (address) => `Verificando ${address}…`,
    available: (address) =>
      `${address} está livre agora. Ele só fica seu depois de fechar comigo, então fale antes que alguém escolha o mesmo.`,
    taken: (address) => `${address} já está em uso. Tente outro nome.`,
    reserved: (name) => `"${name}" é um nome reservado. Tente outro.`,
    rateLimited: 'Muitas consultas seguidas. Espere um minuto e tente de novo.',
    unavailable:
      'Não consegui verificar agora. Tente de novo em instantes ou fale comigo pelo WhatsApp.',
    problems: {
      empty: () => 'Digite o nome que você quer para o seu site.',
      short: (min) => `Use pelo menos ${String(min)} caracteres.`,
      long: (_min, max) => `Use no máximo ${String(max)} caracteres.`,
      characters: () => 'Use só letras sem acento, números e hífen (-).',
      hyphen: () => 'O hífen não pode ficar no começo, no fim nem aparecer duas vezes seguidas.',
    },
    talkOnWhatsApp: 'falar no WhatsApp',
    buildQuote: 'montar orçamento',
    whatsappMessage: (address) =>
      `Olá! Vi seu portfólio e quero o endereço ${address} para o meu site.`,
  },
  quotePage: {
    eyebrow: '$ orcamento --novo',
    title: 'Monte o orçamento do seu projeto',
    lead: 'Escolha o que precisa e veja a estimativa. No fim, o resumo segue pronto para o meu WhatsApp, sem cadastro e sem pagar nada agora.',
    backToPortfolio: 'voltar ao portfólio',
    howItWorks: 'Como funciona',
    steps: [
      { title: 'Monte o orçamento', text: 'Escolha o que precisa em poucos cliques.' },
      { title: 'Envie pelo WhatsApp', text: 'O resumo já vai escrito, é só tocar em enviar.' },
      { title: 'Converso com você', text: 'Leio os detalhes e confirmo o valor final juntos.' },
    ],
  },
  quotePanel: {
    stepProject: '1. O que você precisa?',
    stepExtras: '2. Extras (opcional)',
    stepDeadline: '3. Prazo',
    stepName: '4. Seu nome',
    stepDetails: '5. Conte sobre o projeto (opcional)',
    namePlaceholder: 'Como devo te chamar?',
    detailsPlaceholder: 'O que ele faz, para quem é, exemplos que você gosta…',
    summary: 'Seu orçamento',
    empty: 'Escolha o tipo de projeto para começar.',
    estimate: 'Estimativa',
    note: 'O valor final é confirmado na conversa, depois de eu ler os detalhes.',
    sendWhatsApp: 'enviar meu orçamento no WhatsApp',
    sendInstagram: 'enviar pelo Instagram',
    required: 'obrigatório',
    progress: (done, total) => `${String(done)} de ${String(total)} passos obrigatórios`,
    progressDone: 'Pronto para enviar',
    jumpToSummary: 'ver resumo e enviar',
    copied: 'Mensagem copiada: cole na conversa do Instagram.',
    ready: 'Tudo certo. Ao enviar, o resumo abre pronto na conversa.',
    missing: (fields) => `Falta informar: ${fields}.`,
    preview: 'Ver a mensagem que será enviada',
    privacy:
      'Este site não guarda nada do que você digita. Os dados só saem daqui quando você toca em enviar.',
    text: {
      greeting: 'Olá! Vim pelo seu portfólio e montei um orçamento.',
      name: 'Nome',
      project: 'Projeto',
      toBeDefined: 'a definir',
      extras: 'Extras',
      estimate: 'Estimativa',
      deadline: 'Prazo',
      about: 'Sobre o projeto',
      toArrange: 'a combinar',
      plusOnRequest: 'itens sob consulta',
      onRequest: 'sob consulta',
      missingProject: 'o tipo de projeto',
      missingName: 'seu nome',
      and: ' e ',
    },
  },
  error: {
    mascot: 'Corvo com falha: algo quebrou',
    title: 'Algo deu errado por aqui.',
    text: 'Não foi possível exibir esta página. Recarregue o navegador ou acesse o perfil no GitHub.',
  },
}

const en: Ui = {
  skipToContent: 'Skip to content',
  brandLabel: (name) => `${name}, top of the page`,
  externalLinkHint: '(opens in a new tab)',
  theme: { toLight: 'Switch to light theme', toDark: 'Switch to dark theme' },
  language: { label: 'Language', menuLabel: 'Choose language' },
  header: { navLabel: 'Main', menu: 'menu' },
  hero: {
    age: (years) => `${String(years)} years old`,
    seeProjects: 'see projects',
    talkToMe: 'talk to me',
  },
  projects: {
    technologies: 'Technologies',
    nextProject: 'The next project could be yours.',
    requestQuote: 'request a quote',
  },
  security: {
    knowledge: (level) => `System knowledge: ${level}`,
    vision: (percent) => `VISIBILITY ${String(percent)}%`,
  },
  footer: {
    navLabel: 'Footer',
    navigate: 'Navigate',
    security: 'Security',
    contact: 'Contact',
    sourceCode: 'Source code',
    rights: 'all rights reserved',
  },
  contact: {
    statement: "Let's get your project off the ground.",
    quoteTitle: 'Build a quote for your project',
    quoteText:
      'Pick what you need, see the estimate and send the ready-made summary to my WhatsApp. No sign-up and nothing to pay now.',
    quoteButton: 'build a quote',
    preferDirect: 'Prefer to talk directly? Pick a channel:',
    whatsappGreeting: "Hi! I saw your portfolio and I'd like to ask for a quote.",
  },
  domain: {
    dialogTitle: 'Check if your site name is available',
    nameExample: 'yourname',
    leadBefore: 'The free address for the first year looks like ',
    leadAfter: '. The check happens live, straight in the Cloudflare account.',
    fieldLabel: 'Desired name',
    placeholder: 'my-store',
    verify: 'check',
    verifying: 'checking…',
    hint: (min, max) =>
      `${String(min)} to ${String(max)} characters: letters without accents, numbers and hyphens.`,
    close: 'Close',
    checking: (address) => `Checking ${address}…`,
    available: (address) =>
      `${address} is available right now. It only becomes yours once we close a deal, so get in touch before someone picks the same one.`,
    taken: (address) => `${address} is already in use. Try another name.`,
    reserved: (name) => `"${name}" is a reserved name. Try another one.`,
    rateLimited: 'Too many checks in a row. Wait a minute and try again.',
    unavailable: "I couldn't check right now. Try again in a moment or message me on WhatsApp.",
    problems: {
      empty: () => 'Type the name you want for your site.',
      short: (min) => `Use at least ${String(min)} characters.`,
      long: (_min, max) => `Use at most ${String(max)} characters.`,
      characters: () => 'Use only letters without accents, numbers and hyphens (-).',
      hyphen: () => 'The hyphen cannot be at the start, at the end, or appear twice in a row.',
    },
    talkOnWhatsApp: 'talk on WhatsApp',
    buildQuote: 'build a quote',
    whatsappMessage: (address) =>
      `Hi! I saw your portfolio and I want the address ${address} for my site.`,
  },
  quotePage: {
    eyebrow: '$ quote --new',
    title: 'Build a quote for your project',
    lead: 'Pick what you need and see the estimate. In the end, the summary goes ready to my WhatsApp, with no sign-up and nothing to pay now.',
    backToPortfolio: 'back to the portfolio',
    howItWorks: 'How it works',
    steps: [
      { title: 'Build your quote', text: 'Pick what you need in a few clicks.' },
      { title: 'Send it on WhatsApp', text: 'The summary is already written, just tap send.' },
      { title: 'We talk', text: 'I read the details and we confirm the final price together.' },
    ],
  },
  quotePanel: {
    stepProject: '1. What do you need?',
    stepExtras: '2. Extras (optional)',
    stepDeadline: '3. Deadline',
    stepName: '4. Your name',
    stepDetails: '5. Tell me about the project (optional)',
    namePlaceholder: 'What should I call you?',
    detailsPlaceholder: 'What it does, who it is for, examples you like…',
    summary: 'Your quote',
    empty: 'Pick the project type to get started.',
    estimate: 'Estimate',
    note: 'The final price is confirmed in our chat, after I read the details.',
    sendWhatsApp: 'send my quote on WhatsApp',
    sendInstagram: 'send on Instagram',
    required: 'required',
    progress: (done, total) => `${String(done)} of ${String(total)} required steps`,
    progressDone: 'Ready to send',
    jumpToSummary: 'see summary and send',
    copied: 'Message copied: paste it into the Instagram chat.',
    ready: 'All set. When you send it, the summary opens ready in the chat.',
    missing: (fields) => `Still missing: ${fields}.`,
    preview: 'See the message that will be sent',
    privacy:
      'This site does not store anything you type. The data only leaves here when you tap send.',
    text: {
      greeting: 'Hi! I came from your portfolio and put together a quote.',
      name: 'Name',
      project: 'Project',
      toBeDefined: 'to be defined',
      extras: 'Extras',
      estimate: 'Estimate',
      deadline: 'Deadline',
      about: 'About the project',
      toArrange: 'to be agreed',
      plusOnRequest: 'items on request',
      onRequest: 'on request',
      missingProject: 'the project type',
      missingName: 'your name',
      and: ' and ',
    },
  },
  error: {
    mascot: 'Crow with a fault: something broke',
    title: 'Something went wrong here.',
    text: 'This page could not be displayed. Reload the browser or visit the GitHub profile.',
  },
}

const es: Ui = {
  skipToContent: 'Saltar al contenido',
  brandLabel: (name) => `${name}, inicio de la página`,
  externalLinkHint: '(se abre en una pestaña nueva)',
  theme: { toLight: 'Activar tema claro', toDark: 'Activar tema oscuro' },
  language: { label: 'Idioma', menuLabel: 'Elegir idioma' },
  header: { navLabel: 'Principal', menu: 'menú' },
  hero: {
    age: (years) => `${String(years)} años`,
    seeProjects: 'ver proyectos',
    talkToMe: 'hablar conmigo',
  },
  projects: {
    technologies: 'Tecnologías',
    nextProject: 'El próximo proyecto puede ser el tuyo.',
    requestQuote: 'pedir presupuesto',
  },
  security: {
    knowledge: (level) => `Conocimiento del sistema: ${level}`,
    vision: (percent) => `VISIÓN ${String(percent)}%`,
  },
  footer: {
    navLabel: 'Pie de página',
    navigate: 'Navegar',
    security: 'Seguridad',
    contact: 'Contacto',
    sourceCode: 'Código fuente',
    rights: 'todos los derechos reservados',
  },
  contact: {
    statement: 'Saquemos tu proyecto del papel.',
    quoteTitle: 'Arma el presupuesto de tu proyecto',
    quoteText:
      'Elige lo que necesitas, mira la estimación y envía el resumen listo a mi WhatsApp. Sin registro y sin pagar nada ahora.',
    quoteButton: 'armar presupuesto',
    preferDirect: '¿Prefieres hablar directamente? Elige un canal:',
    whatsappGreeting: '¡Hola! Vi tu portafolio y me gustaría pedir un presupuesto.',
  },
  domain: {
    dialogTitle: 'Comprueba si el nombre de tu sitio está libre',
    nameExample: 'tunombre',
    leadBefore: 'La dirección gratis del primer año tiene el formato ',
    leadAfter: '. La consulta se hace al momento, directamente en la cuenta de Cloudflare.',
    fieldLabel: 'Nombre deseado',
    placeholder: 'mi-tienda',
    verify: 'comprobar',
    verifying: 'comprobando…',
    hint: (min, max) =>
      `De ${String(min)} a ${String(max)} caracteres: letras sin acento, números y guion.`,
    close: 'Cerrar',
    checking: (address) => `Comprobando ${address}…`,
    available: (address) =>
      `${address} está libre ahora. Solo será tuyo después de cerrar conmigo, así que escríbeme antes de que alguien elija el mismo.`,
    taken: (address) => `${address} ya está en uso. Prueba con otro nombre.`,
    reserved: (name) => `"${name}" es un nombre reservado. Prueba con otro.`,
    rateLimited: 'Demasiadas consultas seguidas. Espera un minuto e inténtalo de nuevo.',
    unavailable:
      'No pude comprobarlo ahora. Inténtalo de nuevo en un momento o escríbeme por WhatsApp.',
    problems: {
      empty: () => 'Escribe el nombre que quieres para tu sitio.',
      short: (min) => `Usa al menos ${String(min)} caracteres.`,
      long: (_min, max) => `Usa como máximo ${String(max)} caracteres.`,
      characters: () => 'Usa solo letras sin acento, números y guion (-).',
      hyphen: () =>
        'El guion no puede estar al principio, al final ni aparecer dos veces seguidas.',
    },
    talkOnWhatsApp: 'hablar por WhatsApp',
    buildQuote: 'armar presupuesto',
    whatsappMessage: (address) =>
      `¡Hola! Vi tu portafolio y quiero la dirección ${address} para mi sitio.`,
  },
  quotePage: {
    eyebrow: '$ presupuesto --nuevo',
    title: 'Arma el presupuesto de tu proyecto',
    lead: 'Elige lo que necesitas y mira la estimación. Al final, el resumen va listo a mi WhatsApp, sin registro y sin pagar nada ahora.',
    backToPortfolio: 'volver al portafolio',
    howItWorks: 'Cómo funciona',
    steps: [
      { title: 'Arma el presupuesto', text: 'Elige lo que necesitas en pocos clics.' },
      { title: 'Envíalo por WhatsApp', text: 'El resumen ya va escrito, solo toca enviar.' },
      { title: 'Conversamos', text: 'Leo los detalles y confirmamos juntos el precio final.' },
    ],
  },
  quotePanel: {
    stepProject: '1. ¿Qué necesitas?',
    stepExtras: '2. Extras (opcional)',
    stepDeadline: '3. Plazo',
    stepName: '4. Tu nombre',
    stepDetails: '5. Cuéntame sobre el proyecto (opcional)',
    namePlaceholder: '¿Cómo debo llamarte?',
    detailsPlaceholder: 'Qué hace, para quién es, ejemplos que te gustan…',
    summary: 'Tu presupuesto',
    empty: 'Elige el tipo de proyecto para empezar.',
    estimate: 'Estimación',
    note: 'El precio final se confirma en la conversación, después de leer los detalles.',
    sendWhatsApp: 'enviar mi presupuesto por WhatsApp',
    sendInstagram: 'enviar por Instagram',
    required: 'obligatorio',
    progress: (done, total) => `${String(done)} de ${String(total)} pasos obligatorios`,
    progressDone: 'Listo para enviar',
    jumpToSummary: 'ver resumen y enviar',
    copied: 'Mensaje copiado: pégalo en la conversación de Instagram.',
    ready: 'Todo listo. Al enviar, el resumen se abre listo en la conversación.',
    missing: (fields) => `Falta indicar: ${fields}.`,
    preview: 'Ver el mensaje que se enviará',
    privacy:
      'Este sitio no guarda nada de lo que escribes. Los datos solo salen de aquí cuando tocas enviar.',
    text: {
      greeting: '¡Hola! Vengo de tu portafolio y armé un presupuesto.',
      name: 'Nombre',
      project: 'Proyecto',
      toBeDefined: 'por definir',
      extras: 'Extras',
      estimate: 'Estimación',
      deadline: 'Plazo',
      about: 'Sobre el proyecto',
      toArrange: 'a convenir',
      plusOnRequest: 'ítems a consultar',
      onRequest: 'a consultar',
      missingProject: 'el tipo de proyecto',
      missingName: 'tu nombre',
      and: ' y ',
    },
  },
  error: {
    mascot: 'Cuervo con una falla: algo se rompió',
    title: 'Algo salió mal por aquí.',
    text: 'No fue posible mostrar esta página. Recarga el navegador o visita el perfil de GitHub.',
  },
}

export const ui: Readonly<Record<Lang, Ui>> = { pt, en, es }
