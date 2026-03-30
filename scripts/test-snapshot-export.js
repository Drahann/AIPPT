const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const SNAPSHOT_PATH = path.join(process.cwd(), 'debug-data', 'session-1774058427144', 'layout-snap-1774058427321-20.json');
const OUTPUT_FILENAME = 'snapshot-font-test-SESSION.pptx';
const FONT_SCALE = 1.0;
const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8'));

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';

const SLIDE_W = 13.33;
const SLIDE_H = 7.5;

function parseColor(colorStr) {
    if (!colorStr) return '000000';
    if (colorStr.includes('rgb')) {
        const parts = colorStr.match(/\d+/g);
        return parts ? parts.slice(0, 3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('').toUpperCase() : '000000';
    }
    if (colorStr.includes('srgb')) {
        const parts = colorStr.match(/0?\.\d+|1\.0|0/g);
        return parts ? parts.slice(0, 3).map(x => Math.round(parseFloat(x) * 255).toString(16).padStart(2, '0')).join('').toUpperCase() : '000000';
    }
    return '000000';
}

[1.0].forEach(FONT_FACTOR => {
    const slide = pptx.addSlide();
    
    // Sort elements: background (DIV) first, then others, follow zIndex if available
    const sortedElements = [...snapshot.elements].sort((a, b) => {
        const az = parseInt(a.zIndex) || 0;
        const bz = parseInt(b.zIndex) || 0;
        if (az !== bz) return az - bz;
        if (a.tag === 'DIV' && b.tag !== 'DIV') return -1;
        if (a.tag !== 'DIV' && b.tag === 'DIV') return 1;
        return 0;
    });

    sortedElements.forEach((el) => {
        if (el.className === 'slide-number') return;
        
        const x = parseFloat(el.x) / 100 * SLIDE_W;
        const y = parseFloat(el.y) / 100 * SLIDE_H;
        const w = parseFloat(el.width) / 100 * SLIDE_W;
        const h = parseFloat(el.height) / 100 * SLIDE_H;

        const hexBg = parseColor(el.backgroundColor);
        const hasBg = el.backgroundColor && !el.backgroundColor.includes('rgba(0, 0, 0, 0)') && !el.backgroundColor.includes('transparent');
        const opacity = el.opacity ? Math.round(parseFloat(el.opacity) * 100) : 100;

        // Handle Background Images or IMG tags
        let imageUrl = el.src;
        if (!imageUrl && el.backgroundImage && el.backgroundImage !== 'none') {
            const match = el.backgroundImage.match(/url\(["']?([^"']+)["']?\)/);
            if (match) imageUrl = match[1];
        }

        if (imageUrl) {
            // If it's a relative URL, we might need to handle it. 
            // Assuming data URIs or absolute URLs for now.
            try {
                slide.addImage({
                    path: imageUrl.startsWith('http') ? imageUrl : undefined,
                    data: imageUrl.startsWith('data:') ? imageUrl : undefined,
                    x, y, w, h,
                    sizing: { type: el.objectFit === 'contain' ? 'contain' : 'cover', w, h }
                });
            } catch (e) {
                console.warn('Failed to add image:', imageUrl.substring(0, 50));
            }
        } else if (hasBg) {
            // Render background shape if no image
            const borderW = parseFloat(el.borderWidth) || 0;
            slide.addShape('rect', {
                x, y, w, h,
                fill: { color: hexBg, transparency: 100 - opacity },
                line: borderW > 0 ? { color: parseColor(el.borderColor), width: borderW * 0.75 } : undefined,
                rectRadius: el.borderRadius ? parseFloat(el.borderRadius) / 50 : 0
            });
        }

        if (el.text && el.text.trim()) {
            const hexColor = parseColor(el.color);
            const fontSize = parseFloat(el.fontSize) * FONT_FACTOR;
            const text = el.text.replace(/\n/g, ' ');

            // Increase buffer for short text which is more prone to wrapping issues
            const widthBuffer = text.length < 10 ? 1.15 : 1.05;

            slide.addText(text, {
                x, y: y, w: w * widthBuffer,
                h: h * 1.1,
                fontSize: fontSize,
                color: hexColor,
                transparency: 100 - opacity,
                bold: parseInt(el.fontWeight) >= 600,
                fontFace: el.fontFamily.includes('Serif') ? 'Source Serif Pro' : 'Microsoft YaHei',
                align: 'left',
                valign: 'top',
                fit: 'shrink'
            });
        }
    });
});

console.log('Total Elements processed:', snapshot.elements.length);
console.log('DIV Elements (Potential BG blocks):', snapshot.elements.filter(e => e.tag === 'DIV').length);

const outFileName = 'snapshot-font-test-FINAL.pptx';
const outPath = path.join(rootDir, outFileName);
pptx.writeFile({ fileName: outPath }).then(name => {
    console.log(`Successfully created calibration file: ${name}`);
});
