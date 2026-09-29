# CORVO · Portfólio

Site estático de portfólio (projetos, ferramentas, serviços, segurança e condições), feito para ser
linkado no bio.site e publicado na Cloudflare. Identidade preto e branco em pixel art.

**Stack:** React 19 · TypeScript (modo estrito) · Vite 8 · CSS Modules · Vitest · Cloudflare Workers (assets estáticos).

## Começando

Requer Node **22.13 ou superior** (`.nvmrc` fixa o 22).

```bash
npm install
npm run dev        # servidor local com recarga automática
```

## Comandos

| Comando              | O que faz                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------ |
| `npm run dev`        | Desenvolvimento local                                                                            |
| `npm run check`      | **Tudo de uma vez**: tipos, lint, formatação, testes e build. Rode antes do push                 |
| `npm run typecheck`  | Só o TypeScript                                                                                  |
| `npm run lint`       | ESLint (regras estritas com tipos) · `lint:fix` corrige o que der                                |
| `npm run format`     | Prettier · `format:check` só confere                                                             |
| `npm test`           | Testes · `test:watch` reexecuta ao salvar                                                        |
| `npm run build`      | Gera `dist/` (é o que a Cloudflare publica)                                                      |
| `npm run preview`    | Serve o `dist/` localmente                                                                       |
| `npm run preview:cf` | Build + `wrangler dev`: roda o site no **mesmo motor da Cloudflare**, com `_headers` e 404 reais |

## Como editar o conteúdo

Todo texto do site fica em [`src/content/`](src/content), sem mexer em componentes:

| Arquivo       | O que controla                                                          |
| ------------- | ----------------------------------------------------------------------- |
| `site.ts`     | Nome da marca, barra de status, título principal, rodapé, links         |
| `sections.ts` | Seções: ordem, nomes, texto do menu e frase de cada uma                 |
| `projects.ts` | Projetos (adicione um item à lista)                                     |
| `tools.ts`    | Ferramentas e seus logos                                                |
| `services.ts` | Serviços                                                                |
| `security.ts` | Black/Grey/White Box e demais capacidades de segurança                  |
| `offers.ts`   | Condições (domínio grátis, hospedagem, suporte, 30 dias)                |
| `contact.ts`  | Canais de contato. **Hoje só o GitHub**: adicione WhatsApp, e-mail etc. |

Os tipos e os testes (`content.test.ts`) acusam erro de digitação, link inválido (só HTTPS) ou id
repetido antes de o site ir ao ar.

## Documentação

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): pastas, convenções e decisões
- [`docs/DEPLOY.md`](docs/DEPLOY.md): Cloudflare, bio.site e o que fazer ao ter domínio próprio
- [`brand/`](brand): kit original da identidade (logo, favicons, animações), intocado
