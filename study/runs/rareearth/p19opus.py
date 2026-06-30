# -*- coding: utf-8 -*-
"""p19opus — 落地前景 (H2 #19) for the rare-earth TIE331 deck.

COLD-START, self-designed (no other pXX module read). Reference = deep-blue sci-tech roadmap
page `red_tour_b3841e36_p02` (HUD frame, ascending nodes); skin/clean_base from its deck
`red_tour_b3841e36` (深蓝创新芯片). Content = the WHOLE 「落地前景」 section, ZERO deletion,
split across THREE pages (the section has 4 dense H3 parts that cannot fit one slide at the
18px floor):
  page 1 (returned)  产业化实施路径   — 3-phase ascending roadmap, 3 cards
  page 2 (aux)        市场推广策略     — 3 strategy cards
  page 3 (aux)        综合效益展望 + 风险应对机制 — 2 benefit panels + 3 risk panels

Every decoration is a real gen_deco image (full-bleed, real alpha, normal blend), tagged with
its function for deco_check; each placed at a box whose aspect matches the asset's native aspect
(no STRETCH). No self-drawn pills / rounded filled panels — only thin connector/axis lines and the
full-bleed scrim are vector. Fonts are sized so NOTHING auto-shrinks (every run >= 18px).
"""
import os, sys, subprocess
import deckgen_lib as L
from deckgen_lib import Page

HERE = os.path.dirname(os.path.abspath(__file__))
ENG = os.path.abspath(os.path.join(HERE, '..', '..', 'engine'))
CORPUS = os.path.abspath(os.path.join(HERE, '..', '..', 'corpus'))

DECK = os.path.join(CORPUS, 'red_tour_b3841e36', 'deck_record.json')
BASE = os.path.join(HERE, '_base_b3841e36.png')
REF_PAGE = 'red_tour_b3841e36_p02'

# ---- deep-blue palette (this deck) ----
CYAN_STOPS  = ['#9BFCFF', '#0BF9FE', '#16A8E0']
WHITE_STOPS = ['#FFFFFF', '#D8ECFB']
DIM   = '#BFE0F2'
DIM2  = '#86B6D8'
WHITE = '#FFFFFF'
SCRIM = 'rgba(3,12,30,0.46)'

NUM, DISP, BODY, BODYM = L.NUM, L.DISP, L.BODY, L.BODYM


def _ensure_base():
    if not os.path.exists(BASE):
        subprocess.run([sys.executable, os.path.join(ENG, 'clean_base.py'),
                        'red_tour_b3841e36', BASE], check=True)


def _title(pg, flankL, flankR, title, sub, flipR=True, fw=130, fh=81):
    pg.scrim(fill=SCRIM)
    pg.img([66, 22, fw, fh], flankL, function='title_flank')
    pg.img([1214 - fw, 22, fw, fh], flankR, function='title_flank', flipH=flipR)
    pg.T([224, 22, 840, 50], title, 46, font=DISP, grad=CYAN_STOPS, align='LEFT')
    pg.T([226, 78, 900, 26], sub, 20, font=BODYM, color=DIM, align='LEFT')
    pg.line([226, 74, 760, 74], color='rgba(11,249,254,0.55)', w=2)


