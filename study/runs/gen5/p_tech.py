# -*- coding: utf-8 -*-
"""创新技术 → solution/content archetype. ref: med_blue_white_26c204da_p06 (3_col_cards).
3 technology columns, each: number badge + tech name + approach + hero metric + sub-metrics + 代表性成果."""
from gen5_lib import *

H2 = '创新技术'
DECOS = 'W:/ppt/study/runs/gen5/_decos'


def tech_card(pg, x, no, short, full, approach, hero, hero_unit, hero_label, subs, achieve):
    w, y0, h = 373, 196, 468
    pg.panel([x, y0, w, h])
    corner_brackets(pg, [x, y0, w, h], size=20)
    # header: badge + short title
    icon_disc(pg, x + 42, y0 + 36, 24, color=GOLD)
    pg.T([x + 18, y0 + 22, 48, 30], no, 24, font=NUM, grad=GOLD_STOPS, align='CENTER')
    pg.T([x + 78, y0 + 22, w - 90, 30], short, 22, font=DISP, grad=GOLD_STOPS)
    # full name (2 lines ok)
    pg.T([x + 22, y0 + 62, w - 44, 50], full, 17, font=DISP, color=WHITE)
    # approach
    pg.T([x + 22, y0 + 110, w - 44, 46], approach, 14, font=BODY, color=DIM)
    node_divider(pg, x + 22, y0 + 168, w - 44)
    # hero metric with vector badge
    cx = x + w / 2
    num_badge(pg, cx, y0 + 232, 56)
    pg.T([x, y0 + 196, w, 64], hero, 52, font=NUM, grad=GOLD_STOPS, align='CENTER')
    pg.T([x, y0 + 264, w, 24], hero_label, 15, font=BODYM, color=CYAN, align='CENTER')
    # sub metrics
    sy = y0 + 300
    for s in subs:
        pg.extras.append({'type': 'rect', 'box': [x + 30, sy + 6, 7, 7], 'rx': 2, 'fill': GOLD})
        pg.T([x + 46, sy, w - 70, 22], s, 14, font=BODY, color=DIM)
        sy += 25
    # 代表性成果 footer
    fy = y0 + h - 78
    pg.panel([x + 14, fy, w - 28, 64], fill='rgba(20,55,120,0.5)', stroke=GOLD_STK, sw=1.1, rx=8)
    pg.T([x + 26, fy + 8, w - 50, 20], '代表性成果', 13.5, font=DISP, color=GOLD)
    pg.T([x + 26, fy + 30, w - 50, 30], achieve, 13.5, font=BODY, color=DIM)


def build():
    pg = Page()
    pg.scrim(fill='rgba(6,14,40,0.50)')
    pg.img([360, 6, 560, 150], f'{DECOS}/glow.png', blend='screen', opacity=0.45)
    pg.img([1112, 14, 150, 150], f'{DECOS}/nano.png', blend='screen', opacity=0.8)

    page_title(pg, '创新技术', x=64, y=44, big=50,
               sub_text='三项核心技术体系 · 高纯制备 / 疏水定向调控 / 纳米涂层稳定 · 全链条创新突破')
    # intro band
    pg.panel([56, 132, 1168, 50], fill='rgba(10,28,68,0.5)', stroke='rgba(120,180,255,0.3)', rx=10)
    pg.T([78, 146, 1130, 26],
         '针对导管涂层原料成本高（单支超15元）、批次稳定性弱、功能单一等产业瓶颈，系统构建三项核心技术，'
         '聚焦高纯蛋白制备、疏水性定向调控与纳米涂层稳定，实现从原料纯化到功能涂层的全链条创新突破。',
         14.5, font=BODY, color=DIM)

    tech_card(pg, 56, '01', '组合排杂纯化', '大米蛋白组合排杂纯化技术',
              '皂化脱脂 + 协同酶解 + CSAP亲和离子交换层析联用，高选择性富集目标白蛋白组分。',
              '99.99', '%', '蛋白纯度（传统工艺 ≤85%）',
              ['内毒素含量降至 0.005 EU/mg', '回收率稳定 60%', '批次误差 RSD ＜ 3%', '满足医用辅料级标准'],
              '发明专利 CN202510262436.6 · Foods / J.Food Eng（SCI Q1）2篇')

    tech_card(pg, 453, '02', 'pH共架改性增溶', '大米蛋白 pH 共架改性增溶技术',
              '调控体系pH构建亲水共架结构，修饰二硫键并引入双亲性组装结构域，重构亲疏水平衡。',
              '96.8', '%', '蛋白溶解度（传统 ＜10%）',
              ['摩擦系数低至 0.001（优于进口肝素）', '抗凝活性亚组分占比 ＞30%', '分子分散性显著提升', '破解水相功能协同壁垒'],
              '发明专利 CN202610489470.1 · Food&Bioprocess Tech（SCI Q1）')

    tech_card(pg, 850, '03', '纳米共组装稳定', '谷-清蛋白纳米共组装涂层稳定技术',
              '谷蛋白:清蛋白=3:7 梯度配比，构建50nm单分散纳米胶体，界面交联锁合形成致密薄膜。',
              '98.2', '%', '血栓抑制率',
              ['涂层划痕脱落面积 ＜2%', '血小板黏附率降至 17.9%', '单支导管涂层成本降低 60%', '关键指标全面优于进口肝素'],
              '发明专利 CN202510600358.6 · J.Cereal Sci / CCA（SCI Q2）3篇')

    return pg, H2
