#!/usr/bin/env python3
"""deco_check (v3, FUNCTION-AWARE) — enforce that a page uses REAL image decorations the way the
template does, NOT self-drawn vector. 2026-06-29 用户反馈：卡片必须套 card_frame 图片、要点文字必须坐在
图片装饰上；自画矩形/线条 + 反复刷的几张 AI 光带不算数。

How it judges (binding.json):
  • Each decoration IMAGE extra may carry `"function": "card_frame|bullet_marker|bg_panel|title_flank|
    number_backplate|corner_hud|avatar_ring|ribbon|motif|glow|connector"`. Tag your placed assets.
  • Image source is classified: library (assets_lib / _assets/lib path) | doc (mermaid) | gen (gen_deco).
    All three are REAL images and count. Self-drawn rect/line/pill do NOT count (that's the point).
  • Reference per-function deco counts come from the page_record (images + decor_shapes).
GATES:
  1) CARD-FRAME : if the reference frames cards, placed real card_frame images >= reference card_frame count
                  (every card must sit in a real frame image — library or gen-by-box; not a self-drawn rect).
  2) STRUCTURAL : every other structural function the template uses must have >=1 real image present
                  (bg_panel / title_flank / number_backplate / bullet_marker / avatar_ring / ribbon / corner_hud).
  3) ONLY-MORE  : total REAL decoration images (+data-viz) >= reference total deco count.
Glows alone can NOT satisfy a structural slot — they only count as 'glow'.

Usage:  python deco_check.py <binding.json> --ref <reference_page_id>
"""
import os, sys, json, glob, argparse, math, collections

ROOT = os.path.join(os.path.dirname(__file__), '..', 'corpus')
LIB = os.path.join(os.path.dirname(__file__), '..', 'assets_lib')
ap = argparse.ArgumentParser()
ap.add_argument('binding')
ap.add_argument('--ref', required=True)
ap.add_argument('--cards', type=int, default=0, help='override #cards if the page has more cards than the ref')
a = ap.parse_args()

STRUCTURAL = {'card_frame', 'bg_panel', 'title_flank', 'number_backplate', 'bullet_marker',
              'avatar_ring', 'ribbon', 'corner_hud', 'icon_pedestal', 'connector'}


def full_bleed(b):
    return b[2] >= 1200 and b[3] >= 650


# ---- reference per-function counts ----
hits = glob.glob(os.path.join(ROOT, '*', 'pages', a.ref + '.json'))
if not hits:
    sys.exit('ref page not found: ' + a.ref)
p = json.load(open(hits[0], encoding='utf-8'))
ref_func = collections.Counter()
for im in p.get('images', []):
    if im.get('role') in ('decoration', 'icon', 'hero') and im.get('function') not in ('none', '', None) and not full_bleed(im['box']):
        ref_func[im['function']] += 1
for d in p.get('decor_shapes', []):
    if d.get('role') in ('decoration', 'icon') and d.get('function') not in ('none', '', None) and not full_bleed(d['box']):
        ref_func[d['function']] += 1
ref_total = sum(ref_func.values())
# #cards is THIS page's design decision (pass --cards). The ref's card_frame count is a sub-part
# tally (a 3-card page may harvest 11 frame parts), so don't equate it with card count.
ref_cards = a.cards if a.cards > 0 else (1 if ref_func.get('card_frame', 0) else 0)

# ---- library basename set (path-based source classification) ----
lib_paths = ('assets_lib', '/_assets/lib/')


def cls(e):
    h = (e.get('href') or '').replace(os.sep, '/')
    if any(t in h for t in lib_paths):
        return 'library'
    if 'mermaid' in os.path.basename(h).lower():
        return 'doc'
    return 'gen'


B = json.load(open(a.binding, encoding='utf-8'))
BIND_DIR = os.path.dirname(os.path.abspath(a.binding))
extras = B.get('extras', [])
real_imgs = [e for e in extras if e.get('type') == 'image' and not full_bleed(e.get('box', [0, 0, 0, 0]))]
src = collections.Counter(cls(e) for e in real_imgs)
placed_func = collections.Counter(e.get('function', 'untagged') for e in real_imgs)
markers = sum(1 for e in extras if e.get('type') in ('pie', 'cards'))
total_real = len(real_imgs) + markers
# self-drawn DECORATION BACKINGS (pills/tabs/badges/panel rects drawn with vector) are FORBIDDEN
# (2026-06-30 用户问题3: 年份胶囊/底板必须是素材图或AI生图，禁止自画). Pure axis/divider lines and the
# full-bleed scrim are tolerated; pie/cards/bar rects are data-viz (separate).
vec_backings = [e for e in extras if e.get('type') == 'pill'
                or (e.get('type') == 'polygon' and e.get('fill') not in (None, 'none'))
                or (e.get('type') == 'rect' and e.get('rx', 0) and e.get('rx', 0) >= 8
                    and not full_bleed(e.get('box', [0, 0, 0, 0])) and e.get('fill') not in (None, 'none'))]
