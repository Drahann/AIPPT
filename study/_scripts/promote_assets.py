# -*- coding: utf-8 -*-
"""Promote curated subset from _pool into the named library under
skills/ppt-master/templates/assets_lib/<family>/<category>/<family>_<category>_NNNN.ext
+ build MANIFEST.json. Quality levers: popularity(uses) + alpha + aspect + per-bucket caps.
Genuine stock decoration is reused across decks (high uses); one-off photos/cutouts are uses=1."""
import os, sys, json, shutil
sys.stdout.reconfigure(encoding='utf-8')
OUT = r"W:\ppt\study\assets_lib"; POOL = os.path.join(OUT, "_pool")
LIB = r"W:\ppt\ppt-master\skills\ppt-master\templates\assets_lib"
rows = [json.loads(l) for l in open(os.path.join(OUT, "_index.jsonl"), encoding="utf-8")]
counts = json.load(open(os.path.join(OUT, "_counts.json")))
for r in rows: r["uses"] = counts.get(r["sha1"], 1)

FAMS = ["tech_blue", "agri_green", "red", "heritage_gold", "neutral"]
# map harvest cat -> (lib category, subtype, filter, cap, neutral_cap)
def promote_plan(r):
    c = r["cat"]; a = r["alpha"]; ar = r["ar"]; u = r["uses"]; kb = r["kb"]
    if c == "background" and a < 0.12 and 1.5 <= ar <= 1.9 and kb >= 25:
        return ("background", "atmosphere_or_scene")
    if c == "fx_strip" and a >= 0.25 and ar >= 2.4:
        return ("fx", "light_strip")
    if c == "deco_square" and a >= 0.25 and u >= 2:
        return ("decoration", "ring_orb")
    if c == "deco_misc" and a >= 0.25 and u >= 2:
        return ("decoration", "misc")
    if c == "cutout_tall" and a >= 0.3 and ar <= 0.72:
        return ("cutout", "person_or_object")
    return (None, None)

CAP = {"background": 50, "fx": 50, "decoration": 90, "cutout": 24}
buckets = {}  # (fam, libcat) -> list
for r in rows:
    if r["cfam"] not in FAMS: continue
    libcat, subtype = promote_plan(r)
    if not libcat: continue
    # neutral is low-saturation → catches logos/watermarks/screenshots; require stronger reuse
    if r["cfam"] == "neutral" and libcat in ("fx", "decoration") and r["uses"] < 3: continue
    if r["cfam"] == "neutral" and libcat == "background" and r["uses"] < 2: continue
    r["_libcat"] = libcat; r["_subtype"] = subtype
    buckets.setdefault((r["cfam"], libcat), []).append(r)

if os.path.exists(LIB): shutil.rmtree(LIB)
manifest = []
for (fam, libcat), items in sorted(buckets.items()):
    cap = CAP[libcat] * (3 if fam == "neutral" and libcat in ("fx", "decoration", "background") else 1)
    items.sort(key=lambda r: (-r["uses"], -(r["w"]*r["h"])))
    chosen = items[:cap]
    d = os.path.join(LIB, fam, libcat); os.makedirs(d, exist_ok=True)
    for i, r in enumerate(chosen, 1):
        fn = f"{fam}_{libcat}_{i:04d}{r['ext']}"
        try: shutil.copy(os.path.join(POOL, r["sha1"]+r["ext"]), os.path.join(d, fn))
        except: continue
        manifest.append({"file": f"{fam}/{libcat}/{fn}", "family": fam, "category": libcat,
            "subtype": r["_subtype"], "w": r["w"], "h": r["h"], "ar": r["ar"], "alpha": r["alpha"],
            "dom": r["dom"], "uses": r["uses"], "src_deck": r["deck"], "sha1": r["sha1"]})
json.dump({"version": 1, "count": len(manifest), "assets": manifest},
          open(os.path.join(LIB, "MANIFEST.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
from collections import Counter
print(f"PROMOTED {len(manifest)} assets -> {LIB}")
for k, v in sorted(Counter((m["family"], m["category"]) for m in manifest).items()):
    print(f"  {k[0]:14s} {k[1]:12s} {v}")
