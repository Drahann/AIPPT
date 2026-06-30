#!/usr/bin/env python3
"""corpus_index — build compact search indexes over the corpus so agents QUERY, not load all.

Scans corpus/*/{deck_record.json, pages/*.json} -> writes:
  corpus/_pages_index.jsonl   (one tiny row per page: id/family/archetype/slot_signature/desc/render/rec)
  corpus/_decks_index.jsonl   (one row per deck: skin/tokens/style)
Re-run after each batch. Search tools read these (fast, small).

Usage: python corpus_index.py [corpus_root]
"""
import os, sys, json, glob

ROOT = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', 'corpus'))
pf = open(os.path.join(ROOT, '_pages_index.jsonl'), 'w', encoding='utf-8')
df = open(os.path.join(ROOT, '_decks_index.jsonl'), 'w', encoding='utf-8')
nd = npg = 0
for dr in sorted(glob.glob(os.path.join(ROOT, '*', 'deck_record.json'))):
    deckdir = os.path.dirname(dr)
    try:
        d = json.load(open(dr, encoding='utf-8'))
    except Exception:
        continue
    skin = d.get('skin', {})
    df.write(json.dumps({
        'deck_id': d.get('deck_id') or os.path.basename(deckdir),
        'family': d.get('family'), 'track': d.get('track'),
        'style_desc': d.get('style_desc'), 'render_tags': d.get('render_tags'),
        'skin': {k: skin.get(k) for k in ('primary', 'bg_deep', 'text', 'accents')},
        'type_ramp': [t['px'] for t in d.get('design_system', {}).get('type_ramp', [])],
        'margins': d.get('design_system', {}).get('content_margins'),
        'n_pages': len(d.get('pages', [])), 'source_pptx': d.get('source_pptx'),
        'dir': os.path.relpath(deckdir, ROOT).replace('\\', '/'),
    }, ensure_ascii=False) + '\n')
    nd += 1
    for pp in sorted(glob.glob(os.path.join(deckdir, 'pages', '*.json'))):
        try:
            p = json.load(open(pp, encoding='utf-8'))
        except Exception:
            continue
        pf.write(json.dumps({
            'id': p['id'], 'deck': p.get('source_deck'), 'family': p.get('family'),
            'archetype': p.get('archetype'), 'slot_signature': p.get('slot_signature'),
            'content_shape': p.get('content_shape'), 'page_desc': p.get('page_desc'),
            'tags': p.get('tags'),
            'render': os.path.relpath(os.path.join(deckdir, p['render']), ROOT).replace('\\', '/'),
            'rec': os.path.relpath(pp, ROOT).replace('\\', '/'),
            'n_slots': len(p.get('slots', [])), 'n_images': len(p.get('images', [])),
            'n_decor': len(p.get('decor_shapes', [])),
        }, ensure_ascii=False) + '\n')
        npg += 1
pf.close(); df.close()
print(f"indexed {nd} decks, {npg} pages -> {ROOT}\\_pages_index.jsonl + _decks_index.jsonl")
