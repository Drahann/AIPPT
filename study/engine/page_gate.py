#!/usr/bin/env python3
"""page_gate — the S6 mechanical safety net, ALL gates in one command. A page is DONE only when this
exits 0. Built 2026-06-30 after five process bugs slipped through (cross-page asset reuse, gen shrink/
stretch, self-drawn pills, fake transparency, tiny fonts) — the fix is gates that ENFORCE, not an agent
that must remember.

  python page_gate.py <page_dir> --ref <reference_page_id> --cards N

Runs, in order:
  1) PROVENANCE  — no asset in this page's _assets is byte-identical to ANOTHER page's _assets
                   (cross-page reuse of AI gen is forbidden; only the original reference's own
                   harvested parts, which also live under corpus/<deck>/assets, are exempt).
  2) FONT-FLOOR  — every text run in page.record.json is >= FONT_FLOOR px (data-driven, see RAMP).
  3) DECO-CHECK  — delegates to deco_check.py (card_frame≥cards, structural funcs, only-more,
                   SIZE-FIT, NO-SELF-DRAW, STRETCH).
"""
import os, sys, json, glob, hashlib, subprocess, argparse

HERE = os.path.dirname(os.path.abspath(__file__))
RUNS = os.path.join(HERE, '..', 'runs')
CORPUS = os.path.join(HERE, '..', 'corpus')

# ===== data-driven font ramp (measured over 5 blue_tech decks, 958 multi-char readable runs) =====
# median readable text = 26px, p10 = 17px, p25 = 21px.  Almost nothing real is below ~17px.
FONT_FLOOR = 18          # hard floor: no readable text smaller than this (real p10≈17)
RAMP = {                 # use these named sizes; do NOT invent smaller ones
    'note': 18, 'body': 21, 'sub': 24, 'card_title': 30, 'section': 34,
    'headline': 42, 'page_title': 52, 'hero_num': 66,
}


def md5(p):
    return hashlib.md5(open(p, 'rb').read()).hexdigest()


def gate_provenance(page_dir):
    mine = glob.glob(os.path.join(page_dir, '_assets', '*.png'))
    if not mine:
        return True, "no _assets/*.png"
    # hashes of every OTHER page's assets
    others = {}
    for p in glob.glob(os.path.join(RUNS, '*', '*', '_assets', '*.png')):
        if os.path.abspath(os.path.dirname(os.path.dirname(p))) == os.path.abspath(page_dir):
            continue
        others.setdefault(md5(p), []).append(p)
    # hashes of legit reference-harvested parts (corpus assets) are exempt
    corpus_h = set()
    for p in glob.glob(os.path.join(CORPUS, '*', 'assets', '*')):
        if p.lower().endswith(('.png', '.jpg', '.jpeg')):
            try:
                corpus_h.add(md5(p))
            except Exception:
                pass
    bad = []
    for p in mine:
        h = md5(p)
        if h in others and h not in corpus_h:
            bad.append((os.path.basename(p), os.path.relpath(others[h][0], RUNS)))
    if bad:
        return False, "CROSS-PAGE REUSE: " + "; ".join(f"{n} == runs/{o}" for n, o in bad)
    return True, f"{len(mine)} assets, none reused from another page"


def gate_fonts(page_dir):
    rec_p = os.path.join(page_dir, 'page.record.json')
    if not os.path.exists(rec_p):
        return True, "no record"
    rec = json.load(open(rec_p, encoding='utf-8'))
    small = []
    for s in rec.get('shapes', []):
        if s.get('kind') == 'text':
            px = s.get('font_px', 99)
            if px < FONT_FLOOR:
                small.append((round(px, 1), (s.get('text', '')[:14])))
    if small:
        u = sorted(set(p for p, _ in small))
        return False, f"{len(small)} authored run(s) < {FONT_FLOOR}px (sizes {u}); e.g. " + \
            ", ".join(f"{px}px '{t}'" for px, t in small[:4])
    # auto-shrink desync: if render_page had to shrink ANY box, sibling text now differs in size
    # (2026-06-30 用户问题1). Zero tolerance — size peer boxes to the longest item at one shared px.
    fit_p = os.path.join(page_dir, 'page.fit.json')
    if os.path.exists(fit_p):
        fit = json.load(open(fit_p, encoding='utf-8'))
        if fit:
            ex = ", ".join(f"{r['from_px']:.0f}->{r['to_px']:.0f}px '{r['text']}'" for r in fit[:4])
            return False, f"{len(fit)} text box(es) auto-shrunk = sibling sizes now differ; enlarge those " \
                          f"boxes / cut words / add a line so nothing shrinks. e.g. " + ex
    return True, f"all text >= {FONT_FLOOR}px, no auto-shrink"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('page_dir')
    ap.add_argument('--ref', required=True)
    ap.add_argument('--cards', type=int, default=0)
    a = ap.parse_args()
    pd = os.path.abspath(a.page_dir)

    results = []
    ok1, m1 = gate_provenance(pd); results.append(('PROVENANCE', ok1, m1))
    ok2, m2 = gate_fonts(pd); results.append(('FONT-FLOOR', ok2, m2))

    print("=" * 72)
    for name, ok, msg in results:
        print(f"  [{'PASS' if ok else 'FAIL'}] {name:11}: {msg}")
    print("  ---- deco_check ----")
    binding = os.path.join(pd, 'page.binding.json')
    cmd = [sys.executable, os.path.join(HERE, 'deco_check.py'), binding, '--ref', a.ref]
    if a.cards:
        cmd += ['--cards', str(a.cards)]
    r = subprocess.run(cmd)
    ok3 = (r.returncode == 0)
    allok = ok1 and ok2 and ok3
    print("=" * 72)
    print(f"  => PAGE GATE {'PASS ✅ (all checks green)' if allok else 'FAIL ❌ — fix above before moving on'}")
    sys.exit(0 if allok else 1)


if __name__ == '__main__':
    main()
