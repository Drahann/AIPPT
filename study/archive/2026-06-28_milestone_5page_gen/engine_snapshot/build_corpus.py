#!/usr/bin/env python3
"""build_corpus — offline asset-library builder for ONE deck (ARCH §2 build pipeline).

Per deck:  extract_deck(skin) -> render_ref(COM, all slides) -> parse_page(geometry per
slide) -> VLM page-call (context-aware: archetype/slot_signature/page_desc/tags + per-image
role/FUNCTION/desc/treatment, judged WITH the page visible) -> merge -> corpus records.
Then HARVEST functional decorations (role decoration/icon + a function) into a cross-deck
assets_lib indexed by function x family (the "card_frame / title_flank 麦穗 / icon_pedestal"
parts that make templates look polished).

Usage:
  python build_corpus.py --pptx P --deck-id ID --family F --track T --out CORPUS \
      [--limit N] [--reuse] [--model qwen3.7-max-2026-06-08]
"""
import os, sys, json, shutil, argparse, subprocess, tempfile, hashlib, collections
from concurrent.futures import ThreadPoolExecutor
from PIL import Image
from vlm import VLM

ENG = os.path.dirname(os.path.abspath(__file__))
PY = sys.executable

ap = argparse.ArgumentParser()
ap.add_argument('--pptx', required=True)
ap.add_argument('--deck-id', required=True)
ap.add_argument('--family', default='')
ap.add_argument('--track', default='')
ap.add_argument('--out', required=True)            # corpus root
ap.add_argument('--assets-lib', default=os.path.join(ENG, '..', 'assets_lib'))
ap.add_argument('--limit', type=int, default=0)    # limit slides (debug)
ap.add_argument('--reuse', action='store_true')    # skip render/parse if present
ap.add_argument('--model', default='qwen3.7-max-2026-06-08')
a = ap.parse_args()

deckdir = os.path.join(a.out, a.deck_id)
RENDERS = os.path.join(deckdir, 'renders')
ASSETS = os.path.join(deckdir, 'assets')
PAGES = os.path.join(deckdir, 'pages')
RAW = os.path.join(deckdir, '_raw')
for d in (RENDERS, ASSETS, PAGES, RAW):
    os.makedirs(d, exist_ok=True)

FUNCTIONS = ("card_frame title_flank number_backplate icon_pedestal divider corner_hud "
             "bullet_marker ribbon avatar_ring bg_panel connector glow motif none")

PAGE_PROMPT = """你在为"创赛PPT复刻生成"系统建资产库。这是一页PPT的渲染图，下面按 id 列出了这页所有的图形资产(图片+矢量装饰)。
请只输出JSON：
{{
 "archetype":"从[cover,toc,content,team,expert,financing,roadmap,market,solution,bignum,chart,closing]选最接近的一个——**禁止输出 other**，再不像也要选最近的",
 "slot_signature":"**必填**·结构指纹英文短语(描述这页骨架)，如 5way_pie+spend_cards / 6_person_grid / 3stage_bands / left_text+right_image",
 "content_shape":"这页适合装什么形状的内容(中文短语)",
 "page_desc":"整页一句话(中文≤40字)",
 "tags":["中文标签3-6个"],
 "images":{{ "资产id(用下面清单给的id)": {{
    "role":"从[chrome,decoration,icon,content-placeholder,hero,chart,photo]选一",
    "function":"这件资产在版面里的组合作用，从[{funcs}]选一(尽量给具体function，少用none)",
    "desc":"画的是什么(中文≤18字)",
    "theme_meaning":"主题含义(如 科技HUD/医疗/农业麦穗/通用)",
    "treatment":"从[reuse,theme-swap,content-regen]选一",
    "reusable": true或false
 }} }}
}}
**清单里每个 id 都要在 images 里给一条**(图片和矢量装饰都要判)。
判据：背景/整页边框/导航条=chrome+reuse；主题装饰(麦穗/飘带/圆环/光效/光斑/螺旋/边框)=decoration+theme-swap；功能小图标=icon+reuse；
人像/产品/示意图/截图/文档=content-placeholder+content-regen；主视觉大图=hero+content-regen；图表=chart。
function 抓"怎么用"：套在卡片外框=card_frame；标题或重点两侧对称装饰=title_flank；大数字背后的衬底=number_backplate；
图标下面的台座=icon_pedestal；分隔条=divider；四角=corner_hud；列表前的点=bullet_marker；金句条=ribbon；
人像框=avatar_ring；半透内容面板=bg_panel；流程箭头=connector；光斑=glow；主题主视觉motif=motif；都不是=none。
图片资产清单：
{inventory}"""

