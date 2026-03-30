const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

const SNAPSHOT_PATH = path.join(__dirname, '../debug-data/dbg-1774061015441-9yr17x/layout-snap-1774062922188-22.json');
const data = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf-8'));
const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';

const slide = pptx.addSlide();

function parseColor(colorStr) {
    if (!colorStr) return { hex: '000000', alpha: 1 };
    
    // Handle rgb/rgba
    if (colorStr.includes('rgb')) {
        const parts = colorStr.match(/[\d.]+/g);
        if (!parts) return { hex: '000000', alpha: 1 };
        const hex = parts.slice(0, 3).map(x => Math.round(parseFloat(x)).toString(16).padStart(2, '0')).join('').toUpperCase();
        const alpha = parts[3] ? parseFloat(parts[3]) : 1;
        return { hex, alpha };
    }
    
    // Handle color(srgb R G B / A)
    if (colorStr.includes('srgb')) {
        const parts = colorStr.match(/(\d+\.?\d*)/g);
        if (!parts || parts.length < 3) return { hex: '000000', alpha: 1 };
        const hex = parts.slice(0, 3).map(x => Math.round(parseFloat(x) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
        const alpha = parts[3] ? parseFloat(parts[3]) : 1;
        return { hex, alpha };
    }
    
    return { hex: '000000', alpha: 1 };
}

const sortedElements = [...data.elements].sort((a, b) => {
    const az = parseInt(a.zIndex) || 0;
    const bz = parseInt(b.zIndex) || 0;
    if (az !== bz) return az - bz;
    if (a.tag === 'DIV' && b.tag !== 'DIV') return -1;
    if (a.tag !== 'DIV' && b.tag === 'DIV') return 1;
    return 0;
});

const debugResults = [];

sortedElements.forEach((el, idx) => {
    const x = parseFloat(el.x);
    const y = parseFloat(el.y);
    const w = parseFloat(el.width);
    const h = parseFloat(el.height);
    
    const bgInfo = parseColor(el.backgroundColor);
    const colorInfo = parseColor(el.color);
    const elementOpacity = el.opacity ? parseFloat(el.opacity) : 1;
    const finalBgAlpha = bgInfo.alpha * elementOpacity;
    
    if (w > 50 && h > 50) {
        // Capture parts inside the loop too
        const bgParts = el.backgroundColor ? el.backgroundColor.match(/(\d+\.?\d*)/g) : [];
        debugResults.push({
            idx,
            tag: el.tag,
            className: el.className,
            originalBg: el.backgroundColor,
            bgParts: bgParts,
            hex: bgInfo.hex,
            alpha: bgInfo.alpha,
            finalAlpha: finalBgAlpha,
            transparency: Math.round((1 - finalBgAlpha) * 100)
        });
    }

    const hasBg = el.backgroundColor && !el.backgroundColor.includes('rgba(0, 0, 0, 0)') && !el.backgroundColor.includes('transparent');
    
    if (hasBg) {
        slide.addShape('rect', {
            x: x + '%', y: y + '%', w: w + '%', h: h + '%',
            fill: { color: bgInfo.hex, transparency: Math.round((1 - finalBgAlpha) * 100) }
        });
    }

    if (el.text && el.text.trim()) {
        slide.addText(el.text, {
            x: x + '%', y: y + '%', w: w + '%', h: h + '%',
            fontSize: parseFloat(el.fontSize),
            color: colorInfo.hex,
            align: el.textAlign || 'left'
        });
    }
});

fs.writeFileSync('debug-results.json', JSON.stringify(debugResults, null, 2));

pptx.writeFile({ fileName: 'debug-slide-22.pptx' }).then(() => {
    console.log("Done. Results in debug-results.json");
});
