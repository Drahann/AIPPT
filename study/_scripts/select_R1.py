# -*- coding: utf-8 -*-
"""Resolve R1 breadth picks (by filename substring) to full paths; write sample_R1.csv."""
import csv, sys, os
sys.stdout.reconfigure(encoding='utf-8')
IDX = r"W:\ppt\study\00_corpus_index.csv"
OUT = r"W:\ppt\study\_scripts\sample_R1.csv"

# (family_label, filename_substring, deck_id)
PICKS = [
    ("blue_tech",        "国金定拿",            "blue_guojin_dingna"),
    ("blue_tech",        "驾培智链",            "blue_jiapei"),
    ("blue_tech",        "20页科技风创赛ppt模板",  "blue_kjf20"),
    ("blue_tech",        "clean angel",        "blue_cleanangel_defense"),
    ("green_agri",       "麦谷丰登",            "green_maigu"),
    ("green_agri",       "28页科技农业创赛PPT静态","green_nongye28"),
    ("green_agri",       "海洋守护",            "green_ocean"),
    ("green_agri",       "南橘北枳",            "green_nanju"),
    ("red_tour",         "红色红旅",            "red_hongse"),
    ("red_tour",         "练就宽肩膀",          "red_kuanjianbang"),
    ("red_tour",         "志愿者在行动",        "red_zhiyuanzhe"),
    ("redgold_heritage", "国奖水准红金风格",      "redgold_kangshuai"),
    ("redgold_heritage", "非遗乐器",            "redgold_yueqi"),
    ("redgold_heritage", "朱红色-非遗",         "redgold_zhuhong"),
    ("redgold_heritage", "蓝染色-非遗",         "redgold_lanran"),
    ("med_blue_white",   "深蓝基因安全",        "med_jiyin"),
    ("med_blue_white",   "蓝青高端医疗定制",      "med_lanqing"),
    ("med_blue_white",   "VR养老",            "med_vryanglao"),
    ("dark_tech",        "编号0012",           "dark_heijin0012"),
    ("dark_tech",        "芯片工科模板",         "dark_xinpian"),
    ("general_unknown",  "星空未来",            "gen_xingkong"),
    ("general_unknown",  "畅行有方",            "gen_changxing"),
]

rows = list(csv.DictReader(open(IDX, encoding="utf-8-sig")))
out = []
seen_paths = set()
for fam, sub, did in PICKS:
    # find candidate rows whose filename contains substring; prefer smallest size for speed unless flagship gold
    cands = [r for r in rows if sub in r["filename"]]
    if not cands:
        print(f"  !! NO MATCH for {did} ({sub})")
        continue
    # prefer .pptx over .ppt, then prefer gold, then median-ish size (avoid >300MB)
    cands.sort(key=lambda r:(r["ext"]!=".pptx", -int(r["gold"]), abs(float(r["size_mb"])-120)))
    r = cands[0]
    if r["fullpath"] in seen_paths:
        # next distinct
        for c in cands:
            if c["fullpath"] not in seen_paths: r=c; break
    if r["fullpath"] in seen_paths:
        print(f"  ~ dup skip {did}")
        continue
    seen_paths.add(r["fullpath"])
    out.append({"deck_id":did, "family":fam, "gold":r["gold"], "size_mb":r["size_mb"],
                "filename":r["filename"], "fullpath":r["fullpath"]})

with open(OUT,"w",newline="",encoding="utf-8-sig") as f:
    w=csv.DictWriter(f, fieldnames=["deck_id","family","gold","size_mb","filename","fullpath"])
    w.writeheader(); w.writerows(out)

print(f"R1 sample: {len(out)} decks")
for o in out:
    g="★" if o["gold"]=="1" else " "
    print(f"  {g} [{o['family']:17s}] {o['deck_id']:24s} {float(o['size_mb']):6.1f}MB  {o['filename'][:40]}")
print(f"\n-> {OUT}")