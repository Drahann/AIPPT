#!/usr/bin/env python3
"""p19glm — 落地前景 page (H2 #19).

Layout: full-width Section 1 (3 stage cards) + 3 columns for Sections 2-4.
Reference: blue_tech_726a261e_p12 (4 arrow headers + 4 content boxes).
Skin: deep navy blue + gold accents, HUD tech aesthetic.
"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from deckgen_lib import Page

# ---- skin ----
DEEP_NAVY  = '#02103B'
BLUE       = '#0070C0'
BLUE_BR    = '#2C7BE5'
BLUE_LT    = '#5B9BFF'
CYAN       = '#16C7F0'
GOLD       = '#F2D290'
GOLD_DK    = '#E0B25C'
WHITE      = '#FFFFFF'
DIM        = '#C3D6F2'
DIM2       = '#8FB0DA'
GOLD_STOPS = ['#FBF1C6', '#F2D290', '#E2B25E']
BLUE_STOPS = ['#3D8BF0', '#0B57C8']
PANEL      = 'rgba(8,22,55,0.72)'
GOLD_STK   = 'rgba(242,210,144,0.85)'

KAI  = 'DISP_KAI'
DISP = 'DISP_TITLE'
NUM  = 'DISP_NUM'
BODY = 'BODY'
BODYB= 'BODY_B'
BODYM= 'BODY_M'

A = '_assets'

DECK = os.path.join(HERE, '..', '..', 'corpus', 'blue_tech_726a261e', 'deck_record.json')
BASE = os.path.join(HERE, 'p19glm_落地前景', '_assets', 'base.png')

# layout constants
CANVAS_W = 1280
CANVAS_H = 720

# 3-column layout (for Sections 2-4 and Section 1 stage cards)
COL_W = 395
COL_GAP = 20
MARGIN = (CANVAS_W - 3*COL_W - 2*COL_GAP) // 2  # = 27
COL_X = [MARGIN, MARGIN+COL_W+COL_GAP, MARGIN+2*(COL_W+COL_GAP)]

# Section 1 stage cards
STAGE_Y = 100
STAGE_H = 175

# Sections 2-4 column cards
COL_Y = 282
COL_H = 420

NUM_SZ = 48
BULLET = 20


def build():
    pg = Page()

    # ===== bg_panel overlay =====
    pg.img([0, 0, CANVAS_W, CANVAS_H], f'{A}/bg_panel.png', function='bg_panel')

    # ===== page title =====
    pg.img([0, 0, 200, 84], f'{A}/title_flank.png', function='title_flank')
    pg.img([1080, 0, 200, 84], f'{A}/title_flank.png', flipH=True, function='title_flank')
    pg.T([300, 6, 680, 50], '落地前景', 52, font=KAI, grad=GOLD_STOPS, align='CENTER')
    pg.T([300, 52, 680, 20], 'TIE331萜类化合物辅助稀土金属回收 · 产业落地全景',
         18, font=BODYM, color=DIM, align='CENTER')

    # ===== Section 1: 产业化实施路径 (full width) =====
    # section header
    npx = MARGIN + 4
    npy = 70
    pg.img([npx, npy, NUM_SZ, NUM_SZ], f'{A}/number_backplate.png', function='number_backplate')
    pg.T([npx, npy+10, NUM_SZ, NUM_SZ-10], '01', 20, font=NUM, grad=GOLD_STOPS, align='CENTER')
    pg.T([npx+NUM_SZ+8, npy+6, 400, 28], '产业化实施路径', 24, font=DISP, color=WHITE, align='LEFT')
    pg.T([npx+NUM_SZ+8, npy+32, 500, 20], '已完成实验室验证 · 具备中试放大条件 · 三阶段推进',
         18, font=BODYM, color=GOLD, align='LEFT')

    # 3 stage cards
    stages = [
        ('02', '中试验证与标杆突破', '第一年',
         '完成TIE331工艺参数固化与中试放大，对接2家稀土回收领域标杆企业开展小批量试用，验证单级萃取效率（目标回收率≥85%）与工艺适配性，形成可复制的技术实施方案。'),
        ('03', '产品拓展与网络构建', '第二年',
         '推进TIE332-TIE350系列开发，拓展至3家标杆客户，深化校企协同合作，积累跨场景应用数据，完善"技术方案+定制服务"轻资产服务模式。'),
        ('04', '模式固化与规模预备', '第三年',
         '完成TIE331-TIE381全系产品矩阵优化，依托客户反馈闭环迭代技术，实现累计销售收入20万元目标，验证商业模式可行性，为规模化复制奠定实证基础与客户资源储备。'),
    ]

    for i, (snum, stitle, syear, stext) in enumerate(stages):
        cx = COL_X[i]
        cy = STAGE_Y
        cw = COL_W
        ch = STAGE_H

        # card_frame
        pg.img([cx, cy, cw, ch], f'{A}/card_frame_stage.png', function='card_frame')

        # corner_hud
        hud = 24
        for corner in [(cx+3, cy+3, False), (cx+cw-hud-3, cy+3, True),
                       (cx+3, cy+ch-hud-3, True), (cx+cw-hud-3, cy+ch-hud-3, False)]:
            pg.img([corner[0], corner[1], hud, hud], f'{A}/corner_hud.png',
                   flipH=corner[2], function='corner_hud')

        # number backplate
        bp_sz = 42
        bp_x = cx + 8
        bp_y = cy + 5
        pg.img([bp_x, bp_y, bp_sz, bp_sz], f'{A}/number_backplate.png', function='number_backplate')
        pg.T([bp_x, bp_y+8, bp_sz, bp_sz-8], snum, 18, font=NUM, grad=GOLD_STOPS, align='CENTER')

        # stage title (next to badge)
        pg.T([bp_x + bp_sz + 6, bp_y+4, 200, 22], stitle, 18, font=BODYB, color=BLUE_LT, align='LEFT')

        # year tag (right-aligned, wider box)
        pg.T([cx + cw - 68, bp_y+4, 60, 22], syear, 18, font=BODYM, color=GOLD, align='RIGHT')

        # content text — generous height to prevent overflow
        text_y = cy + 50
        text_h = ch - 54
        pg.T([cx + 8, text_y, cw - 16, text_h], stext, 18, font=BODY, color=DIM, align='LEFT')

    # ===== divider between Section 1 and Sections 2-4 =====
    div_y = 278
    pg.line([MARGIN, div_y, CANVAS_W - MARGIN, div_y], color='rgba(242,210,144,0.4)', w=1.5)
    # diamond at center
    dcx = CANVAS_W // 2
    pg.extras.append({'type': 'rect', 'box': [dcx-4, div_y-4, 8, 8], 'rx': 1, 'fill': GOLD, 'opacity': 0.9})

    # ===== Sections 2-4: 3 columns =====
    sections = [
        {
            'num': '05',
            'title': '市场推广策略',
            'subtitle': '点验证·线链接·面扩散',
            'items': [
                ('精准锚定标杆合作', '聚焦稀土回收企业及萃取剂生产商，针对单级萃取效率低、溶剂损耗高等痛点，以小批量试用快速验证TIE331产品在回收率提升与成本控制方面的实效，形成可量化合作案例。'),
                ('校企资源协同赋能', '联动新西伯利亚国立大学科研平台，举办稀土绿色回收技术研讨会，以实证案例吸引产业链企业参与，建立高意向客户清单，实现技术背书与资源网络双驱动。'),
                ('梯度渗透市场覆盖', '立足标杆客户细分领域，通过定向技术分享、行业白皮书、线上直播与专业会议组合策略，推动成功模式向区域及跨应用场景有序复制，稳步扩大市场影响力与品牌认知度。'),
            ],
        },
        {
            'num': '06',
            'title': '综合效益展望',
            'subtitle': '经济+社会双重效益',
            'items': [
                ('经济效益', '轻资产运营模式显著降低初期投入，依托溶剂可循环特性压缩客户侧与项目侧长期成本；三年内验证商业模式可行性，后续通过技术授权、定制服务等高附加值路径提升盈利空间，形成"销售-反馈-优化"良性现金流循环。'),
                ('社会效益', '推动工业废弃物中稀土资源高效绿色回收，减少环境污染，惠及稀土产业及受污染地区人群；为行业提供可推广的资源化技术方案，助力工艺升级与国家循环经济战略实施，彰显科技赋能可持续发展的社会价值。'),
            ],
        },
        {
            'num': '07',
            'title': '风险应对机制',
            'subtitle': '市场·技术·运营三维防控',
            'items': [
                ('市场风险', '采用"精准锚定+梯度扩张"策略，优先验证高匹配度客户，预留运营资金应对需求波动，动态优化推广节奏。'),
                ('技术风险', '依托高校科研平台与中试验证闭环持续优化工艺参数，建立客户反馈实时迭代机制，确保技术与产业需求同步演进。'),
                ('运营风险', '核心团队持股激励（融资后合计34.3%）强化长期绑定；专项资金账户与分阶段拨付制度保障资金高效使用；轻资产结构降低固定成本负担，全面提升项目抗风险韧性与可持续发展能力。'),
            ],
        },
    ]

    for i, sec in enumerate(sections):
        cx = COL_X[i]
        cy = COL_Y
        cw = COL_W
        ch = COL_H

        # card_frame
        pg.img([cx, cy, cw, ch], f'{A}/card_frame_col.png', function='card_frame')

        # corner_hud at 4 corners
        hud = 26
        for c_pos in [(cx+3, cy+3, False), (cx+cw-hud-3, cy+3, True),
                      (cx+3, cy+ch-hud-3, True), (cx+cw-hud-3, cy+ch-hud-3, False)]:
            pg.img([c_pos[0], c_pos[1], hud, hud], f'{A}/corner_hud.png',
                   flipH=c_pos[2], function='corner_hud')

        # number backplate + number
        bp_sz = NUM_SZ
        bp_x = cx + (cw - bp_sz) // 2
        bp_y = cy + 8
        pg.img([bp_x, bp_y, bp_sz, bp_sz], f'{A}/number_backplate.png', function='number_backplate')
        pg.T([bp_x, bp_y+10, bp_sz, bp_sz-10], sec['num'], 20, font=NUM, grad=GOLD_STOPS, align='CENTER')

        # section title
        title_y = bp_y + bp_sz + 2
        pg.T([cx+8, title_y, cw-16, 28], sec['title'], 24, font=DISP, color=WHITE, align='CENTER')

        # subtitle
        sub_y = title_y + 28
        pg.T([cx+8, sub_y, cw-16, 20], sec['subtitle'], 18, font=BODYM, color=GOLD, align='CENTER')

        # divider
        div_y2 = sub_y + 22
        pg.line([cx+24, div_y2, cx+cw-24, div_y2], color='rgba(242,210,144,0.35)', w=1.2)
        dcx2 = cx + cw // 2
        pg.extras.append({'type': 'rect', 'box': [dcx2-4, div_y2-4, 8, 8], 'rx': 1, 'fill': GOLD, 'opacity': 0.85})

        # content items
        item_y = div_y2 + 8
        inner_x = cx + 10
        inner_w = cw - 20

        for item_idx, (item_title, item_text) in enumerate(sec['items']):
            # bullet marker
            pg.img([inner_x, item_y+2, BULLET, BULLET], f'{A}/bullet_marker.png', function='bullet_marker')

            # item title
            pg.T([inner_x + BULLET + 5, item_y, inner_w - BULLET - 5, 22],
                 item_title, 18, font=BODYB, color=BLUE_LT, align='LEFT')

            # content text — generous box height to prevent auto-shrink
            text_y = item_y + 24
            # estimate lines: ~20 chars per line at 18px in 360px width
            cpl = max(1, int(inner_w / 18))
            n_lines = max(1, (len(item_text) + cpl - 1) // cpl)
            text_h = n_lines * 23 + 6

            pg.T([inner_x, text_y, inner_w, text_h],
                 item_text, 18, font=BODY, color=DIM, align='LEFT')

            item_y = text_y + text_h + 4

    # ===== footer =====
    pg.T([30, 706, 1220, 18], 'TIE331 · 萜类化合物辅助稀土金属回收 · 落地前景规划',
         18, font=BODYM, color=DIM2, align='CENTER')

    return pg, 'p19glm_落地前景'
