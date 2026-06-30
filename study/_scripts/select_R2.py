# -*- coding: utf-8 -*-
"""R2 sample: 20 NEW decks (not in R1), stratified with emphasis on falsification targets
(more red_tour + general for density question, more redgold for serif check). Prefer curated,
gold, .pptx, varied size. Writes sample_R2.csv."""
import csv, sys
from collections import defaultdict
sys.stdout.reconfigure(encoding='utf-8')
IDX = r"W:\ppt\study\00_corpus_index.csv"
R1  = r"W:\ppt\study\_scripts\sample_R1.csv"
OUT = r"W:\ppt\study\_scripts\sample_R2.csv"
WORKS = "创赛作品合集赠送【PPT不是这个文件】"

r1_paths = {r["fullpath"] for r in csv.DictReader(open(R1, encoding="utf-8-sig"))}
r1_files = {r["filename"] for r in csv.DictReader(open(R1, encoding="utf-8-sig"))}
rows = list(csv.DictReader(open(IDX, encoding="utf-8-sig")))

# per-family quota (emphasis on red, general, redgold)
QUOTA = {"red_tour":4, "general_unknown":4, "redgold_heritage":4, "green_agri":3,
         "blue_tech":2, "med_blue_white":2, "dark_tech":1}

# candidate pool: curated only, not in R1 (by path AND filename), pptx preferred, dedupe filename
seen_files = set(r1_files)
pool = defaultdict(list)
for r in rows:
    if r["top_category"] == WORKS: continue
    if r["fullpath"] in r1_paths: continue
    if r["filename"] in seen_files: continue
    pool[r["family"]].append(r)

out = []
for fam, q in QUOTA.items():
    cands = pool.get(fam, [])
    # prefer pptx, gold, then spread sizes (pick varied: largest, mid, small...)
    cands = [c for c in cands if c["filename"] not in seen_files]
    cands.sort(key=lambda r:(r["ext"]!=".pptx", -int(r["gold"]), -float(r["size_mb"])))
    picks = []
    # take spread across size to get variety: top, and evenly sampled
    if cands:
        idxs = set()
        n=len(cands)
        for k in range(q):
            idxs.add(min(n-1, int(k*n/max(1,q))))
        for i in sorted(idxs):
            c=cands[i]
            if c["filename"] in seen_files: continue
            picks.append(c); seen_files.add(c["filename"])
    for c in picks:
        did = f"{fam.split('_')[0]}_{len(out):02d}_" + ''.join(ch for ch in c['parent'] if ch.isalnum())[:10]
        out.append({"deck_id":did, "family":fam, "gold":c["gold"], "size_mb":c["size_mb"],
                    "filename":c["filename"], "fullpath":c["fullpath"]})

with open(OUT,"w",newline="",encoding="utf-8-sig") as f:
    w=csv.DictWriter(f, fieldnames=["deck_id","family","gold","size_mb","filename","fullpath"])
    w.writeheader(); w.writerows(out)
print(f"R2 sample: {len(out)} decks")
for o in out:
    g="★" if o["gold"]=="1" else " "
    print(f"  {g} [{o['family']:17s}] {o['deck_id']:22s} {float(o['size_mb']):6.1f}MB  {o['filename'][:42]}")
print("->",OUT)