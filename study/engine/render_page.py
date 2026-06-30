#!/usr/bin/env python3
"""render_page — the deterministic GUIDED renderer (ARCH §0.2 guided / §3 S4).

Draws fresh text onto a faithful chrome plate. It NEVER invents geometry: every
text element is placed at the REAL box / font / size / color / align parsed from the
template (the locked scaffold). The binding only swaps WHAT each slot says; the
renderer handles capacity auto-shrink, CJK wrapping, vertical tabs, and gradient fills.
Skin roles resolve through deck_record (resolve(page, skin)) when a slot asks for one.

Unbound template placeholders ("请输入…", "XXX", "小标题内容" …) are dropped; unbound
real text (nav labels) is kept verbatim = reuse-verbatim chrome.

Usage:
  python render_page.py --record R.json --binding B.json --deck D.json \
      --plate plate.png --out out.svg
"""
import argparse, json, html, re, os, math

ap = argparse.ArgumentParser()
ap.add_argument('--record', required=True)
ap.add_argument('--binding', required=True)
ap.add_argument('--deck', required=True)
ap.add_argument('--plate', required=True)
ap.add_argument('--out', required=True)
args = ap.parse_args()

PLATE_URL = 'file:///' + os.path.abspath(args.plate).replace('\\', '/')   # absolute -> loads in any context
BIND_DIR = os.path.dirname(os.path.abspath(args.binding))


def file_url(p):
    p = p if os.path.isabs(p) else os.path.join(BIND_DIR, p)
    return 'file:///' + os.path.abspath(p).replace('\\', '/')

REC = json.load(open(args.record, encoding='utf-8'))
BIND = json.load(open(args.binding, encoding='utf-8'))
DECK = json.load(open(args.deck, encoding='utf-8'))
SLOTS = BIND.get('slots', {})
DROP = BIND.get('drop_unbound_placeholders', True)

