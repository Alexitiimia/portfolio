import type { Translations } from './types'

export const es: Translations = {
  site: {
    statusBar: {
      left: 'CANAL SEGURO · TLS 1.3 · HSTS',
      prompt: 'operador@thecrow:~$',
      command: 'status --all',
      result: 'ok',
    },
    hero: {
      command: 'whoami',
      role: 'full stack · seguridad de la información',
      headline: ['Sistemas web ', { mark: 'seguros' }, ', de la base de datos a la interfaz.'],
      lead: 'Creo tiendas virtuales, sistemas de gestión financiera y automatizaciones, con análisis de seguridad. Front-end y back-end, del prototipo al soporte 24 h.',
    },
    footer: {
      about: 'Desarrollo web seguro y análisis de seguridad. Código auditable, cero ruido.',
      securityFacts: ['HTTPS + HSTS', 'CSP estricta', 'Sin rastreadores'],
      closing: '$ echo "nevermore"',
    },
  },
  sections: {
    projetos: {
      label: 'Proyectos',
      navLabel: 'proyectos',
      lead: 'Algunos de los trabajos que desarrollé.',
    },
    ferramentas: {
      label: 'Herramientas',
      navLabel: 'herramientas',
      lead: 'Tecnologías y plataformas con las que trabajo.',
    },
    servicos: {
      label: 'Servicios',
      navLabel: 'servicios',
      lead: 'Lo que puedo construir y mantener para tu negocio.',
    },
    seguranca: {
      label: 'Seguridad',
      navLabel: 'seguridad',
      lead: 'Análisis de seguridad en tres niveles de conocimiento del sistema.',
    },
    condicoes: {
      label: 'Condiciones',
      navLabel: 'condiciones',
      lead: 'Lo que recibes al contratar.',
    },
    contato: {
      label: 'Contacto',
      navLabel: 'contacto --24h',
      lead: 'Arma el presupuesto y envíalo por WhatsApp, o escríbeme por otro canal.',
    },
  },
  offers: {
    dominio: {
      label: 'Dominio',
      highlight: 'Gratis por 1 año',
      description:
        'Dirección gratis durante el primer año, con el formato tunombre.axeldev.workers.dev. Comprueba si el nombre que quieres está libre.',
      actionLabel: 'comprobar nombre',
    },
    hospedagem: {
      label: 'Hosting',
      highlight: 'Gratis por 3 meses',
      description: 'Después de los 3 meses, el precio se calcula según la demanda.',
    },
    suporte: {
      label: 'Soporte técnico',
      highlight: '24 horas al día',
      description:
        'Corrección de errores y atención de pedidos de ayuda técnica con tu sitio o sistema, a cualquier hora.',
      callout: 'Durante los primeros 30 días después de la compra, el soporte técnico es gratis.',
    },
  },
  projects: {
    'f-cordeiro': {
      summary:
        'Tienda online de piezas impresas en 3D: carrito, favoritos, cuenta de cliente, pago con Mercado Pago, envío con Melhor Envio y pedido de presupuesto a medida. Tiene panel de administración con finanzas, fijación de precios y presupuesto en PDF. Incluye una comunidad automatizada en Discord, mediante un bot: vincula la cuenta del cliente al servidor, da roles automáticos (vinculado, comprador, afiliado) y hace sorteos solo para cuentas vinculadas.',
      links: ['Ver la tienda'],
    },
    'vila-cartola': {
      summary:
        'Comunidad de Minecraft con juego entre Java y Bedrock. El sitio tiene inicio de sesión con Discord, mapa 3D en vivo, ranking, tienda y suscripción de apoyo con Mercado Pago. Por detrás: servidor en Docker con copias de seguridad, plugins propios en Java (economía, social y verificación), bot de bienvenida y panel de administración.',
      links: ['Ver el sitio'],
    },
    'pure-tone-check': {
      summary:
        'Examen auditivo online y gratuito, en inglés: reproduce tonos puros en cinco frecuencias, un oído a la vez, y entrega un gráfico con el resultado, que se puede descargar en PDF. Un Worker guarda el historial por correo y frena el spam con una trampa invisible y una lista de correos desechables.',
      links: ['Hacer la prueba'],
    },
  },
  tools: {
    groups: {
      linguagens: 'Lenguajes y frameworks',
      plataformas: 'Plataformas y despliegue',
      sistemas: 'Sistemas operativos',
      dados: 'Bases de datos',
      seguranca: 'Seguridad y pruebas de API',
      marketing: 'Marketing digital',
    },
    notes: {
      python: 'Avanzado',
      ubuntu: 'Linux',
      debian: 'Linux',
      'kali-linux': 'Linux',
      'burp-suite': 'Nociones de SQL Injection',
    },
  },
  services: {
    lojas: {
      title: 'Tiendas y ventas online',
      description: 'Sitios para vender productos, con pago real, envío y ubicación.',
    },
    financeiro: {
      title: 'Gestión financiera',
      description:
        'Control de ventas, precio de costo y ganancia, con cálculo de facturación semanal, mensual y anual.',
    },
    frete: {
      title: 'Envío y ubicación',
      description:
        'Cálculo de envío y ubicación por el sitio o por el canal que prefieras, para todo Brasil o solo local.',
    },
    login: {
      title: 'Registro e inicio de sesión seguros',
      description:
        'Registro e inicio de sesión rápidos y seguros con Google, Discord, GitHub y Steam.',
    },
    'verificacao-email': {
      title: 'Verificación de correo',
      description: 'Sistema para confirmar el correo de quien se registra.',
    },
    'verificacao-telefone': {
      title: 'Verificación de teléfono',
      description: 'Sistema para confirmar el número de teléfono, solo para números brasileños.',
    },
    gerenciamento: {
      title: 'Gestión de datos',
      description: 'Registro y gestión de los datos de clientes o empleados.',
    },
    pagamentos: {
      title: 'Pagos',
      description: 'Sistema de pago real, para ventas físicas y online.',
    },
    automacao: {
      title: 'Automatización de datos',
      description:
        'Scripts automatizados y eficaces para el mantenimiento, manejo, almacenamiento y actualización de datos.',
    },
    'previa-de-design': {
      title: 'Vista previa del diseño',
      description:
        'Prototipo visual del sitio o sistema antes de programar, para que apruebes el diseño, los colores y los textos con claridad.',
    },
    'criacao-de-logo': {
      title: 'Creación de logo',
      description:
        'Logo e identidad visual simples para tu negocio, listos para el sitio y las redes.',
    },
    'automacao-de-sistemas': {
      title: 'Automatización de sistemas',
      description:
        'Automatización de sistemas virtuales, del proceso interno a la integración entre herramientas.',
    },
    seo: {
      title: 'SEO para sitios',
      description:
        'SEO auténtico, eficaz y optimizado para tu sitio, para que sea más fácil de encontrar en las búsquedas.',
    },
    mentoria: {
      title: 'Mentoría de portabilidad',
      description:
        'Acompañamiento para migrar y portar proyectos entre plataformas y proveedores de hosting.',
    },
  },
  security: {
    methodologies: {
      black: {
        translation: 'Caja negra',
        knowledge: 'Ninguno',
        description:
          'Sin acceso al código ni a la documentación. El análisis parte desde fuera, como lo haría un atacante real.',
      },
      grey: {
        translation: 'Caja gris',
        knowledge: 'Parcial',
        description:
          'Conocimiento parcial del sistema, como cuentas de prueba o parte de la arquitectura. Une la visión externa con algo de contexto interno.',
      },
      white: {
        translation: 'Caja blanca',
        knowledge: 'Total',
        description:
          'Acceso completo al código, a la configuración y a la infraestructura. Es el análisis más profundo.',
      },
    },
    capabilities: {
      auditoria: {
        title: 'Auditoría de seguridad',
        description: 'Revisión de sistemas para encontrar y corregir fallas de seguridad.',
      },
      'banco-de-dados': {
        title: 'Análisis de base de datos en tiempo real',
        description:
          'Pruebas simuladas para validar y corregir fallas de seguridad, errores, integraciones mal hechas y puntos de optimización.',
      },
      'sql-injection': {
        title: 'Nociones de SQL Injection',
        description: 'Pruebas de inyección SQL con Burp Suite.',
      },
      'engenharia-reversa': {
        title: 'Ingeniería inversa',
        description: 'Técnicas de ingeniería inversa para entender el funcionamiento de sistemas.',
      },
    },
  },
  quote: {
    items: {
      'site-institucional': {
        label: 'Sitio institucional',
        description: 'Te presenta a ti o a tu empresa: servicios, proyectos y contacto.',
      },
      'loja-virtual': {
        label: 'Tienda virtual',
        description: 'Venta de productos online, con catálogo y carrito.',
      },
      'sistema-financeiro': {
        label: 'Sistema de gestión financiera',
        description: 'Ventas, costo, ganancia y facturación semanal, mensual y anual.',
      },
      'automacao-de-dados': {
        label: 'Automatización de datos',
        description: 'Scripts para el mantenimiento, almacenamiento y actualización de datos.',
      },
      outro: {
        label: 'Otro proyecto',
        description: 'Algo diferente: descríbelo en el campo de abajo.',
      },
      'login-social': {
        label: 'Inicio de sesión rápido y seguro',
        description: 'Google, Discord, GitHub y Steam.',
      },
      'verificacao-email': {
        label: 'Verificación de correo',
        description: 'Confirma el correo de quien se registra.',
      },
      'verificacao-telefone': {
        label: 'Verificación de teléfono',
        description: 'Confirma el número, solo números brasileños.',
      },
      frete: {
        label: 'Envío y ubicación',
        description:
          'Cálculo por el sitio o por el canal que prefieras, en todo Brasil o solo local.',
      },
      pagamentos: {
        label: 'Sistema de pago',
        description: 'Pago real, para ventas físicas y online.',
      },
      gerenciamento: {
        label: 'Gestión de datos',
        description: 'Registro y gestión de clientes o empleados.',
      },
      'previa-de-design': {
        label: 'Vista previa del diseño',
        description: 'Prototipo visual para aprobar antes de programar.',
      },
      'criacao-de-logo': {
        label: 'Creación de logo',
        description: 'Logo e identidad visual simples.',
      },
      'automacao-de-sistemas': {
        label: 'Automatización de sistemas',
        description: 'Automatización de procesos e integración entre herramientas.',
      },
      'auditoria-de-seguranca': {
        label: 'Auditoría de seguridad',
        description: 'Revisión del sistema para encontrar y corregir fallas.',
      },
      mentoria: {
        label: 'Mentoría de portabilidad',
        description: 'Ayuda para migrar el proyecto entre plataformas y proveedores de hosting.',
      },
    },
    deadlines: {
      'sem-pressa': 'Sin prisa',
      'ate-1-mes': 'En hasta 1 mes',
      urgente: 'Urgente',
    },
  },
}