# ============================== PAGE 1 — 产业化实施路径 ==============================
def build_page1():
    a = '_assets'
    pg = Page()
    _title(pg, a + '/p1_flankL.png', a + '/p1_flankR.png',
           '落地前景 · 产业化实施路径',
           'TIE331 萜类化合物辅助稀土金属回收  ·  三阶段产业化推进路径')

    intro = ('项目当前已完成实验室系统验证，技术方案在高酸度、含氟硫等复杂工业废液环境中展现出优异的铈离子选择性'
             '萃取能力、两相分离清晰度及溶剂循环稳定性，具备中试放大条件，并据产业验证阶段定位制定三阶段推进路径。')
    pg.img([122, 110, 150, 130], a + '/p1_motif.png', function='motif')
    pg.T([300, 116, 830, 90], intro, 20, font=BODY, color=DIM, align='LEFT')

    phases = [
        dict(no='01', yr='第一年',  name='中试验证 · 标杆突破',
             body='完成TIE331工艺参数固化与中试放大，对接2家稀土回收领域标杆企业开展小批量试用，'
                  '验证单级萃取效率（目标回收率≥85%）与工艺适配性，形成可复制的技术实施方案。'),
        dict(no='02', yr='第二年',  name='产品拓展 · 网络构建',
             body='推进TIE332-TIE350系列开发，拓展至3家标杆客户，深化校企协同合作，'
                  '积累跨场景应用数据，完善“技术方案+定制服务”轻资产服务模式。'),
        dict(no='03', yr='第三年',  name='模式固化 · 规模预备',
             body='完成TIE331-TIE381全系产品矩阵优化，依托客户反馈闭环迭代技术，'
                  '实现累计销售收入20万元目标，验证商业模式可行性，为规模化复制奠定实证基础与客户资源储备。'),
    ]
    card_w, card_h = 372, 450
    xs = [70, 472, 874]
    tops = [248, 218, 188]            # ascending to the right (roadmap rise)
    cy = [tops[i] + 70 for i in range(3)]
    for i in range(2):                # cyan ascending connectors between cards
        pg.line([xs[i] + card_w - 6, cy[i], xs[i + 1] + 6, cy[i + 1]], color='rgba(11,249,254,0.5)', w=2)

    for i, ph in enumerate(phases):
        x, top = xs[i], tops[i]
        pg.img([x, top, card_w, card_h], a + '/p1_card1.png', function='card_frame')
        rb_w, rb_h = 300, 128
        rx = x + (card_w - rb_w) / 2
        pg.img([rx, top + 18, rb_w, rb_h], a + '/p1_ribbon.png', function='ribbon')
        pg.T([rx + 16, top + 28, 112, 58], ph['no'], 50, font=NUM, grad=CYAN_STOPS, align='LEFT')
        pg.T([rx + 116, top + 34, rb_w - 128, 26], '推进阶段', 19, font=BODYM, color=DIM2, align='LEFT')
        pg.T([rx + 116, top + 62, rb_w - 128, 30], ph['yr'], 24, font=DISP, grad=WHITE_STOPS, align='LEFT')
        pg.T([rx + 8, top + 100, rb_w - 16, 30], ph['name'], 22, font=DISP, color=WHITE, align='CENTER')
        bp_w, bp_h = 330, 250
        bx = x + (card_w - bp_w) / 2
        bp_top = top + 172
        pg.img([bx, bp_top, bp_w, bp_h], a + '/p1_bgpanel.png', function='bg_panel')
        pg.T([bx + 18, bp_top + 16, bp_w - 36, bp_h - 32], ph['body'], 19, font=BODY, color=DIM, align='LEFT')

    return pg, 'p19opus_落地前景'


# ============================== PAGE 2 — 市场推广策略 ==============================
def build_page2():
    a = '_assets'
    pg = Page()
    _title(pg, a + '/p2_flankL.png', a + '/p2_flankL.png',
           '落地前景 · 市场推广策略',
           '构建“点验证—线链接—面扩散”闭环推广体系  ·  三大推进路径')
    pg.img([1070, 96, 150, 130], a + '/p2_motif.png', function='motif')
    # section header ribbon (real image)
    pg.img([70, 116, 300, 95], a + '/p2_ribbon.png', function='ribbon')
    pg.T([90, 132, 270, 30], '二 · 市场推广策略', 24, font=DISP, grad=WHITE_STOPS, align='LEFT')

    strat = [
        ('精准锚定标杆合作',
         '精准锚定标杆合作：聚焦稀土回收企业及萃取剂生产商，针对单级萃取效率低、溶剂损耗高等痛点，'
         '以小批量试用快速验证TIE331产品在回收率提升与成本控制方面的实效，形成可量化合作案例。'),
        ('校企资源协同赋能',
         '校企资源协同赋能：联动新西伯利亚国立大学科研平台，举办稀土绿色回收技术研讨会，'
         '以实证案例吸引产业链企业参与，建立高意向客户清单，实现技术背书与资源网络双驱动。'),
        ('梯度渗透市场覆盖',
         '梯度渗透市场覆盖：立足标杆客户细分领域，通过定向技术分享、行业白皮书、线上直播与专业会议组合策略，'
         '推动成功模式向区域及跨应用场景有序复制，稳步扩大市场影响力与品牌认知度。'),
    ]
    sxs = [70, 472, 874]
    sw, sh = 372, 451
    sy = 234
    # step connectors (vector lines, allowed) — left-to-right flow
    for i in range(2):
        pg.line([sxs[i] + sw - 6, sy + 60, sxs[i + 1] + 6, sy + 60], color='rgba(11,249,254,0.5)', w=2)
    for i, (ttl, body) in enumerate(strat):
        x = sxs[i]
        # card frame (real image, native 0.824 -> box 0.825)
        pg.img([x, sy, sw, sh], a + '/p2_card.png', function='card_frame')
        # header ribbon strip (real image, native 3.17 -> box 300x95)
        rb_w, rb_h = 300, 95
        rx = x + (sw - rb_w) / 2
        pg.img([rx, sy + 16, rb_w, rb_h], a + '/p2_ribbon.png', function='ribbon')
        pg.T([rx + 18, sy + 28, 90, 50], f'0{i+1}', 42, font=NUM, grad=CYAN_STOPS, align='LEFT')
        pg.T([rx + 100, sy + 38, rb_w - 112, 34], ttl, 20, font=DISP, grad=WHITE_STOPS, align='LEFT')
        # body panel (real image, native 1.395 -> box 320x229) + body text
        bp_w, bp_h = 320, 229
        bx = x + (sw - bp_w) / 2
        bp_top = sy + 124
        pg.img([bx, bp_top, bp_w, bp_h], a + '/p2_bgpanel.png', function='bg_panel')
        pg.T([bx + 18, bp_top + 16, bp_w - 36, bp_h - 30], body, 19, font=BODY, color=DIM, align='LEFT')
    return pg, 'p19opus_落地前景_b推广'


