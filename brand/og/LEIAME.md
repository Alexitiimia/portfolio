# Imagem de prévia de link (og-image.png e og-orcamento.png)

É a imagem que aparece quando alguém cola o link do site no WhatsApp, Instagram (mensagens),
Discord, X/Twitter, Telegram, LinkedIn etc. Tamanho fixo: **1200 × 630**, PNG, bem abaixo de
300 KB (o WhatsApp descarta imagens maiores).

`og.html` é o modelo. `?v=home` gera a do portfólio e `?v=orcamento` a da página de orçamento. Os
textos ficam no objeto `variants`, no fim do arquivo. Usa as fontes reais do site (JetBrains Mono e
Inter, de `node_modules`) e o corvo de `public/icon-512.png`.

**Tudo fica no quadrado central de 630 × 630** (x de 285 a 915): o bio.site e outros sites cortam a
prévia em quadrado, e assim a miniatura aparece completa em vez de um pedaço do texto.

## Como gerar de novo

1. Na raiz do projeto: `python3 -m http.server 8765` (as fontes só carregam por http, não por
   arquivo aberto direto).
2. No Chrome (ou `chrome-headless-shell --window-size=1200,630 --screenshot=...`), abra `http://127.0.0.1:8765/brand/og/og.html?v=home`, deixe a janela com 1200 × 630
   (DevTools → Ctrl+Shift+M → "Responsive" → 1200 × 630) e capture a tela: DevTools → Ctrl+Shift+P →
   "Capture screenshot".
3. Reduza as cores para o arquivo ficar pequeno, por exemplo com Pillow:
   `Image.open(x).convert("RGB").quantize(colors=64, dither=Image.Dither.NONE).save("public/og-image.png", optimize=True)`
4. Repita com `?v=orcamento` para `public/og-orcamento.png`.

Depois de trocar uma imagem, mude o nome do arquivo (ou acrescente `?v=2` no `og:image`), porque
WhatsApp, Discord e Meta guardam a prévia antiga em cache.
