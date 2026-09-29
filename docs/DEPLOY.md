# Publicação (Cloudflare + bio.site)

## Como está montado

O site é **estático**: o `npm run build` gera `dist/` e a Cloudflare o serve como _Worker com assets_
(`wrangler.jsonc`). Não há servidor nem variáveis de ambiente.

O Worker já existe na sua conta com o nome **`portfolio`** (hoje mostrando "Hello world"). O
`name` em `wrangler.jsonc` precisa continuar **igual** a esse nome, ou o build falha.

## Configuração no painel (uma vez)

Cloudflare → Workers & Pages → `portfolio` → **Settings → Builds**:

| Campo          | Valor                                                                           |
| -------------- | ------------------------------------------------------------------------------- |
| Build command  | `npm run build` ← **obrigatório**: sem isso não existe `dist/` e o deploy falha |
| Deploy command | `npx wrangler deploy` (padrão)                                                  |
| Root directory | `/`                                                                             |
| Node.js        | Automático: o arquivo `.nvmrc` fixa a versão 22                                 |

Depois é só dar `git push` na branch `main`: cada push publica sozinho.

## Antes de dar push

```bash
npm run check        # tem que terminar sem erros
npm run preview:cf   # abre o site no motor real da Cloudflare (http://localhost:8787)
```

## Primeira publicação

```bash
git add -A
git commit -m "Portfólio CORVO"
git remote add origin git@github.com:Alexitiimia/portfolio.git   # se ainda não existir
git push -u origin main
```

## bio.site

Use a URL do Worker (`https://portfolio.<sua-conta>.workers.dev`) como link no bio.site. O site é
otimizado para celular. A CSP permite ser exibido em frame apenas por ele mesmo e por
`https://bio.site` (`frame-ancestors` em `public/_headers`).

## Quando tiver domínio próprio

1. Em Workers & Pages → `portfolio` → Settings → Domains & Routes, adicione o domínio.
2. Em `index.html`, acrescente `og:url` e `og:image` com **URL absoluta** (a imagem de prévia do
   WhatsApp/Instagram). Sem isso a prévia do link aparece só com texto.
3. Ative "Always Use HTTPS" e confirme o HSTS no painel SSL/TLS.

## Cuidados com a CSP (`public/_headers`)

A política só libera arquivos do próprio site. Isso protege contra XSS e rastreadores, e sustenta as
frases do rodapé ("CSP estrita", "Sem rastreadores"). Consequências:

- Ativar **Cloudflare Web Analytics** (injeção automática) ou qualquer script/fonte/vídeo de
  terceiro será **bloqueado** até você liberar o domínio na diretiva certa. Se liberar, revise as
  frases do rodapé em `content/site.ts`; o `deploy.test.ts` cobra evidência para cada uma.
- O texto "TLS 1.3" da barra de status é o padrão da Cloudflare. Se mudar de hospedagem, confira.

## Pendências suas

- Adicionar canais de contato (WhatsApp, e-mail, Instagram) em `src/content/contact.ts`. Só o
  GitHub está público hoje. O e-mail da sua conta **não** foi publicado.
- Conferir os textos marcados para revisão: "Pagamentos" (físicos e online), "Mentoria de
  portabilidade" e a lista de projetos (`src/content/projects.ts`).