# real installed family -> CSS stack (Chrome on Windows matches by family name)
# NOTE: many CJK display fonts register their PRIMARY family under a LATIN name
# (e.g. 字体圈欣意冠黑体 -> "Fontquan-XinYiGuanHeiTi"); list both so Chrome matches.
FONTMAP = {
    '字体圈欣意冠黑体': "'字体圈欣意冠黑体','Fontquan-XinYiGuanHeiTi','Microsoft YaHei',sans-serif",
    'OPPOSans R': "'OPPOSans R','OPPOSans','OPPO Sans','Microsoft YaHei',sans-serif",
    'OPPOSans H': "'OPPOSans H','OPPOSans','OPPO Sans','Microsoft YaHei',sans-serif",
    'OPPOSans M': "'OPPOSans M','OPPOSans','OPPO Sans','Microsoft YaHei',sans-serif",
    'OPPOSans B': "'OPPOSans B','OPPOSans','OPPO Sans','Microsoft YaHei',sans-serif",
    '云峰飞云体': "'云峰飞云体','YunFeng FeiYunTi','Microsoft YaHei',sans-serif",
    '微软雅黑': "'Microsoft YaHei',sans-serif",
    # ---- 良药智纪 deck: 汉仪粗宋简/雅酷黑 not installed -> faithful in-category substitutes ----
    '汉仪粗宋简': "'汉仪粗宋简','方正粗宋_GBK','FZCuSong-B09','SimSun',serif",
    '汉仪雅酷黑简': "'汉仪雅酷黑简','阿里汉仪智能黑体','AliHYAiHei','Alimama ShuHeiTi Bold','Microsoft YaHei',sans-serif",
    '汉仪雅酷黑W': "'汉仪雅酷黑W','阿里汉仪智能黑体','AliHYAiHei','Alimama ShuHeiTi Bold','Microsoft YaHei',sans-serif",
    '潮字社曾玉波手书简': "'潮字社曾玉波手书简','REEJI-CHAO-ZengGB','Microsoft YaHei',sans-serif",
    # ---- gen5 substitutes: display fonts not installed -> best installed in-category ----
    '字体圈欣意冠黑体': "'字体圈欣意冠黑体','Fontquan-XinYiGuanHeiTi','Alibaba PuHuiTi H','Source Han Sans CN Heavy','Microsoft YaHei',sans-serif",
    '优设标题黑': "'优设标题黑','Alibaba PuHuiTi H','Source Han Sans CN Heavy','Microsoft YaHei',sans-serif",
    '演示流云楷': "'演示流云楷','华文行楷','STXingkai','Source Han Serif CN Heavy','KaiTi',serif",
    '思源黑体 CN Bold': "'Source Han Sans CN Bold','Source Han Sans CN','思源黑体 CN Bold','Microsoft YaHei',sans-serif",
    '思源黑体 CN Heavy': "'Source Han Sans CN Heavy','Source Han Sans CN','Microsoft YaHei',sans-serif",
    '思源黑体 CN Regular': "'Source Han Sans CN Regular','Source Han Sans CN','Microsoft YaHei',sans-serif",
    '思源黑体 CN W23': "'Source Han Sans CN Heavy','Source Han Sans CN','Microsoft YaHei',sans-serif",
    '梦源黑体 CN W23': "'Source Han Sans CN Heavy','Source Han Sans CN','Microsoft YaHei',sans-serif",
    '思源宋体 CN Heavy': "'Source Han Serif CN Heavy','Source Han Serif CN','SimSun',serif",
    '阿里妈妈数黑体': "'Alibaba PuHuiTi H','Source Han Sans CN Heavy','Microsoft YaHei',sans-serif",
    '阿里巴巴普惠体 R': "'Alibaba PuHuiTi R','Alibaba PuHuiTi 3.0 55 Regular','Microsoft YaHei',sans-serif",
    '阿里巴巴普惠体 B': "'Alibaba PuHuiTi B','Source Han Sans CN Bold','Microsoft YaHei',sans-serif",
    '等线': "'DengXian','Microsoft YaHei',sans-serif",
    # semantic display aliases I author with
    'DISP_TITLE': "'Alibaba PuHuiTi H','Source Han Sans CN Heavy','Microsoft YaHei',sans-serif",
    'DISP_KAI': "'华文行楷','STXingkai','Source Han Serif CN Heavy','KaiTi',serif",
    'DISP_NUM': "'Alibaba PuHuiTi H','OPPOSans B','Source Han Sans CN Heavy','Arial',sans-serif",
    'BODY': "'OPPOSans R','Source Han Sans CN Regular','Microsoft YaHei',sans-serif",
    'BODY_M': "'OPPOSans M','Source Han Sans CN Medium','Microsoft YaHei',sans-serif",
    'BODY_B': "'OPPOSans B','Source Han Sans CN Bold','Microsoft YaHei',sans-serif",
}
DEFFONT = "'Microsoft YaHei',sans-serif"
# PPT default text is tx1 (dark); unresolved-color runs here are nav/role/badges on
# light backgrounds, so a neutral dark gray is the safe fallback (never blind white).
DEFAULT_TEXT = '#595959'
PLACEHOLDER = re.compile(r'(请输入|请提炼|单击此处|点击输入|此处输入|XXX+|[Xx]{2,}|小标题内容|标题内容|关键词内容|关键词|脱敏标题|资料来源|CONTENT)')


def esc(s):
    return html.escape(str(s), quote=True)


def fam_css(name, role=None):
    if role and role in ('title_family', 'subtitle_family', 'body_family'):
        name = DECK['typography'].get(role, name)
    return FONTMAP.get(name, DEFFONT)


def resolve_color(sh, ov):
    """slot may request a fill_role -> deck skin; else use the parsed real color/grad."""
    role = ov.get('fill_role') if isinstance(ov, dict) else None
    if role:
        return DECK['skin'].get(role, sh.get('color', DEFAULT_TEXT)), None
    if 'grad' in sh:
        return None, sh['grad']
    return sh.get('color', DEFAULT_TEXT), None


