# CORVO — identidade (favicon + header + footer)

Preto e branco, pixel nítido, tema dev/cybersec.

## Favicons (escolha 1 pasta em `favicons/`)
| pasta | ideia |
|---|---|
| 1-poleiro | corvo pousado — o mais reconhecível (recomendado) |
| 2-perfil | cabeça + bico grande |
| 3-cabeca | cabeça minimalista, mais legível em 16×16 |
| 4-voo | corvo de asas abertas, estilo emblema |

Todos são desenhados na grade 16×16 (pixel-perfect: sem borrar), fundo preto, corvo branco.

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```
Copie `favicon.svg`, `favicon.ico` e `apple-touch-icon.png` da pasta escolhida para a raiz do site (`icon-192/512.png` são para PWA).

## Header / footer
- `brand.css` — tokens (tema dark por padrão; `<html data-theme="light">` inverte)
- `layout.css` — estilos de header e footer
- `header.html`, `footer.html` — cole no layout do site (sem JS, menu mobile via `<details>`)
- `demo.html` — abra no navegador para ver tudo junto

Troque `CORVO`, e-mail, GitHub e fingerprint PGP pelos seus. Para usar outro corvo no logo, troque o `d` do `<path>` pelo do `favicon.svg` escolhido.

## Corvo detalhado (32×32) e animações
O logo do header/footer usa o corvo 32×32 (bico curvo pesado, penas da asa, cauda em cunha, poleiro). O favicon usa a versão 16×16.

`animacoes/` — 5 animações em pixel art, a partir do mesmo corvo:
| arquivo | uso |
|---|---|
| corvo-carregando | corvo bicando + 3 pontos (spinner) |
| corvo-404 | corvo inclinando a cabeça, `?` e `404` |
| corvo-concluido | acena e o check aparece com brilhos |
| corvo-recusado | balança a cabeça, símbolo de proibido piscando |
| corvo-falha | glitch + aviso piscando |

Cada uma vem em 3 formatos: `corvo-*.svg` (animado, use em `<img>`; branco, para fundo escuro), `corvo-*-sprite.png` (frames lado a lado) e classes CSS em `corvo-animacoes.css` (a cor segue `color`, então funciona no tema claro). Tempos e nº de frames em `frames.json`. Veja `animacoes/demo.html`.

```html
<link rel="stylesheet" href="corvo-animacoes.css">
<span class="corvo-carregando" role="img" aria-label="Carregando"></span>
```
