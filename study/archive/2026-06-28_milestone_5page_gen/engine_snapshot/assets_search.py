#!/usr/bin/env python3
"""assets_search — find functional decoration parts (the 创赛 "每处文字垫装饰" zubehör) by function x family x theme.

Returns file paths (so render_page can pick & place them) without loading the 8000+ index into context.
--montage builds a preview grid PNG so the orchestrator can eyeball candidates and choose.

Usage:
  python assets_search.py --function card_frame --family blue_tech
  python assets_search.py --function title_flank --theme 农业 --montage W:\\...\\flank.png
"""
import os, sys, json, argparse

LIB = os.path.join(os.path.dirname(__file__), '..', 'assets_lib')
ap = argparse.ArgumentParser()
ap.add_argument('--function', default='')
ap.add_argument('--family', default='')
ap.add_argument('--theme', default='')
ap.add_argument('--limit', type=int, default=30)
ap.add_argument('--montage', default='')
a = ap.parse_args()

rows = [json.loads(l) for l in open(os.path.join(LIB, 'index.jsonl'), encoding='utf-8')]


def ok(r):
    if a.function and r.get('function') != a.function:
        return False
    if a.family and a.family not in (r.get('family') or ''):
        return False
    if a.theme and a.theme.lower() not in str(r.get('theme_meaning', '')).lower():
        return False
    return True


out = [r for r in rows if ok(r)]
seen, uniq = set(), []
for r in out:                                   # de-dup identical asset names
    if r['asset'] in seen:
        continue
    seen.add(r['asset']); uniq.append(r)
uniq = uniq[:a.limit]

paths = []
for r in uniq:
    p = os.path.join(LIB, r['function'], r['family'], r['asset'])
    paths.append(p)
    print(f"{r['function']:15} {str(r.get('family','')):15} {str(r.get('theme_meaning',''))[:12]:12} aspect={r.get('aspect')}  {p}  {r.get('desc','')}")
print(f"\n{len(uniq)} shown (of {sum(1 for r in rows if ok(r))} match, {len(rows)} total)")

if a.montage and paths:
    from PIL import Image, ImageDraw
    cell, cols = 150, 6
    pp = [p for p in paths if os.path.exists(p)]
    rows_n = (len(pp) + cols - 1) // cols
    m = Image.new('RGB', (cols * cell, rows_n * (cell + 16)), '#2b2b2b')
    d = ImageDraw.Draw(m)
    for i, p in enumerate(pp):
        try:
            im = Image.open(p).convert('RGBA'); im.thumbnail((cell - 8, cell - 8))
            bg = Image.new('RGBA', (cell, cell), (52, 56, 70, 255))
            bg.alpha_composite(im, ((cell - im.width) // 2, (cell - im.height) // 2))
            r0, c0 = divmod(i, cols)
            m.paste(bg.convert('RGB'), (c0 * cell, r0 * (cell + 16)))
            d.text((c0 * cell + 2, r0 * (cell + 16) + cell + 2), os.path.basename(p)[:22], fill='#9df')
        except Exception:
            pass
    os.makedirs(os.path.dirname(os.path.abspath(a.montage)), exist_ok=True)
    m.save(a.montage)
    print("montage ->", a.montage)