def anchor(al):
    return {'CENTER': 'middle', 'RIGHT': 'end'}.get((al or '').upper(), 'start')


def wrap_cjk(text, maxchars):
    """greedy width-based wrap; respects explicit newlines."""
    out = []
    for seg in str(text).split('\n'):
        if not seg:
            out.append('')
            continue
        while len(seg) > maxchars:
            out.append(seg[:maxchars]); seg = seg[maxchars:]
        out.append(seg)
    return out


defs, body = [], []
gid = [0]


def grad_def(stops, vertical=True):
    gid[0] += 1
    name = f"g{gid[0]}"
    x2, y2 = (0, 1) if vertical else (1, 0)
    s = f'<linearGradient id="{name}" x1="0" y1="0" x2="{x2}" y2="{y2}">'
    n = len(stops)
    for i, c in enumerate(stops):
        off = 0 if n == 1 else int(100 * i / (n - 1))
        s += f'<stop offset="{off}%" stop-color="{c}"/>'
    s += '</linearGradient>'
    defs.append(s)
    return f"url(#{name})"


# ============================ EXTRAS (declarative draw primitives) ============================
# binding["extras"] = list of {type: image|pie|cards|line|text}. These are the deterministic
# "page-builder" assets the orchestrator declares: content-regen images, vector data charts,
# and count-adaptive card rows (the architecture's charts[]/image-decisions made concrete).
extras_svg = []
PALETTE = DECK.get('theme', {}).get('palette', {})


def draw_image(e):
    x, y, w, h = e['box']
    style = []
    if 'opacity' in e:
        style.append(f'opacity:{e["opacity"]}')
    if e.get('blend'):
        style.append(f'mix-blend-mode:{e["blend"]}')   # 'screen' drops a black gen bg -> hologram
    st = f' style="{";".join(style)}"' if style else ''
    tx = ''
    if e.get('flipH'):
        tx = f' transform="translate({2*x+w:.1f} 0) scale(-1 1)"'
    pres = e.get('preserve', 'xMidYMid meet')
    extras_svg.append(
        f'<image href="{esc(file_url(e["href"]))}" x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" '
        f'height="{h:.1f}" preserveAspectRatio="{pres}"{st}{tx}/>')


def _arc(cx, cy, r, a0, a1):
    x0, y0 = cx + r*math.cos(a0), cy + r*math.sin(a0)
    x1, y1 = cx + r*math.cos(a1), cy + r*math.sin(a1)
    large = 1 if (a1 - a0) > math.pi else 0
    return x0, y0, x1, y1, large


