# -*- coding: utf-8 -*-
"""Summarize the harvested asset index and build per-bucket contact sheets (sorted by
popularity 'uses') on a checkerboard so transparency shows — for human curation."""
import os, sys, json, glob
sys.stdout.reconfigure(encoding='utf-8')
from PIL import Image, ImageDraw, ImageFont
Image.MAX_IMAGE_PIXELS = None
OUT = r"W:\ppt\study\assets_lib"; POOL = os.path.join(OUT, "_pool")
CS = os.path.join(OUT, "contact_sheets"); os.makedirs(CS, exist_ok=True)
rows = [json.loads(l) for l in open(os.path.join(OUT, "_index.jsonl"), encoding="utf-8")]
try: counts = json.load(open(os.path.join(OUT, "_counts.json")))
except: counts = {}
for r in rows: r["uses"] = counts.get(r["sha1"], r.get("uses", 1))

def F(s):
    try: return ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", s)
    except: return ImageFont.load_default()

# ---- summary ----
from collections import Counter
print(f"TOTAL unique assets: {len(rows)}")
print("\nby category:");  [print(f"  {k:14s} {v}") for k, v in Counter(r["cat"] for r in rows).most_common()]
print("\nby family:");    [print(f"  {k:16s} {v}") for k, v in Counter(r["cfam"] for r in rows).most_common()]
print("\nby category × family (top buckets):")
bc = Counter((r["cat"], r["cfam"]) for r in rows)
for (c, fam), v in bc.most_common(40):
    print(f"  {c:14s} {fam:16s} {v}")

# ---- contact sheets ----
def checker(w, h, c=14):
    img = Image.new("RGB", (w, h), (66, 66, 74)); d = ImageDraw.Draw(img)
    for y in range(0, h, c):
        for x in range(0, w, c):
            if (x//c + y//c) % 2 == 0: d.rectangle([x, y, x+c, y+c], fill=(92, 92, 104))
    return img

def sheet(items, name, cols=8, tw=200, th=130):
    pad = 6; lab = 26; n = len(items); rows_ = (n + cols - 1)//cols
    if n == 0: return
    img = Image.new("RGB", (cols*(tw+pad)+pad, rows_*(th+lab+pad)+pad+30), (34, 34, 40))
    d = ImageDraw.Draw(img); d.text((pad, 6), name, fill=(255, 230, 120), font=F(18))
    for i, r in enumerate(items):
        rr = i//cols; cc = i % cols; x = pad+cc*(tw+pad); y = 30+pad+rr*(th+lab+pad)
        bg = checker(tw, th)
        p = os.path.join(POOL, r["sha1"]+r["ext"])
        try:
            im = Image.open(p).convert("RGBA"); im.thumbnail((tw, th)); bg.paste(im, ((tw-im.width)//2, (th-im.height)//2), im)
        except Exception as e: pass
        img.paste(bg, (x, y))
        d.text((x, y+th+1), f"#{i} u{r['uses']} {r['w']}x{r['h']} a{r['alpha']}", fill=(225, 225, 225), font=F(11))
    out = os.path.join(CS, name+".png"); img.save(out); print("  sheet:", out, f"({n})")

# which buckets to montage (high value): top-48 by uses each
BUCKETS = []
for fam in ["tech_blue","agri_green","red","heritage_gold","med","dark_gold","neutral"]:
    for cat in ["background","fx_strip","deco_square","deco_misc","cutout_tall"]:
        BUCKETS.append((cat, fam))
print("\nbuilding contact sheets...")
for cat, fam in BUCKETS:
    items = sorted([r for r in rows if r["cat"]==cat and r["cfam"]==fam], key=lambda r:-r["uses"])[:48]
    if items: sheet(items, f"{fam}__{cat}")
print("DONE")
