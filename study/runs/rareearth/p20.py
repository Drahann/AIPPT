# -*- coding: utf-8 -*-
"""p20 「社会影响」 — replica of blue_tech_5571d6b9_p08 (3_col_text_image_cards).

Three pillars (民生福祉 / 社会文明 / 生态文明) as three framed tech cards, each with a
glowing card_frame, a frosted bg_panel, a numbered hex badge, a themed motif, a HUD
corner bracket, and a bulleted condensed body. Deep-blue 国金定拿 skin (cyan + gold).
All decorations are real images freshly gen'd into ./_assets for THIS page's boxes.
"""
import os, sys

RUN = os.path.dirname(os.path.abspath(__file__))   # study/runs/rareearth
HERE = os.path.join(RUN, 'p20_社会影响')             # this page's output folder
sys.path.insert(0, RUN)
import deckgen_lib as L
from deckgen_lib import Page

# ---- chosen reference deck (skin/fonts) + this page's clean base ----
DECK = os.path.join(RUN, '..', '..', 'corpus', 'blue_tech_5571d6b9', 'deck_record.json')
BASE = os.path.join(HERE, '_assets', 'clean_base.png')

A = os.path.join(HERE, '_assets')

# ---- skin colors (from blue_tech_5571d6b9 deck_record) ----
CYAN   = '#0BF9FE'
CYAN_D = '#5EB0FC'
WHITE  = '#FFFFFF'
DIM    = '#CFE6FF'
GOLD   = '#F2D290'
GOLD_S = ['#FBF1C6', '#F2D290', '#E2B25E']
CYAN_S = ['#9DF6FF', '#0BF9FE', '#5EB0FC']

# fonts
DISP = 'DISP_TITLE'   # Alibaba PuHuiTi H heavy -> titles/headline/numbers display
NUM  = 'DISP_NUM'
BODY = 'BODY'
BODYM = 'BODY_M'
BODYB = 'BODY_B'


def build():
    pg = Page()

    # 0) full-bleed calming scrim over the busy city scene (allowed vector)
    pg.scrim((0, 0, 1280, 720), fill='rgba(4,12,38,0.40)')

    # ===================== HEADLINE =====================
    # title_flank winged banner behind the page title (native asp 3.176 -> box 470x148)
    pg.img([405, 18, 470, 148], os.path.join(A, 'title_flank.png'),
           preserve='none', function='title_flank')
    pg.T([405, 48, 470, 64], '社会影响', 52, font=DISP, grad=GOLD_S, align='CENTER')
    pg.T([340, 112, 600, 26], 'SOCIAL  IMPACT · 三维社会价值', 24, font=BODYM, color=DIM, align='CENTER')

    # ===================== THREE PILLAR CARDS =====================
    cards = [
        dict(no='一', en='LIVELIHOOD', title='民生福祉',
             motif='motif_minsheng.png',
             lead='就业拉动 · 人才提质 · 获得感增强',
             bullets=[
                 '直接或间接带动相关行业新增就业约50人，就业拉动效应显著',
                 '以萃取剂技术创新弥补工业废弃物资源化人才结构性缺口，系统提升技术能力与职业素养',
                 '依托萜类化合物产业链协同，提供技术含量高、成长清晰的岗位，增强职业稳定性与社会认同',
                 '产业链价值提升间接优化薪酬结构与社保覆盖，增强劳动者获得感与就业可持续性',
             ]),
        dict(no='二', en='CIVILIZATION', title='社会文明',
             motif='motif_shehui.png',
             lead='平台协作 · 知识共享 · 包容韧性',
             bullets=[
                 '构建"校—企—产"多元协作平台，联动新西伯利亚国立大学等开展技术研讨与案例分享',
                 '促进科研人员、企业技术骨干、产业工人等不同群体深度交流与知识共享',
                 '打破行业壁垒与信息孤岛，推动社会资源优化配置与群体间理解互信',
                 '培育开放协作、创新驱动的社会文化，助力社会向包容、协同、韧性方向演进',
             ]),
        dict(no='三', en='ECOLOGY', title='生态文明',
             motif='motif_shengtai.png',
             lead='生产—生活—自然 · 和谐共生',
             bullets=[
                 '生产端：高选择性萃取实现废液稀土绿色回收，降排放降消耗，引领清洁化循环化升级',
                 '生活端：示范应用强化资源节约与环保认知，引导绿色消费与低碳生活方式',
                 '自然端：减少废弃物对土壤、水体危害，助力区域生态修复与生物多样性保护',
                 '三端联动构建资源高效、环境友好的可持续闭环，提供可复制的产业实践路径',
             ]),
    ]

    # geometry
    cw, ch = 370, 502
    cy = 176
    xs = [56, 455, 854]

    for i, (cx, c) in enumerate(zip(xs, cards)):
        # 1) card frame (hollow glowing border) — real image, == card box
        pg.img([cx, cy, cw, ch], os.path.join(A, 'card_frame.png'),
               preserve='none', function='card_frame')
        # 2) frosted bg_panel behind the body text (real image)
        pg.img([cx + 18, cy + 160, cw - 36, 320], os.path.join(A, 'bg_panel.png'),
               preserve='none', opacity=0.48, function='bg_panel')
        # 3) numbered hex badge (real image) + the number on top
        bx = cx + cw / 2 - 46
        pg.img([bx, cy + 18, 92, 92], os.path.join(A, 'num_badge.png'),
               preserve='none', function='number_backplate')
        pg.T([bx, cy + 18 + 26, 92, 44], c['no'], 34, font=DISP, grad=CYAN_S, align='CENTER')
        # 4) themed motif beside title
        pg.img([cx + 24, cy + 116, 64, 64], os.path.join(A, c['motif']),
               preserve='none', function='motif')
        # title + english + flank bullet marker
        pg.T([cx + 94, cy + 116, cw - 110, 40], c['title'], 30, font=DISP, grad=GOLD_S, align='LEFT')
        pg.T([cx + 96, cy + 150, cw - 110, 20], c['en'], 18, font=BODYM, color=CYAN_D, align='LEFT')
        # lead line (sits on the bg_panel top band) with a glowing marker
        pg.img([cx + 22, cy + 176, 22, 22], os.path.join(A, 'bullet.png'),
               preserve='none', function='bullet_marker')
        pg.T([cx + 50, cy + 174, cw - 70, 24], c['lead'], 18, font=BODYB, color=GOLD, align='LEFT')
        # divider line under lead (allowed thin vector)
        pg.line([cx + 24, cy + 204, cx + cw - 24, cy + 204], color='rgba(120,200,255,0.5)', w=1.4)

        # 5) condensed bullets (every point preserved)
        by = cy + 214
        for b in c['bullets']:
            # gold bullet dot (thin vector marker is fine as a tiny dash, text carries it)
            pg.T([cx + 24, by, 16, 22], '▸', 18, font=DISP, color=CYAN, align='LEFT')
            pg.T([cx + 42, by, cw - 64, 70], b, 18, font=BODY, color=DIM, align='LEFT')
            by += 68

        # 6) HUD corner bracket bottom-right of each card (real image), flipped to hug the corner
        pg.img([cx + cw - 86, cy + ch - 86, 78, 78], os.path.join(A, 'corner_hud.png'),
               preserve='none', flipH=True, function='corner_hud')

    return pg, 'p20_社会影响'
