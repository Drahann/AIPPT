const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

// --- CALIBRATED CONSTANTS ---
const SLIDE_W = 13.33;
const SLIDE_H = 7.5;

function hexToPptx(hex) {
    if (!hex) return '000000';
    return hex.replace('#', '').toUpperCase();
}

// --- CORE RENDERERS ---

function renderCover(s, slide, c) {
    s.background = { fill: hexToPptx(c.primary) };
    s.addText(slide.title, {
        x: 0.8, y: 3.0, w: 11.7, h: 2.0,
        fontSize: 48, fontFace: 'Microsoft YaHei', color: 'FFFFFF', bold: true, align: 'center', fit: 'shrink'
    });
    if (slide.subtitle) {
        s.addText(slide.subtitle, {
            x: 0.8, y: 5.2, w: 11.7, h: 0.5,
            fontSize: 20, fontFace: 'Microsoft YaHei', color: 'CBD5E1', align: 'center'
        });
    }
}

function renderSectionHeader(s, slide, c) {
    s.background = { fill: hexToPptx(c.background) };
    s.addShape('rect', { x: 0, y: 0, w: 0.1, h: 7.5, fill: { color: hexToPptx(c.primary) } });
    s.addText(slide.subtitle || 'SECTION', {
        x: 0.8, y: 2.8, w: 11.5, h: 0.4,
        fontSize: 14, fontFace: 'Microsoft YaHei', color: hexToPptx(c.primary), bold: true
    });
    s.addText(slide.title, {
        x: 0.8, y: 3.3, w: 11.5, h: 1.2,
        fontSize: 44, fontFace: 'Microsoft YaHei', color: hexToPptx(c.text), bold: true, fit: 'shrink'
    });
}

function renderTextBullets(s, slide, c) {
    s.addText(slide.title, { x: 0.8, y: 0.6, w: 11.7, h: 0.8, fontSize: 32, bold: true, align: 'center' });
    const text = slide.contentHint || slide.speakerNotes || '';
    const items = text.split(/[；。]/).filter(x => x.trim().length > 2).slice(0, 6);
    items.forEach((item, i) => {
        s.addText('• ' + item.trim(), {
            x: 1.5, y: 2.0 + i * 0.8, w: 10.3, h: 0.6,
            fontSize: 18, color: hexToPptx(c.textSecondary), lineSpacing: 1.2
        });
    });
}

function renderCards(s, slide, c, layout) {
    s.addText(slide.title, { x: 0.8, y: 0.6, w: 11.7, h: 0.8, fontSize: 30, bold: true, align: 'center' });
    const rawItems = (slide.contentHint || '').split(/[、，；]/).filter(x => x.trim().length > 1);
    const items = rawItems.length > 0 ? rawItems : ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
    
    // TEMPLATE FIX: use 4 columns for cards-4
    const cols = layout === 'cards-4' ? 4 : (layout === 'cards-2' ? 2 : 3);
    const gap = 0.3;
    const cardW = (SLIDE_W - 1.6 - (cols - 1) * gap) / cols;
    
    items.slice(0, cols).forEach((item, i) => {
        const x = 0.8 + i * (cardW + gap);
        s.addShape('roundRect', {
            x, y: 2.2, w: cardW, h: 3.8, rectRadius: 0.1,
            fill: { color: hexToPptx(c.background) }, line: { color: hexToPptx(c.primary), width: 1 }
        });
        s.addText(item, { x: x + 0.2, y: 2.4, w: cardW - 0.4, h: 3.4, fontSize: 16, align: 'center', valign: 'middle' });
    });
}

function renderChart(s, slide, c, type) {
    s.addText(slide.title, { x: 0.8, y: 0.6, w: 11.7, h: 0.8, fontSize: 32, bold: true, align: 'center' });
    const data = [{ name: 'Values', labels: ['Cat 1', 'Cat 2', 'Cat 3', 'Cat 4'], values: [30, 50, 80, 45] }];
    s.addChart(type, data, { x: 1.5, y: 1.8, w: 10.3, h: 4.8, chartColors: [hexToPptx(c.primary)] });
}

function renderTimeline(s, slide, c) {
    s.addText(slide.title, { x: 0.8, y: 0.6, w: 11.7, h: 0.8, fontSize: 32, bold: true });
    s.addShape('line', { x: 0.8, y: 4.0, w: 11.7, h: 0, line: { color: hexToPptx(c.primary), width: 2 } });
    const dots = [0, 1, 2, 3];
    dots.forEach(i => {
        const x = 0.8 + i * 3;
        s.addShape('ellipse', { x: x - 0.1, y: 3.9, w: 0.2, h: 0.2, fill: { color: hexToPptx(c.primary) } });
        s.addText('Event ' + (i+1), { x: x - 0.5, y: 4.3, w: 1.0, h: 0.4, fontSize: 12, align: 'center' });
    });
}

// --- MAIN ---
async function main() {
    const slides = JSON.parse(fs.readFileSync(path.join(__dirname, 'clean-slides.json'), 'utf8'));
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';
    
    const colors = { primary: '#1E293B', background: '#F8FAFC', text: '#0F172A', textSecondary: '#64748B' };

    console.log(`Generating final delivery PPTX with ${slides.length} slides...`);

    slides.forEach((slide, i) => {
        const s = pptx.addSlide();
        const layout = slide.layout;
        console.log(`[${i+1}] Rendering ${layout}`);

        switch (layout) {
            case 'cover': renderCover(s, slide, colors); break;
            case 'section-header': renderSectionHeader(s, slide, colors); break;
            case 'text-bullets': renderTextBullets(s, slide, colors); break;
            case 'cards-4':
            case 'cards-3':
            case 'cards-2': renderCards(s, slide, colors, layout); break;
            case 'chart-bar':
            case 'chart-bar-compare': renderChart(s, slide, colors, 'bar'); break;
            case 'chart-line': renderChart(s, slide, colors, 'line'); break;
            case 'chart-pie': renderChart(s, slide, colors, 'pie'); break;
            case 'timeline': renderTimeline(s, slide, colors); break;
            case 'image-text': renderTextBullets(s, slide, colors); break; // Fallback with text
            default: renderSectionHeader(s, slide, colors);
        }
    });

    const outPath = '交付_全模板高保真导出方案.pptx';
    await pptx.writeFile({ fileName: outPath });
    console.log(`\nCOMPLETED: ${outPath}`);
}

main();
