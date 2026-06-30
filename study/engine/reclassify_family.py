#!/usr/bin/env python3
"""reclassify_family — fix MIS-LABELED deck families WITHOUT rebuilding the corpus.

Root cause of library pollution: `family` is a MANUAL `--family` arg at build time
(build_corpus.py), not derived from content — so a few decks got the wrong label
(e.g. the green/national herbal deck `med_blue_white_629face9` poisoning the blue
med library). Family is just a label/dir, so fixing it = relabel + move asset files,
no re-parse / re-render / re-VLM.

For each deck in MAP it:
  1) rewrites family in corpus/<deck>/deck_record.json + corpus/<deck>/pages/*.json
  2) updates assets_lib/index.jsonl family field for that deck's rows
  3) MOVES the harvested asset files  assets_lib/<fn>/<oldfam>/  ->  <fn>/<newfam>/
  4) (then run corpus_index.py to regenerate _decks_index / _pages_index)

Usage:  python reclassify_family.py [--dry-run]
"""
import os, sys, json, glob, shutil

ENG = os.path.dirname(os.path.abspath(__file__))
CORPUS = os.path.join(ENG, '..', 'corpus')
LIB = os.path.join(ENG, '..', 'assets_lib')
DRY = '--dry-run' in sys.argv

# deck folder/id  ->  correct family  (style_desc directly contradicts the labeled family)
MAP = {
    'med_blue_white_629face9': 'redgold_heritage',   # 深绿+米金书法+艾草祥云国风 (NOT blue medical)
    'green_agri_cce959cc':     'redgold_heritage',   # 米黄宣纸+红书法+祥云仙鹤国潮 (NOT green agri)
    'green_agri_ce8dbe41':     'redgold_heritage',   # 深棕暗金+传统纹样+非遗 (NOT green agri)
    'red_tour_b3841e36':       'blue_tech',          # 深蓝科技+发光芯片电路板 (NOT red tour)
}


def rewrite_json(path, newfam):
    d = json.load(open(path, encoding='utf-8'))
    d['family'] = newfam
    if not DRY:
        json.dump(d, open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


for deck, newfam in MAP.items():
    dd = os.path.join(CORPUS, deck)
    if not os.path.isdir(dd):
        print(f"!! corpus dir missing: {deck}"); continue
    oldfam = json.load(open(os.path.join(dd, 'deck_record.json'), encoding='utf-8')).get('family')
    print(f"\n== {deck}: {oldfam} -> {newfam} ==")
    rewrite_json(os.path.join(dd, 'deck_record.json'), newfam)
    pages = glob.glob(os.path.join(dd, 'pages', '*.json'))
    for p in pages:
        rewrite_json(p, newfam)
    print(f"   records: deck_record + {len(pages)} pages relabeled")

# update assets_lib/index.jsonl + move files
idx_path = os.path.join(LIB, 'index.jsonl')
rows = [json.loads(l) for l in open(idx_path, encoding='utf-8')]
moved = relabeled = 0
for r in rows:
    deck = r.get('deck')
    if deck in MAP:
        newfam = MAP[deck]
        oldfam = r.get('family')
        if oldfam == newfam:
            continue
        fn = r['function']; asset = r['asset']
        src = os.path.join(LIB, fn, oldfam, asset)
        dst = os.path.join(LIB, fn, newfam, asset)
        if os.path.exists(src):
            if not DRY:
                os.makedirs(os.path.dirname(dst), exist_ok=True)
                shutil.move(src, dst)
            moved += 1
        r['family'] = newfam
        relabeled += 1
if not DRY:
    with open(idx_path, 'w', encoding='utf-8') as f:
        for r in rows:
            f.write(json.dumps(r, ensure_ascii=False) + '\n')
print(f"\nassets_lib: {relabeled} index rows relabeled, {moved} files moved  {'(dry-run)' if DRY else ''}")
print("next: python corpus_index.py")
