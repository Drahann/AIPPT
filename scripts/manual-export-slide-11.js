const PptxGenJS = require('pptxgenjs');
const path = require('path');

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE'; // 16:9

async function exportSlide11() {
    console.log("[Manual Export] Generating Slide 12 (ID 11: Metrics Rings)...");
    const slide = pptx.addSlide();

    // Background
    slide.addShape('rect', { x: '0%', y: '0%', w: '100%', h: '100%', fill: { color: 'FFFFFF' } });

    // Overline
    slide.addText("The PainPoint", {
        x: '4.45%', y: '8.15%', w: '40.00%', h: '5.51%',
        fontSize: 19.84, color: '2683EB', bold: true,
        fontFace: 'Radio Canada Big', align: 'left', valign: 'top'
    });

    // Title
    slide.addText("核心性能指标与研究方向", {
        x: '4.45%', y: '14.49%', w: '40.00%', h: '6.28%',
        fontSize: 33.28, color: '000000', bold: true,
        fontFace: 'Radio Canada Big', align: 'left', valign: 'top'
    });

    // Metrics Data
    const metrics = [
        {
            ring_x: '10.28%', ring_y: '24.03%', ring_w: '17.17%', ring_h: '30.52%', ring_color: '2683EB',
            val_text: "0.1mm级", val_x: '11.45%', val_y: '31.14%', val_w: '14.82%', val_h: '16.30%',
            label_text: "空间分辨率", label_x: '5.71%', label_y: '56.62%', label_w: '26.30%', label_h: '3.56%'
        },
        {
            ring_x: '41.42%', ring_y: '24.03%', ring_w: '17.17%', ring_h: '30.52%', ring_color: '2683EB',
            val_text: ">98.2%", val_x: '42.19%', val_y: '35.22%', val_w: '15.62%', val_h: '8.15%',
            label_text: "手势识别准确率", label_x: '36.85%', label_y: '56.62%', label_w: '26.30%', label_h: '3.56%'
        },
        {
            ring_x: '72.56%', ring_y: '24.03%', ring_w: '17.17%', ring_h: '30.52%', ring_color: '2683EB',
            val_text: "60%", val_x: '76.50%', val_y: '35.22%', val_w: '9.27%', val_h: '8.15%',
            label_text: "开发效率提升", label_x: '67.99%', label_y: '56.62%', label_w: '26.30%', label_h: '3.56%'
        }
    ];

    metrics.forEach(m => {
        // Ring
        slide.addShape('ellipse', {
            x: m.ring_x, y: m.ring_y, w: m.ring_w, h: m.ring_h,
            fill: { transparency: 100 }, 
            line: { color: m.ring_color, width: 12 } 
        });

        // Value
        slide.addText(m.val_text, {
            x: m.val_x, y: m.val_y, w: m.val_w, h: m.val_h,
            fontSize: 44, color: '000000', bold: true,
            fontFace: 'Radio Canada Big', align: 'center', valign: 'middle'
        });

        // Label
        slide.addText(m.label_text, {
            x: m.label_x, y: m.label_y, w: m.label_w, h: m.label_h,
            fontSize: 16, color: '222222',
            fontFace: 'Source Serif Pro', align: 'center', valign: 'top'
        });
    });

    const outPath = path.join(process.cwd(), 'manual-slide-11-final.pptx');
    await pptx.writeFile({ fileName: outPath });
    console.log(`[Success] Manual Slide 11 exported to: ${outPath}`);
}

exportSlide11();
