#!/usr/bin/env python3
"""p19qwen37 — 落地前景 (H2 #19, rare-earth TIE331 project, blue_tech deck).

Reference: blue_tech_79727f0e_p04 (4-stage rising blocks, roadmap archetype).
Layout: 2+2 grid — 4 content blocks (615x340 each), items in columns inside each.
All content from H2 #19 preserved (zero deletion).
"""
import os, sys, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from deckgen_lib import Page

# ---- paths ----
DECK = r'W:\ppt\study\corpus\blue_tech_79727f0e\deck_record.json'
BASE = r'W:\ppt\study\runs\rareearth\_base_p19qwen37.png'
ASSET = os.path.join(HERE, 'p19qwen37_落地前景', '_assets')

# ---- palette (from reference deck skin) ----
BG_DEEP   = '#0F1016'
BLUE      = '#006CFE'
BLUE_BR   = '#265ED4'
CYAN      = '#15F7F9'
CYAN_DIM  = 'rgba(21,247,249,0.55)'
GOLD      = '#FFC000'
GOLD_LT   = '#F7C076'
GOLD_DIM  = 'rgba(255,192,0,0.55)'
WHITE     = '#FFFFFF'
DIM       = '#E7E6E6'
DIM2      = '#CEDBED'
SCRIM_FILL = 'rgba(8,12,30,0.35)'

GOLD_STOPS = ['#FBF1C6', '#FFC000', '#E0A800']

# font aliases
KAI  = 'DISP_KAI'
DISP = 'DISP_TITLE'
NUM  = 'DISP_NUM'
BODY = 'BODY'
BODYM = 'BODY_M'
BODYB = 'BODY_B'

# RAMP sizes (from page_gate.RAMP)
SZ_PAGE_TITLE = 42
SZ_SECTION    = 24
SZ_CARD_TITLE = 24
SZ_BODY       = 18


def _a(name):
    return os.path.join(ASSET, name)