STYLE_PROMPT = """看这张PPT封面/内页，用中文一句话(≤40字)描述这套模板的整体视觉风格(配色/质感/装饰/字感)，
再给3-6个英文风格标签。只输出JSON：{"style_desc":"...","render_tags":["..."]}"""

CHROME_PROMPT = """这是从PPT版式/母版抠出的一张持久装饰图(尺寸 {box})。它是模板"每处文字底下都垫装饰"的那类零件。只输出JSON：
{{"role":"从[chrome,decoration,icon]选一","function":"组合作用，从[{funcs}]选一",
"desc":"画的是什么(中文≤16字)","theme_meaning":"主题(科技HUD/医疗/农业麦穗/通用等)",
"treatment":"从[reuse,theme-swap]选一","reusable":true或false}}
function：卡片外框=card_frame；标题/重点两侧对称(麦穗/chevron/花纹)=title_flank；数字衬底=number_backplate；
图标台座=icon_pedestal；分隔条=divider；四角=corner_hud；列表点=bullet_marker；金句条=ribbon；人像框=avatar_ring；
半透面板=bg_panel；流程箭头=connector；光斑光效=glow；主题motif=motif；都不是=none。"""


def run(*cmd):
    r = subprocess.run([PY] + list(cmd), capture_output=True, text=True, encoding='utf-8', errors='replace')
    if r.returncode != 0:
        sys.stderr.write(r.stdout + '\n' + r.stderr + '\n')
        raise RuntimeError(f"subprocess failed: {cmd[0]}")
    return r.stdout


# 1) deck skin
if not (a.reuse and os.path.exists(os.path.join(deckdir, 'deck_record.json'))):
    run(os.path.join(ENG, 'extract_deck.py'), a.pptx, deckdir)
deck = json.load(open(os.path.join(deckdir, 'deck_record.json'), encoding='utf-8'))

# 2) render all slides (COM, once)
have = sorted(f for f in os.listdir(RENDERS) if f.endswith('.png'))
if not (a.reuse and have):
    run(os.path.join(ENG, 'render_ref.py'), a.pptx, RENDERS)
    have = sorted(f for f in os.listdir(RENDERS) if f.endswith('.png'))
slides = [int(f[1:3]) for f in have]
if a.limit:
    slides = slides[:a.limit]

# 3) parse geometry per slide (writes page_record.raw.json + pic*.png into _raw/sNN)
for s in slides:
    sd = os.path.join(RAW, f"s{s:02d}")
    if not (a.reuse and os.path.exists(os.path.join(sd, 'page_record.raw.json'))):
        os.makedirs(sd, exist_ok=True)
        run(os.path.join(ENG, 'parse_page.py'), a.pptx, str(s), sd)

vlm = VLM(model=a.model)


def _deco_like(sh):
    """a vector shape worth cataloguing as a reusable decoration: has visual + sane size, not full-bleed."""
    if sh.get('kind') != 'shape':
        return False
    b = sh['box']
    if b[2] < 40 or b[3] < 40 or (b[2] > 1200 and b[3] > 650):
        return False
    fp = sh.get('fillp') or {}
    return bool((fp.get('type') and fp['type'] != 'none') or sh.get('line') or sh.get('effects') or (sh.get('geom') or {}).get('path'))


