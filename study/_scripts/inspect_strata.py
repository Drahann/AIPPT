# -*- coding: utf-8 -*-
"""Show family strata within curated template folders to guide sampling."""
import csv, sys
from collections import defaultdict
sys.stdout.reconfigure(encoding='utf-8')

IDX = r"W:\ppt\study\00_corpus_index.csv"
WORKS = "创赛作品合集赠送【PPT不是这个文件】"

rows = list(csv.DictReader(open(IDX, encoding="utf-8-sig")))
curated = [r for r in rows if r["top_category"] != WORKS]
works   = [r for r in rows if r["top_category"] == WORKS]

print(f"curated templates: {len(curated)} | real works: {len(works)}\n")
by_fam = defaultdict(list)
for r in curated:
    by_fam[r["family"]].append(r)

for fam in ["blue_tech","green_agri","red_tour","redgold_heritage","med_blue_white","dark_tech","general_unknown"]:
    lst = by_fam.get(fam, [])
    print(f"\n===== {fam}  ({len(lst)} curated) =====")
    # prefer gold first, then by size desc; show up to 14
    lst_sorted = sorted(lst, key=lambda r:(-int(r["gold"]), -float(r["size_mb"])))
    for r in lst_sorted[:14]:
        g = "★" if r["gold"]=="1" else " "
        # show a shortened path: parent/filename
        print(f"  {g} {float(r['size_mb']):6.1f}MB  {r['parent'][:24]:24s} | {r['filename'][:46]}")