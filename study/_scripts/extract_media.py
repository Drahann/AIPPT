# -*- coding: utf-8 -*-
"""Extract embedded media (ppt/media/*) from decks (by deck_id, resolved via sample CSVs).
Classifies each image: bg (slide-aspect & large) / photo / deco-small. Writes to assets/_raw/<deck_id>/.
Usage: python extract_media.py <deck_id> [<deck_id> ...]"""
import os, sys, csv, glob, zipfile, io
sys.stdout.reconfigure(encoding='utf-8')
from PIL import Image

SAMPLES = glob.glob(r"W:\ppt\study\_scripts\sample_*.csv")
OUTROOT = r"W:\ppt\study\assets\_raw"

def resolve(did):
    for s in SAMPLES:
        for r in csv.DictReader(open(s, encoding="utf-8-sig")):
            if r["deck_id"] == did:
                return r["fullpath"], r.get("family","")
    return None, None

def classify(w, h):
    if not w or not h: return "?"
    ar = w/h
    area = w*h
    if 1.6 <= ar <= 1.85 and area >= 800*450: return "BG"        # full-bleed 16:9
    if area >= 300*300 and 0.4 <= ar <= 2.5:   return "PHOTO"     # mid image
    return "deco/small"

for did in sys.argv[1:]:
    path, fam = resolve(did)
    if not path:
        print(f"!! {did} not found in samples"); continue
    outdir = os.path.join(OUTROOT, did)
    os.makedirs(outdir, exist_ok=True)
    z = zipfile.ZipFile(path)
    media = [n for n in z.namelist() if n.startswith("ppt/media/")]
    rows = []
    for n in media:
        ext = os.path.splitext(n)[1].lower()
        if ext not in (".png",".jpg",".jpeg",".jpe",".bmp",".gif",".webp",".emf",".wmf"): continue
        data = z.read(n)
        base = os.path.basename(n)
        out = os.path.join(outdir, base)
        with open(out, "wb") as f: f.write(data)
        w=h=None; cls="vector(emf/wmf)" if ext in (".emf",".wmf") else "?"
        if ext not in (".emf",".wmf"):
            try:
                im = Image.open(io.BytesIO(data)); w,h = im.size; cls = classify(w,h)
            except: pass
        rows.append((base, ext, w, h, round((w/h),2) if (w and h) else 0, len(data)//1024, cls))
    # report sorted by class then size
    order={"BG":0,"PHOTO":1}
    rows.sort(key=lambda r:(order.get(r[6],9), -(r[2] or 0)*(r[3] or 0)))
    print(f"\n=== {did} ({fam}) — {len(rows)} images -> {outdir}")
    nbg=sum(1 for r in rows if r[6]=="BG"); nph=sum(1 for r in rows if r[6]=="PHOTO")
    print(f"    BG={nbg} PHOTO={nph} other={len(rows)-nbg-nph}")
    for base,ext,w,h,ar,kb,cls in rows[:18]:
        print(f"    [{cls:13s}] {str(w)+'x'+str(h):11s} ar{ar:<5} {kb:5d}KB  {base}")