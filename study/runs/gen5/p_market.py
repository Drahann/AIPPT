# -*- coding: utf-8 -*-
"""市场分析 → market archetype. ref: liangyao_p02 (left_chart + right_3_tiers).
left 市场规模 growth bars (real figures) + stat chips | right 3-tier structural analysis."""
from gen5_lib import *

H2 = '市场分析'
DECOS = 'W:/ppt/study/runs/gen5/_decos'


def tier(pg, x, y, w, h, idx, title, desc, points=None):
    pg.panel([x, y, w, h])
    corner_brackets(pg, [x, y, w, h], size=16)
    icon_disc(pg, x + 36, y + 34, 21, color=GOLD)
    pg.T([x + 16, y + 22, 42, 26], idx, 20, font=NUM, grad=GOLD_STOPS, align='CENTER')
    pg.T([x + 72, y + 22, w - 90, 28], title, 20, font=DISP, grad=GOLD_STOPS)
    pg.T([x + 20, y + 58, w - 40, h - 70], desc, 14.5, font=BODY, color=DIM)
    if points:
        cx = x + 20
        for p in points:
            cw = len(p) * 14 + 18
            tag_pill(pg, cx, y + h - 36, cw, 26, p, 13.5, fill='rgba(20,70,150,0.6)',
                     stroke='rgba(120,180,255,0.6)', txt_color='#CFE0F2')
            cx += cw + 8


def build():
    pg = Page()
    pg.scrim(fill='rgba(6,14,40,0.50)')
    pg.img([320, 6, 680, 140], f'{DECOS}/glow.png', blend='screen', opacity=0.42)
    pg.img([1112, 14, 152, 152], f'{DECOS}/nano.png', blend='screen', opacity=0.8)

    page_title(pg, '市场分析', x=64, y=44, big=50,
               sub_text='血管介入导管涂层 · 高增长细分赛道 · 国产高性能替代窗口期')

    # ---------- LEFT: market growth ----------
    pg.panel([56, 150, 560, 508])
    corner_brackets(pg, [56, 150, 560, 508])
    pg.T([84, 168, 400, 30], '市场规模 · 高增长赛道', 23, font=DISP, color=WHITE)
    node_divider(pg, 84, 206, 504)

    pg.T([84, 220, 250, 22], '全球医用涂层市场', 15, font=BODYM, color=CYAN)
    tag_pill(pg, 84, 246, 120, 26, 'CAGR 10.2%', 13.5, fill='rgba(242,210,144,0.18)',
             stroke=GOLD_STK, txt_color=GOLD)
    bar_chart(pg, [92, 300, 200, 150], [
        {'label': '2025', 'value': 58, 'value_text': '58', 'color': BLUE_BR},
        {'label': '2035E', 'value': 139, 'value_text': '139', 'color': GOLD},
    ], max_value=165, trend=True)
    pg.T([92, 470, 200, 20], '单位：亿美元', 13, font=BODY, color=DIM2, align='CENTER')

    pg.T([342, 220, 250, 22], '中国抗凝涂层细分', 15, font=BODYM, color=CYAN)
    tag_pill(pg, 342, 246, 116, 26, 'CAGR 5.9%', 13.5, fill='rgba(242,210,144,0.18)',
             stroke=GOLD_STK, txt_color=GOLD)
    bar_chart(pg, [350, 300, 200, 150], [
        {'label': '2023', 'value': 91.5, 'value_text': '91.5', 'color': BLUE_BR},
        {'label': '2030E', 'value': 137.2, 'value_text': '137.2', 'color': GOLD},
    ], max_value=165, trend=True)
    pg.T([350, 470, 200, 20], '单位：亿元', 13, font=BODY, color=DIM2, align='CENTER')

    # stat chips
    chips = [('＜20%', '高端涂层国产化率'), ('＞80%', '进口肝素市场份额'), ('+17%', '创新器械审批增速')]
    cxs = 84
    for v, lab in chips:
        pg.panel([cxs, 506, 162, 92], fill='rgba(20,55,120,0.5)', stroke=GOLD_STK, sw=1.1, rx=10)
        pg.T([cxs, 520, 162, 40], v, 34, font=NUM, grad=GOLD_STOPS, align='CENTER')
        pg.T([cxs, 566, 162, 22], lab, 13.5, font=BODYM, color=DIM, align='CENTER')
        cxs += 172
    pg.T([84, 612, 504, 20], '数据来源：全球医用涂层及中国抗凝涂层细分市场规模测算（项目行业分析）',
         12.5, font=BODY, color=DIM2)

    # ---------- RIGHT: 3-tier structural analysis ----------
    tier(pg, 640, 150, 584, 156, '①', '结构性机会与痛点',
         '高端造影导管长期依赖进口动物源肝素，国产化率偏低；现有方案普遍存在血源安全风险、'
         '成本高企、功能单一、批次稳定性不足。集采深化与供应链安全战略下，复合型国产涂层需求迫切。',
         points=['国产化率低', '血源风险', '成本高企', '功能单一'])

    tier(pg, 640, 316, 584, 156, '②', '谷原焕生精准契合',
         '植物源大米蛋白基材从根本规避动物源风险，低致敏、无病毒隐患；工艺创新实现抗凝、润滑、'
         '成膜稳定多重功能一体化集成，弥补现有涂层功能割裂；同步显著优化成本结构。',
         points=['植物源安全', '多功能集成', '成本优化'])

    tier(pg, 640, 482, 584, 176, '③', '战略机会与结论',
         '立足血管介入导管涂层高增长细分领域，以植物源非药物抗凝技术直击行业瓶颈，填补国产高性能涂层原料空白。'
         '在国产替代加速与创新器械审批提速的政策环境下，随中试验证推进与注册路径明晰，'
         '有望快速切入高端耗材供应链，在国产替代浪潮中把握市场先机。',
         points=['填补国产空白', '政策驱动', '把握替代先机'])

    return pg, H2
