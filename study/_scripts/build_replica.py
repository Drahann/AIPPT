#!/usr/bin/env python3
"""Build a replica SVG from parsed slide _layout.json + layout bg.
Data-driven: REAL bg image, REAL slide images at REAL boxes WITH flips, text at
REAL boxes using the REAL font / size / color / align — only the words change.

Usage: python build_replica.py <layout.json> <out.svg> <bg_image_rel>
"""
import json, sys, html

layout, outsvg, bg = sys.argv[1], sys.argv[2], sys.argv[3]
D = json.load(open(layout, encoding='utf-8'))
shapes = D['shapes']

# ---- content map (med_jiyin s13 team -> 焕白 team) ----
CARD_X = [62.7, 262.0, 461.3, 660.6, 860.0, 1059.3]
NAMES = ['王炯桦', '盛宇菲', '张津叶', '徐悦可', '任一帆', '邓煜婕']
ROLES = ['团队负责人', '研发总监', '产品总监', '生产经理', '市场总监', '财务总监']
BULLETS = [['项目统筹', '技术路线把控', '资源协调推进'],
           ['核心技术研发', '实验设计', '检测验证'],
           ['产品性能验证', '结构优化', '4项发明专利'],
           ['中试生产', '质量控制', '生产协同'],
           ['市场调研', '客户沟通', '渠道拓展'],
           ['融资测算', '财务模型', '资本运作']]
DUTY = ['统筹技术路线与产业化推进', '主导核心技术研发与检测', '蛋白超分子结构构建验证',
        '全链条质量安全管控建设', '市场调研与供应链管理', '财务模型与资本运作体系']
MAP = {'请输入数据标题': '宁波大学 · 焕白新生项目团队', '技术专利的展示': '团队人员配置'}
RIBBON_SMALL = 'SCI论文14篇 · 发明专利4项 · 国家级奖项7项'   # small line: ~46-char budget
RIBBON_BIG = '六大领域专业互补 · 协同高效闭环'   # big line 37px: <=18-char budget

FONTMAP = {
    '思源宋体 CN Heavy': "'Source Han Serif CN','思源宋体 CN',SimSun,serif",
    '阿里妈妈数黑体': "'Alimama ShuHeiTi','阿里妈妈数黑体',Impact,'Microsoft YaHei',sans-serif",
    '阿里巴巴普惠体': "'Alibaba PuHuiTi 2.0','阿里巴巴普惠体','Microsoft YaHei',sans-serif",
    '梦源黑体 CN W23': "'Source Han Sans CN','梦源黑体 CN','Microsoft YaHei',sans-serif",
    'OPPOSans M': "'OPPOSans','Microsoft YaHei',sans-serif",
    '微软雅黑': "'Microsoft YaHei',sans-serif",
}
DEFFONT = "'Microsoft YaHei',sans-serif"


def fontcss(n):
    return FONTMAP.get(n, DEFFONT)


def cidx(x):
    return min(range(6), key=lambda i: abs(x - CARD_X[i]))


def esc(s):
    return html.escape(str(s), quote=True)


def anchor(al):
    return {'CENTER': 'middle', 'RIGHT': 'end'}.get(al, 'start')


def fit(content, w, fpx, lines=1, floor=0.62):
    """Auto-shrink: if CJK content exceeds box capacity, reduce font (to a floor)."""
    cap = (w / fpx) * lines
    n = len(content)
    if n > cap:
        return max(fpx * floor, fpx * cap / n)
    return fpx


out = ['<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1280 720" width="1280" height="720">']
out.append('<defs>')
out.append('<linearGradient id="band" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#0A2E6E"/><stop offset="55%" stop-color="#0C57C0"/><stop offset="100%" stop-color="#0AA0E0"/></linearGradient>')
out.append('<linearGradient id="pill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1E9BE6"/><stop offset="100%" stop-color="#0E5FB8"/></linearGradient>')
# real name fill = gold gradient (#F8ECA9 -> #F1CE7D), from source gradFill
out.append('<linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#F8ECA9"/><stop offset="55%" stop-color="#F1CE7D"/><stop offset="100%" stop-color="#E3B24E"/></linearGradient>')
# blue duotone for placeholder avatar photos (cream -> blue, like source render)
out.append('<filter id="blueduo" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0"/><feComponentTransfer><feFuncR type="linear" slope="0.5" intercept="0.03"/><feFuncG type="linear" slope="0.72" intercept="0.16"/><feFuncB type="linear" slope="0.95" intercept="0.33"/></feComponentTransfer></filter>')
# bg color-correction (Chrome renders the JPEG washed vs PowerPoint): darken + saturate
out.append('<filter id="bgadj" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="1.45"/><feComponentTransfer><feFuncR type="linear" slope="0.62"/><feFuncG type="linear" slope="0.68"/><feFuncB type="linear" slope="0.82"/></feComponentTransfer></filter>')
for i, x in enumerate(CARD_X):
    out.append(f'<clipPath id="av{i}"><circle cx="{x+65.6:.1f}" cy="248" r="60"/></clipPath>')
out.append('</defs>')

