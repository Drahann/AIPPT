# -*- coding: utf-8 -*-
"""融资计划 → financing archetype. ref: liangyao_p04 / med_blue_white_5d47632c_p17.
left 资金用途 donut + purpose list | mid 股权结构 stacked bar + 融资额度 200万 bignum | right 4 里程碑."""
from gen5_lib import *

H2 = '融资计划'
DECOS = 'W:/ppt/study/runs/gen5/_decos'


def build():
    pg = Page()
    pg.scrim(fill='rgba(6,14,40,0.50)')
    # faint header glow + a small nano accent top-right
    pg.img([300, 18, 760, 120], f'{DECOS}/glow.png', blend='screen', opacity=0.5)
    pg.img([1120, 16, 150, 150], f'{DECOS}/nano.png', blend='screen', opacity=0.85)

    page_title(pg, '融资计划', x=64, y=44, big=50,
               sub_text='天使轮 · 200万元（部分资金已到账）· 资金分阶段拨付、专款专用')
    # angel-round tag
    tag_pill(pg, 980, 60, 150, 34, 'ANGEL ROUND 天使轮', 13)

    # ---------- LEFT: 资金用途 donut + purpose list ----------
    pg.panel([56, 132, 420, 532])
    corner_brackets(pg, [56, 132, 420, 532])
    pg.T([84, 150, 380, 30], '资金用途规划', 23, font=DISP, color=WHITE)
    node_divider(pg, 84, 188, 360)
    pg.pie(266, 296, 104, [
        {'label': '中试纯化', 'value': 40},
        {'label': '质量检测', 'value': 25},
        {'label': '研发人力', 'value': 20},
        {'label': '市场验证', 'value': 15},
    ], inner=0.56, colors=[GOLD, BLUE_BR, CYAN, TEAL], center='200万', center_px=30, label_px=14)
    uses = [
        ('①', '中试与纯化', '40%', GOLD, '医用级蛋白纯化工艺开发 · GMP标准中试生产线建设'),
        ('②', '质量与检测', '25%', BLUE_BR, '第三方权威检测 · 医疗器械注册送审 · 质量体系建设'),
        ('③', '研发与人力', '20%', CYAN, '核心研发人才引进 · 团队薪酬保障 · 工艺迭代优化'),
        ('④', '市场与验证', '15%', TEAL, '已验证客户首批商业化交付 · 区域市场拓展'),
    ]
    yy = 428
    for idx, name, pct, col, desc in uses:
        pg.extras.append({'type': 'rect', 'box': [84, yy + 6, 12, 12], 'rx': 3, 'fill': col})
        pg.T([104, yy, 200, 22], f'{idx} {name}', 16, font=DISP, color=WHITE)
        pg.T([0, yy - 1, 452, 22], pct, 18, font=NUM, grad=GOLD_STOPS, align='RIGHT')
        pg.T([104, yy + 24, 350, 30], desc, 14, font=BODY, color=DIM2)
        yy += 56

    # ---------- MID-TOP: 公司股权结构 stacked 100% bar + legend ----------
    pg.panel([496, 132, 360, 300])
    pg.T([522, 150, 320, 28], '公司股权结构（融资前）', 20, font=DISP, color=WHITE)
    node_divider(pg, 522, 186, 308)
    equity = [
        ('王炯桦', 75.0, GOLD, '创始人/法人 · 绝对控股'),
        ('任一帆', 6.25, BLUE_BR, '市场总监'),
        ('邓煜婕', 6.25, CYAN, '财务总监'),
        ('张瑜瑜', 5.0, TEAL, '核心成员'),
        ('其他成员', 7.5, '#6E8AC0', '张凯文 · 龚则达 · 王艺蒙'),
    ]
    bx, bw, by, bh = 522, 308, 204, 34
    cur = bx
    for nm, pc, col, _ in equity:
        seg = bw * pc / 100.0
        pg.extras.append({'type': 'rect', 'box': [cur, by, seg, bh], 'rx': 0, 'fill': col, 'opacity': 0.95})
        if pc >= 12:
            pg.T([cur, by + 6, seg, 22], f'{pc:.0f}%', 18, font=NUM, color=NEAR_BLACK, align='CENTER')
        cur += seg
    pg.extras.append({'type': 'rect', 'box': [bx, by, bw, bh], 'rx': 0, 'fill': 'none',
                      'stroke': GOLD_STK, 'sw': 1.2})
    ly = 256
    for i, (nm, pc, col, role) in enumerate(equity):
        col_x = 522 if i < 3 else 692
        row = i if i < 3 else i - 3
        oy = ly + row * 34
        pg.extras.append({'type': 'rect', 'box': [col_x, oy + 4, 12, 12], 'rx': 3, 'fill': col})
        pg.T([col_x + 18, oy, 60, 20], nm, 15, font=DISP, color=WHITE)
        pg.T([col_x + 18, oy + 17, 156, 16], role, 12.5, font=BODY, color=DIM2)
        pg.T([col_x + 92, oy - 1, 70, 20], f'{pc:g}%', 15, font=NUM, grad=GOLD_STOPS, align='LEFT')

    # ---------- MID-BOTTOM: 融资额度 200万 bignum ----------
    pg.panel([496, 448, 360, 216])
    corner_brackets(pg, [496, 448, 360, 216], color=CYAN, size=20)
    pg.T([522, 466, 320, 24], '天使轮融资额度', 17, font=BODYM, color=DIM)
    num_badge(pg, 600, 560, 60)
    pg.T([520, 516, 170, 78], '200', 74, font=NUM, grad=GOLD_STOPS, align='CENTER')
    pg.T([690, 540, 80, 40], '万元', 28, font=DISP, color=WHITE, align='LEFT')
    tag_pill(pg, 690, 584, 150, 30, '部分资金已到账', 13, fill='rgba(13,197,159,0.22)',
             stroke='rgba(13,197,159,0.8)', txt_color='#7FE9CF')
    pg.T([522, 626, 320, 22], '拟出让股权约 10% · 投后规范化信息披露', 13, font=BODY, color=DIM2)

    # ---------- RIGHT: 融资目标 / milestones ----------
    pg.panel([876, 132, 348, 532])
    pg.T([902, 150, 320, 28], '融资目标 · 关键里程碑', 20, font=DISP, color=WHITE)
    node_divider(pg, 902, 188, 296)
    miles = [
        ('01', 'GMP 医械级中试线', '建成符合医疗器械生产质量管理规范（GMP）的医械级原料中试生产线，具备稳定量产能力。'),
        ('02', '全项检测 · 注册申报', '完成产品在权威机构的全项检测认证，同步启动医疗器械注册申报流程。'),
        ('03', '首批商业化交付', '基于海生医疗（冠脉造影导管）、先健科技（外周血管造影导管）验证成果，实现首批产品商业化交付。'),
        ('04', '国产替代 · 填补空白', '加速国产高端医疗器械涂层原料替代进程，填补国内技术与供应链空白，奠定全国拓展基础。'),
    ]
    my = 206
    for no, t, d in miles:
        icon_disc(pg, 924, my + 24, 22, color=GOLD)
        pg.T([902, my + 12, 44, 26], no, 22, font=NUM, grad=GOLD_STOPS, align='CENTER')
        pg.T([958, my + 4, 252, 24], t, 18, font=DISP, color=WHITE)
        pg.T([958, my + 32, 256, 82], d, 14, font=BODY, color=DIM)
        if no != '04':
            pg.extras.append({'type': 'line', 'p': [924, my + 50, 924, my + 108],
                              'color': 'rgba(242,210,144,0.4)', 'w': 1.4})
        my += 116

    return pg, H2
