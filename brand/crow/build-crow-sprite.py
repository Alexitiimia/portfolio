"""Extrai os quadros do corvo (crow.png) e monta um sprite alinhado pelo olho.

Uso: python build_crow.py <crow.png> <saida.png> <preview.png> [largura_celula_px]
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

SRC, OUT, PREVIEW = sys.argv[1:4]
TARGET_W = int(sys.argv[4]) if len(sys.argv) > 4 else 156      # largura final de cada célula
FRAMES = [0, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]                  # 0 = parado; resto = voo

img = Image.open(SRC).convert('RGBA')
arr = np.array(img)
mask = arr[..., 3] >= 128
# separa cada corvo por componentes conectados (o brilho de fundo fica de fora)
grown = ndi.binary_dilation(mask, iterations=6)
lab, n = ndi.label(grown)
objs = [(i + 1, s) for i, s in enumerate(ndi.find_objects(lab)) if (mask[s] & (lab[s] == i + 1)).sum() > 3000]
assert len(objs) == 16, f'esperava 16 quadros, achei {len(objs)}'
objs.sort(key=lambda o: (round((o[1][0].start + o[1][0].stop) / 2 / 256 - .5), o[1][1].start))
objs.sort(key=lambda o: (int(((o[1][0].start + o[1][0].stop) / 2) // 256), (o[1][1].start + o[1][1].stop) / 2))

crops = []
for idx, (label, sl) in enumerate(objs):
    own = mask & (ndi.binary_dilation(lab == label, iterations=0) )
    sub = arr[sl].copy()
    keep = (lab[sl] == label) & mask[sl]
    sub[..., 3] = np.where(keep, 255, 0)
    red = keep & (sub[..., 0] > 150) & (sub[..., 1] < 90) & (sub[..., 2] < 90)
    ys, xs = np.nonzero(red)
    eye = (xs.mean(), ys.mean()) if len(xs) else None
    crops.append((Image.fromarray(sub, 'RGBA'), eye))

sel = [crops[i] for i in FRAMES]
assert all(e is not None for _, e in sel), 'quadro sem olho'
# extensões relativas ao olho
L = max(e[0] for _, e in sel); R = max(im.width - e[0] for im, e in sel)
T = max(e[1] for _, e in sel); B = max(im.height - e[1] for im, e in sel)
PAD = 6
cw, ch = int(np.ceil(L + R)) + 2 * PAD, int(np.ceil(T + B)) + 2 * PAD
print('célula bruta', cw, 'x', ch)
scale = TARGET_W / cw
fw, fh = TARGET_W, int(round(ch * scale))
sheet = Image.new('RGBA', (fw * len(sel), fh), (0, 0, 0, 0))
for k, (im, e) in enumerate(sel):
    cell = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
    cell.alpha_composite(im, (int(round(PAD + L - e[0])), int(round(PAD + T - e[1]))))
    sheet.paste(cell.resize((fw, fh), Image.LANCZOS), (k * fw, 0))
# paleta de 48 cores: ~8x menor, sem diferença visível numa arte escura e pequena
sheet = sheet.quantize(colors=48, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE)
sheet.save(OUT, optimize=True)
sheet = sheet.convert('RGBA')
print('sprite', OUT, sheet.size, 'célula', fw, 'x', fh, 'quadros', len(sel))
bg = Image.new('RGBA', sheet.size, (245, 245, 245, 255)); bg.alpha_composite(sheet); bg.convert('RGB').save(PREVIEW)
