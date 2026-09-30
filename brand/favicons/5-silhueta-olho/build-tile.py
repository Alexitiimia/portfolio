#!/usr/bin/env python3
"""Gera os ícones do site: corvo preto sobre um quadrado claro de cantos arredondados.

Fonte do desenho: corvo-preto.svg (16x16, pixel art). Cada retângulo dele é lido e redesenhado
dentro de um quadrado de 20x20 (margem de 2). Saída em ../../../public/:
  favicon.svg           vetor (aba do navegador)
  favicon.ico           16/32/48 px, com cantos arredondados transparentes
  apple-touch-icon.png  180 px, quadrado inteiro (o iOS aplica os cantos sozinho)
  icon-192.png / icon-512.png  Android, com cantos arredondados transparentes

Uso (na raiz do projeto):  python3 brand/favicons/5-silhueta-olho/build-tile.py
Precisa do Pillow (pip install pillow). Para mudar as cores ou o arredondamento, edite as
constantes abaixo e rode de novo.
"""
import re
import struct
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
PUBLIC = HERE.parents[2] / "public"

TILE = "#dedede"  # fundo: cinza claro, que aparece tanto em aba escura quanto em aba clara
INK = "#0a0a0a"  # corvo
EYE = "#e3262b"  # olho
GRID = 20  # lado do quadrado, em unidades do desenho
MARGIN = 2  # o corvo (16x16) fica centralizado
RADIUS = 4.5  # cantos arredondados: 22,5% do lado, como nos favicons dos outros sites
SUPERSAMPLE = 8  # desenha 8x maior e reduz, para bordas suaves sem borrar o pixel art


def read_crow() -> list[tuple[int, int, int, int, str]]:
    """Retângulos (x, y, largura, altura, cor) do corvo-preto.svg."""
    svg = (HERE / "corvo-preto.svg").read_text(encoding="utf-8")
    colors = {"k": INK, "e": EYE}
    rects = []
    for cls, x, y, w, h in re.findall(
        r'<rect class="(\w)" x="(\d+)" y="(\d+)" width="(\d+)" height="(\d+)"/>', svg
    ):
        rects.append((int(x), int(y), int(w), int(h), colors[cls]))
    if not rects:
        raise SystemExit("Nenhum retângulo encontrado em corvo-preto.svg")
    return rects


def write_svg(rects) -> None:
    body = "".join(
        f'<rect x="{x + MARGIN}" y="{y + MARGIN}" width="{w}" height="{h}" fill="{color}"/>'
        for x, y, w, h, color in rects
    )
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {GRID} {GRID}" '
        f'shape-rendering="crispEdges">'
        # O fundo é suave (geometricPrecision); só o pixel art usa bordas retas (crispEdges).
        f'<rect width="{GRID}" height="{GRID}" rx="{RADIUS}" fill="{TILE}" '
        f'shape-rendering="geometricPrecision"/>{body}</svg>\n'
    )
    (PUBLIC / "favicon.svg").write_text(svg, encoding="utf-8")


def render(size: int, rounded: bool, rects) -> Image.Image:
    big = size * SUPERSAMPLE
    unit = big / GRID
    image = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    if rounded:
        draw.rounded_rectangle((0, 0, big - 1, big - 1), radius=RADIUS * unit, fill=TILE)
    else:
        draw.rectangle((0, 0, big - 1, big - 1), fill=TILE)
    for x, y, w, h, color in rects:
        left, top = round((x + MARGIN) * unit), round((y + MARGIN) * unit)
        right, bottom = round((x + MARGIN + w) * unit), round((y + MARGIN + h) * unit)
        draw.rectangle((left, top, right - 1, bottom - 1), fill=color)
    return image.resize((size, size), Image.Resampling.BOX)


def png_bytes(image: Image.Image) -> bytes:
    buffer = BytesIO()
    image.save(buffer, format="PNG", optimize=True)
    return buffer.getvalue()


def write_ico(rects) -> None:
    frames = [(size, png_bytes(render(size, True, rects))) for size in (16, 32, 48)]
    header = struct.pack("<HHH", 0, 1, len(frames))
    offset = 6 + 16 * len(frames)
    entries, data = b"", b""
    for size, png in frames:
        entries += struct.pack("<BBBBHHII", size, size, 0, 0, 1, 32, len(png), offset + len(data))
        data += png
    (PUBLIC / "favicon.ico").write_bytes(header + entries + data)


def main() -> None:
    rects = read_crow()
    write_svg(rects)
    write_ico(rects)
    # iOS descarta transparência (vira preto): o ícone da tela inicial é o quadrado inteiro.
    render(180, False, rects).convert("RGB").save(PUBLIC / "apple-touch-icon.png", optimize=True)
    for size in (192, 512):
        render(size, True, rects).save(PUBLIC / f"icon-{size}.png", optimize=True)
    print("ok:", ", ".join(sorted(p.name for p in PUBLIC.glob("*icon*")) + ["favicon.ico"]))


if __name__ == "__main__":
    main()