def draw_pie(e):
    """vector pie/donut from real data. e: {cx,cy,r, inner?, data:[{label,value,color?}],
       label_font, label_px, label_color, gap_deg?}"""
    cx, cy, r = e['cx'], e['cy'], e['r']
    inner = e.get('inner', 0) * r
    data = e['data']
    total = sum(d['value'] for d in data) or 1
    fam = fam_css(e.get('label_font', '汉仪粗宋简'))
    famv = fam_css(e.get('value_font', e.get('label_font', '汉仪雅酷黑简')))
    lpx = e.get('label_px', 17)
    lcol = e.get('label_color', '#FFFFFF')
    cols = e.get('colors') or [PALETTE.get(f'accent{i+1}', '#4874CB') for i in range(6)]
    a = -math.pi / 2   # start at top
    for i, d in enumerate(data):
        frac = d['value'] / total
        a1 = a + frac * 2 * math.pi
        col = d.get('color') or cols[i % len(cols)]
        x0, y0, x1, y1, large = _arc(cx, cy, r, a, a1)
        if inner > 0:
            xi0, yi0, xi1, yi1, _ = _arc(cx, cy, inner, a, a1)
            path = (f'M{x0:.1f},{y0:.1f} A{r:.1f},{r:.1f} 0 {large} 1 {x1:.1f},{y1:.1f} '
                    f'L{xi1:.1f},{yi1:.1f} A{inner:.1f},{inner:.1f} 0 {large} 0 {xi0:.1f},{yi0:.1f} Z')
        else:
            path = f'M{cx:.1f},{cy:.1f} L{x0:.1f},{y0:.1f} A{r:.1f},{r:.1f} 0 {large} 1 {x1:.1f},{y1:.1f} Z'
        extras_svg.append(f'<path d="{path}" fill="{col}" stroke="#0A1A3A" stroke-width="1.5"/>')
        # label + leader line outside
        am = (a + a1) / 2
        ex_, ey_ = cx + (r + 6) * math.cos(am), cy + (r + 6) * math.sin(am)
        lx, ly = cx + (r + 46) * math.cos(am), cy + (r + 46) * math.sin(am)
        side = 1 if math.cos(am) >= 0 else -1
        tx2 = lx + side * 8
        an = 'start' if side > 0 else 'end'
        extras_svg.append(f'<polyline points="{ex_:.1f},{ey_:.1f} {lx:.1f},{ly:.1f} {tx2:.1f},{ly:.1f}" '
                          f'fill="none" stroke="{col}" stroke-width="1.5"/>')
        extras_svg.append(
            f'<text x="{tx2+side*4:.1f}" y="{ly-3:.1f}" text-anchor="{an}" font-family="{famv}" '
            f'font-size="{lpx+3:.0f}" fill="{col}" font-weight="700">{int(round(frac*100))}%</text>')
        extras_svg.append(
            f'<text x="{tx2+side*4:.1f}" y="{ly+lpx+1:.1f}" text-anchor="{an}" font-family="{fam}" '
            f'font-size="{lpx:.0f}" fill="{lcol}">{esc(d["label"])}</text>')
        a = a1
    if e.get('center'):
        extras_svg.append(f'<text x="{cx:.1f}" y="{cy:.1f}" text-anchor="middle" dominant-baseline="middle" '
                          f'font-family="{fam}" font-size="{e.get("center_px",20)}" fill="{lcol}">{esc(e["center"])}</text>')


def draw_cards(e):
    """count-adaptive card row. e: {area:[x,y,w,h], gap, items:[{title,value,unit?,sub?,icon?}],
       accent, panel} — width auto-splits across however many items (the 4-vs-3 fix)."""
    x, y, w, h = e['area']
    items = e['items']
    n = len(items)
    gap = e.get('gap', 24)
    cw = (w - (n - 1) * gap) / n
    accent = e.get('accent', PALETTE.get('accent5', '#30C0B4'))
    panel = e.get('panel', 'rgba(20,60,120,0.38)')
    famT = fam_css(e.get('title_font', '汉仪雅酷黑简'))
    famB = fam_css(e.get('body_font', '汉仪粗宋简'))
    for i, it in enumerate(items):
        cx0 = x + i * (cw + gap)
        midx = cx0 + cw / 2
        extras_svg.append(f'<rect x="{cx0:.1f}" y="{y:.1f}" width="{cw:.1f}" height="{h:.1f}" rx="10" '
                          f'fill="{panel}" stroke="{accent}" stroke-width="1.5"/>')
        # icon circle
        icr = 26
        icy = y + 30
        extras_svg.append(f'<circle cx="{midx:.1f}" cy="{icy:.1f}" r="{icr}" fill="none" stroke="{accent}" stroke-width="2.5"/>')
        if it.get('icon'):
            extras_svg.append(f'<image href="{esc(file_url(it["icon"]))}" x="{midx-18:.1f}" y="{icy-18:.1f}" width="36" height="36"/>')
        else:
            extras_svg.append(f'<text x="{midx:.1f}" y="{icy+8:.1f}" text-anchor="middle" font-family="{famT}" '
                              f'font-size="26" fill="{accent}">{esc(it.get("badge","¥"))}</text>')
        # value + unit
        vy = y + 96
        extras_svg.append(f'<text x="{midx:.1f}" y="{vy:.1f}" text-anchor="middle" font-family="{famT}" '
                          f'font-size="40" fill="#FFFFFF" font-weight="700">{esc(it["value"])}'
                          f'<tspan font-size="18" dx="2">{esc(it.get("unit",""))}</tspan></text>')
        # title
        extras_svg.append(f'<text x="{midx:.1f}" y="{y+h-46:.1f}" text-anchor="middle" font-family="{famT}" '
                          f'font-size="21" fill="{accent}">{esc(it["title"])}</text>')
        if it.get('sub'):
            sub_lines = wrap_cjk(it['sub'], max(6, int((cw - 24) / 14)))
            for j, ln in enumerate(sub_lines[:2]):
                extras_svg.append(f'<text x="{midx:.1f}" y="{y+h-22+j*16:.1f}" text-anchor="middle" '
                                  f'font-family="{famB}" font-size="13" fill="#CFE0F2">{esc(ln)}</text>')


