#!/usr/bin/env python3
"""gen5_lib — shared skin + component helpers for the 5 gen5 pages.

SKIN LOCKED from deck med_blue_white_2e33d129 (深蓝深邃基因安全):
  royal-blue #0755BF + gold accents + near-black #0E0023, deep-blue medical lab
  backdrop with a built-in HUD frame (clean_base scene). White text, gold emphasis.

Author records (text shapes) + bindings (decoration extras) with these helpers, then:
  render_page.py --record R --binding B --deck DECK --plate base.png --out svg
  svg_to_png.py svg png
Text shapes draw ON TOP of extras, so panels/charts/decos go in extras (behind), text on top.
"""
import json, os

# ---------------- locked skin palette ----------------
NEAR_BLACK = '#0E0023'
BLUE       = '#0755BF'      # primary royal blue
BLUE_BR    = '#2C7BE5'      # brighter blue
BLUE_LT    = '#5B9BFF'
CYAN       = '#16C7F0'
TEAL       = '#0DC59F'
GOLD       = '#F2D290'
GOLD_DK    = '#E0B25C'
WHITE      = '#FFFFFF'
DIM        = '#C3D6F2'      # dim blue-white body text
DIM2       = '#8FB0DA'
GOLD_STOPS = ['#FBF1C6', '#F2D290', '#E2B25E']
BLUE_STOPS = ['#3D8BF0', '#0B57C8']
PANEL      = 'rgba(8,22,55,0.70)'      # semi-transparent deep-blue content panel
PANEL_SOFT = 'rgba(10,28,68,0.55)'
PANEL_STK  = 'rgba(120,180,255,0.42)'
GOLD_STK   = 'rgba(242,210,144,0.85)'
SCRIM      = 'rgba(6,14,40,0.42)'      # full-bleed scrim to calm the busy lab scene

# pie / category colors (cohesive blue+gold+teal set)
CAT = [GOLD, BLUE_BR, CYAN, TEAL, '#6E8AC0', '#9B7BE0']

# font aliases (resolved by render_page FONTMAP -> real installed families)
KAI   = 'DISP_KAI'      # gold calligraphic page title (演示流云楷 -> 华文行楷)
DISP  = 'DISP_TITLE'    # heavy sans for card/section titles & names
NUM   = 'DISP_NUM'      # heavy numerals
BODY  = 'BODY'
BODYB = 'BODY_B'
BODYM = 'BODY_M'

CANVAS = [1280, 720]


