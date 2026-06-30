# -*- coding: utf-8 -*-
"""Harvest ALL embedded media from every .pptx under ROOT, dedup by sha1, analyze
(dims / transparency / dominant-color→family / rough category), index to JSONL, save
deduped originals to _pool/. Resumable. Foundation for the curated asset library."""
import os, sys, zipfile, hashlib, json, io, glob, colorsys, time
sys.stdout.reconfigure(encoding='utf-8')
from PIL import Image
Image.MAX_IMAGE_PIXELS = None

ROOT = r"W:\ppt\挑战杯 互联网+三创赛 创青春 国赛金奖级PPT 模板"
OUT  = r"W:\ppt\study\assets_lib"
POOL = os.path.join(OUT, "_pool")
IDXP = os.path.join(OUT, "_index.jsonl")
os.makedirs(POOL, exist_ok=True)
IMG_EXT = {".png", ".jpg", ".jpeg", ".jpe", ".bmp", ".webp"}  # skip gif(anim)/emf/wmf for v1

# map top folder -> source family hint (track-level)
def src_family(path):
    p = path
    if "医学" in p: return "med"
    if "乡村振兴" in p or "红旅" in p: return "red_or_agri"
    if "作品合集" in p: return "bp_generic"
    return "chuangsai"

seen = {}  # sha1 -> count (popularity across decks)
if os.path.exists(IDXP):
    for line in open(IDXP, encoding="utf-8"):
        try:
            r = json.loads(line); seen[r["sha1"]] = r.get("uses", 1)
        except: pass
already = set(seen)

def hsv_family(h, s, v):
    if s < 0.16: return "neutral"
    if 175 <= h <= 255: return "tech_blue"
    if 80 <= h < 175:  return "agri_green"
    if h >= 340 or h < 14: return "red"
    if 14 <= h < 48:   return "heritage_gold"
    if 255 < h < 340:  return "violet_misc"
    return "misc"

def analyze(data):
    im = Image.open(io.BytesIO(data)); w, h = im.size
    alpha_frac = 0.0
    if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
        a = im.convert("RGBA").split()[-1].resize((40, 40))
        px = list(a.getdata()); alpha_frac = sum(1 for q in px if q < 240) / len(px)
    rgb = im.convert("RGBA").resize((40, 40)); pix = list(rgb.getdata())
    op = [(r, g, b) for (r, g, b, al) in pix if al > 200]
    mid = [(r, g, b) for (r, g, b) in op if not (r > 235 and g > 235 and b > 235) and not (r < 22 and g < 22 and b < 22)]
    use = mid if len(mid) > 25 else (op if op else [(128, 128, 128)])
    n = len(use); cr = sum(c[0] for c in use)/n; cg = sum(c[1] for c in use)/n; cb = sum(c[2] for c in use)/n
    hh, ss, vv = colorsys.rgb_to_hsv(cr/255, cg/255, cb/255)
    return w, h, im.mode, round(alpha_frac, 3), (int(cr), int(cg), int(cb)), round(hh*360, 1), round(ss, 2), round(vv, 2)

def category(w, h, alpha_frac):
    ar = w / h; big = w*h >= 800*450; transp = alpha_frac >= 0.12
    if not transp and 1.55 <= ar <= 1.86 and big: return "background"
    if not transp and big and 0.45 <= ar <= 2.2:  return "photo"
    if transp:
        if ar >= 2.4: return "fx_strip"
        if 0.88 <= ar <= 1.14: return "deco_square"
        if ar <= 0.72: return "cutout_tall"
        return "deco_misc"
    return "texture_small"

files = glob.glob(ROOT + "/**/*.pptx", recursive=True)
print(f"[harvest] {len(files)} pptx; already indexed {len(already)} unique assets", flush=True)
idx = open(IDXP, "a", encoding="utf-8")
t0 = time.time(); new = 0; scanned = 0
for fi, f in enumerate(files):
    try: z = zipfile.ZipFile(f)
    except: continue
    fam_src = src_family(f); deck = os.path.basename(os.path.dirname(f))
    for n in z.namelist():
        if not n.startswith("ppt/media/"): continue
        ext = os.path.splitext(n)[1].lower()
        if ext not in IMG_EXT: continue
        try: data = z.read(n)
        except: continue
        if len(data) < 3072: continue  # skip <3KB junk
        sha = hashlib.sha1(data).hexdigest()
        scanned += 1
        if sha in seen:
            seen[sha] += 1; continue
        try: w, h, mode, af, dom, hue, sat, val = analyze(data)
        except: continue
        if w < 80 or h < 80: continue
        cat = category(w, h, af); cfam = hsv_family(hue, sat, val)
        out = os.path.join(POOL, sha + ext)
        try:
            with open(out, "wb") as o: o.write(data)
        except: continue
        seen[sha] = 1; new += 1
        idx.write(json.dumps({"sha1": sha, "ext": ext, "w": w, "h": h, "ar": round(w/h, 2),
            "alpha": af, "cat": cat, "cfam": cfam, "dom": dom, "hue": hue, "sat": sat, "val": val,
            "kb": len(data)//1024, "deck": deck, "src": fam_src, "uses": 1}, ensure_ascii=False) + "\n")
        if new % 500 == 0:
            idx.flush(); print(f"  ..deck {fi+1}/{len(files)} | new {new} | scanned {scanned} | {time.time()-t0:.0f}s", flush=True)
idx.close()
# write popularity counts
json.dump(seen, open(os.path.join(OUT, "_counts.json"), "w"), )
print(f"[harvest DONE] unique new {new} | total unique {len(seen)} | scanned refs {scanned} | {time.time()-t0:.0f}s", flush=True)
