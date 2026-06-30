#!/usr/bin/env python3
"""clean_base — produce a CONTENT-FREE backdrop for additive composition.

The flattened template plate (make_plate) carries leftover template text/logos/decorations
that don't align to new content and shouldn't be there (financing blue frame, tech 山河大学/
医创先锋 logos, team summary bar). Instead START CLEAN: use the deck's background SCENE image
(skin.backgrounds = the bg blip, no slide content) scaled to 1280x720; fall back to a vertical
gradient in the deck's bg color. Then the orchestrator places decorations ADDITIVELY at known
boxes so content co-registers exactly — no leftovers, perfect alignment.

Usage: python clean_base.py <deck_id> <out.png> [corpus_root]
"""
import os, sys, json
from PIL import Image

ROOT = sys.argv[3] if len(sys.argv) > 3 else os.path.join(os.path.dirname(__file__), '..', 'corpus')
deck_id, out = sys.argv[1], sys.argv[2]
dd = os.path.join(ROOT, deck_id)
deck = json.load(open(os.path.join(dd, 'deck_record.json'), encoding='utf-8'))
os.makedirs(os.path.dirname(os.path.abspath(out)) or '.', exist_ok=True)

bgs = (deck.get('skin', {}) or {}).get('backgrounds') or []
for b in bgs:
    src = os.path.join(dd, 'assets', b)
    if os.path.exists(src):
        Image.open(src).convert('RGB').resize((1280, 720)).save(out)
        print(f"clean base from bg scene ({b}) -> {out}")
        sys.exit()

# gradient fallback in the deck's measured bg color
bg = (deck.get('skin', {}) or {}).get('bg_deep') or '#04102B'
h = bg.lstrip('#')
r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
top = (min(255, int(r * 1.6) + 8), min(255, int(g * 1.6) + 10), min(255, int(b * 1.7) + 22))
col = Image.new('RGB', (1, 720))
for y in range(720):
    t = y / 719.0
    col.putpixel((0, y), tuple(int(top[i] * (1 - t) + (r, g, b)[i] * t) for i in range(3)))
col.resize((1280, 720)).save(out)
print(f"clean base gradient ({bg}) -> {out}")
