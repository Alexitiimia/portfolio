# Publicação (Cloudflare + bio.site)

## Como está montado

O site é **estático**: o `npm run build` gera `dist/` e a Cloudflare o serve como _Worker com assets_
(`wrangler.jsonc`). O único código de servidor é `worker/index.ts`, que só roda em `/api/*` e
atende a verificação de nomes livres do campo "Domínio" (veja a seção abaixo). Ele precisa de dois
segredos, que **não** ficam no repositório.

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

## Verificação de nomes livres (uma vez)

O campo "Confira se o nome do seu site está livre" pergunta a `/api/dominio`. O Worker consulta a
lista de Workers da sua conta na API da Cloudflare: um nome está ocupado se já existe um Worker com
ele, porque o endereço grátis é `nome.axeldev.workers.dev`. Para isso ele precisa de um token **só
de leitura**:

1. Painel da Cloudflare → **My Profile → API Tokens → Create Token → Create Custom Token**.
2. Permissão: **Account → Workers Scripts → Read** (só essa). Em _Account Resources_, escolha
   apenas a sua conta. Não use o token global nem o que faz deploy.
3. Guarde o token e o **ID da conta** (aparece em `npx wrangler whoami` e na página inicial de
   Workers & Pages) como segredos do Worker:

```bash
npx wrangler secret put CLOUDFLARE_API_TOKEN     # cole o token
npx wrangler secret put CLOUDFLARE_ACCOUNT_ID    # cole o ID da conta
```

Os segredos ficam na Cloudflare e sobrevivem aos próximos deploys. Nunca escreva nenhum dos dois
em arquivo versionado (`deploy.test.ts` recusa um ID de conta no `wrangler.jsonc`).

**Sem os segredos o site funciona normalmente**: o campo só responde "Não consegui verificar agora".
A consulta nunca dá um nome como livre por engano: qualquer falha (token errado, API fora do ar,
resposta estranha) vira "indisponível". Como prova, o Worker exige que a lista traga o próprio
`portfolio`; se você renomear o Worker, troque `SELF_WORKER_NAME` em `worker/domain.ts` (um teste
confere que os dois nomes são iguais).

Proteções: no máximo 20 consultas por minuto por IP (`ratelimits` no `wrangler.jsonc`), lista
guardada por 1 minuto na memória do Worker e nomes reservados (`www`, `api`, `admin`...) em
`src/lib/domainName.ts`.

**Testar no seu computador** (o `npm run dev` não tem `/api`, só o motor da Cloudflare tem):

```bash
# crie o arquivo .dev.vars na raiz (já está no .gitignore) com os mesmos dois nomes:
#   CLOUDFLARE_ACCOUNT_ID=...
#   CLOUDFLARE_API_TOKEN=...
npm run preview:cf     # abre http://localhost:8787
```

Um nome livre só fica seu quando você criar o Worker do cliente com esse nome: a verificação não
reserva nada. Se duas pessoas perguntarem ao mesmo tempo, vale quem fechar primeiro.

## Antes de dar push

```bash
npm run check        # tem que terminar sem erros
npm run preview:cf   # abre o site no motor real da Cloudflare (http://localhost:8787)
```

## Primeira publicação

```bash
git add -A
git commit -m "Portfólio The Crow"
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

- Criar o token e os dois segredos da verificação de nomes (seção acima).
- Canais de contato ficam em `src/content/contact.ts`. O e-mail da sua conta **não** foi publicado.
- Conferir os textos marcados para revisão: "Pagamentos" (físicos e online), "Mentoria de
  portabilidade" e a lista de projetos (`src/content/projects.ts`).
