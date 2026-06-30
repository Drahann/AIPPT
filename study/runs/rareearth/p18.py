# -*- coding: utf-8 -*-
"""p18 — 财务规划 (TIE331 萜类化合物辅助稀土金属回收).

REPLICA of reference page  blue_tech_e180c417_p05  (financing:
  top_nav + title + left_bar_chart + right_pie_list).
Same deep-blue tech skin (智驭未来 deck), same layout: top nav chevrons, gold/white
title band, LEFT card = staged-funding bar chart, RIGHT card = fund-allocation donut
+ 4 bottom category panels with glowing bullet markers.

All decorations are AI-generated to THIS page's exact boxes (see _assets/), screen-blended.
"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import deckgen_lib as L
from deckgen_lib import Page

# ---- reference paths (智驭未来 deck skin + this page's clean base) ----
DECK = os.path.join(HERE, '..', '..', 'corpus', 'blue_tech_e180c417', 'deck_record.json')
BASE = os.path.join(HERE, 'p18_财务规划', '_assets', 'base.png')
A = '_assets/'   # extras hrefs resolve relative to binding dir (= page out dir)

# ---- override lib palette constants to the REFERENCE skin (深蓝科技 智驭未来) ----
BG_DEEP = '#002455'
BLUE    = '#016DFF'      # primary royal blue
CYAN    = '#0AADEE'
CYAN_BR = '#66FFFF'
GREEN   = '#08D089'
BLUE_DK = '#1D56A1'
GOLD    = '#F2C14E'
WHITE   = '#FFFFFF'
DIM     = '#CFE0F5'
DIM2    = '#9DBDE6'
TITLE_GRAD = ['#BBBBBB', '#F2F2F2', '#FFFFFF', '#BFBFBF', '#D8D8D8']  # ref title silver grad
CYAN_STOPS = ['#9BE8FF', '#0AADEE', '#016DFF']
GOLD_STOPS = ['#FCE9B8', '#F2C14E', '#E0A93B']

# patch lib so helpers (pie/bar) emit reference colors
L.GOLD = GOLD; L.GOLD_DK = '#E0A93B'; L.GOLD_STOPS = GOLD_STOPS
L.BLUE = BLUE; L.BLUE_BR = BLUE; L.CYAN = CYAN; L.TEAL = GREEN
L.WHITE = WHITE; L.DIM = DIM; L.DIM2 = DIM2
L.PANEL = 'rgba(7,26,66,0.62)'; L.PANEL_SOFT = 'rgba(9,30,74,0.5)'
L.PANEL_STK = 'rgba(90,170,255,0.45)'; L.GOLD_STK = 'rgba(242,193,78,0.85)'
# donut allocation colors: 研发(blue) 运营(cyan) 市场(green) 团队(gold)
CAT = [BLUE, CYAN, GREEN, GOLD]

KAI = '字体圈欣意冠黑体'    # reference title font
DISP = L.DISP
NUM = L.NUM
BODY = L.BODY
BODYM = L.BODYM
BODYB = L.BODYB


def chevron_tab(pg, x, y, w, h, text, active=False):
    """parallelogram nav tab like the reference top row."""
    skew = 14
    pts = f'{x+skew},{y} {x+w},{y} {x+w-skew},{y+h} {x},{y+h}'
    fill = ('rgba(3,162,255,0.55)' if active else 'rgba(20,70,140,0.30)')
    stroke = (CYAN_BR if active else 'rgba(120,180,255,0.45)')
    pg.extras.append({'type': 'polygon', 'points': pts, 'fill': fill,
                      'stroke': stroke, 'sw': 1.4})
    pg.T([x, y + (h - 21) / 2 - 1, w, 30], text, 21,
         font=BODYB, color=(WHITE if active else DIM), align='CENTER')


def build():
    pg = Page()

    # full-canvas calming scrim so text reads on the gradient base
    pg.scrim((0, 0, 1280, 720), fill='rgba(3,14,40,0.30)')

    # ---- bottom atmospheric glow (screen) ----
    pg.img([0, 430, 1280, 290], A + 'bottom_glow.png', blend='screen', opacity=0.85,
           function='glow')

    # ================= TOP NAV (5 chevron tabs) =================
    tabs = ['项目背景', '技术方案', '市场分析', '财务规划', '风险控制']
    tx = 314; tw = 165; th = 50; gap = 9
    for i, t in enumerate(tabs):
        chevron_tab(pg, tx + i * (tw + gap), 22, tw, th, t, active=(t == '财务规划'))

    # ---- page-title flank backplate (ref sh03: 左上角标题底块) ----
    pg.img([30, 8, 300, 56], A + 'title_tab.png', blend='screen', opacity=0.9,
           function='title_flank')
    # ---- page title (left, silver grad like ref sh06) ----
    pg.T([48, 6, 320, 60], '财务规划', 50, font=KAI, grad=TITLE_GRAD, align='LEFT')

    # ================= TITLE BAND + headline =================
    pg.img([0, 100, 1280, 72], A + 'title_band.png', blend='screen', opacity=0.9,
           function='title_flank')
    pg.T([150, 110, 980, 50], '融资 1000 万元 · 出让 30% 股权 · 三年累计销售收入 20 万元',
         36, font=DISP, grad=GOLD_STOPS, align='CENTER')

    # ================= LEFT CARD: staged-funding bar chart =================
    LCX, LCY, LCW, LCH = 46, 190, 576, 490
    pg.img([LCX, LCY, LCW, LCH], A + 'card_left.png', blend='screen', function='card_frame')
    pg.T([LCX + 24, LCY + 14, LCW - 48, 40], '资金使用 · 分阶段执行计划', 30,
         font=DISP, color=WHITE, align='CENTER')
    pg.T([LCX + LCW - 168, LCY + 58, 150, 26], '单位：资金占比', 16,
         font=BODYM, color=DIM2, align='RIGHT')
    # legend
    pg.pill([LCX + 30, LCY + 60, 16, 16], fill=BLUE, rx=4)
    pg.T([LCX + 52, LCY + 58, 120, 24], '当年投入占比', 15, font=BODYM, color=DIM, align='LEFT')

    bars = [
        {'label': '第一年\n工艺优化·2家客户', 'value': 40, 'value_text': '40%', 'color': BLUE},
        {'label': '第二年\nTIE332-350·3家客户', 'value': 40, 'value_text': '40%', 'color': CYAN},
        {'label': '第三年\n矩阵完善·规模复制', 'value': 20, 'value_text': '20%', 'color': GREEN},
    ]
    L.bar_chart(pg, [LCX + 46, LCY + 110, LCW - 92, 250], bars, max_value=52,
                value_px=30, label_px=15, value_grad=GOLD_STOPS, label_color=DIM,
                bar_w_frac=0.46, trend=False)
    # milestone caption inside card
    pg.T([LCX + 30, LCY + 432, LCW - 60, 44],
         '资金拨付与里程碑节点严格挂钩，核心团队与投资方协同监督，确保投入效率与目标一致。',
         15, font=BODY, color=DIM, align='CENTER')

    # ================= RIGHT CARD: allocation donut + categories =================
    RCX, RCY, RCW, RCH = 663, 190, 576, 490
    pg.img([RCX, RCY, RCW, RCH], A + 'card_right.png', blend='screen', function='card_frame')
    pg.T([RCX + 24, RCY + 14, RCW - 48, 40], '资金分配结构', 30,
         font=DISP, color=WHITE, align='CENTER')

    # donut (research/ops/market/team)
    pie_data = [
        {'label': '研发投入', 'value': 50, 'color': BLUE},
        {'label': '运营支出', 'value': 30, 'color': CYAN},
        {'label': '市场推广', 'value': 10, 'color': GREEN},
        {'label': '团队建设', 'value': 10, 'color': GOLD},
    ]
    dcx, dcy, dr = RCX + 200, RCY + 195, 96
    pg.pie(dcx, dcy, dr, pie_data, inner=0.56, colors=CAT,
           label_font=BODYM, value_font=NUM, label_px=15, label_color=WHITE)
    # molecular motif in the donut hole (screen)
    pg.img([dcx - 56, dcy - 56, 112, 112], A + 'molecule.png', blend='screen',
           opacity=0.95, function='motif')
    pg.T([dcx - 80, dcy - 24, 160, 30], '1000万', 30, font=NUM, grad=GOLD_STOPS, align='CENTER')
    pg.T([dcx - 80, dcy + 8, 160, 22], '专项融资', 15, font=BODYM, color=DIM, align='CENTER')

    # ---- 4 category panels (bottom of right card) ----
    cats = [
        ('研发投入', '50%', '萃取剂工艺·新品TIE332-381', BLUE),
        ('运营支出', '30%', '管理·知产维护·流动资金', CYAN),
        ('市场推广', '10%', '标杆对接·白皮书·精准营销', GREEN),
        ('团队建设', '10%', '研发工艺市场人才·激励', GOLD),
    ]
    pcols = 2
    pw, ph = 262, 96
    pgapx, pgapy = 16, 14
    px0 = RCX + 22
    py0 = RCY + 290
    for i, (name, pct, desc, col) in enumerate(cats):
        r = i // pcols; c = i % pcols
        bx = px0 + c * (pw + pgapx)
        by = py0 + r * (ph + pgapy)
        pg.img([bx, by, pw, ph], A + 'panel_cat.png', blend='screen', opacity=0.95,
               function='bg_panel')
        # glowing bullet marker
        pg.img([bx + 14, by + 14, 34, 34], A + 'dot.png', blend='screen',
               function='bullet_marker')
        pg.T([bx + 56, by + 12, pw - 70, 30], name, 20, font=DISP, color=WHITE, align='LEFT')
        pg.T([bx + pw - 96, by + 8, 86, 40], pct, 32, font=NUM, grad=GOLD_STOPS, align='RIGHT')
        pg.T([bx + 56, by + 50, pw - 66, 38], desc, 14, font=BODY, color=DIM, align='LEFT')

    return pg, 'p18_财务规划'


if __name__ == '__main__':
    build()
