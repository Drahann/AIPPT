#!/usr/bin/env python3
"""deco_skeleton — extract a reference page's DECORATION BLUEPRINT so the generator INHERITS the
template's placement discipline instead of free-deciding (and under-decorating) on a clean base.

Why: switching make_plate -> clean_base removed the baked-in decorations, which biases the model to
drop them. Fix: the reference page_record ALREADY encodes where the template puts every functional
decoration (images[]/decor_shapes[] each carry function + box). Lift that into a skeleton; the
generator then, for EACH zone, pulls a CLEAN library part of that function+family (assets_search
--clean) re-skinned to the locked deck, and fills the text slots with project content at LARGE fonts.
=> placement rules + decoration density (the 金奖 discipline) come from the template; content from the doc.

Usage:
  python deco_skeleton.py <page_id> [--json out.json]
  -> prints deco zones (function@box) + text slots (box/font) + per-function density to match.
"""
import os, sys, json, glob, argparse

ROOT = os.path.join(os.path.dirname(__file__), '..', 'corpus')
ap = argparse.ArgumentParser()
ap.add_argument('page_id')
ap.add_argument('--json', default='')
a = ap.parse_args()

hits = glob.glob(os.path.join(ROOT, '*', 'pages', a.page_id + '.json'))
if not hits:
    sys.exit('page not found: ' + a.page_id)
p = json.load(open(hits[0], encoding='utf-8'))
W, H = p.get('canvas', [1280, 720])


def font_of(sh):
    fp = sh.get('font_px')
    if fp:
        return round(fp)
    for pa in sh.get('paras', []):
        for rn in pa.get('runs', []):
            if rn.get('sz'):
                return round(rn['sz'])
    return None


deckdir = os.path.dirname(os.path.dirname(hits[0]))


def asset_path(asset):
    if not asset:
        return ''
    pth = os.path.join(deckdir, 'assets', asset)
    return pth.replace('\\', '/') if os.path.exists(pth) else ''


deco = []
for im in p.get('images', []):
    fn = im.get('function')
    if im.get('role') in ('decoration', 'icon', 'chrome') and fn not in ('none', '', None):
        b = im['box']
        deco.append({'function': fn, 'box': [round(v, 1) for v in b], 'from': 'image',
                     'aspect': round(b[2] / b[3], 2) if b[3] else None,
                     'theme': im.get('theme_meaning', ''), 'treatment': im.get('treatment', ''),
                     'desc': im.get('desc', ''), 'asset': asset_path(im.get('asset'))})
for dc in p.get('decor_shapes', []):
    fn = dc.get('function')
    if dc.get('role') in ('decoration', 'icon') and fn not in ('none', '', None):
        b = dc['box']
        deco.append({'function': fn, 'box': [round(v, 1) for v in b], 'from': 'vector',
                     'aspect': round(b[2] / b[3], 2) if b[3] else None,
                     'theme': dc.get('theme_meaning', ''), 'treatment': dc.get('treatment', ''),
                     'desc': dc.get('desc', ''), 'asset': asset_path(dc.get('asset'))})
deco.sort(key=lambda d: -(d['box'][2] * d['box'][3]))

slots = []
for sh in p.get('slots', []):
    b = sh['box']
    slots.append({'box': [round(v, 1) for v in b], 'font_px': font_of(sh),
                  'align': (sh.get('paras', [{}]) or [{}])[0].get('align', 'LEFT'),
                  'placeholder': (sh.get('text', '') or '')[:24]})

import collections
dens = collections.Counter(d['function'] for d in deco)

print(f"# DECO SKELETON  {a.page_id}")
print(f"archetype={p.get('archetype')}  slot_signature={p.get('slot_signature')}  canvas={W}x{H}")
print(f"content_shape: {p.get('content_shape')}")
print(f"page_desc: {p.get('page_desc')}")
print(f"\n## DECORATION ZONES — MANDATORY FLOOR = {len(deco)} parts. This is the template's deco discipline:")
print(f"   density by function: " + ", ".join(f"{fn}×{n}" for fn, n in dens.most_common()))
print(f"   RULES (2026-06-29 用户细化):")
print(f"   1) FILL EVERY zone below — never leave a template-decorated spot bare. Per zone, choose ONE:")
print(f"      (a) reuse the template's own part  (b) pick a DIFFERENT clean library part of that function")
print(f"          `assets_search.py --function <fn> --family <locked> --clean`")
print(f"      (c) AI-GENERATE one sized to the actual box  `gen_deco.py --function <fn> --box WxH ...`")
print(f"   2) You MAY ADD decorations beyond these zones where you judge it improves the page (creativity OK):")
print(f"      e.g. a frame around every card, a pill-bg behind each bullet, 麦穗/flank beside each metric.")
print(f"   3) INVARIANT — ONLY MORE, NEVER FEWER: final placed decorations + images >= {len(deco)} (the template's).")
print(f"      Verify with: deco_check.py <binding.json> --ref {a.page_id}")
print(f"   ★ STUDY each zone's REAL reference image (asset path below) + its desc, THEN reuse it directly,"
      f" or AI-GENERATE a transparent/black-bg look-alike sized to the box. NEVER hand-draw.")
for d in deco:
    x, y, w, h = d['box']
    print(f"   [fill] {d['function']:16} box[{x:6.0f},{y:6.0f} {w:5.0f}x{h:4.0f}] asp{str(d['aspect']):>5} {d['from']:6} {d['theme']:8} {d['desc']}")
    if d['asset']:
        print(f"            ref-image: {d['asset']}")
print(f"\n## TEXT SLOTS — fill with project content, START LARGE (≥ box-implied size; never shrink to fit)")
for s in slots:
    x, y, w, h = s['box']
    print(f"   box[{x:6.0f},{y:6.0f} {w:5.0f}x{h:4.0f}] font~{str(s['font_px']):>4}px {s['align']:6} ph='{s['placeholder']}'")

if a.json:
    json.dump({'page_id': a.page_id, 'archetype': p.get('archetype'), 'canvas': [W, H],
               'deco_zones': deco, 'text_slots': slots, 'deco_density': dict(dens)},
              open(a.json, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('\n-> ' + a.json)
