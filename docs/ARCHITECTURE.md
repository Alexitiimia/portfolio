# Arquitetura

## Estrutura de pastas

```
brand/            Kit original da identidade (a marca hoje é "The Crow"). Fonte da verdade; não entra no build.
docs/             Documentação.
orcamento/        Modelo HTML da segunda página (orçamento). Entrada: src/orcamento.tsx. Listada em vite.config.ts.
vite.i18n.ts      Plugin do Vite: gera um HTML por idioma a partir dos dois modelos (index.html e orcamento/index.html).
worker/           Único código de servidor: /api/dominio (verificação de nomes livres) e o redirecionamento de "/" para /pt/, /en/ ou /es/. Ver docs/DEPLOY.md.
public/           Copiado como está para a raiz do site (sem hash): _headers, 404, favicons, robots.
src/
  app/            Composição das páginas (App = portfólio, QuotePage = /orcamento/) e ErrorBoundary.
  assets/brand/   Sprites do mascote importados pelo CSS (ganham hash no build).
  components/
    brand/        Logo (Brand), corvo (CorvoSprite, CorvoIcon, FooterCrow) e mascote de erro (CorvoMascot).
    icons/        Logos de marcas de tecnologia (brands.ts) e o componente BrandIcon.
    layout/       Header, Footer, StatusBar, Section, Container, SkipLink.
    ui/           Peças reutilizáveis: botões, links, ícones, cursor, alternador de tema.
  content/        TODO o texto do site, tipado. É aqui que se edita. O português fica nos próprios arquivos;
                  as traduções (en, es) ficam em content/translations/, indexadas pelo id de cada item.
  hooks/          useTheme, useActiveSection.
  i18n/           Idiomas (pt, en, es): rotas (lang.ts), textos da interface (ui.ts), títulos/prévias do <head> (meta.ts), contexto e hooks (useI18n.ts).
  lib/            Funções puras: tema, URLs seguras, cx.
  sections/       Uma pasta por seção da página (hero, projects, tools, services, security, offers, contact).
  styles/         tokens.css (cores, fontes, espaços), reset.css, base.css.
  test/           Utilitários e testes de "contrato" (CSS Modules, deploy/CSP).
```

Regra de dependência: `sections` → `components` → `lib`/`content`. `content` e `lib` não importam
componentes de tela (exceto o registro de logos, `components/icons/brands.ts`).

## Idiomas (/pt/, /en/, /es/)

Cada idioma é uma página estática própria: `/pt/`, `/en/`, `/es/` e o orçamento em
`/pt/orcamento/`, `/en/quote/`, `/es/presupuesto/` (nomes em `src/i18n/lang.ts`). O Vite gera um HTML
por idioma (título, descrição, prévia de link e `hreflang` no idioma certo) e o React lê o idioma da
URL. A raiz `/` (e o antigo `/orcamento/`) passa pelo Worker, que encaminha para o idioma do
navegador (`Accept-Language`). O seletor fica no cabeçalho, ao lado do botão de tema.

- **Mudar um texto em português:** edite o arquivo de `src/content/` (ou `src/i18n/ui.ts`, para botões
  e avisos). Depois ajuste a mesma chave em `content/translations/en.ts` e `es.ts`.
- **Acrescentar um item** (projeto, serviço, oferta...): coloque a tradução com o mesmo `id` em
  `en.ts` e `es.ts`. Se esquecer, `src/i18n/i18n.test.ts` falha.
- **Título da aba e prévia do link:** `src/i18n/meta.ts`.
- Não traduzidos de propósito: nomes de marcas e projetos, `public/404.html` e a imagem da prévia
  (`og-image.png`, igual nos três idiomas).

## Convenções

- **Um componente = uma pasta de arquivos vizinhos**: `X.tsx`, `X.module.css`, testes ao lado.
- **CSS Modules com camelCase** e sempre `styles.nomeDaClasse` (nunca desestruturar). Um teste
  falha se uma classe usada não existir no CSS.
- **Cores e medidas vêm de `styles/tokens.css`**, nunca valores soltos. Cantos sempre retos (`--radius: 0`).
- **Links externos** usam `ExternalLink` (`rel="noopener noreferrer"`) e só aceitam `HttpsUrl`
  (o compilador recusa `http://` e `javascript:`).
- **Sem HTML injetado** (`dangerouslySetInnerHTML` é proibido pelo lint), **sem script, estilo ou
  evento inline**: a CSP do site bloquearia.
- Ícones de **marca** (logos) vêm de `brands.ts`, em `currentColor` (monocromáticos). Ícones
  **genéricos** vêm do `lucide-react`.
