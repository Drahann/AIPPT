#!/usr/bin/env python3
"""bake_deco — bake 创赛 functional decorations onto the base plate for one slide.

Architecture-faithful: the plate carries chrome + DECORATION (baked), render_page draws
only text on top. Decorations are the '创赛 backings': glassy content panels, cyan glow
frames, section-header flanks/underlines, number backplates, and real assets_lib markers
(bullet_marker / connector / icon_pedestal) pulled by function+family.

Usage: python bake_deco.py <base_plate.png> <deco_spec.json> <out_plate.png>
"""
import sys, json, math, os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

base = Image.open(sys.argv[1]).convert('RGBA')
spec = json.load(open(sys.argv[2], encoding='utf-8'))
out = sys.argv[3]
W, H = base.size
ASSETS = r'W:/ppt/study/corpus/liangyao/assets'

over = Image.new('RGBA', (W, H), (0, 0, 0, 0))
d = ImageDraw.Draw(over, 'RGBA')


def rrect(box, radius, fill=None, outline=None, width=2):
    x, y, w, h = box
    d.rounded_rectangle([x, y, x + w, y + h], radius=radius, fill=fill, outline=outline, width=width)


def glow_rrect(box, radius, glow_color, fill, line_color, line_w=2, glow_rad=12):
    # soft outer glow then crisp frame
    gl = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(gl, 'RGBA')
    x, y, w, h = box
    gd.rounded_rectangle([x, y, x + w, y + h], radius=radius, outline=glow_color, width=line_w + 4)
    gl = gl.filter(ImageFilter.GaussianBlur(glow_rad))
    over.alpha_composite(gl)
    rrect(box, radius, fill=fill)
    rrect(box, radius, outline=line_color, width=line_w)


def font(sz, bold=False):
    cands = ([r'C:/Windows/Fonts/msyhbd.ttc'] if bold else []) + [r'C:/Windows/Fonts/msyh.ttc']
    for p in cands:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, sz)
            except Exception:
                pass
    return ImageFont.load_default()


for item in spec.get('items', []):
    t = item['type']
    if t == 'panel':
        # glassy translucent content panel with cyan glow frame (the text-backing)
        glow_rrect(item['box'], item.get('radius', 12),
                   glow_color=tuple(item.get('glow', [3, 252, 254, 60])),
                   fill=tuple(item.get('fill', [16, 46, 92, 120])),
                   line_color=tuple(item.get('line', [3, 252, 254, 150])),
                   line_w=item.get('line_w', 2), glow_rad=item.get('glow_rad', 14))
    elif t == 'header_flank':
        # section header: left accent bar + double-chevron flank (title_flank motif)
        x, y = item['xy']
        col = tuple(item.get('color', [7, 249, 250, 255]))
        # left tall accent bar
        d.rectangle([x, y, x + 6, y + item.get('h', 30)], fill=col)
        # double chevron to the left of bar
        cx = x - 14
        for k in range(2):
            ox = cx - k * 9
            d.line([(ox, y + 4), (ox - 8, y + item.get('h', 30) / 2), (ox, y + item.get('h', 30) - 4)],
                   fill=(col[0], col[1], col[2], 200 - k * 70), width=3)
    elif t == 'underline':
        x, y, w = item['x'], item['y'], item['w']
        col = tuple(item.get('color', [52, 213, 241, 220]))
        # gradient-ish underline: bright left fading right
        steps = 60
        for i in range(steps):
            a = int(col[3] * (1 - i / steps))
            xx = x + (w * i / steps)
            d.line([(xx, y), (xx + w / steps + 1, y)], fill=(col[0], col[1], col[2], a), width=2)
    elif t == 'number_backplate':
        # big translucent number behind a stat (number_backplate motif)
        x, y = item['xy']
        f = font(item.get('size', 120), bold=True)
        d.text((x, y), str(item['text']), font=f, fill=tuple(item.get('color', [52, 213, 241, 40])))
    elif t == 'bullet':
        # real assets_lib bullet_marker icon, screen-blended (drops near-black bg)
        ic = Image.open(os.path.join(ASSETS, item['asset'])).convert('RGBA')
        s = item.get('size', 26)
        ic = ic.resize((s, s))
        over.alpha_composite(ic, tuple(item['xy']))
    elif t == 'image':
        im = Image.open(os.path.join(ASSETS, item['asset'])).convert('RGBA')
        x, y, w, h = item['box']
        im = im.resize((int(w), int(h)))
        over.alpha_composite(im, (int(x), int(y)))
    elif t == 'trapezoid':
        # stage band: trapezoid (wider bottom) cyan-edged translucent — liangyao 梯形 motif
        x, y, w, h = item['box']
        inset = item.get('inset', 28)
        pts = [(x + inset, y), (x + w - inset, y), (x + w, y + h), (x, y + h)]
        fill = tuple(item.get('fill', [11, 223, 246, 60]))
        d.polygon(pts, fill=fill)
        d.line(pts + [pts[0]], fill=tuple(item.get('line', [3, 252, 254, 180])), width=2)
    elif t == 'arrow_up':
        x, y, w, h = item['box']
        col = tuple(item.get('color', [255, 255, 255, 230]))
        d.polygon([(x + w / 2, y), (x + w, y + h * 0.55), (x + w * 0.66, y + h * 0.55),
                   (x + w * 0.66, y + h), (x + w * 0.34, y + h), (x + w * 0.34, y + h * 0.55),
                   (x, y + h * 0.55)], fill=col)
    elif t == 'connector':
        # arrow between stages (real connector asset, screen blend)
        im = Image.open(os.path.join(ASSETS, item['asset'])).convert('RGBA')
        x, y, w, h = item['box']
        im = im.resize((int(w), int(h)))
        over.alpha_composite(im, (int(x), int(y)))
    elif t == 'circle':
        x, y, r = item['x'], item['y'], item['r']
        d.ellipse([x - r, y - r, x + r, y + r], fill=item.get('fill'),
                  outline=tuple(item.get('line', [48, 192, 180, 255])), width=item.get('w', 3))

res = Image.alpha_composite(base, over).convert('RGB')
res.save(out)
print('baked plate ->', out)
