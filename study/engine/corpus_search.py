#!/usr/bin/env python3
"""corpus_search — find a REFERENCE page (or deck skin) by structure, without loading the whole corpus.

S1 选页 tool. Returns compact rows (id + archetype + slot_signature + render path + one-line desc) so the
orchestrator picks a design-language reference, then uses get_record.py to load only that page's full detail.

Usage:
  python corpus_search.py --archetype team --family blue_tech            # pages of an archetype/family
  python corpus_search.py --kw 融资 股权                                  # keyword over desc/shape/tags/sig
  python corpus_search.py --sig pie                                       # slot_signature substring
  python corpus_search.py --mode decks --family med_blue_white           # deck skins/tokens
"""
import os, sys, json, argparse

ROOT = os.path.join(os.path.dirname(__file__), '..', 'corpus')
ap = argparse.ArgumentParser()
ap.add_argument('--mode', choices=['pages', 'decks'], default='pages')
ap.add_argument('--family', default='')
ap.add_argument('--archetype', default='')
ap.add_argument('--sig', default='')
ap.add_argument('--kw', nargs='*', default=[])
ap.add_argument('--limit', type=int, default=20)
a = ap.parse_args()

idx = os.path.join(ROOT, '_pages_index.jsonl' if a.mode == 'pages' else '_decks_index.jsonl')
if not os.path.exists(idx):
    sys.exit("index missing — run: python corpus_index.py")
rows = [json.loads(l) for l in open(idx, encoding='utf-8')]


def ok(r):
    if a.family and a.family not in (r.get('family') or ''):
        return False
    if a.mode == 'pages':
        if a.archetype and a.archetype.lower() not in (r.get('archetype') or '').lower():
            return False
        if a.sig and a.sig.lower() not in (r.get('slot_signature') or '').lower():
            return False
        if a.kw:
            blob = (' '.join(str(r.get(k, '')) for k in ('page_desc', 'content_shape', 'slot_signature', 'archetype'))
                    + ' ' + ' '.join(r.get('tags') or [])).lower()
            if not all(k.lower() in blob for k in a.kw):
                return False
    else:
        if a.kw:
            blob = (str(r.get('style_desc', '')) + ' ' + ' '.join(r.get('render_tags') or [])).lower()
            if not all(k.lower() in blob for k in a.kw):
                return False
    return True


out = [r for r in rows if ok(r)][:a.limit]
for r in out:
    if a.mode == 'pages':
        print(f"{r['id']:30} {str(r.get('archetype',''))[:16]:16} | {str(r.get('slot_signature',''))[:38]:38} | s{r['n_slots']}i{r['n_images']}d{r['n_decor']} | {r['render']}")
        print(f"   {r.get('page_desc','')}")
    else:
        sk = r.get('skin', {})
        print(f"{r['deck_id']:26} {str(r.get('family','')):16} skin {sk.get('primary')}/{sk.get('bg_deep')} ramp{r.get('type_ramp')} | {r.get('style_desc','')}")
print(f"\n{len(out)} match (of {len(rows)})")
