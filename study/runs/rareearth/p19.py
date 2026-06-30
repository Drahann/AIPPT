# -*- coding: utf-8 -*-
"""p19 — 落地前景 (TIE331 萜类化合物辅助稀土金属回收).

REPLICA-DRIVEN page. Primary layout reference = blue_tech_73369ac4_p22
  (archetype=roadmap, slot_signature=3_stage_roadmap_cards): a deep-blue tech
  3-stage rising/aligned roadmap card band with ribbon title bars + tech motifs.
Skin = blue_tech_e180c417 (智驭未来 深蓝科技) — SAME skin/fonts as sibling page p18
  (财务规划) so the whole deck reads as one book (大类=科技 + unified font ramp).

Content = ALL 4 H3 sections of 落地前景, zero point deletion:
  ① 产业化实施路径  -> 3-stage roadmap hero (第一年/二年/三年 cards)
  ② 市场推广策略    -> support card (点—线—面 闭环, 3 bullets)
  ③ 综合效益展望    -> support card (经济/社会效益, 2 bullets)
  ④ 风险应对机制    -> support card (市场/技术/运营风险, 3 bullets)

Decorations are AI-generated to THIS page's boxes (card_A/card_B/ribbon/bg_panel,
screen-blended) + same-box chrome reused from the same deck skin (title_band/
title_tab/bottom_glow/dot/molecule). See _assets/.
"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import deckgen_lib as L
from deckgen_lib import Page

# ---- reference paths (智驭未来 deck skin + this page's clean base) ----
DECK = os.path.join(HERE, '..', '..', 'corpus', 'blue_tech_e180c417', 'deck_record.json')
BASE = os.path.join(HERE, 'p19_落地前景', '_assets', 'base.png')
A = '_assets/'

# ---- reference skin palette (深蓝科技 智驭未来) — matches p18 ----
BG_DEEP = '#002455'
BLUE    = '#016DFF'
CYAN    = '#0AADEE'
CYAN_BR = '#66FFFF'
GREEN   = '#08D089'
GOLD    = '#F2C14E'
WHITE   = '#FFFFFF'
DIM     = '#CFE0F5'
DIM2    = '#9DBDE6'
TITLE_GRAD = ['#BBBBBB', '#F2F2F2', '#FFFFFF', '#BFBFBF', '#D8D8D8']
GOLD_STOPS = ['#FCE9B8', '#F2C14E', '#E0A93B']

L.GOLD = GOLD; L.GOLD_DK = '#E0A93B'; L.GOLD_STOPS = GOLD_STOPS
L.BLUE = BLUE; L.BLUE_BR = BLUE; L.CYAN = CYAN; L.TEAL = GREEN
L.WHITE = WHITE; L.DIM = DIM; L.DIM2 = DIM2
L.PANEL = 'rgba(7,26,66,0.62)'; L.PANEL_SOFT = 'rgba(9,30,74,0.5)'
L.PANEL_STK = 'rgba(90,170,255,0.45)'; L.GOLD_STK = 'rgba(242,193,78,0.85)'

KAI  = '字体圈欣意冠黑体'
DISP = L.DISP
NUM  = L.NUM
BODY = L.BODY
BODYM = L.BODYM
BODYB = L.BODYB

STAGE_COL = [BLUE, CYAN, GREEN]


def chevron_tab(pg, x, y, w, h, text, active=False):
    skew = 14
    pts = f'{x+skew},{y} {x+w},{y} {x+w-skew},{y+h} {x},{y+h}'
    fill = ('rgba(3,162,255,0.55)' if active else 'rgba(20,70,140,0.30)')
    stroke = (CYAN_BR if active else 'rgba(120,180,255,0.45)')
    pg.extras.append({'type': 'polygon', 'points': pts, 'fill': fill,
                      'stroke': stroke, 'sw': 1.4})
    pg.T([x, y + (h - 21) / 2 - 1, w, 30], text, 21,
         font=BODYB, color=(WHITE if active else DIM), align='CENTER')


def bullet(pg, x, y, w, h, label, desc, col, panel='bg_panel.png'):
    """one bullet row: bg_panel strip (real img) + dot marker (real img) + label + desc, co-registered."""
    pg.img([x, y, w, h], A + panel, blend='screen', opacity=0.95, function='bg_panel')
    pg.img([x + 13, y + 13, 28, 28], A + 'dot.png', blend='screen', function='bullet_marker')
    pg.T([x + 50, y + 9, w - 60, 22], label, 16, font=BODYB, color=col, align='LEFT')
    pg.T([x + 50, y + 31, w - 62, h - 36], desc, 14, font=BODY, color=DIM, align='LEFT')


def stage_card(pg, x, y, w, h, year, title, bullets, col):
    pg.img([x, y, w, h], A + 'card_A.png', blend='screen', function='card_frame')
    # ribbon title bar (real img) + stage title on top, co-registered
    rb_w = w - 36
    pg.img([x + 18, y + 8, rb_w, 44], A + 'ribbon.png', blend='screen', function='ribbon')
    pg.T([x + 18, y + 18, rb_w, 30], title, 20, font=DISP, color=WHITE, align='CENTER')
    # year tag (gold) sitting top-left, poking above the ribbon
    L.tag_pill(pg, x + 14, y - 14, 80, 30, year, size=17, font=BODYB,
               fill='rgba(12,46,104,0.92)', stroke='rgba(242,193,78,0.9)', txt_color=GOLD)
    # body bullets (dot + line)
    by = y + 66
    for b in bullets:
        pg.img([x + 16, by + 1, 22, 22], A + 'dot.png', blend='screen', function='bullet_marker')
        pg.T([x + 44, by - 2, w - 60, 40], b, 14, font=BODY, color=DIM, align='LEFT')
        # estimate height: 1 line if <=20 chars else 2
        by += 28 if len(b) <= 20 else 50


def support_card(pg, x, y, w, h, title, col, rows, row_h, panel='bg_panel.png', gap=7):
    pg.img([x, y, w, h], A + 'card_B.png', blend='screen', function='card_frame')
    # header: icon disc + section title
    L.icon_disc(pg, x + 34, y + 31, 13, color=GOLD, fill='rgba(12,46,104,0.85)')
    pg.T([x + 32, y + 20, 16, 24], '◆', 12, font=NUM, color=GOLD, align='CENTER')
    pg.T([x + 56, y + 15, w - 72, 30], title, 23, font=DISP, color=WHITE, align='LEFT')
    L.node_divider(pg, x + 24, y + 50, w - 48, color=GOLD)
    ry = y + 56
    for label, desc, c in rows:
        bullet(pg, x + 14, ry, w - 28, row_h, label, desc, c, panel)
        ry += row_h + gap


def build():
    pg = Page()
    pg.scrim((0, 0, 1280, 720), fill='rgba(3,14,40,0.32)')
    pg.img([0, 430, 1280, 290], A + 'bottom_glow.png', blend='screen', opacity=0.85, function='glow')

    # ===== TOP NAV =====
    tabs = ['项目背景', '技术方案', '市场分析', '财务规划', '落地前景']
    tx = 314; tw = 165; th = 50; gap = 9
    for i, t in enumerate(tabs):
        chevron_tab(pg, tx + i * (tw + gap), 22, tw, th, t, active=(t == '落地前景'))

    # ---- page-title flank + title ----
    pg.img([30, 8, 300, 56], A + 'title_tab.png', blend='screen', opacity=0.9, function='title_flank')
    pg.T([48, 6, 320, 60], '落地前景', 50, font=KAI, grad=TITLE_GRAD, align='LEFT')

    # ===== TITLE BAND + headline =====
    pg.img([0, 100, 1280, 72], A + 'title_band.png', blend='screen', opacity=0.9, function='title_flank')
    pg.T([150, 112, 900, 48], '产业验证阶段 · 三年三阶段推进 · 累计销售收入 20 万元',
         34, font=DISP, grad=GOLD_STOPS, align='CENTER')
    pg.img([1176, 116, 56, 56], A + 'molecule.png', blend='screen', opacity=0.95, function='motif')

    # ===== HERO: 产业化实施路径 — 3-stage roadmap =====
    pg.T([54, 176, 360, 28], '产业化实施路径', 20, font=DISP, color=GOLD, align='LEFT')
    pg.T([232, 180, 1000, 22],
         '实验室系统验证已完成，高酸度含氟硫复杂废液中铈离子选择性萃取、两相分离与溶剂循环稳定，具备中试放大条件',
         14, font=BODY, color=DIM2, align='LEFT')

    cards = [
        ('第一年', '中试验证 · 标杆突破',
         ['TIE331 工艺参数固化 + 中试放大',
          '对接 2 家稀土回收标杆企业小批量试用',
          '验证单级萃取效率（回收率≥85%），形成可复制实施方案'], STAGE_COL[0]),
        ('第二年', '产品拓展 · 网络构建',
         ['推进 TIE332–350 系列开发，拓展 3 家标杆客户',
          '深化校企协同，积累跨场景应用数据',
          '完善“技术方案+定制服务”轻资产服务模式'], STAGE_COL[1]),
        ('第三年', '模式固化 · 规模预备',
         ['TIE331–381 全系产品矩阵优化',
          '依托客户反馈闭环迭代技术',
          '累计销售收入 20 万元，验证商业模式可行性'], STAGE_COL[2]),
    ]
    cw, chh = 372, 208
    cx0 = 54; cgap = 28; cy = 212
    centers = []
    for i, (yr, ti, bl, col) in enumerate(cards):
        cx = cx0 + i * (cw + cgap)
        stage_card(pg, cx, cy, cw, chh, yr, ti, bl, col)
        centers.append((cx, cx + cw))
    # roadmap connector arrows between stage cards
    for i in range(2):
        ax = centers[i][1] + 2
        bx = centers[i + 1][0] - 2
        L.arrow(pg, ax, cy + chh / 2, bx, cy + chh / 2, color=GOLD, w=3, head=9)

    # ===== BOTTOM: 3 support cards =====
    sw, shh = 390, 288
    sx0 = 40; sgap = 15; sy = 428
    support_card(pg, sx0, sy, sw, shh, '市场推广策略', BLUE, [
        ('精准锚定标杆合作', '聚焦稀土回收 / 萃取剂厂商，小批量试用验证 TIE331 回收率与成本实效，形成可量化合作案例', CYAN_BR),
        ('校企资源协同赋能', '联动新西伯利亚国立大学，举办绿色回收技术研讨会，建立高意向客户清单', CYAN_BR),
        ('梯度渗透市场覆盖', '定向技术分享 + 行业白皮书 + 直播会议，推动成功模式向区域及跨场景复制', CYAN_BR),
    ], row_h=70, panel='bg_panel.png', gap=8)
    support_card(pg, sx0 + (sw + sgap), sy, sw, shh, '综合效益展望', GREEN, [
        ('经济效益', '轻资产运营降低初期投入，溶剂可循环压缩长期成本；后续通过技术授权、定制服务等高附加值路径提升盈利，形成“销售-反馈-优化”现金流循环', '#7CF0C0'),
        ('社会效益', '推动工业废弃物中稀土高效绿色回收，减污惠民；为行业提供可推广资源化方案，助力工艺升级与国家循环经济战略', '#7CF0C0'),
    ], row_h=106, panel='bg_panel_tall.png', gap=16)
    support_card(pg, sx0 + 2 * (sw + sgap), sy, sw, shh, '风险应对机制', GOLD, [
        ('市场风险', '精准锚定 + 梯度扩张，优先验证高匹配度客户，预留运营资金应对需求波动', GOLD),
        ('技术风险', '高校科研平台 + 中试验证闭环持续优化工艺参数，建立客户反馈实时迭代机制', GOLD),
        ('运营风险', '核心团队持股 34.3% 绑定，专项账户分阶段拨付，轻资产结构降低固定成本', GOLD),
    ], row_h=70, panel='bg_panel.png', gap=8)

    return pg, 'p19_落地前景'


if __name__ == '__main__':
    build()