def inventory_of(raw):
    lines = []
    for sh in raw['shapes']:
        if sh.get('kind') == 'pic':
            b = sh['box']
            fl = ''.join(k for k in ('flipH', 'flipV') if sh.get(k))
            lines.append(f"  {sh['id']} [图片]: box[{b[0]:.0f},{b[1]:.0f} {b[2]:.0f}x{b[3]:.0f}] native={sh.get('img_native')} {fl}".rstrip())
    decos = sorted([sh for sh in raw['shapes'] if _deco_like(sh)], key=lambda s: -(s['box'][2] * s['box'][3]))
    for sh in decos[:12]:
        b = sh['box']
        gt = (sh.get('geom') or {}).get('type', 'rect')
        lines.append(f"  {sh['id']} [矢量装饰·{gt}]: box[{b[0]:.0f},{b[1]:.0f} {b[2]:.0f}x{b[3]:.0f}]")
    return '\n'.join(lines) or '  (无)'


def _crop_render(render, box, out):
    try:
        im = Image.open(render).convert('RGBA')
        x, y, w, h = box
        x0, y0, x1, y1 = max(0, int(x)), max(0, int(y)), min(im.width, int(x + w)), min(im.height, int(y + h))
        if x1 - x0 < 8 or y1 - y0 < 8:
            return False
        im.crop((x0, y0, x1, y1)).save(out)
        return True
    except Exception:
        return False


