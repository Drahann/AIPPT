# -*- coding: utf-8 -*-
"""R3: sample real competition ENTRIES from 作品合集 (not templates) to validate findings.
Also add 2 dark_gold to backfill. Writes sample_R3.csv."""
import csv, sys
sys.stdout.reconfigure(encoding='utf-8')
IDX=r"W:\ppt\study\00_corpus_index.csv"; OUT=r"W:\ppt\study\_scripts\sample_R3.csv"
WORKS="创赛作品合集赠送【PPT不是这个文件】"
prev=set()
for fn in [r"W:\ppt\study\_scripts\sample_R1.csv", r"W:\ppt\study\_scripts\sample_R2.csv"]:
    for r in csv.DictReader(open(fn,encoding="utf-8-sig")): prev.add(r["filename"])
rows=list(csv.DictReader(open(IDX,encoding="utf-8-sig")))

works=[r for r in rows if r["top_category"]==WORKS and r["ext"]==".pptx"
       and 8<=float(r["size_mb"])<=120 and r["filename"] not in prev]
# dedupe filename, spread across size
seen=set(); uw=[]
for r in sorted(works,key=lambda r:-float(r["size_mb"])):
    if r["filename"] in seen: continue
    seen.add(r["filename"]); uw.append(r)
picks=[]
n=len(uw)
for k in range(8):
    picks.append(uw[min(n-1,int(k*n/8))])

# backfill 2 dark_gold templates (curated, not in prev)
dark=[r for r in rows if r["top_category"]!=WORKS and r["family"]=="dark_tech"
      and r["filename"] not in prev and r["ext"]==".pptx"]
dseen=set()
for r in dark:
    if r["filename"] in dseen: continue
    dseen.add(r["filename"])

out=[]
for i,r in enumerate(picks):
    out.append({"deck_id":f"work_{i:02d}", "family":"real_entry", "gold":r["gold"],
                "size_mb":r["size_mb"], "filename":r["filename"], "fullpath":r["fullpath"]})
for j,r in enumerate(dark[:2]):
    out.append({"deck_id":f"darkx_{j:02d}", "family":"dark_tech", "gold":r["gold"],
                "size_mb":r["size_mb"], "filename":r["filename"], "fullpath":r["fullpath"]})

with open(OUT,"w",newline="",encoding="utf-8-sig") as f:
    w=csv.DictWriter(f,fieldnames=["deck_id","family","gold","size_mb","filename","fullpath"]); w.writeheader(); w.writerows(out)
print(f"R3 sample: {len(out)} ({len(picks)} real entries + {len(dark[:2])} dark backfill)")
for o in out: print(f"  [{o['family']:11s}] {o['deck_id']:9s} {float(o['size_mb']):6.1f}MB  {o['filename'][:50]}")
print("->",OUT)