def draw_line(e):
    x0, y0, x1, y1 = e['p']
    extras_svg.append(f'<line x1="{x0}" y1="{y0}" x2="{x1}" y2="{y1}" stroke="{e.get("color","#30C0B4")}" '
                      f'stroke-width="{e.get("w",2)}"/>')


def draw_rect(e):
    """generic backing rectangle. e:{box:[x,y,w,h], fill?, grad?, stroke?, sw?, rx?, opacity?}"""
    x, y, w, h = e['box']
    if 'grad' in e:
        fill = grad_def(e['grad'], e.get('grad_vertical', True))
    else:
        fill = e.get('fill', 'none')
    st = ''
    if e.get('stroke'):
        st = f' stroke="{e["stroke"]}" stroke-width="{e.get("sw",1.5)}"'
    op = f' opacity="{e["opacity"]}"' if 'opacity' in e else ''
    extras_svg.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" '
                      f'rx="{e.get("rx",0)}" fill="{fill}"{st}{op}/>')


def draw_pill(e):
    """rounded marker pill / divider tab with optional glow. e:{box,fill?,grad?,rx?}"""
    draw_rect({**e, 'rx': e.get('rx', 999)})


def draw_polygon(e):
    """arbitrary polygon (e.g. nav parallelogram tab). e:{points:'x,y x,y ...', fill?,grad?,stroke?,sw?,opacity?}"""
    if 'grad' in e:
        fill = grad_def(e['grad'], e.get('grad_vertical', True))
    else:
        fill = e.get('fill', 'none')
    st = ''
    if e.get('stroke'):
        st = f' stroke="{e["stroke"]}" stroke-width="{e.get("sw",1.5)}"'
    op = f' opacity="{e["opacity"]}"' if 'opacity' in e else ''
    extras_svg.append(f'<polygon points="{e["points"]}" fill="{fill}"{st}{op}/>')


DRAWERS = {'image': draw_image, 'pie': draw_pie, 'cards': draw_cards, 'line': draw_line,
           'rect': draw_rect, 'pill': draw_pill, 'polygon': draw_polygon}
for e in BIND.get('extras', []):
    DRAWERS[e['type']](e)


