#!/usr/bin/env python3
"""build_batch — drive build_corpus over many decks from the corpus index.

Picks decks from study/00_corpus_index.csv (optionally N-per-family for a sample),
runs build_corpus per deck sequentially (COM is single-instance), tolerates per-deck
failures, and logs progress. The VLM key spread is handled inside vlm.py (random start
per process + round-robin), so no single 百炼 key gets hammered.

Usage:
  python build_batch.py --out CORPUS [--per-family N] [--max M] [--families a,b]
                        [--smallest] [--reuse] [--dry]
"""
import os, sys, csv, json, argparse, subprocess, time, hashlib, collections

ENG = os.path.dirname(os.path.abspath(__file__))
PY = sys.executable
INDEX = os.path.join(ENG, '..', '00_corpus_index.csv')

ap = argparse.ArgumentParser()
ap.add_argument('--out', required=True)
ap.add_argument('--per-family', type=int, default=0)
ap.add_argument('--max', type=int, default=0)
ap.add_argument('--families', default='')
ap.add_argument('--ext', default='.pptx', help='only this extension (python-pptx cannot read old .ppt)')
ap.add_argument('--smallest', action='store_true', help='prefer smallest decks (fast sample)')
ap.add_argument('--slide-limit', type=int, default=0, help='cap slides per deck (bounds time on 100+ page monsters)')
ap.add_argument('--reuse', action='store_true')
ap.add_argument('--dry', action='store_true')
a = ap.parse_args()

import re as _re
rows = list(csv.DictReader(open(INDEX, encoding='utf-8-sig')))
if a.ext:
    rows = [r for r in rows if r['ext'].lower() == a.ext.lower()]
want_fam = set(f for f in a.families.split(',') if f)
if want_fam:
    rows = [r for r in rows if r['family'] in want_fam]


def _norm(fn):                                  # collapse re-sold duplicates (same template, diff shop)
    s = fn.rsplit('.', 1)[0]
    s = _re.split(r'--', s)[0]                   # drop "--gzh：…/--淘宝店：…" shop suffix
    s = _re.sub(r'[\(（][^)）]*[\)）]', '', s)     # drop parentheticals like (1)/(64)
    return _re.sub(r'\s+', '', s)


_seen, _ded = set(), []
for r in rows:
    key = (r['family'], _norm(r['filename']))
    if key in _seen:
        continue
    _seen.add(key); _ded.append(r)
rows = _ded
if a.smallest:
    rows.sort(key=lambda r: float(r['size_mb']))

# select N per family (or all)
picked, per = [], collections.Counter()
for r in rows:
    if a.per_family and per[r['family']] >= a.per_family:
        continue
    picked.append(r); per[r['family']] += 1
    if a.max and len(picked) >= a.max:
        break


def deck_id(r):
    h = hashlib.sha1(r['relpath'].encode('utf-8')).hexdigest()[:8]
    return f"{r['family']}_{h}"


log = os.path.join(a.out, '_batch_log.jsonl')
os.makedirs(a.out, exist_ok=True)
print(f"selected {len(picked)} decks: " + ', '.join(f"{k}:{v}" for k, v in per.items()))
if a.dry:
    for r in picked:
        print('  ', deck_id(r), r['size_mb'], r['filename'][:50])
    sys.exit(0)

ok = fail = 0
for i, r in enumerate(picked, 1):
    did = deck_id(r)
    t0 = time.time()
    cmd = [PY, os.path.join(ENG, 'build_corpus.py'), '--pptx', r['fullpath'], '--deck-id', did,
           '--family', r['family'], '--track', r['track'], '--out', a.out]
    if a.slide_limit:
        cmd += ['--limit', str(a.slide_limit)]
    if a.reuse:
        cmd.append('--reuse')
    print(f"[{i}/{len(picked)}] {did}  {r['filename'][:46]} ({r['size_mb']}MB) ...", flush=True)
    p = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='replace')
    dt = round(time.time() - t0, 1)
    rec = {"deck_id": did, "family": r['family'], "relpath": r['relpath'], "sec": dt,
           "ok": p.returncode == 0, "tail": (p.stdout or p.stderr or '')[-200:].replace('\n', ' ')}
    open(log, 'a', encoding='utf-8').write(json.dumps(rec, ensure_ascii=False) + '\n')
    if p.returncode == 0:
        ok += 1; print('   ', p.stdout.strip().split('\n')[-2] if p.stdout else 'ok', f'({dt}s)')
    else:
        fail += 1; print('    FAIL', (p.stderr or p.stdout)[-160:])

print(f"\nbatch done: ok={ok} fail={fail} -> {a.out}")