self_drawn = sum(1 for e in extras if e.get('type') == 'line') + len(vec_backings)

print(f"# DECO CHECK v3 (function-aware)  {os.path.basename(a.binding)}  ref={a.ref} ({p.get('archetype')})")
print(f"  reference deco floor={ref_total}  by function: " + ", ".join(f"{k}×{v}" for k, v in ref_func.most_common()))
print(f"  placed REAL images={len(real_imgs)} (library={src['library']} gen={src['gen']} doc={src['doc']}) + data-viz={markers} = {total_real}")
print(f"  placed image functions: " + (", ".join(f"{k}×{v}" for k, v in placed_func.most_common()) or "(none tagged)"))
print(f"  self-drawn vector (NOT counted): {self_drawn}")

fails = []
# 0) SIZE-FIT — the SAME image must not be stretched across boxes of different aspect (2026-06-29
#    用户: 生图按 box 尺寸算、不同比例不复用同一张). Catches reuse-across-aspects distortion that the
#    function tags hide (e.g. one tall card_frame reused at 2:1 and 10:1).
asp = collections.defaultdict(list)
for e in real_imgs:
    b = e.get('box', [0, 0, 1, 1])
    if b[3]:
        asp[os.path.basename((e.get('href') or ''))].append(b[2] / b[3])
stretched = [(nm, round(min(v), 2), round(max(v), 2), len(v)) for nm, v in asp.items()
             if len(v) >= 2 and max(v) / min(v) > 1.3]
if stretched:
    for nm, lo, hi, n in stretched:
        print(f"  [FAIL] SIZE-FIT   : '{nm}' 同一张图铺到 {n} 个不同比例(aspect {lo}~{hi}) -> 拉伸失真")
    fails.append("按每个 box 的实际尺寸分别生成装饰图(不同比例不复用同一张)")
# 0b) NO-SELF-DRAW — vector pills / filled polygons / rounded panel rects used as decoration backings
if vec_backings:
    kinds = collections.Counter(e['type'] for e in vec_backings)
    print(f"  [FAIL] NO-SELF-DRAW: {len(vec_backings)} 自画矢量装饰底板/胶囊/标签 (" +
          ", ".join(f"{k}×{v}" for k, v in kinds.items()) + ") — 必须换成素材图或 gen_deco 生图")
    fails.append("把自画的胶囊/底板/多边形标签换成真装饰图(库件或按 box gen_deco)")
# 0c) STRETCH-ABS — a single placed asset whose on-disk native aspect != its box aspect (>1.15) is
#     distorted even if used only once (SIZE-FIT only catches same-asset-across-boxes).
import PIL.Image as _PImg
abs_str = []
for e in real_imgs:
    href = (e.get('href') or '').replace('\\', '/')
    fp = os.path.join(BIND_DIR, href)
    b = e.get('box', [0, 0, 1, 1])
    if os.path.exists(fp) and b[3]:
        try:
            iw, ih = _PImg.open(fp).size
        except Exception:
            continue
        na = iw / ih if ih else 1.0
        ba = b[2] / b[3]
        s = max(na, ba) / min(na, ba)
        if s > 1.15:
            abs_str.append((os.path.basename(href), round(na, 2), round(ba, 2), round(s, 2)))
if abs_str:
    for nm, na, ba, s in abs_str:
        print(f"  [FAIL] STRETCH    : '{nm}' 资源原始比例 {na} 摆进 box 比例 {ba} -> 拉伸 x{s}")
    fails.append("生图按 box 实际比例 full-bleed 生成(资源原始比例须≈box，禁拉伸)")
# 1) CARD-FRAME
if ref_cards > 0:
    have = placed_func.get('card_frame', 0)
    ok = have >= ref_cards
    print(f"\n  [{'PASS' if ok else 'FAIL'}] CARD-FRAME : {have} real card_frame images {'>=' if ok else '<'} {ref_cards} cards")
    if not ok:
        fails.append(f"每张卡片套真 card_frame 图片(库件或按卡尺寸 gen)，还差 {ref_cards - have} 张")
# 2) STRUCTURAL others
for fn in sorted(STRUCTURAL - {'card_frame'}):
    need = ref_func.get(fn, 0)
    if need > 0:
        have = placed_func.get(fn, 0)
        ok = have >= 1
        print(f"  [{'PASS' if ok else 'FAIL'}] {fn:14}: {have} real image present (ref uses {need})")
        if not ok:
            fails.append(f"补一张真 {fn} 图片")
# 3) ONLY-MORE
tot_ok = total_real >= ref_total
print(f"  [{'PASS' if tot_ok else 'FAIL'}] ONLY-MORE  : real decorations {total_real} {'>=' if tot_ok else '<'} template {ref_total}")
if not tot_ok:
    fails.append(f"再加 {ref_total - total_real} 张真装饰(自画不计)")

ok = not fails and tot_ok
print(f"\n  => {'PASS — uses real image decorations like the template' if ok else 'FAIL — ' + '；'.join(fails)}")
sys.exit(0 if ok else 1)