def build():
    pg = Page()

    # ============================================================
    # FULL-BLEED SCRIM
    # ============================================================
    pg.scrim(fill=SCRIM_FILL)

    # ============================================================
    # BG DECORATIONS (behind everything)
    # ============================================================
    # glow band behind title (harvested, native 1280x244)
    pg.img([0, 0, 1280, 244], _a('ref_glow_band.png'), function='glow')
    # bg_panel strip behind title (harvested, native 1250x149)
    pg.img([15, 0, 1250, 149], _a('ref_ribbon_bot.png'), function='bg_panel')

    # ============================================================
    # TITLE AREA (y 0-40)
    # ============================================================
    # left title flank (AI-gen, native 1280x576 asp 2.222, box 200x90 asp 2.222)
    pg.img([0, 0, 200, 90], _a('title_flank_l.png'), function='title_flank')
    # right title flank (harvested, native 1118x575 asp 1.944, box 200x40 asp 5.0 -> STRETCH!)
    # -> use at native aspect: 78x40 (asp 1.944)
    pg.img([1202, 0, 78, 40], _a('ref_title_flank_r.png'), function='title_flank')
    # icon pedestal (harvested, native 696x695 asp 1.001, box 40x40)
    pg.img([620, 0, 40, 40], _a('ref_icon_pedestal.png'), function='icon_pedestal')
    # connector deco (harvested, native 135x44 asp 3.068, box 135x44)
    pg.img([573, 0, 135, 44], _a('ref_title_deco.png'), function='connector')

    # page title
    pg.T([210, 2, 860, 38], '落地前景', SZ_PAGE_TITLE, font=KAI,
         grad=GOLD_STOPS, align='CENTER')

    # title underline
    pg.line([340, 38, 940, 38], color=GOLD_DIM, w=2)

    # ============================================================
    # 4 CONTENT BLOCKS — 2x2 grid (each 615x340)
    # ============================================================
    BW, BH = 615, 340
    GAP = 10
    blocks = [
        # (bx, by, label, title, items[(title, body), ...])
        (10, 40, '01', '产业化实施路径', [
            ('第一年·中试验证',
             '完成TIE331工艺参数固化与中试放大，对接2家稀土回收领域标杆企业开展小批量试用，验证单级萃取效率（目标回收率≥85%）与工艺适配性，形成可复制的技术实施方案。'),
            ('第二年·产品拓展',
             '推进TIE332-TIE350系列开发，拓展至3家标杆客户，深化校企协同合作，积累跨场景应用数据，完善"技术方案+定制服务"轻资产服务模式。'),
            ('第三年·模式固化',
             '完成TIE331-TIE381全系产品矩阵优化，依托客户反馈闭环迭代技术，实现累计销售收入20万元目标，验证商业模式可行性，为规模化复制奠定基础。'),
        ]),
        (655, 40, '02', '市场推广策略', [
            ('精准锚定标杆',
             '聚焦稀土回收企业及萃取剂生产商，针对单级萃取效率低、溶剂损耗高等痛点，以小批量试用快速验证TIE331产品在回收率提升与成本控制方面的实效，形成可量化合作案例。'),
            ('校企资源协同',
             '联动新西伯利亚国立大学科研平台，举办稀土绿色回收技术研讨会，以实证案例吸引产业链企业参与，建立高意向客户清单，实现技术背书与资源网络双驱动。'),
            ('梯度渗透覆盖',
             '立足标杆客户细分领域，通过定向技术分享、行业白皮书、线上直播与专业会议组合策略，推动成功模式向区域及跨应用场景有序复制，稳步扩大市场影响力与品牌认知度。'),
        ]),
        (10, 380, '03', '综合效益展望', [
            ('经济效益',
             '轻资产运营模式显著降低初期投入，依托溶剂可循环特性压缩长期成本；三年内验证商业模式可行性，后续通过技术授权、定制服务等高附加值路径提升盈利空间，形成良性现金流循环。'),
            ('社会效益',
             '推动工业废弃物中稀土资源高效绿色回收，减少环境污染，惠及稀土产业及受污染地区人群；为行业提供可推广的资源化技术方案，助力工艺升级与国家循环经济战略实施。'),
        ]),
        (655, 380, '04', '风险应对机制', [
            ('市场风险',
             '采用"精准锚定+梯度扩张"策略，优先验证高匹配度客户，预留运营资金应对需求波动，动态优化推广节奏。'),
            ('技术风险',
             '依托高校科研平台与中试验证闭环持续优化工艺参数，建立客户反馈实时迭代机制，确保技术与产业需求同步演进。'),
            ('运营风险',
             '核心团队持股激励（融资后合计34.3%）强化长期绑定；专项资金账户与分阶段拨付制度保障资金高效使用；轻资产结构降低固定成本负担，全面提升抗风险韧性。'),
        ]),
    ]

    badge_w, badge_h = 90, 36
    bullet_sz = 20

    for bi, (bx, by, label, title, items) in enumerate(blocks):
        # ---- card_frame image (AI-gen, native 1241x650 asp 1.909, box 615x340 asp 1.809, stretch 1.056) ----
        pg.img([bx, by, BW, BH], _a('card_frame_wide.png'), function='card_frame')

        # ---- corner_hud at top-right of card (native 1233x1255 asp 0.982, box 48x48 asp 1.0, stretch 1.018) ----
        pg.img([bx + BW - 54, by + 4, 48, 48], _a('corner_hud.png'), function='corner_hud')

        # ---- section badge (AI-gen ribbon, native 1280x576 asp 2.222, box 90x36 asp 2.5, stretch 1.125) ----
        bdx = bx + 14
        bdy = by + 12
        pg.img([bdx, bdy, badge_w, badge_h], _a('section_badge.png'), function='ribbon')
        pg.T([bdx, bdy + 4, badge_w, badge_h - 8], label, SZ_BODY, font=NUM,
             color=GOLD_LT, align='CENTER')

        # ---- section title ----
        tx = bdx + badge_w + 10
        pg.T([tx, bdy + 4, BW - badge_w - 40, badge_h - 8], title, SZ_CARD_TITLE,
             font=DISP, color=WHITE, align='LEFT')

        # ---- items in columns ----
        n = len(items)
        col_area_x = bx + 14
        col_area_y = by + badge_h + 18
        col_area_w = BW - 28
        col_area_h = BH - badge_h - 30
        col_gap = 8
        col_w = (col_area_w - col_gap * (n - 1)) / n

        for ci, (item_title, item_body) in enumerate(items):
            cx = col_area_x + ci * (col_w + col_gap)
            # bullet marker (AI-gen, native 1280x1280 asp 1.0, box 20x20)
            pg.img([cx, col_area_y, bullet_sz, bullet_sz], _a('bullet_marker.png'),
                   function='bullet_marker')
            # item title
            pg.T([cx + bullet_sz + 6, col_area_y, col_w - bullet_sz - 6, 24],
                 item_title, SZ_BODY, font=BODYB, color=CYAN, align='LEFT')
            # item body
            body_y = col_area_y + 28
            body_h = col_area_h - 28
            pg.T([cx, body_y, col_w, body_h], item_body, SZ_BODY, font=BODY,
                 color=DIM, align='LEFT')

    # ============================================================
    # PAGE CORNER HUD decorations
    # ============================================================
    pg.img([0, 0, 50, 50], _a('corner_hud.png'), function='corner_hud')
    pg.img([1230, 0, 50, 50], _a('corner_hud.png'), flipH=True, function='corner_hud')

    return pg, 'p19qwen37_落地前景'