class Page:
    def __init__(self):
        self.shapes = []
        self.extras = []
        self._n = 0

    def _id(self, pfx='s'):
        self._n += 1
        return f'{pfx}{self._n}'

    # ---- text (drawn on top) ----
    def T(self, box, text, size, font=BODY, color=None, grad=None, align='LEFT', bold=False, id=None):
        sh = {'id': id or self._id('t'), 'kind': 'text', 'box': [float(v) for v in box],
              'font': font, 'font_px': size, 'align': align, 'text': text}
        if grad:
            sh['grad'] = grad
        else:
            sh['color'] = color or WHITE
        if bold:
            sh['bold'] = True
        self.shapes.append(sh)
        return sh

    # ---- decoration extras (drawn behind text, in order) ----
    def panel(self, box, fill=PANEL, stroke=PANEL_STK, sw=1.4, rx=14, opacity=None, grad=None, grad_vertical=True):
        e = {'type': 'rect', 'box': [float(v) for v in box], 'rx': rx}
        if grad:
            e['grad'] = grad; e['grad_vertical'] = grad_vertical
        else:
            e['fill'] = fill
        if stroke:
            e['stroke'] = stroke; e['sw'] = sw
        if opacity is not None:
            e['opacity'] = opacity
        self.extras.append(e); return e

    def pill(self, box, fill=None, grad=None, stroke=None, sw=1.2, opacity=None, rx=999):
        e = {'type': 'pill', 'box': [float(v) for v in box], 'rx': rx}
        if grad:
            e['grad'] = grad
        else:
            e['fill'] = fill or BLUE_BR
        if stroke:
            e['stroke'] = stroke; e['sw'] = sw
        if opacity is not None:
            e['opacity'] = opacity
        self.extras.append(e); return e

    def line(self, p, color=GOLD, w=2):
        self.extras.append({'type': 'line', 'p': [float(v) for v in p], 'color': color, 'w': w}); return

    def rect(self, box, **kw):
        return self.panel(box, **kw)

    def img(self, box, href, blend=None, preserve='none', opacity=None, flipH=False, function=None):
        e = {'type': 'image', 'box': [float(v) for v in box], 'href': href, 'preserve': preserve}
        if blend:
            e['blend'] = blend
        if opacity is not None:
            e['opacity'] = opacity
        if flipH:
            e['flipH'] = True
        if function:                       # tag deco function so deco_check can verify card_frame/pill/... by function
            e['function'] = function
        self.extras.append(e); return e

    def pie(self, cx, cy, r, data, inner=0.0, colors=None, label_font=BODYM, value_font=DISP,
            label_px=15, label_color=WHITE, center=None, center_px=20):
        e = {'type': 'pie', 'cx': cx, 'cy': cy, 'r': r, 'inner': inner, 'data': data,
             'colors': colors or CAT, 'label_font': label_font, 'value_font': value_font,
             'label_px': label_px, 'label_color': label_color}
        if center:
            e['center'] = center; e['center_px'] = center_px
        self.extras.append(e); return e

    def scrim(self, box=(0, 0, 1280, 720), fill=SCRIM):
        self.extras.append({'type': 'rect', 'box': list(box), 'rx': 0, 'fill': fill}); return

    # ---- write & nothing else ----
    def dump(self, out_dir, name='page'):
        os.makedirs(out_dir, exist_ok=True)
        rec = {'canvas': CANVAS, 'shapes': self.shapes}
        binding = {'slots': {}, 'extras': self.extras, 'drop_unbound_placeholders': False}
        rp = os.path.join(out_dir, name + '.record.json')
        bp = os.path.join(out_dir, name + '.binding.json')
        json.dump(rec, open(rp, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        json.dump(binding, open(bp, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        return rp, bp


# ---- convenience: a gold page-title block with chevron flanks (vector) + optional flank img ----
def page_title(pg, text, x=70, y=40, big=52, sub=None, sub_text=None, accent=GOLD):
    """gold calligraphic title with a vector double-chevron flank on the left + underline."""
    # left double chevron (gold)
    cx = x
    for k in range(2):
        ox = cx + k * 13
        pg.extras.append({'type': 'line', 'p': [ox, y + 12, ox + 12, y + big * 0.5], 'color': accent, 'w': 4})
        pg.extras.append({'type': 'line', 'p': [ox, y + big - 6, ox + 12, y + big * 0.5], 'color': accent, 'w': 4})
    tx = x + 44
    pg.T([tx, y - 4, 760, big + 12], text, big, font=KAI, grad=GOLD_STOPS, align='LEFT')
    # underline rule
    pg.extras.append({'type': 'line', 'p': [tx + 2, y + big + 8, tx + 2 + min(620, len(text) * big * 0.62), y + big + 8],
                      'color': 'rgba(242,210,144,0.6)', 'w': 2})
    if sub_text:
        pg.T([tx + 4, y + big + 14, 820, 26], sub_text, 16, font=BODYM, color=DIM, align='LEFT')


# ============== vector decoration helpers (clean, aligned, text-free) ==============

def corner_brackets(pg, box, color=GOLD, size=24, w=3, inset=4):
    """4 L-shaped HUD corner brackets around a panel box (co-registered to the box)."""
    x, y, bw, bh = box
    x0, y0, x1, y1 = x + inset, y + inset, x + bw - inset, y + bh - inset
    L = [  # (corner) two segments each
        [(x0, y0 + size), (x0, y0), (x0 + size, y0)],
        [(x1 - size, y0), (x1, y0), (x1, y0 + size)],
        [(x0, y1 - size), (x0, y1), (x0 + size, y1)],
        [(x1 - size, y1), (x1, y1), (x1, y1 - size)],
    ]
    for seg in L:
        for i in range(len(seg) - 1):
            pg.extras.append({'type': 'line', 'p': [seg[i][0], seg[i][1], seg[i + 1][0], seg[i + 1][1]],
                              'color': color, 'w': w})


def num_badge(pg, cx, cy, r, color=GOLD, ring2=None):
    """clean vector glowing backplate for a big number: soft disc + 2 rings + tick ring."""
    ring2 = ring2 or 'rgba(120,180,255,0.55)'
    # soft filled disc (glow)
    pg.extras.append({'type': 'rect', 'box': [cx - r, cy - r, 2 * r, 2 * r], 'rx': r,
                      'fill': 'rgba(20,55,120,0.45)', 'stroke': color, 'sw': 2})
    # inner ring
    ir = r * 0.74
    pg.extras.append({'type': 'rect', 'box': [cx - ir, cy - ir, 2 * ir, 2 * ir], 'rx': ir,
                      'fill': 'none', 'stroke': ring2, 'sw': 1.4})
    # tick marks around (12)
    import math
    for k in range(12):
        a = k * math.pi / 6
        x0 = cx + (r + 3) * math.cos(a); y0 = cy + (r + 3) * math.sin(a)
        x1 = cx + (r + 11) * math.cos(a); y1 = cy + (r + 11) * math.sin(a)
        pg.extras.append({'type': 'line', 'p': [x0, y0, x1, y1], 'color': color, 'w': 1.6})


def node_divider(pg, x, y, w, color=GOLD, diamond=True):
    pg.extras.append({'type': 'line', 'p': [x, y, x + w, y], 'color': 'rgba(242,210,144,0.55)', 'w': 1.6})
    if diamond:
        s = 5
        cx = x + w / 2
        pg.extras.append({'type': 'rect', 'box': [cx - s, y - s, 2 * s, 2 * s], 'rx': 1,
                          'fill': color, 'opacity': 0.95})


def tag_pill(pg, x, y, w, h, text, size=14, font=BODYM, fill='rgba(20,70,150,0.7)',
             stroke=GOLD_STK, txt_color=GOLD, align='CENTER'):
    """label pill (extra) + its text (shape) co-registered in the same box."""
    pg.pill([x, y, w, h], fill=fill, stroke=stroke, sw=1.1)
    ty = y + (h - size) / 2 - 1
    tx = x + w / 2 if align == 'CENTER' else x + 12
    pg.T([x, ty, w, size + 6], text, size, font=font, color=txt_color, align=align)


def icon_disc(pg, cx, cy, r, color=GOLD, fill='rgba(15,45,105,0.78)', w=2):
    pg.extras.append({'type': 'rect', 'box': [cx - r, cy - r, 2 * r, 2 * r], 'rx': r,
                      'fill': fill, 'stroke': color, 'sw': w})


def arrow(pg, x0, y0, x1, y1, color=GOLD, w=3, head=9):
    """straight flow connector with a triangular arrowhead at (x1,y1)."""
    import math
    pg.extras.append({'type': 'line', 'p': [x0, y0, x1, y1], 'color': color, 'w': w})
    a = math.atan2(y1 - y0, x1 - x0)
    for da in (math.radians(150), math.radians(-150)):
        hx = x1 + head * math.cos(a + da); hy = y1 + head * math.sin(a + da)
        pg.extras.append({'type': 'line', 'p': [x1, y1, hx, hy], 'color': color, 'w': w})


def big_number(pg, cx, top, value, unit='', label='', color_grad=GOLD_STOPS,
               num_px=64, unit_px=22, label_px=17, label_color=None, badge_r=0):
    """a co-registered big metric: optional vector badge, big gold number, unit, caption."""
    if badge_r:
        num_badge(pg, cx, top + num_px * 0.42, badge_r)
    # number (center-anchored)
    pg.T([cx - 220, top, 440, num_px + 10], value + ('' if not unit else ''), num_px,
         font=NUM, grad=color_grad, align='CENTER')
    if unit:
        pass  # unit folded into value string by caller when needed
    if label:
        pg.T([cx - 220, top + num_px + 8, 440, label_px + 8], label, label_px,
             font=BODYM, color=label_color or DIM, align='CENTER')


def bar_chart(pg, area, bars, max_value=None, baseline_color='rgba(120,180,255,0.5)',
              value_px=20, label_px=15, value_grad=GOLD_STOPS, label_color=None, bar_w_frac=0.5,
              trend=False):
    """vertical bar chart from rect extras + value/label text shapes (real data, vector).
    area=[x,y,w,h] is the plot box; bars=[{label,value,color?,value_text?}]; bars sit on the
    bottom baseline of area and rise proportionally to value/max_value."""
    x, y, w, h = area
    n = len(bars)
    mv = max_value or max(b['value'] for b in bars) * 1.18
    slot = w / n
    bw = slot * bar_w_frac
    base_y = y + h
    pg.extras.append({'type': 'line', 'p': [x, base_y, x + w, base_y], 'color': baseline_color, 'w': 1.6})
    pts = []
    for i, b in enumerate(bars):
        bx = x + i * slot + (slot - bw) / 2
        bh = max(4, h * (b['value'] / mv))
        col = b.get('color', BLUE_BR)
        # bar with subtle top cap
        pg.extras.append({'type': 'rect', 'box': [bx, base_y - bh, bw, bh], 'rx': 5,
                          'fill': col, 'opacity': 0.92})
        pg.extras.append({'type': 'rect', 'box': [bx, base_y - bh, bw, 5], 'rx': 2, 'fill': GOLD, 'opacity': 0.9})
        # value text above bar
        pg.T([bx - slot * 0.25, base_y - bh - value_px - 8, bw + slot * 0.5, value_px + 6],
             b.get('value_text', str(b['value'])), value_px, font=NUM, grad=value_grad, align='CENTER')
        # label below baseline
        pg.T([bx - slot * 0.25, base_y + 8, bw + slot * 0.5, label_px * 2 + 6],
             b['label'], label_px, font=BODYM, color=label_color or DIM, align='CENTER')
        pts.append((bx + bw / 2, base_y - bh))
    if trend and len(pts) > 1:
        for i in range(len(pts) - 1):
            pg.extras.append({'type': 'line', 'p': [pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]],
                              'color': GOLD, 'w': 2.2})
