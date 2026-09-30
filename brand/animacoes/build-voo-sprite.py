"""Limpa e alinha a folha do corvo (corvoanimation.png) em um sprite com células iguais.

Passos: 1) binariza o alfa e descarta ruído; 2) acha os 8 quadros; 3) reconstrói cada um na sua
grade real de pixel art (passo estimado por pureza das células); 4) redesenha com blocos nítidos,
numa escala única; 5) alinha (chão nas poses paradas, olho nas poses de voo); 6) grava o sprite.
Uso: python build_sprite.py <folha.png> <saida-sprite.png> [preview.png]
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

SRC, OUT = sys.argv[1], sys.argv[2]
PREVIEW = sys.argv[3] if len(sys.argv) > 3 else None
SCALE = 0.7      # fator da folha original para o sprite final
PAD = 6

alpha = np.array(Image.open(SRC).convert('RGBA'))[..., 3] >= 128
lab, n = ndi.label(alpha)
areas = ndi.sum(alpha, lab, range(1, n + 1))
clean = np.isin(lab, [i + 1 for i, a in enumerate(areas) if a > 150])
lab, n = ndi.label(clean)
boxes = sorted(((s[0].start, s[0].stop, s[1].start, s[1].stop) for s in ndi.find_objects(lab)),
               key=lambda b: (round(b[0] / 450), b[2]))
assert len(boxes) == 8, f'esperava 8 quadros, achei {len(boxes)}'

def purity(sub, p):
    h, w = sub.shape
    nx, ny = max(1, round(w / p)), max(1, round(h / p))
    xs, ys = np.linspace(0, w, nx + 1), np.linspace(0, h, ny + 1)
    s = 0.0
    for j in range(ny):
        for i in range(nx):
            c = sub[int(ys[j]):int(ys[j + 1]), int(xs[i]):int(xs[i + 1])]
            if c.size: s += abs(c.mean() - .5) * 2
    return s / (nx * ny)

frames = []
for (y0, y1, x0, x1) in boxes:
    sub = clean[y0:y1, x0:x1]
    p = max((purity(sub, q), q) for q in np.arange(9, 16, 0.25))[1]
    nx, ny = round(sub.shape[1] / p), round(sub.shape[0] / p)
    xs, ys = np.linspace(0, sub.shape[1], nx + 1), np.linspace(0, sub.shape[0], ny + 1)
    grid = np.zeros((ny, nx), bool)
    for j in range(ny):
        for i in range(nx):
            grid[j, i] = sub[int(ys[j]):int(ys[j + 1]), int(xs[i]):int(xs[i + 1])].mean() > .5
    # olho = menor buraco interno
    holes, hn = ndi.label(~grid)
    eye = None
    for k in range(1, hn + 1):
        yy, xx = np.nonzero(holes == k)
        if yy.min() == 0 or xx.min() == 0 or yy.max() == ny - 1 or xx.max() == nx - 1: continue
        if eye is None or len(yy) < eye[0]: eye = (len(yy), xx.mean() + .5, yy.mean() + .5)
    frames.append(dict(grid=grid, px=(sub.shape[1] / nx) * SCALE, py=(sub.shape[0] / ny) * SCALE,
                       w=sub.shape[1] * SCALE, h=sub.shape[0] * SCALE, eye=eye))

for f in frames:
    f['eye_xy'] = (f['eye'][1] * f['px'], f['eye'][2] * f['py']) if f['eye'] else None

# posições (canto superior esquerdo do quadro) no espaço "mundo" antes de definir a célula
pos = [None] * 8
ground_y = 0.0
for i in (0, 1, 2, 3, 4):              # poses paradas/crouch: chão comum e centro comum
    pos[i] = [-frames[i]['w'] / 2, ground_y - frames[i]['h']]
for i in (5, 6, 7):                    # voo: mantém o olho do quadro anterior
    prev = frames[i - 1]; cur = frames[i]
    ex, ey = pos[i - 1][0] + prev['eye_xy'][0], pos[i - 1][1] + prev['eye_xy'][1]
    pos[i] = [ex - cur['eye_xy'][0], ey - cur['eye_xy'][1]]

minx = min(p[0] for p in pos); maxx = max(p[0] + f['w'] for p, f in zip(pos, frames))
miny = min(p[1] for p in pos); maxy = max(p[1] + f['h'] for p, f in zip(pos, frames))
# centraliza horizontalmente em torno do centro dos quadros parados
half = max(-minx, maxx)
CELLW = int(np.ceil(2 * half)) + 2 * PAD
CELLW += CELLW % 2
CELLH = int(np.ceil(maxy - miny)) + 2 * PAD
print('célula:', CELLW, 'x', CELLH, '| extensão x', round(minx), round(maxx), '| y', round(miny), round(maxy))
ox = CELLW / 2
oy = CELLH - PAD - maxy                 # a linha do chão (y=0 no mundo) cai perto do fim da célula

sheet = Image.new('RGBA', (CELLW * 8, CELLH), (0, 0, 0, 0))
for k, (f, p) in enumerate(zip(frames, pos)):
    cell = np.zeros((CELLH, CELLW), bool)
    ny, nx = f['grid'].shape
    for j in range(ny):
        for i in range(nx):
            if not f['grid'][j, i]: continue
            x0 = int(round(ox + p[0] + i * f['px'])); x1 = int(round(ox + p[0] + (i + 1) * f['px']))
            y0 = int(round(oy + p[1] + j * f['py'])); y1 = int(round(oy + p[1] + (j + 1) * f['py']))
            cell[y0:y1, x0:x1] = True
    rgba = np.zeros((CELLH, CELLW, 4), np.uint8); rgba[cell] = (255, 255, 255, 255)
    sheet.paste(Image.fromarray(rgba), (k * CELLW, 0))
sheet.save(OUT, optimize=True)
print('sprite:', OUT, sheet.size)

if PREVIEW:
    bg = Image.new('RGBA', sheet.size, (70, 70, 70, 255)); bg.alpha_composite(sheet)
    from PIL import ImageDraw
    d = ImageDraw.Draw(bg)
    for k in range(9): d.line([(k * CELLW, 0), (k * CELLW, CELLH)], fill=(255, 0, 0, 255))
    d.line([(0, int(oy)), (sheet.width, int(oy))], fill=(0, 200, 255, 255))   # linha do chão
    bg.save(PREVIEW)
