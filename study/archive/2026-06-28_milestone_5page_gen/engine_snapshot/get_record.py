#!/usr/bin/env python3
"""get_record — print ONE full record by id, after you've selected it via corpus_search.

  python get_record.py <page_id>        e.g. liangyao_p04   -> full page_record (slots/images/decor_shapes)
  python get_record.py <deck_id>        e.g. liangyao        -> full deck_record (skin/design_system/chrome)
  python get_record.py <deck_id> deck   force deck record
"""
import os, sys, glob

ROOT = os.path.join(os.path.dirname(__file__), '..', 'corpus')
q = sys.argv[1]
force_deck = len(sys.argv) > 2 and sys.argv[2] == 'deck'

hits = []
if not force_deck:
    hits = glob.glob(os.path.join(ROOT, '*', 'pages', q + '.json'))
if not hits:
    hits = glob.glob(os.path.join(ROOT, q, 'deck_record.json'))
if hits:
    sys.stdout.write(open(hits[0], encoding='utf-8').read())
else:
    print("not found:", q)
