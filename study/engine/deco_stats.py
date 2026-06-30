#!/usr/bin/env python3
"""deco_stats — mine the corpus for HOW templates use functional decorations.

The 金奖 reference decks never leave text bare: they wrap cards in card_frame, flank
titles with title_flank, back big numbers with number_backplate, etc. This tool turns
that habit into DATA so the generator can match it instead of guessing (or hand-drawing):

  * per-archetype decoration playbook: for each archetype, the typical decos-per-page and
    the function-frequency profile (which functional parts appear, how often) — i.e.
    "a solution/content page usually carries ~N decos: mostly card_frame + title_flank + ...".
  * library availability: clean vs dirty parts per function x family. Harvested assets are
    two qualities — source∈{slide,chrome} = real embedded PNG graphics (CLEAN, reusable),
    source=vector = a crop of the RENDER (DIRTY: bakes in the template's placeholder text).
    Consume CLEAN ones; theme-swap their color to the locked skin.

Usage:
  python deco_stats.py                          # full report
  python deco_stats.py --archetype solution     # one archetype's playbook
  python deco_stats.py --family med_blue_white   # library availability for a family
"""
import os, sys, json, glob, collections, argparse

ENG = os.path.dirname(os.path.abspath(__file__))
CORPUS = os.path.join(ENG, '..', 'corpus')
LIB = os.path.join(ENG, '..', 'assets_lib')
FUNCS = ['card_frame', 'title_flank', 'number_backplate', 'icon_pedestal', 'divider',
         'corner_hud', 'bullet_marker', 'ribbon', 'avatar_ring', 'bg_panel', 'connector',
         'glow', 'motif']

ap = argparse.ArgumentParser()
ap.add_argument('--archetype', default='')
ap.add_argument('--family', default='')
a = ap.parse_args()


def page_func_counts(p):
    c = collections.Counter()
    for im in p.get('images', []):
        if im.get('role') in ('decoration', 'icon') and im.get('function') not in ('none', '', None):
            c[im['function']] += 1
    for dc in p.get('decor_shapes', []):
        if dc.get('role') in ('decoration', 'icon') and dc.get('function') not in ('none', '', None):
            c[dc['function']] += 1
    return c


# ---- scan corpus pages ----
arch_decos = collections.defaultdict(list)        # archetype -> [deco count per page]
arch_func = collections.defaultdict(collections.Counter)  # archetype -> Counter(function -> pages-with-it)
arch_n = collections.Counter()
for pp in glob.glob(os.path.join(CORPUS, '*', 'pages', '*.json')):
    try:
        p = json.load(open(pp, encoding='utf-8'))
    except Exception:
        continue
    arch = p.get('archetype', 'content')
    if a.family and p.get('family') != a.family:
        continue
    c = page_func_counts(p)
    arch_decos[arch].append(sum(c.values()))
    arch_n[arch] += 1
    for fn in c:
        arch_func[arch][fn] += 1

# ---- scan assets_lib for clean vs dirty availability ----
avail = collections.defaultdict(lambda: collections.Counter())   # (family) -> Counter(function+":clean/dirty")
fam_func_clean = collections.defaultdict(lambda: collections.defaultdict(lambda: [0, 0]))  # fam->fn->[clean,dirty]
for l in open(os.path.join(LIB, 'index.jsonl'), encoding='utf-8'):
    r = json.loads(l)
    fam = r.get('family', '?'); fn = r.get('function', '?')
    clean = r.get('source') in ('slide', 'chrome')
    fam_func_clean[fam][fn][0 if clean else 1] += 1


def show_archetype(arch):
    n = arch_n[arch]
    if not n:
        print(f"  (no pages for archetype {arch})"); return
    decos = arch_decos[arch]
    avg = sum(decos) / n
    print(f"\n### {arch}  ({n} pages, avg {avg:.1f} functional decos/page)")
    prof = sorted(arch_func[arch].items(), key=lambda kv: -kv[1])
    for fn, pages in prof:
        pct = 100 * pages / n
        print(f"    {fn:16} on {pct:3.0f}% of pages")


print("=" * 64)
print("PER-ARCHETYPE DECORATION PLAYBOOK  (how templates decorate each page type)")
print("=" * 64)
order = ['cover', 'market', 'solution', 'content', 'team', 'financing', 'chart', 'roadmap', 'bignum', 'expert', 'closing', 'toc']
for arch in (([a.archetype] if a.archetype else order)):
    if arch in arch_n:
        show_archetype(arch)

if not a.archetype:
    print("\n" + "=" * 64)
    print("LIBRARY AVAILABILITY  (clean=embedded PNG reusable | dirty=render-crop w/ baked text)")
    print("=" * 64)
    fams = [a.family] if a.family else sorted(fam_func_clean)
    for fam in fams:
        if fam not in fam_func_clean:
            continue
        tot_c = sum(v[0] for v in fam_func_clean[fam].values())
        tot_d = sum(v[1] for v in fam_func_clean[fam].values())
        print(f"\n### {fam}   clean={tot_c} dirty={tot_d}")
        for fn in FUNCS:
            c, d = fam_func_clean[fam].get(fn, [0, 0])
            if c or d:
                print(f"    {fn:16} clean {c:4}  dirty {d:4}")
