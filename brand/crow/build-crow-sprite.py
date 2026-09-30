"""Extrai os quadros do corvo (crow.png) e monta o sprite do logo animado.

Quadros do sprite (índice: origem na folha):
  0 parado olhando p/ direita (0)   1 parado p/ esquerda (1)   2 parado de frente (2)
  3 agachado (4)                    4..12 voo (5..13)          13 pouso agachado (14)
Poses no chão (0,1,2,3,13) são alinhadas pelo chão e pelo centro; o voo (4..12) é alinhado pelo
olho vermelho, a partir do olho do quadro agachado, para a cabeça não tremer ao bater as asas.

Uso: python build-crow-sprite.py <crow.png> <saida.png> <preview.png> [largura_celula_px]
Requer: numpy, scipy, Pillow.
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

SRC, OUT, PREVIEW = sys.argv[1:4]
TARGET_W = int(sys.argv[4]) if len(sys.argv) > 4 else 176
SHEET_ORDER = [0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
GROUND = {0, 1, 2, 3, 13}          # posições no SPRITE (não na folha)

img = Image.open(SRC).convert('RGBA')
arr = np.array(img)
mask = arr[..., 3] >= 128
lab, n = ndi.label(ndi.binary_dilation(mask, iterations=6))
objs = [(i + 1, s) for i, s in enumerate(ndi.find_objects(lab)) if (mask[s] & (lab[s] == i + 1)).sum() > 3000]
assert len(objs) == 16, f'esperava 16 quadros, achei {len(objs)}'
objs.sort(key=lambda o: (int(((o[1][0].start + o[1][0].stop) / 2) // 256), (o[1][1].start + o[1][1].stop) / 2))

crops = []
for label, sl in objs:
    sub = arr[sl].copy()
    keep = (lab[sl] == label) & mask[sl]
    sub[..., 3] = np.where(keep, 255, 0)
    red = keep & (sub[..., 0] > 150) & (sub[..., 1] < 90) & (sub[..., 2] < 90)
    ys, xs = np.nonzero(red)
    crops.append((Image.fromarray(sub, 'RGBA'), (xs.mean(), ys.mean()) if len(xs) else None))
frames = [crops[i] for i in SHEET_ORDER]

pos = [None] * len(frames)              # canto superior esquerdo de cada quadro (chão em y=0)
for k in GROUND:
    im, _ = frames[k]
    pos[k] = (-im.width / 2, -im.height)
eye_ref = (pos[3][0] + frames[3][1][0], pos[3][1] + frames[3][1][1])   # olho do agachado
for k in range(4, 13):
    im, e = frames[k]
    assert e is not None, f'quadro {k} sem olho'
    pos[k] = (eye_ref[0] - e[0], eye_ref[1] - e[1])

x0 = min(p[0] for p in pos); x1 = max(p[0] + f[0].width for p, f in zip(pos, frames))
y0 = min(p[1] for p in pos); y1 = max(p[1] + f[0].height for p, f in zip(pos, frames))
PAD = 6
cw, ch = int(np.ceil(x1 - x0)) + 2 * PAD, int(np.ceil(y1 - y0)) + 2 * PAD
scale = TARGET_W / cw
fw, fh = TARGET_W, int(round(ch * scale))
print(f'célula bruta {cw}x{ch} -> final {fw}x{fh} | chão em {(-y0 + PAD) / ch:.3f} da altura')
sheet = Image.new('RGBA', (fw * len(frames), fh), (0, 0, 0, 0))
for k, ((im, _), p) in enumerate(zip(frames, pos)):
    cell = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
    cell.alpha_composite(im, (int(round(p[0] - x0 + PAD)), int(round(p[1] - y0 + PAD))))
    sheet.paste(cell.resize((fw, fh), Image.LANCZOS), (k * fw, 0))
bg = Image.new('RGBA', sheet.size, (245, 245, 245, 255)); bg.alpha_composite(sheet); bg.convert('RGB').save(PREVIEW)
# paleta de 48 cores: ~8x menor, sem diferença visível numa arte escura e pequena
sheet.quantize(colors=48, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE).save(OUT, optimize=True)
print('sprite:', OUT, f'{len(frames)} quadros de {fw}x{fh}')
