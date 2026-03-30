const PptxGenJS = require('pptxgenjs');
const path = require('path');

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE'; // 16:9

async function exportSlide13() {
    console.log("[Manual Export] Generating Slide 14 (ID 13: Milestone List)...");
    const slide = pptx.addSlide();

    // Background
    slide.addShape('rect', { x: '0%', y: '0%', w: '100%', h: '100%', fill: { color: 'FFFFFF' } });

    // Accent Panel
    slide.addShape('rect', { x: '0%', y: '0%', w: '31.00%', h: '100.00%', fill: { color: 'F5EBCB' } });

    const items = [
        {
            year: "第1–2月", year_x: '32.93%', year_y: '5.09%', year_w: '20.10%', year_h: '7.47%',
            desc: "完成柔性传感器阵列的微结构设计、液态金属-聚氨酯复合材料制备与信号标定，构建高灵敏度、低迟滞的仿生传感基础。", desc_x: '54.46%', desc_y: '5.74%', desc_w: '43.30%', desc_h: '11.90%'
        },
        {
            year: "第3月", year_x: '32.93%', year_y: '28.23%', year_w: '20.10%', year_h: '7.47%',
            desc: "开发轻量化分层手势识别模型，结合时序滑动窗口分割与噪声抑制，实现毫秒级实时推理与多模态融合协议栈开发。", desc_x: '54.46%', desc_y: '28.88%', desc_w: '43.30%', desc_h: '11.90%'
        },
        {
            year: "第4月", year_x: '32.93%', year_y: '51.36%', year_w: '20.10%', year_h: '7.47%',
            desc: "完成软硬件联调，集成压力/温度动态反馈执行单元，构建感知-意图-反馈闭环，嵌入多模态交互协议栈。", desc_x: '54.46%', desc_y: '52.01%', desc_w: '43.30%', desc_h: '7.94%'
        },
        {
            year: "第5–6月", year_x: '32.93%', year_y: '74.49%', year_w: '20.10%', year_h: '7.47%',
            desc: "依托合作企业平台开展工业级远程操控、虚拟实训等多场景压力测试，进行用户体验迭代，形成可复用的交互标准接口。", desc_x: '54.46%', desc_y: '75.14%', desc_w: '43.30%', desc_h: '11.90%'
        }
    ];

    items.forEach(item => {
        // Year text
        slide.addText(item.year, {
            x: item.year_x, y: item.year_y, w: item.year_w, h: item.year_h,
            fontSize: 44.8, color: '0A0A0A', bold: false,
            fontFace: 'Radio Canada Big', align: 'left', valign: 'top'
        });

        // Description text
        slide.addText(item.desc, {
            x: item.desc_x, y: item.desc_y, w: item.desc_w, h: item.desc_h,
            fontSize: 17.28, color: '1F1F1F', bold: false,
            fontFace: 'Radio Canada Big', align: 'left', valign: 'top', margin: 0
        });
    });

    const outPath = path.join(process.cwd(), 'manual-slide-13-final.pptx');
    await pptx.writeFile({ fileName: outPath });
    console.log(`[Success] Manual Slide 13 exported to: ${outPath}`);
}

exportSlide13();