# ============================== PAGE 3 — 综合效益展望 + 风险应对机制 ==============================
def build_page3():
    a = '_assets'
    pg = Page()
    _title(pg, a + '/p3_flank.png', a + '/p3_flank.png',
           '落地前景 · 综合效益 · 风险应对',
           '综合效益展望（经济 · 社会）  /  风险应对机制（市场 · 技术 · 运营）',
           fw=110, fh=101)
    pg.img([1068, 92, 150, 150], a + '/p3_motif.png', function='motif')

    # ---- 三 · 综合效益展望 : 2 wide panels ----
    pg.img([70, 116, 224, 95], a + '/p3_ribbon.png', function='ribbon')      # native 2.35 -> 224x95
    pg.T([84, 132, 240, 30], '三 · 综合效益展望', 22, font=DISP, grad=WHITE_STOPS, align='LEFT')
    pg.img([318, 116, 156, 90], a + '/p3_card.png', function='card_frame')   # small structural card_frame plate
    pg.T([318, 132, 156, 30], '双效益', 22, font=DISP, grad=CYAN_STOPS, align='CENTER')
    ben = [
        '经济效益：轻资产运营模式显著降低初期投入，依托溶剂可循环特性压缩客户侧与项目侧长期成本；三年内验证'
        '商业模式可行性，后续通过技术授权、定制服务等高附加值路径提升盈利空间，形成“销售-反馈-优化”良性现金流循环。',
        '社会效益：推动工业废弃物中稀土资源高效绿色回收，减少环境污染，惠及稀土产业及受污染地区人群；为行业'
        '提供可推广的资源化技术方案，助力工艺升级与国家循环经济战略实施，彰显科技赋能可持续发展的社会价值。',
    ]
    bxs = [70, 662]
    bw, bh = 548, 205
    by = 222
    for i, body in enumerate(ben):
        x = bxs[i]
        ttl, txt = body.split('：', 1)
        pg.img([x, by, bw, bh], a + '/p3_panelW.png', function='bg_panel')
        pg.T([x + 24, by + 16, 220, 30], ttl, 23, font=DISP, grad=CYAN_STOPS, align='LEFT')
        pg.line([x + 24, by + 52, x + bw - 24, by + 52], color='rgba(11,249,254,0.34)', w=1.2)
        pg.T([x + 24, by + 62, bw - 48, 140], txt, 19, font=BODY, color=DIM, align='LEFT')

    # ---- 四 · 风险应对机制 : section ribbon + 3 equal panels in one row ----
    pg.img([70, 440, 224, 95], a + '/p3_ribbon.png', function='ribbon')   # 11th deco (native 2.35 -> 224x95)
    pg.T([84, 456, 240, 30], '四 · 风险应对机制', 22, font=DISP, grad=WHITE_STOPS, align='LEFT')
    risk = [
        '市场风险：采用“精准锚定+梯度扩张”策略，优先验证高匹配度客户，预留运营资金应对需求波动，动态优化推广节奏。',
        '技术风险：依托高校科研平台与中试验证闭环持续优化工艺参数，建立客户反馈实时迭代机制，确保技术与产业需求同步演进。',
        '运营风险：核心团队持股激励（融资后合计34.3%）强化长期绑定；专项资金账户与分阶段拨付制度保障资金高效使用；'
        '轻资产结构降低固定成本负担，全面提升项目抗风险韧性与可持续发展能力。',
    ]
    rxs = [60, 445, 830]
    rw, rh = 410, 157
    ry = 548
    for i, body in enumerate(risk):
        x = rxs[i]
        pg.img([x, ry, rw, rh], a + '/p3_panelW.png', function='bg_panel')
        pg.T([x + 18, ry + 14, rw - 36, 133], body, 18, font=BODY, color=DIM, align='LEFT')
    return pg, 'p19opus_落地前景_c效益风险'


def _render_aux(pg, name):
    out_dir = os.path.join(HERE, name)
    rp, bp = pg.dump(out_dir, 'page')
    svg = os.path.join(out_dir, 'page.svg')
    png = os.path.join(out_dir, 'page.png')
    subprocess.run([sys.executable, os.path.join(ENG, 'render_page.py'),
                    '--record', rp, '--binding', bp, '--deck', os.path.abspath(DECK),
                    '--plate', os.path.abspath(BASE), '--out', svg], check=True)
    subprocess.run([sys.executable, os.path.join(ENG, 'svg_to_png.py'), svg, png], check=True)
    print('AUX PAGE OK ->', png)


def build():
    _ensure_base()
    _render_aux(*build_page2())
    _render_aux(*build_page3())
    return build_page1()
