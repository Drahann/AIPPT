# -*- coding: utf-8 -*-
import json, re, os, sys, urllib.request, io
sys.stdout.reconfigure(encoding='utf-8')
from PIL import Image
d = json.load(open(r"W:\ppt\postppt.json", encoding="utf-8"))
c = d["content"]
imgs = re.findall(r'!\[([^\]]*)\]\(([^)]+)\)', c)
OUT = r"W:\ppt\ppt-master\projects\huanbai_medical_ppt169_20260626\images"
os.makedirs(OUT, exist_ok=True)
def san(s):
    s = re.sub(r'[^\w一-鿿]+', '_', s).strip('_')
    return s[:18] or "img"
hdr = {"User-Agent": "Mozilla/5.0"}
manifest = []
for i, (alt, url) in enumerate(imgs, 1):
    url = url.strip()
    name = f"src{i:02d}_{san(alt)}.png"
    out = os.path.join(OUT, name)
    try:
        req = urllib.request.Request(url, headers=hdr)
        data = urllib.request.urlopen(req, timeout=40).read()
        im = Image.open(io.BytesIO(data)); w, h = im.size
        with open(out, "wb") as f: f.write(data)
        manifest.append({"name": name, "alt": alt, "w": w, "h": h, "ar": round(w/h, 2), "kb": len(data)//1024})
        print(f"OK  {name:34s} {w}x{h} {len(data)//1024}KB  | {alt[:30]}")
    except Exception as e:
        print(f"ERR {name:34s} {str(e)[:60]} | {url[:80]}")
json.dump(manifest, open(os.path.join(OUT, "_src_images.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"\n{len(manifest)}/{len(imgs)} downloaded -> {OUT}")
