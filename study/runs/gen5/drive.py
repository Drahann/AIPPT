#!/usr/bin/env python3
"""drive.py <page_module> — build one gen5 page end to end (unicode-safe paths).

  python drive.py p_fin
Imports p_fin.build() -> Page, dumps record/binding into runs/gen5/<H2>/, then
subprocess-calls render_page.py + svg_to_png.py with the locked deck + clean base.
"""
import sys, os, subprocess, importlib

HERE = os.path.dirname(os.path.abspath(__file__))
ENG = os.path.join(HERE, '..', '..', 'engine')
DECK = os.path.join(HERE, '..', '..', 'corpus', 'med_blue_white_2e33d129', 'deck_record.json')
BASE = os.path.join(HERE, '_decos', 'base.png')
sys.path.insert(0, HERE)

mod = importlib.import_module(sys.argv[1])
pg, h2 = mod.build()
out_dir = os.path.join(HERE, h2)
rp, bp = pg.dump(out_dir, 'page')
svg = os.path.join(out_dir, 'page.svg')
png = os.path.join(out_dir, 'page.png')

subprocess.run([sys.executable, os.path.join(ENG, 'render_page.py'),
                '--record', rp, '--binding', bp, '--deck', os.path.abspath(DECK),
                '--plate', os.path.abspath(BASE), '--out', svg], check=True)
subprocess.run([sys.executable, os.path.join(ENG, 'svg_to_png.py'), svg, png], check=True)
print('PAGE OK ->', png)
