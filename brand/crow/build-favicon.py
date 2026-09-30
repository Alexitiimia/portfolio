"""Gera favicon-32.png, apple-touch-icon.png e favicon.ico a partir de crowfavicon.png.

Fundo transparente. O corvo ocupa o quadrado inteiro (limitado pela largura da cabeça, sem cortar
nada) e ganha um contorno claro fino, para não sumir em abas escuras.
Uso: python build-favicon.py <crowfavicon.png> <pasta_de_saida>   Requer: numpy, scipy, Pillow.
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

SRC, OUT_DIR = sys.argv[1], Path(sys.argv[2])
OUTLINE = (232, 232, 232)
im = Image.open(SRC).convert('RGBA')
ys, xs = np.nonzero(np.array(im)[..., 3] >= 128)
head = im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
w, h = head.size


def icon(size, margin_px, outline_px):
    scale = (size - 2 * margin_px) / max(w, h)
    k = 8                                             # trabalha em 8x para o contorno ficar liso
    tw, th = round(w * scale * k), round(h * scale * k)
    resized = np.array(head.resize((tw, th), Image.LANCZOS))
    core = resized[..., 3] >= 128
    ring = ndi.binary_dilation(core, structure=np.ones((3, 3)), iterations=max(1, round(outline_px * k)))
    canvas = np.zeros((size * k, size * k, 4), np.uint8)
    ox, oy = (size * k - tw) // 2, (size * k - th) // 2
    canvas[oy:oy + th, ox:ox + tw][ring] = (*OUTLINE, 235)
    layer = Image.fromarray(canvas)
    crow = resized.copy(); crow[..., 3] = np.where(core, 255, 0)
    layer.alpha_composite(Image.fromarray(crow), (ox, oy))
    return layer.resize((size, size), Image.LANCZOS)


icon(32, 1, 0.8).save(OUT_DIR / 'favicon-32.png', optimize=True)
icon(180, 6, 3).save(OUT_DIR / 'apple-touch-icon.png', optimize=True)
icon(256, 8, 4).save(OUT_DIR / 'favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
print('favicons gerados em', OUT_DIR)
