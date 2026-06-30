#!/usr/bin/env python3
"""export_pptx — assemble finished pages into a real 16:9 .pptx (S6 导出).

Each page in this pipeline renders to a deterministic, final 1280x720 image (page.png) from its
page.svg. The faithful, reliable export is therefore ONE full-bleed image per slide — pixel-identical
to what the render/gate approved (the SVG->native-shape path is parked, see PLAN_创赛特化改造.md). With
--hires the page's SVG is re-rasterized at 2x so the slide stays crisp on a projector.

Usage:
  python export_pptx.py -o deck.pptx <page_dir> [<page_dir> ...]
  python export_pptx.py -o deck.pptx --deck ../runs/rareearth        # auto-discover p*/ in page order
  python export_pptx.py -o deck.pptx --deck ../runs/rareearth --hires

A page_dir must contain page.png (and page.svg for --hires). Pages are ordered by the number in the
folder name (p18_财务规划 -> 18); pass dirs explicitly to force a custom order.
"""
import os, sys, re, glob, argparse, subprocess, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))


def page_num(d):
    m = re.search(r'p(\d+)', os.path.basename(os.path.normpath(d)))
    return int(m.group(1)) if m else 10**9


def collect(args):
    dirs = list(args.page_dirs)
    if args.deck:
        found = [d for d in glob.glob(os.path.join(args.deck, 'p*')) if os.path.isdir(d)]
        dirs += sorted(found, key=page_num)
    # de-dup preserving order
    seen, out = set(), []
    for d in dirs:
        ad = os.path.abspath(d)
        if ad not in seen and os.path.isdir(ad):
            seen.add(ad); out.append(ad)
    return out


def page_image(d, hires, tmp):
    """Return a path to this page's slide image (re-rasterizing the SVG at 2x if --hires)."""
    png = os.path.join(d, 'page.png')
    svg = os.path.join(d, 'page.svg')
    if hires and os.path.exists(svg):
        out = os.path.join(tmp, os.path.basename(d) + '@2x.png')
        r = subprocess.run([sys.executable, os.path.join(HERE, 'svg_to_png.py'), svg, out, '2560', '1440'],
                           capture_output=True, text=True)
        if os.path.exists(out):
            return out
        print(f"  ! hires re-raster failed for {os.path.basename(d)} ({r.stderr[-120:].strip()}); using page.png")
    return png if os.path.exists(png) else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('page_dirs', nargs='*', help='page folders (each with page.png), in slide order')
    ap.add_argument('--deck', default='', help='auto-discover <deck>/p*/ in page-number order')
    ap.add_argument('-o', '--out', required=True)
    ap.add_argument('--hires', action='store_true', help='re-rasterize each SVG at 2x for crisp slides')
    a = ap.parse_args()

    from pptx import Presentation
    from pptx.util import Inches

    dirs = collect(a)
    if not dirs:
        sys.exit("no page dirs (pass folders or --deck <runs/deck>)")

    prs = Presentation()
    prs.slide_width = Inches(13.333)        # standard 16:9
    prs.slide_height = Inches(7.5)
    blank = prs.slide_layouts[6]

    tmp = tempfile.mkdtemp(prefix='pptx_export_')
    n_ok, n_skip = 0, 0
    for d in dirs:
        img = page_image(d, a.hires, tmp)
        if not img:
            print(f"  [skip] {os.path.basename(d)} — no page.png"); n_skip += 1; continue
        slide = prs.slides.add_slide(blank)
        slide.shapes.add_picture(img, 0, 0, width=prs.slide_width, height=prs.slide_height)
        print(f"  [slide {n_ok+1}] {os.path.basename(d)}{'  (2x)' if a.hires else ''}")
        n_ok += 1

    if not n_ok:
        sys.exit("no slides written")
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    prs.save(a.out)
    print(f"\nPPTX OK -> {a.out}  ({n_ok} slides{', '+str(n_skip)+' skipped' if n_skip else ''}, 16:9)")


if __name__ == '__main__':
    main()
