# -*- coding: utf-8 -*-
"""创新技术 v2 — REAL library decorations (no hand-drawn frames), per deco_skeleton discipline.
card_frame = real med_blue_white_2e33d129_s10 card backgrounds; title_flank = real EKG (医疗);
motif = qwen-image-2.0-pro nano. Fonts START large. ref: med_blue_white_26c204da_p06 (3_col_cards)."""
from gen5_lib import *

H2 = '创新技术'
DEC = 'W:/ppt/study/runs/gen5/_decos'
FRAME = {'01': f'{DEC}/cardframe_L.png', '02': f'{DEC}/cardframe_M.png', '03': f'{DEC}/cardframe_R.png'}


def tech_card(pg, x, no, short, full, approach, hero, hero_label, subs, achieve):
    w, y0, h = 373, 176, 484
    # dark panel to calm the bright HUD frame, then the REAL card_frame on top (opaque -> opacity tones it)
    pg.panel([x, y0, w, h], fill='rgba(5,12,32,0.92)', stroke=None, rx=10)
    pg.img([x, y0, w, h], FRAME[no], preserve='none', opacity=0.86)
    # header: number (top-left) + short title (centered under the frame's gold notch)
    pg.T([x + 20, y0 + 14, 60, 30], no, 26, font=NUM, grad=GOLD_STOPS)
    pg.T([x, y0 + 16, w, 30], short, 23, font=DISP, grad=GOLD_STOPS, align='CENTER')
    pg.T([x + 20, y0 + 54, w - 40, 48], full, 18, font=DISP, color=WHITE, align='CENTER')
    # hero metric (big, gold) — real glow emphasis behind the number (用户: 每个数字背后加强调装饰)
    pg.img([x + w / 2 - 105, y0 + 116, 210, 96], f'{DEC}/glow.png', blend='screen', opacity=0.75)
    pg.T([x, y0 + 128, w, 70], hero, 62, font=NUM, grad=GOLD_STOPS, align='CENTER')
    # '%' just right of the centered number (number visual half-width ~ 2.0 chars * 62 * 0.3)
    pg.T([x + w / 2 + len(hero) * 17, y0 + 150, 40, 30], '%', 26, font=DISP, color=GOLD, align='LEFT')
    pg.T([x, y0 + 200, w, 24], hero_label, 16, font=BODYM, color='#BFE8FF', align='CENTER')
    # sub metrics
    sy = y0 + 240
    for s in subs:
        pg.extras.append({'type': 'rect', 'box': [x + 34, sy + 7, 8, 8], 'rx': 2, 'fill': GOLD})
        pg.T([x + 52, sy, w - 78, 24], s, 15.5, font=BODY, color='#EAF3FF')
        sy += 28
    # 代表性成果 in the frame's dark bottom strip
    pg.T([x + 24, y0 + h - 64, w - 48, 20], '代表性成果', 14, font=DISP, color=GOLD)
    pg.T([x + 24, y0 + h - 42, w - 48, 32], achieve, 13.5, font=BODY, color='#CFE0F2')


def build():
    pg = Page()
    pg.scrim(fill='rgba(6,14,40,0.52)')
    pg.img([1108, 8, 160, 160], f'{DEC}/nano2.png', blend='screen', opacity=0.92)
    page_title(pg, '创新技术', x=64, y=44, big=52,
               sub_text='三项核心技术体系 · 高纯制备 / 疏水定向调控 / 纳米涂层稳定 · 全链条创新突破')
    pg.img([300, 40, 660, 92], f'{DEC}/glow.png', blend='screen', opacity=0.4)            # title glow streak
    pg.img([470, 52, 150, 50], f'{DEC}/flank_ekg.png', blend='screen', opacity=0.9)        # real 医疗 title_flank (R)
    pg.img([198, 52, 150, 50], f'{DEC}/flank_ekg.png', blend='screen', opacity=0.9, flipH=True)  # mirrored (L)

    pg.panel([56, 130, 1168, 40], fill='rgba(10,28,68,0.5)', stroke='rgba(120,180,255,0.3)', rx=10)
    pg.T([78, 140, 1130, 24],
         '针对导管涂层原料成本高（单支超15元）、批次稳定性弱、功能单一等瓶颈，系统构建三项核心技术，'
         '聚焦高纯蛋白制备、疏水定向调控与纳米涂层稳定，实现从原料纯化到功能涂层的全链条创新突破。',
         15, font=BODY, color=DIM)

    tech_card(pg, 56, '01', '组合排杂纯化', '大米蛋白组合排杂纯化技术',
              '皂化脱脂 + 协同酶解 + CSAP亲和离子交换层析联用',
              '99.99', '蛋白纯度（传统工艺 ≤85%）',
              ['内毒素降至 0.005 EU/mg', '回收率稳定 60%', '批次误差 RSD ＜ 3%', '满足医用辅料级标准'],
              '发明专利 CN202510262436.6 · Foods / J.Food Eng（SCI Q1）2篇')
    tech_card(pg, 453, '02', 'pH共架改性', '大米蛋白 pH 共架改性增溶技术',
              '调控pH构建亲水共架 + 修饰二硫键 + 引入双亲性组装域',
              '96.8', '蛋白溶解度（传统 ＜10%）',
              ['摩擦系数低至 0.001（优于肝素）', '抗凝活性亚组分 ＞30%', '分子分散性显著提升', '破解水相功能协同壁垒'],
              '发明专利 CN202610489470.1 · Food&Bioprocess Tech（SCI Q1）')
    tech_card(pg, 850, '03', '纳米共组装', '谷-清蛋白纳米共组装涂层稳定技术',
              '谷:清=3:7 梯度配比 → 50nm单分散胶体 + 界面交联锁合',
              '98.2', '血栓抑制率',
              ['涂层划痕脱落面积 ＜2%', '血小板黏附率降至 17.9%', '单支涂层成本降低 60%', '全面优于进口肝素'],
              '发明专利 CN202510600358.6 · J.Cereal Sci / CCA（SCI Q2）3篇')
    return pg, '创新技术_v2'