- Seções novas: adicione o `id` em `SECTION_IDS` (`content/sections.ts`); menu, número e âncora
  saem dali. Depois crie a pasta em `src/sections/` e inclua em `App.tsx`.

## Garantias automáticas (`npm run check`)

| Camada             | O que pega                                                                            |
| ------------------ | ------------------------------------------------------------------------------------- |
| TypeScript estrito | `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, links HTTPS, ids de seção   |
| ESLint             | Regras estritas com tipos, hooks do React, proibição de `dangerouslySetInnerHTML`     |
| `content.test`     | Ids únicos, textos limpos, links válidos, logos com desenho válido                    |
| `contrast.test`    | Contraste WCAG AA de todo par de cores, nos dois temas                                |
| `cssModules.test`  | Classe usada no TSX que não existe no CSS                                             |
| `deploy.test`      | CSP estrita, HSTS, ausência de inline, arquivos referenciados existem, nome do Worker |
| `App.test`         | Marcos da página, links internos/externos, ordem de tabulação, axe-core               |

O jsdom não mede cores nem layout. Para contraste real e visual, use o navegador (`npm run
preview:cf`) e uma extensão como axe DevTools ou o Lighthouse.

## Identidade (brand/)

O kit em `brand/` é a origem; o que o site usa foi copiado/portado assim:

| Do kit                              | Onde está no site                                                                          |
| ----------------------------------- | ------------------------------------------------------------------------------------------ |
| `brand.css` (paleta e fontes)       | `src/styles/tokens.css`                                                                    |
| `layout.css` + `header/footer.html` | `components/layout/{StatusBar,Header,Footer}` e `components/brand/Brand`                   |
| `favicons/5-silhueta-olho/*`        | `public/site.webmanifest` (os ícones em si vêm da imagem do corvo, ver abaixo)             |
| `animacoes/corvo-404-*`             | `public/404.css` + `corvo-404-sprite.png`                                                  |
| `brand/crow/crow.png`               | `components/brand/{CorvoSprite,CorvoIcon,FooterCrow}` + `src/assets/brand/crow-sprite.png` |
| `animacoes/` (demais estados)       | `components/brand/CorvoMascot` + `src/assets/brand/`                                       |

Os ícones (`favicon.ico` 16/32/48, `apple-touch-icon.png` 180, `icon-192/512.png`) saem todos da mesma
imagem: a cabeça do corvo em pixel art, cortada no quadrado arredondado e reduzida para cada tamanho
(Pillow). **Não há `favicon.svg` de propósito**: o navegador prefere o SVG e ignoraria o `.ico`, então
trocar só um dos arquivos não muda a aba. Para trocar o ícone, regenere os quatro arquivos juntos.
O manifesto usa o nome da marca (`site.name`) e o preto do tema escuro; `deploy.test.ts` confere.
Se o kit for atualizado, refaça a cópia acima; não edite `brand/` à mão.

O Lovable ainda não existe no pacote de logos usado (`simple-icons`), por isso seu desenho está
embutido em `brands.ts` com a fonte anotada. Troque por `siLovable` quando o pacote incluir.

### O corvo (`brand/crow/`)

`crow.png` (folha de voo) e `crowfavicon.png` (cabeça) são as fontes.

- `build-crow-sprite.py` separa cada corvo, alinha (chão nas poses paradas, olho vermelho no voo) e
  gera `src/assets/brand/crow-sprite.png`: 14 quadros de fundo transparente (parado direita,
  esquerda e de frente; agachado; 9 de voo; pouso).
- **Header** (`CorvoIcon`): parado, olha para o ponteiro do mouse (esquerda, frente ou direita); ao
  clicar ou tocar, decola, bate asas e pousa (2,81 s). No celular não há ponteiro, então fica
  olhando para a direita e só reage ao toque. Sem movimento (preferência do sistema), não voa.
- **Rodapé** (`FooterCrow`): camada decorativa que patrulha o rodapé de um lado ao outro, batendo
  asas e virando nas pontas (28 s por volta, só CSS com `cqw`/`cqh`).
- Mudar a duração da decolagem exige mexer em `CorvoSprite.module.css`, `CorvoIcon.module.css` e
  `FLIGHT_MS` em `CorvoIcon.tsx`.
- `build-favicon.py` e `crowfavicon.png` geravam o favicon antigo (cabeça com contorno claro). O site
  hoje usa o kit `favicons/5-silhueta-olho`; esses dois ficam só como fonte.
- O tom escuro do corvo ganha esse contorno (`--crow-glow`) só no tema escuro.
