#!/usr/bin/env python3
"""drive.py <page_module> — build ONE page end to end (per-reference skin).

The page module must define module-level DECK (path to the CHOSEN reference's deck_record.json,
for skin/fonts) and BASE (path to this page's clean_base png, made from that same reference deck),
and a build() -> (Page, out_name). Each page picks its OWN reference + skin (no locked deck).

  python drive.py p18
"""
import sys, os, subprocess, importlib

HERE = os.path.dirname(os.path.abspath(__file__))
ENG = os.path.join(HERE, '..', '..', 'engine')
sys.path.insert(0, HERE)

mod = importlib.import_module(sys.argv[1])
pg, name = mod.build()
out_dir = os.path.join(HERE, name)
rp, bp = pg.dump(out_dir, 'page')
svg = os.path.join(out_dir, 'page.svg')
png = os.path.join(out_dir, 'page.png')
subprocess.run([sys.executable, os.path.join(ENG, 'render_page.py'),
                '--record', rp, '--binding', bp, '--deck', os.path.abspath(mod.DECK),
                '--plate', os.path.abspath(mod.BASE), '--out', svg], check=True)
subprocess.run([sys.executable, os.path.join(ENG, 'svg_to_png.py'), svg, png], check=True)
print('PAGE OK ->', png)