FIT_REPORT = []
for sh in REC['shapes']:
    if sh.get('kind') != 'text':
        continue
    sid = sh['id']
    ov = SLOTS.get(sid)
    if ov is None:
        # unbound: drop template placeholders, keep real chrome text (nav, etc.)
        orig = sh.get('text', '')
        if not orig or (DROP and PLACEHOLDER.search(orig)):
            continue
        content = orig
        ov = {}
    else:
        content = ov['text'] if isinstance(ov, dict) else ov
    if content == '' or content is None:
        continue

    x, y, w, h = sh['box']
    fpx = (ov.get('px') if isinstance(ov, dict) else None) or sh.get('font_px', 18)
    fam = fam_css((ov.get('font') if isinstance(ov, dict) else None) or sh.get('font', ''),
                  ov.get('font_role') if isinstance(ov, dict) else None)
    bold = ' font-weight="800"' if sh.get('bold') or 'H' == sh.get('font', '')[-1:] or '冠黑' in sh.get('font', '') else ''
    color, grad = resolve_color(sh, ov)
    fill = grad_def(grad) if grad else color

    vertical = w < 46 and h > w * 1.6   # narrow tall tab -> vertical CJK
    if vertical:
        cx = x + w / 2
        body.append(
            f'<text x="{cx:.0f}" y="{y+fpx*0.95:.0f}" text-anchor="middle" '
            f'writing-mode="vertical-rl" style="text-orientation:upright" '
            f'font-family="{fam}" font-size="{fpx:.1f}"{bold} fill="{fill}">{esc(content)}</text>')
        continue

    # horizontal: capacity-aware. lines = explicit list, or wrap by width.
    if isinstance(content, list):
        lines = [str(c) for c in content]
    else:
        maxchars = max(1, int(w / max(fpx, 1)))
        lines = wrap_cjk(content, maxchars)
    # shrink if too many lines for the box height. PER-BOX auto-shrink is what makes sibling bullets
    # render at DIFFERENT sizes (the longer one shrinks, the shorter stays big) — 2026-06-30 用户问题1.
    # So: (a) NEVER shrink below the 18px readable floor (overflow + warn instead of silent tiny text),
    # (b) record every shrink so page_gate can fail desync / sub-floor that the nominal-size check misses.
    FLOOR = 18.0
    lh = 1.32
    nominal = fpx
    max_lines = max(1, int(h / (fpx * lh))) if h > fpx else 1
    if len(lines) > max_lines and not isinstance(content, list):
        fpx2 = max(FLOOR, fpx * max_lines / len(lines))
        maxchars = max(1, int(w / max(fpx2, 1)))
        lines = wrap_cjk(content, maxchars)
        fpx = fpx2
        fitlines = max(1, int(h / (fpx * lh)))
        FIT_REPORT.append({'id': sh.get('id', ''), 'text': (content if isinstance(content, str) else '')[:18],
                           'from_px': round(nominal, 1), 'to_px': round(fpx, 1),
                           'overflow': len(lines) > fitlines})
    al = anchor(sh.get('align'))
    ax = x if al == 'start' else (x + w if al == 'end' else x + w / 2)
    nlines = len(lines)
    block_h = (nlines - 1) * fpx * lh
    y0 = y + h / 2 - block_h / 2 + fpx * 0.34   # vertically center the block
    spans = ''.join(
        f'<tspan x="{ax:.0f}" dy="{0 if i == 0 else fpx*lh:.1f}">{esc(ln)}</tspan>'
        for i, ln in enumerate(lines))
    body.append(
        f'<text x="{ax:.0f}" y="{y0:.0f}" text-anchor="{al}" '
        f'font-family="{fam}" font-size="{fpx:.1f}"{bold} fill="{fill}">{spans}</text>')

W, Hc = REC.get('canvas', [1280, 720])
svg = [f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
       f'viewBox="0 0 {W} {Hc}" width="{W}" height="{Hc}">']
if defs:
    svg.append('<defs>' + ''.join(defs) + '</defs>')
svg.append(f'<image href="{esc(PLATE_URL)}" x="0" y="0" width="{W}" height="{Hc}"/>')
svg += extras_svg   # content-regen images / vector charts / cards (under text)
svg += body
svg.append('</svg>')
open(args.out, 'w', encoding='utf-8').write('\n'.join(svg))
print(f"rendered {len(body)} text elements -> {args.out}")
# write a fit-report sidecar + warn so font desync / sub-floor overflow is VISIBLE (page_gate reads it)
import json as _json
_fit = os.path.splitext(args.out)[0] + '.fit.json'
_json.dump(FIT_REPORT, open(_fit, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
if FIT_REPORT:
    print(f"  ⚠ {len(FIT_REPORT)} text box(es) auto-shrunk (sibling sizes may now differ — size peer boxes "
          f"to the LONGEST item at one shared px):")
    for r in FIT_REPORT:
        tag = ' OVERFLOW@18' if r['overflow'] else ''
        print(f"     {r['from_px']:.0f}->{r['to_px']:.0f}px  '{r['text']}'{tag}")
