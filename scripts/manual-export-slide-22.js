const PptxGenJS = require('pptxgenjs');
const path = require('path');

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';

async function manualExport22() {
    console.log("[Manual Export] Generating Slide 22 (Corporate Insights)...");
    const slide = pptx.addSlide();

    // 1. White Background
    slide.addShape('rect', {
        x: 0, y: 0, w: '100%', h: '100%',
        fill: { color: 'FFFFFF' }
    });

    // 2. Headline Panel (Left)
    slide.addShape('rect', {
        x: '1.47%', y: '5.87%', w: '29.61%', h: '91.64%',
        fill: { color: 'FFFFFF', transparency: 8 },
        line: { color: '000000', transparency: 62, width: 1 },
        rectRadius: 0.1
    });

    // 3. Matrix Panel (Right)
    slide.addShape('rect', {
        x: '31.27%', y: '5.87%', w: '67.26%', h: '91.64%',
        fill: { color: 'FFFFFF', transparency: 8 },
        line: { color: '000000', transparency: 62, width: 1 },
        rectRadius: 0.1
    });

    // 4. Headline Title
    slide.addText("团队结构与精神", {
        x: '3.04%', y: '44.49%', w: '26.46%', h: '14.40%',
        fontSize: 39.68,
        color: '000000',
        fontFace: 'Microsoft YaHei',
        align: 'left',
        bold: true
    });

    // 5. Matrix Items (Loops through the 6 points)
    const points = [
        { dot: {x: 33.01, y: 9.61}, head: "扁平化架构与核心引领", body: "团队构建\"核心引领、模块协同\"的扁平化架构，由范柳丰博士统筹战略与技术攻坚，下设技术研发、产品运营与质量供应链三大职能模块。", y: 9.08 },
        { dot: {x: 65.90, y: 9.61}, head: "技术研发模块", body: "专注手势识别算法优化、柔性传感器集成与多模态系统架构设计，由软件、硬件及系统架构负责人组成，实现核心技术自主攻关。", y: 9.08 },
        { dot: {x: 33.01, y: 38.95}, head: "产品运营模块", body: "深度联动用户需求与开发者生态，负责实训场景验证策划及社群运营，推动产品与市场精准对接。", y: 38.41 },
        { dot: {x: 65.90, y: 38.95}, head: "质量供应链模块", body: "严守军工/医疗级可靠性标准，高效对接纳米材料等关键供应链，确保产品从研发到落地的质量闭环。", y: 38.41 },
        { dot: {x: 33.01, y: 68.28}, head: "哈工大人才梯队", body: "7人核心团队均源自哈工大计算学部，形成\"1博士+5硕士+1本科\"梯队，专业覆盖计算机科学、软件工程、材料工程，实现全链条能力闭环。", y: 67.75 },
        { dot: {x: 65.90, y: 68.28}, head: "敏捷协同与校训精神", body: "日常采用Scrum敏捷模式，通过站会与迭代评审强化跨模块协同。团队扎根哈工大\"规格严格，功夫到家\"校训，聚焦科技报国使命。", y: 67.75 }
    ];

    points.forEach(p => {
        // Blue Dot (using 'ellipse' string)
        slide.addShape('ellipse', {
            x: p.dot.x + '%', y: p.dot.y + '%', w: '1.53%', h: '2.73%',
            fill: { color: '2683EB' }
        });

        // Heading
        slide.addText(p.head, {
            x: (p.dot.x + 2.7) + '%', y: p.y + '%', w: '19.00%', h: '3.02%',
            fontSize: 15.68,
            color: '000000',
            bold: true,
            fontFace: 'Microsoft YaHei'
        });

        // Body
        slide.addText(p.body, {
            x: (p.dot.x + 2.7) + '%', y: (p.y + 3.6) + '%', w: '19.00%', h: '11.42%',
            fontSize: 10.56,
            color: '6C6C6C',
            fontFace: 'Microsoft YaHei',
            valign: 'top'
        });
    });

    const outPath = path.join(process.cwd(), 'manual-slide-22-final.pptx');
    await pptx.writeFile({ fileName: outPath });
    console.log(`[Success] Manual Slide 22 exported to: ${outPath}`);
}

manualExport22();
