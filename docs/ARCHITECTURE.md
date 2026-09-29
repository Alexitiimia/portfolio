# Arquitetura

## Estrutura de pastas

```
brand/            Kit original da identidade (CORVO). Fonte da verdade; não entra no build.
docs/             Documentação.
public/           Copiado como está para a raiz do site (sem hash): _headers, 404, favicons, robots.
src/
  app/            Composição da página (App) e ErrorBoundary.
  assets/brand/   Sprites do mascote importados pelo CSS (ganham hash no build).
  components/
    brand/        Logo (BrandMark, Brand) e mascote animado (CorvoMascot).
    icons/        Logos de marcas de tecnologia (brands.ts) e o componente BrandIcon.
    layout/       Header, Footer, StatusBar, Section, Container, SkipLink.
    ui/           Peças reutilizáveis: botões, links, ícones, cursor, alternador de tema.
  content/        TODO o texto do site, tipado. É aqui que se edita.
  hooks/          useTheme, useActiveSection.
  lib/            Funções puras: tema, URLs seguras, cx.
  sections/       Uma pasta por seção da página (hero, projects, tools, services, security, offers, contact).
  styles/         tokens.css (cores, fontes, espaços), reset.css, base.css.
  test/           Utilitários e testes de "contrato" (CSS Modules, deploy/CSP).
```

Regra de dependência: `sections` → `components` → `lib`/`content`. `content` e `lib` não importam
componentes de tela (exceto o registro de logos, `components/icons/brands.ts`).

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

| Do kit                              | Onde está no site                                                        |
| ----------------------------------- | ------------------------------------------------------------------------ |
| `brand.css` (paleta e fontes)       | `src/styles/tokens.css`                                                  |
| `layout.css` + `header/footer.html` | `components/layout/{StatusBar,Header,Footer}` e `components/brand/Brand` |
| Corvo 32×32 (`d` do `<path>`)       | `components/brand/corvoPath.ts`                                          |
| `favicons/1-poleiro/*`              | `public/favicon.svg`, `favicon.ico`, `apple-touch-icon.png`              |
| `animacoes/corvo-404-*`             | `public/404.css` + `corvo-404-sprite.png`                                |
| `animacoes/` (demais estados)       | `components/brand/CorvoMascot` + `src/assets/brand/`                     |

Para trocar o favicon por outra variante, copie os 3 arquivos da pasta escolhida para `public/`.
Se o kit for atualizado, refaça a cópia acima; não edite `brand/` à mão.

O Lovable ainda não existe no pacote de logos usado (`simple-icons`), por isso seu desenho está
embutido em `brands.ts` com a fonte anotada. Troque por `siLovable` quando o pacote incluir.
