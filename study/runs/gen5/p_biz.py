# -*- coding: utf-8 -*-
"""商业模式 → solution/flow archetype. ref: liangyao_p05 (上游→中游→下游 value chain).
top: 策源 hub band + 3-stage value chain (arrows) + value token | bottom: 3 pillars (价值传递/校企赋能/生态共赢)."""
from gen5_lib import *

H2 = '商业模式'
DECOS = 'W:/ppt/study/runs/gen5/_decos'


def stage(pg, x, y, w, h, tag, title, members, desc, col=BLUE_BR):
    pg.panel([x, y, w, h])
    corner_brackets(pg, [x, y, w, h], size=18)
    tag_pill(pg, x + 16, y + 14, 92, 26, tag, 13.5, fill='rgba(242,210,144,0.16)', stroke=GOLD_STK, txt_color=GOLD)
    pg.T([x + 118, y + 12, w - 130, 30], title, 21, font=DISP, grad=GOLD_STOPS)
    pg.T([x + 18, y + 52, w - 36, 24], members, 15, font=BODYM, color=WHITE)
    pg.T([x + 18, y + 82, w - 36, 46], desc, 14, font=BODY, color=DIM)


def pillar(pg, x, y, w, h, idx, title, desc, chips=None):
    pg.panel([x, y, w, h])
    corner_brackets(pg, [x, y, w, h], size=16)
    icon_disc(pg, x + 34, y + 34, 20, color=GOLD)
    pg.T([x + 14, y + 22, 40, 26], idx, 20, font=NUM, grad=GOLD_STOPS, align='CENTER')
    pg.T([x + 66, y + 22, w - 80, 28], title, 20, font=DISP, color=WHITE)
    pg.T([x + 18, y + 62, w - 36, 96], desc, 14, font=BODY, color=DIM)
    if chips:
        cx = x + 18
        for c in chips:
            cw = len(c) * 12 + 16
            tag_pill(pg, cx, y + h - 38, cw, 26, c, 12.5, fill='rgba(13,197,159,0.18)',
                     stroke='rgba(13,197,159,0.8)', txt_color='#7FE9CF')
            cx += cw + 8


def build():
    pg = Page()
    pg.scrim(fill='rgba(6,14,40,0.52)')
    pg.img([1110, 12, 156, 156], f'{DECOS}/nano.png', blend='screen', opacity=0.8)
    pg.img([300, 6, 700, 140], f'{DECOS}/glow.png', blend='screen', opacity=0.4)

    page_title(pg, '商业模式', x=64, y=44, big=50,
               sub_text='全链路整合驱动医用涂层国产化替代 · 上游原料—中游加工—下游应用闭环生态')

    # ---- 策源 hub band ----
    pg.panel([56, 132, 1168, 46], fill='rgba(20,55,120,0.6)', stroke=GOLD_STK, sw=1.2, rx=10)
    pg.T([74, 144, 700, 24], '核心枢纽：宁波谷泽新生生物科技有限公司 · 整合上下游资源并主导运营',
         15, font=BODYM, color=WHITE)
    tag_pill(pg, 854, 140, 354, 30, '宁波大学科研平台 / 院士团队 · 技术策源', 14,
             fill='rgba(242,210,144,0.16)', stroke=GOLD_STK, txt_color=GOLD)

    # ---- 3-stage value chain ----
    sy, sh, sw = 196, 150, 348
    stage(pg, 56, sy, sw, sh, '上游', '原料供给',
          '中粮集团 · 安徽顺鑫 · 金润米业 · 水龙米业',
          '联动优质粮企保障大米蛋白原料稳定供给，夯实国产化成本基础。')
    stage(pg, 466, sy, sw, sh, '中游', '合规加工',
          '江西盖比欧科技',
          '委托规范化加工，严控医疗器械级生产标准与批次一致性（RSD＜3%）。')
    stage(pg, 876, sy, sw, sh, '下游', '临床应用',
          '海生医疗 · 先健科技',
          '服务造影导管制造企业，直击进口肝素成本高、批次波动、润滑不足痛点。')
    # arrows between stages
    arrow(pg, 404, sy + sh / 2, 466, sy + sh / 2, color=GOLD, w=4, head=11)
    arrow(pg, 814, sy + sh / 2, 876, sy + sh / 2, color=GOLD, w=4, head=11)

    # ---- value token + flow note ----
    pg.panel([56, 360, 1168, 44], fill='rgba(10,28,68,0.55)', stroke='rgba(120,180,255,0.32)', rx=10)
    tag_pill(pg, 74, 368, 360, 28, '谷原焕生 · 单支涂层成本6元（较进口降低60%）', 14.5,
             fill='rgba(242,210,144,0.2)', stroke=GOLD_STK, txt_color=GOLD)
    pg.T([470, 372, 740, 24], '价值流高效触达客户 → 资金流反哺研发迭代与产能 → 客户数据实时优化体系，'
         '技术流·资金流·数据流双向循环。', 14, font=BODY, color=DIM)

    # ---- 3 pillars ----
    py, ph, pw = 420, 244, 372
    pillar(pg, 56, py, pw, ph, '①', '价值传递',
           '以项目公司为枢纽构建“上游原料—中游加工—下游应用”闭环生态，'
           '客户试用数据实时输入，形成“市场反馈—技术升级—价值强化”动态循环。')
    pillar(pg, 453, py, pw, ph, '②', '校企赋能',
           '深度依托宁波大学与院士团队，建立“技术共研—验证共担—人才共育”机制；'
           '借高校公信力快速建立市场信任，共享实验与检测资源显著降本。')
    pillar(pg, 850, py, pw, ph, '③', '生态共赢',
           '权责清晰、利益共享，形成抗风险强、迭代快的产业共同体，构筑可持续护城河：',
           chips=['成本·降本60%', '技术·超进口', '生态·校企协同'])

    return pg, H2
