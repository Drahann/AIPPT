# -*- coding: utf-8 -*-
"""团队结构 → team archetype. ref: med_blue_white_2e33d129_p13 / 5d47632c_p12 (founder+grid).
founder hero card (王炯桦) + 6 member cards (2x3) + bottom stat ribbon. zero member loss (7 total)."""
from gen5_lib import *

H2 = '团队结构'
DECOS = 'W:/ppt/study/runs/gen5/_decos'


def avatar(pg, cx, cy, r, surname):
    icon_disc(pg, cx, cy, r, color=GOLD, fill='rgba(15,45,105,0.85)', w=2.2)
    # inner ring
    pg.extras.append({'type': 'rect', 'box': [cx - r * 0.78, cy - r * 0.78, r * 1.56, r * 1.56],
                      'rx': r * 0.78, 'fill': 'none', 'stroke': 'rgba(120,180,255,0.5)', 'sw': 1.2})
    pg.T([cx - r, cy - r * 0.62, 2 * r, r * 1.3], surname, int(r * 1.05), font=DISP, grad=GOLD_STOPS, align='CENTER')


def member(pg, x, y, w, h, surname, name, role, direction, duty, achieve):
    import math
    pg.panel([x, y, w, h])
    corner_brackets(pg, [x, y, w, h], size=16, w=2)
    avatar(pg, x + 38, y + 40, 27, surname)
    pg.T([x + 74, y + 14, w - 86, 28], name, 20, font=DISP, grad=GOLD_STOPS)
    tag_pill(pg, x + 74, y + 44, min(136, len(role) * 15 + 22), 23, role, 13, align='CENTER')
    pg.extras.append({'type': 'line', 'p': [x + 16, y + 78, x + w - 16, y + 78],
                      'color': 'rgba(242,210,144,0.35)', 'w': 1.2})
    yy = y + 86
    tw = w - 62
    maxc = max(1, int(tw / 13))
    for lab, txt, col, lc in [('方向', direction, DIM, CYAN), ('职责', duty, DIM, BLUE_LT), ('成果', achieve, GOLD, GOLD)]:
        lines = min(2, max(1, math.ceil(len(txt) / maxc)))
        pg.T([x + 14, yy + 1, 30, 18], lab, 12, font=DISP, color=lc)
        pg.T([x + 48, yy, tw, 17 * lines + 6], txt, 13, font=BODY, color=col)
        yy += 17 * lines + 9


def build():
    pg = Page()
    pg.scrim(fill='rgba(6,14,40,0.50)')
    pg.img([330, 8, 640, 140], f'{DECOS}/glow.png', blend='screen', opacity=0.4)
    pg.img([1118, 14, 150, 150], f'{DECOS}/nano.png', blend='screen', opacity=0.75)

    page_title(pg, '团队结构', x=64, y=44, big=50,
               sub_text='六大领域全链条复合型协作 · 技术研发—产品验证—生产质控—市场转化—财务融资')

    # ---- founder hero ----
    fx, fy, fw, fh = 56, 150, 300, 458
    pg.panel([fx, fy, fw, fh])
    corner_brackets(pg, [fx, fy, fw, fh], size=22)
    tag_pill(pg, fx + 90, fy + 18, 120, 26, '团队负责人', 13, fill='rgba(242,210,144,0.18)',
             stroke=GOLD_STK, txt_color=GOLD)
    avatar(pg, fx + fw / 2, fy + 110, 56, '王')
    pg.T([fx, fy + 176, fw, 38], '王炯桦', 32, font=DISP, grad=GOLD_STOPS, align='CENTER')
    pg.T([fx, fy + 220, fw, 24], '团队负责人 / 拟任法人', 16, font=BODYM, color=CYAN, align='CENTER')
    node_divider(pg, fx + 30, fy + 256, fw - 60)
    fields = [('研究方向', '医用功能蛋白、生物材料与器械应用研究'),
              ('核心职责', '项目统筹、技术路线把控、资源协调与产业化推进'),
              ('关键成果', 'SCI论文3篇 · 全国大学生生命科学竞赛一等奖')]
    yy = fy + 268
    for lab, txt in fields:
        col = GOLD if lab == '关键成果' else DIM
        pg.T([fx + 24, yy, 80, 20], lab, 14, font=DISP, color=CYAN)
        pg.T([fx + 24, yy + 21, fw - 48, 42], txt, 15, font=BODY, color=col)
        yy += 58

    # ---- 6 members 2x3 ----
    members = [
        ('陈', '陈远幸', '董事长', '临床医学体系建设与诊疗技术创新', '战略规划、外部资源协同、临床需求转化', '全国大学生医学创新大赛二等奖 · SCI论文1篇（一作）'),
        ('盛', '盛宇菲', '研发总监', '血浆非编码分子检定研究', '核心技术研发、实验设计与检测验证', '全国大学生生命科学竞赛三等奖 · SCI论文3篇（一作）'),
        ('张', '张津叶', '产品总监', '蛋白质超分子结构构建及性能验证', '产品性能验证与结构优化', '国家奖学金 · 授权发明专利4项 · SCI论文3篇'),
        ('徐', '徐悦可', '生产经理', '医学全链条质量安全管控体系', '中试生产、质量控制与生产协同', '省政府奖学金 · SCI论文2篇（一作/二作）'),
        ('任', '任一帆', '市场总监', '市场调研与供应链管理', '市场调研、客户沟通、渠道拓展', '全国市场调查与分析大赛一等奖 · SCI论文1篇（一作）'),
        ('邓', '邓煜婕', '财务总监', '技术经济与管理', '融资测算、财务模型与资本运作体系搭建', '参与省重点项目 · SCI论文1篇'),
    ]
    gx, gy, gw, gh, gap = 380, 150, 270, 220, 16
    for i, m in enumerate(members):
        col, row = i % 3, i // 3
        x = gx + col * (gw + gap)
        y = gy + row * (gh + gap + 4)
        member(pg, x, y, gw, gh, *m)

    # ---- bottom stat ribbon ----
    ry = 614
    pg.panel([380, ry, 844, 52], fill='rgba(20,55,120,0.6)', stroke=GOLD_STK, sw=1.2, rx=10)
    stats = [('14', '篇', '累计 SCI 论文'), ('4', '项', '授权发明专利'), ('7', '项', '国家级竞赛奖项')]
    sx = 400
    for v, u, lab in stats:
        pg.T([sx, ry + 8, 70, 38], v, 32, font=NUM, grad=GOLD_STOPS, align='RIGHT')
        pg.T([sx + 74, ry + 12, 30, 24], u, 15, font=DISP, color=WHITE)
        pg.T([sx + 100, ry + 16, 150, 22], lab, 14.5, font=BODYM, color=DIM)
        sx += 250
    pg.T([sx + 6, ry + 16, 200, 22], '六领域能力互补 · 院士团队支撑', 13.5, font=BODY, color=DIM2)

    return pg, H2