# REAL full-bleed background (layout image: bg + top ornament + frame chrome). Pre-darkened/saturated PNG (no SVG filter — Chrome headless renders image filters unreliably).
out.append(f'<image href="{bg}" x="0" y="0" width="1280" height="720" preserveAspectRatio="xMidYMid slice"/>')


def flip_tx(s, x, y, w, h):
    cx, cy = x + w / 2, y + h / 2
    if s.get('flipH') and s.get('flipV'):
        return f' transform="translate({2*cx:.1f} {2*cy:.1f}) scale(-1 -1)"'
    if s.get('flipH'):
        return f' transform="translate({2*cx:.1f} 0) scale(-1 1)"'
    if s.get('flipV'):
        return f' transform="translate(0 {2*cy:.1f}) scale(1 -1)"'
    return ''


for s in shapes:
    x, y, w, h = s['box']
    nm = s.get('name', '')
    txt = s.get('text', '')
    if 'image' in s:
        href = f"../images/{s['image']}"
        tx = flip_tx(s, x, y, w, h)
        if 185 <= y <= 190 and 120 <= w <= 140:   # avatar (placeholder photo): pre-made blue-duotone PNG
            i = cidx(x)
            cx2 = CARD_X[i] + 65.6
            bhref = href.replace('.png', '_blue.png')
            out.append(f'<circle cx="{cx2:.1f}" cy="248" r="60" fill="#08203F" stroke="#2FA8E0" stroke-width="2"/>')
            out.append(f'<image href="{bhref}" x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" preserveAspectRatio="xMidYMid slice" clip-path="url(#av{i})"{tx}/>')
            out.append(f'<circle cx="{cx2:.1f}" cy="248" r="59" fill="none" stroke="#5AD2F5" stroke-width="1" stroke-opacity="0.45"/>')
        else:
            out.append(f'<image href="{href}" x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" preserveAspectRatio="xMidYMid slice"{tx}/>')
        continue
    if '矩形 100' in nm:
        out.append(f'<rect x="{max(x,0):.1f}" y="{y:.1f}" width="{min(w,1280):.1f}" height="{h:.1f}" fill="url(#band)" fill-opacity="0.92"/>')
        continue
    if '对角圆角' in nm:
        out.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="6" fill="url(#pill)"/>')
        continue
    if not txt:
        continue
    # ---- text: REAL font/size/color/align, only words swapped ----
    fpx = s.get('font_px', 16)
    fam = fontcss(s.get('font', ''))
    al = anchor(s.get('align'))
    bold = ' font-weight="800"' if s.get('bold') or 'Heavy' in s.get('font', '') else ''
    tx_anchor = x if al == 'start' else (x + w if al == 'end' else x + w / 2)
    baseY = y + h * 0.5 + fpx * 0.35

    def T(content_raw, color, yy=baseY, ax=tx_anchor, an=al, fm=fam, bd=bold, lines=1):
        sz = fit(content_raw, w, fpx, lines)   # auto-shrink to box capacity
        out.append(f'<text x="{ax:.0f}" y="{yy:.0f}" text-anchor="{an}" font-family="{fm}" font-size="{sz:.1f}"{bd} fill="{color}">{esc(content_raw)}</text>')

    if txt in MAP and txt == '请输入数据标题':
        T(MAP[txt], s.get('color', '#DCEBFF'))
    elif txt == '技术专利的展示':
        T(MAP[txt], s.get('color', '#EAF8FF'))
    elif txt == '周小二':
        T(NAMES[cidx(x)], 'url(#gold)', bd=' font-weight="800"')   # names = gold gradient (source gradFill)
    elif txt == '产品经理':
        T(ROLES[cidx(x)], '#FFFFFF')
    elif '请输入文本内容文字' in txt:
        i = cidx(x)
        spans = ''.join(f'<tspan x="{x:.0f}" dy="{0 if j==0 else fpx*1.7:.0f}">· {esc(b)}</tspan>' for j, b in enumerate(BULLETS[i]))
        out.append(f'<text x="{x:.0f}" y="{y+fpx*1.4:.0f}" font-family="{fam}" font-size="{fpx:.1f}" fill="#C7DDF5">{spans}</text>')
    elif '跟进产品落地' in txt:
        T(DUTY[cidx(x)], '#BFD6F0', lines=2)
    elif '请输入标题文字' in txt:
        sb = fit(RIBBON_BIG, w, fpx, 1)
        out.append(f'<text x="640" y="{y+34:.0f}" text-anchor="middle" font-family="{fam}" font-size="15" fill="#BFEFFF">{esc(RIBBON_SMALL)}</text>')
        out.append(f'<text x="640" y="{y+72:.0f}" text-anchor="middle" font-family="{fam}" font-size="{sb:.1f}" font-weight="800" fill="#FFFFFF">{esc(RIBBON_BIG)}</text>')
    else:   # nav labels & others: keep words, real font/size/color
        T(txt, s.get('color', '#CFE0F2'))

out.append('</svg>')
open(outsvg, 'w', encoding='utf-8').write('\n'.join(out))
print(f"replica built -> {outsvg}")
