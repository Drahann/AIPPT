# -*- coding: utf-8 -*-
"""Scan corpus, classify each .ppt/.pptx into color-family / track / gold, write index CSV."""
import os, csv, sys
sys.stdout.reconfigure(encoding='utf-8')

ROOT = r"W:\ppt\挑战杯 互联网+三创赛 创青春 国赛金奖级PPT 模板"
OUT  = r"W:\ppt\study\00_corpus_index.csv"

# color-family keyword rules, priority order (first match wins)
FAMILY_RULES = [
    ("redgold_heritage", ["非遗","红金","国粹","京剧","水墨","瓷","釉","传统文化","中国风","本草","东方","古"]),
    ("med_blue_white",   ["医疗","医学","医心","健康","基因","生物","制药","药","护理","康养","养老"]),
    ("green_agri",       ["绿色","农业","乡村振兴","生态","环保","低碳","田","麦","橘","菌","种","农核","赋农","橄榄","植","碳","海洋","浪能"]),
    ("red_tour",         ["红旅","红色","党","公益","志愿","初心","乡之情","筑梦","青春曲","宽肩膀"]),
    ("dark_tech",        ["黑色","黑金","深蓝","源芯","暗"]),
    ("blue_tech",        ["蓝色","蓝白","科技","智慧","智能","互联网","数据","工业","智链","驾培","芯","云","数智","机器人","无人机"]),
]

def classify_family(name, path):
    hay = (name + " " + path)
    for fam, kws in FAMILY_RULES:
        for kw in kws:
            if kw in hay:
                return fam, kw
    return "general_unknown", ""

def classify_track(path, name):
    hay = path + " " + name
    if "部分医学类" in path: return "medical"
    if "红旅" in hay or "乡村振兴" in hay: return "red_rural"
    if "互联网+" in hay or "互联网＋" in hay: return "internet_plus"
    if "挑战杯" in hay: return "challenge_cup"
    if "创青春" in hay: return "youth"
    return "general_chuangsai"

def is_gold(path, name):
    hay = path + " " + name
    return any(k in hay for k in ["国金","国赛金奖","金奖","定拿","国奖"])

rows = []
for dirpath, dirnames, filenames in os.walk(ROOT):
    for fn in filenames:
        ext = os.path.splitext(fn)[1].lower()
        if ext not in (".pptx", ".ppt"): continue
        full = os.path.join(dirpath, fn)
        try: size_mb = round(os.path.getsize(full)/1048576, 2)
        except: size_mb = 0
        rel = os.path.relpath(full, ROOT)
        top = rel.split(os.sep)[0]
        parent = os.path.basename(dirpath)
        fam, kw = classify_family(fn, rel)
        rows.append({
            "top_category": top,
            "track": classify_track(rel, fn),
            "family": fam,
            "family_kw": kw,
            "gold": int(is_gold(rel, fn)),
            "ext": ext,
            "size_mb": size_mb,
            "parent": parent,
            "filename": fn,
            "relpath": rel,
            "fullpath": full,
        })

with open(OUT, "w", newline="", encoding="utf-8-sig") as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
    w.writeheader()
    w.writerows(rows)

# summary
from collections import Counter
print(f"TOTAL decks: {len(rows)}")
print("\n-- by family --")
for k,v in Counter(r["family"] for r in rows).most_common(): print(f"  {k:20s} {v}")
print("\n-- by track --")
for k,v in Counter(r["track"] for r in rows).most_common(): print(f"  {k:20s} {v}")
print("\n-- by top_category --")
for k,v in Counter(r["top_category"] for r in rows).most_common(): print(f"  {v:5d}  {k}")
print(f"\n-- gold-labeled: {sum(r['gold'] for r in rows)} / {len(rows)}")
print(f"-- pptx vs ppt: pptx={sum(1 for r in rows if r['ext']=='.pptx')} ppt={sum(1 for r in rows if r['ext']=='.ppt')}")
print(f"\nIndex -> {OUT}")