def describe_slide(s):
    sd = os.path.join(RAW, f"s{s:02d}")
    raw = json.load(open(os.path.join(sd, 'page_record.raw.json'), encoding='utf-8'))
    render = os.path.join(RENDERS, f"s{s:02d}.png")
    inv = inventory_of(raw)

    def call():
        try:
            return vlm.ask_json(render, PAGE_PROMPT.format(funcs=FUNCTIONS, inventory=inv), max_tokens=3000)
        except Exception as e:
            return {"_err": str(e)[:80], "images": {}}
    sem = call()
    if not sem.get('images'):                             # empty => truncated/failed; one retry
        s2 = call()
        if s2.get('images'):
            sem = s2
    sig = sem.get('slot_signature', '')                   # model sometimes returns a dict -> coerce to string
    if isinstance(sig, dict):
        sig = '+'.join(str(v) for v in sig.values())[:120]
    sem['slot_signature'] = sig if isinstance(sig, str) else str(sig)
    if not isinstance(sem.get('archetype'), str) or not sem.get('archetype'):
        sem['archetype'] = 'content'
    imgsem = sem.get('images', {})
    slots, images, decor = [], [], []
    for sh in raw['shapes']:
        k = sh.get('kind')
        sm = imgsem.get(sh['id'], {})
        if k == 'text':
            slot = dict(sh)
            slot['placeholder'] = sh.get('text', '')
            slots.append(slot)
        elif k == 'pic':
            dst = f"s{s:02d}_{sh['image']}"
            try:
                shutil.copy(os.path.join(sd, sh['image']), os.path.join(ASSETS, dst))
            except Exception:
                pass
            rec = dict(sh)
            rec['asset'] = dst
            rec['native'] = sh.get('img_native')
            rec.update({"role": sm.get('role', 'decoration'), "function": sm.get('function', 'none'),
                        "desc": sm.get('desc', ''), "theme_meaning": sm.get('theme_meaning', ''),
                        "treatment": sm.get('treatment', 'reuse'), "reusable": sm.get('reusable', False)})
            b = sh['box']
            if b[3]:
                rec.setdefault('gen_hint', {})['aspect'] = round(b[2] / b[3], 2)
            images.append(rec)
        else:
            d = dict(sh)
            if sm:                                        # vector decoration got classified -> annotate + crop for harvest
                d.update({"role": sm.get('role', 'decoration'), "function": sm.get('function', 'none'),
                          "desc": sm.get('desc', ''), "theme_meaning": sm.get('theme_meaning', ''),
                          "treatment": sm.get('treatment', 'theme-swap'), "reusable": sm.get('reusable', False)})
                if d['role'] in ('decoration', 'icon') and d['function'] not in ('none', '', None) and d['reusable']:
                    crop = os.path.join(ASSETS, f"s{s:02d}_{sh['id']}_deco.png")
                    if _crop_render(render, sh['box'], crop):
                        d['asset'] = os.path.basename(crop)
            decor.append(d)
    page = {"id": f"{a.deck_id}_p{s:02d}", "source_deck": a.deck_id, "slide_idx": s,
            "render": f"renders/s{s:02d}.png", "family": a.family, "track": a.track,
            "archetype": sem.get('archetype', 'content'), "slot_signature": sem.get('slot_signature', ''),
            "content_shape": sem.get('content_shape', ''), "page_desc": sem.get('page_desc', ''),
            "tags": sem.get('tags', []), "canvas": raw.get('canvas', [1280, 720]),
            "slots": slots, "images": images, "decor_shapes": decor}
    json.dump(page, open(os.path.join(PAGES, f"{a.deck_id}_p{s:02d}.json"), 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)
    return page


def compute_design_system(slides):
    """aggregate the deck's invisible discipline (the '呼吸感'): type ramp, margins,
    color usage, decoration density, common card sizes — tokens for design-driven layout."""
    import statistics as stt
    sizes, colors, boxes, margins, decos = collections.Counter(), collections.Counter(), collections.Counter(), [], []
    for s in slides:
        try:
            raw = json.load(open(os.path.join(RAW, f"s{s:02d}", 'page_record.raw.json'), encoding='utf-8'))
        except Exception:
            continue
        xs, ys, xe, ye, nd = [], [], [], [], 0
        for sh in raw['shapes']:
            b = sh['box']
            if sh.get('font_px'):
                sizes[int(round(sh['font_px']))] += 1
            for ck in ('color', 'fill'):
                if sh.get(ck):
                    colors[sh[ck]] += 1
            boxes[(int(round(b[2] / 10) * 10), int(round(b[3] / 10) * 10))] += 1
            if not (b[2] > 1200 and b[3] > 650):
                xs.append(b[0]); ys.append(b[1]); xe.append(b[0] + b[2]); ye.append(b[1] + b[3])
            if sh.get('kind') == 'pic':
                nd += 1
        if xs:
            margins.append((min(xs), min(ys), 1280 - max(xe), 720 - max(ye)))
        decos.append(nd)

    def med(v):
        return round(stt.median(v), 1) if v else None
    m = {}
    if margins:
        m = {'left': med([x[0] for x in margins]), 'top': med([x[1] for x in margins]),
             'right': med([x[2] for x in margins]), 'bottom': med([x[3] for x in margins])}
    return {
        'type_ramp': [{'px': k, 'count': v} for k, v in sorted(sizes.items(), key=lambda kv: -kv[0])[:8]],
        'content_margins': m,
        'common_colors': [c for c, _ in colors.most_common(12)],
        'decos_per_page': round(sum(decos) / len(decos), 1) if decos else 0,
        'common_box_sizes': [{'w': k[0], 'h': k[1], 'n': v} for k, v in boxes.most_common(8)],
    }


def _lum(h):
    h = h.lstrip('#')
    try:
        return 0.299 * int(h[0:2], 16) + 0.587 * int(h[2:4], 16) + 0.114 * int(h[4:6], 16)
    except Exception:
        return -1


def _sat(h):
    h = h.lstrip('#')
    try:
        r, g, b = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
        mx, mn = max(r, g, b), min(r, g, b)
        return (mx - mn) / mx if mx else 0
    except Exception:
        return 0


def fix_skin(deck, ds, slides):
    """skin from MEASURED colors + sampled backdrop. (sub-agent found theme-accent extraction
    gave orange-on-black for a blue deck; the real working colors are the measured ones.)"""
    cols = [c for c in ds.get('common_colors', []) if isinstance(c, str) and c.startswith('#') and len(c) == 7]
    skin = deck.setdefault('skin', {})
    if cols:
        by_lum = sorted(cols, key=_lum)
        sat = sorted([c for c in cols if _sat(c) > 0.35], key=lambda c: -_sat(c))
        skin['text'] = by_lum[-1]
        skin['accents'] = sat[:4]
        skin['primary'] = sat[0] if sat else by_lum[-1]
        skin['palette_measured'] = cols[:12]
    try:                                                  # bg_deep = darkest sampled corner of a mid slide (real backdrop)
        im = Image.open(os.path.join(RENDERS, f"s{slides[len(slides)//2]:02d}.png")).convert('RGB')
        Wd, Hd = im.size
        samp = []
        for cx, cy in [(6, 6), (Wd - 7, 6), (6, Hd - 7), (Wd - 7, Hd - 7), (Wd // 2, 6)]:
            crop = im.crop((cx - 5, cy - 5, cx + 5, cy + 5))
            n = crop.width * crop.height
            r, g, b = (int(sum(px[i] for px in crop.getdata()) / n) for i in range(3))
            samp.append('#%02X%02X%02X' % (r, g, b))
        skin['bg_deep'] = min(samp, key=_lum)
        skin['bg_samples'] = samp
    except Exception:
        pass


def harvest_chrome(slides, idx_path):
    """Most template decorations live in the LAYOUT/MASTER, not slide shapes. Sample slides,
    parse_chrome, dedupe images by md5, VLM-classify, harvest functional parts into assets_lib.
    Returns (chrome_decorations, backgrounds)."""
    samp = slides if len(slides) <= 8 else [slides[i] for i in range(0, len(slides), max(1, len(slides) // 8))][:8]
    seen = {}
    for s in samp:
        sd = os.path.join(RAW, f"s{s:02d}")
        try:
            run(os.path.join(ENG, 'parse_chrome.py'), a.pptx, str(s), sd)
            cj = json.load(open(os.path.join(sd, 'chrome.json'), encoding='utf-8'))
        except Exception:
            continue
        items = list(cj.get('shapes', []))
        for lab, fn in cj.get('bg', {}).items():
            items.append({'asset': fn, 'box': [0, 0, 1280, 720]})
        for it in items:
            p = os.path.join(sd, it.get('asset', ''))
            if not os.path.exists(p):
                continue
            md5 = hashlib.md5(open(p, 'rb').read()).hexdigest()[:12]
            if md5 not in seen:
                seen[md5] = (p, it.get('box', [0, 0, 0, 0]))

    def classify(kv):
        md5, (p, b) = kv
        if b[2] >= 1200 and b[3] >= 650:
            return ('bg', md5, p, b, {})
        try:
            sm = vlm.ask_json(p, CHROME_PROMPT.format(funcs=FUNCTIONS, box=f"{b[2]:.0f}x{b[3]:.0f}"))
        except Exception:
            return None
        return ('deco', md5, p, b, sm)

    decos, backgrounds = [], []
    with ThreadPoolExecutor(max_workers=10) as ex:
        for r in ex.map(classify, list(seen.items())):
            if not r:
                continue
            kind, md5, p, b, sm = r
            if kind == 'bg':
                dst = f"chrome_bg_{md5}.png"
                shutil.copy(p, os.path.join(ASSETS, dst))
                backgrounds.append(dst)
                continue
            dst = f"chrome_{md5}.png"
            shutil.copy(p, os.path.join(ASSETS, dst))
            fn = sm.get('function', 'none')
            rec = {'asset': dst, 'box': b, 'role': sm.get('role', 'decoration'), 'function': fn,
                   'desc': sm.get('desc', ''), 'theme_meaning': sm.get('theme_meaning', ''),
                   'treatment': sm.get('treatment', 'reuse'), 'reusable': sm.get('reusable', True), 'source': 'chrome'}
            decos.append(rec)
            if rec['role'] in ('decoration', 'icon') and fn not in ('none', '', None) and rec['reusable']:
                fam = a.family or 'unknown'
                dd = os.path.join(a.assets_lib, fn, fam)
                os.makedirs(dd, exist_ok=True)
                nm = f"{a.deck_id}_{dst}"
                shutil.copy(os.path.join(ASSETS, dst), os.path.join(dd, nm))
                with open(idx_path, 'a', encoding='utf-8') as idx:
                    idx.write(json.dumps({"asset": nm, "function": fn, "family": fam, "source": "chrome",
                                          "theme_meaning": rec['theme_meaning'], "desc": rec['desc'],
                                          "box": b, "aspect": round(b[2] / b[3], 2) if b[3] else None,
                                          "deck": a.deck_id}, ensure_ascii=False) + '\n')
    return decos, backgrounds


# 4) VLM describe pages (threaded across keys)
with ThreadPoolExecutor(max_workers=10) as ex:
    pages = list(ex.map(describe_slide, slides))

os.makedirs(a.assets_lib, exist_ok=True)
idx_path = os.path.join(a.assets_lib, 'index.jsonl')

# 5) deck style_desc + design-system tokens + chrome decoration harvest
try:
    st = vlm.ask_json(os.path.join(RENDERS, f"s{slides[0]:02d}.png"), STYLE_PROMPT)
    deck['style_desc'] = st.get('style_desc', '')
    deck['render_tags'] = st.get('render_tags', [])
except Exception:
    deck['style_desc'] = ''
deck['design_system'] = compute_design_system(slides)
fix_skin(deck, deck['design_system'], slides)            # measured colors, not theme accents (sub-agent fix #1)
chrome_decos, backgrounds = harvest_chrome(slides, idx_path)
deck['chrome_decorations'] = chrome_decos
deck.setdefault('skin', {})['backgrounds'] = backgrounds
deck['source_pptx'] = os.path.abspath(a.pptx)            # so make_plate/build_bg can be re-run at gen time (sub-agent fix #5)
deck['family'] = a.family or deck.get('family', '')
deck['track'] = a.track
deck['pages'] = [p['id'] for p in pages]
json.dump(deck, open(os.path.join(deckdir, 'deck_record.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

# 6) HARVEST slide-level functional decorations into assets_lib
harvested = 0
with open(idx_path, 'a', encoding='utf-8') as idx:
    for p in pages:
        for im in p['images']:
            fn = im.get('function', 'none')
            if im.get('role') in ('decoration', 'icon') and fn not in ('none', '', None) and im.get('reusable'):
                fam = a.family or 'unknown'
                dstdir = os.path.join(a.assets_lib, fn, fam)
                os.makedirs(dstdir, exist_ok=True)
                shutil.copy(os.path.join(ASSETS, im['asset']), os.path.join(dstdir, f"{a.deck_id}_{im['asset']}"))
                idx.write(json.dumps({"asset": f"{a.deck_id}_{im['asset']}", "function": fn, "family": fam,
                                      "theme_meaning": im.get('theme_meaning', ''), "desc": im.get('desc', ''),
                                      "box": im['box'], "aspect": im.get('gen_hint', {}).get('aspect'),
                                      "source": "slide", "deck": a.deck_id}, ensure_ascii=False) + '\n')
                harvested += 1
        for dc in p.get('decor_shapes', []):              # vector decorations (cropped) — recolorable via stored path
            fn = dc.get('function', 'none')
            if dc.get('asset') and dc.get('role') in ('decoration', 'icon') and fn not in ('none', '', None) and dc.get('reusable'):
                src = os.path.join(ASSETS, dc['asset'])
                if not os.path.exists(src):
                    continue
                fam = a.family or 'unknown'
                dstdir = os.path.join(a.assets_lib, fn, fam)
                os.makedirs(dstdir, exist_ok=True)
                nm = f"{a.deck_id}_{dc['asset']}"
                shutil.copy(src, os.path.join(dstdir, nm))
                idx.write(json.dumps({"asset": nm, "function": fn, "family": fam,
                                      "theme_meaning": dc.get('theme_meaning', ''), "desc": dc.get('desc', ''),
                                      "box": dc['box'], "geom": (dc.get('geom') or {}).get('type'),
                                      "path": (dc.get('geom') or {}).get('path'),
                                      "source": "vector", "deck": a.deck_id}, ensure_ascii=False) + '\n')
                harvested += 1

print(f"[{a.deck_id}] pages={len(pages)} vlm_calls={vlm.calls} slide_decos={harvested} chrome_decos={len(chrome_decos)} bg={len(backgrounds)}")
print(f"  -> {deckdir}")
