
const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

const SNAPSHOT_PATH = path.join(__dirname, 'layout-snap-1774062922225-14.json');
const data = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf-8'));
const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';

const slide = pptx.addSlide();

// High-fidelity rendering logic
const sortedElements = [...data.elements].sort((a, b) => {
    const az = parseInt(a.zIndex) || 0;
    const bz = parseInt(b.zIndex) || 0;
    if (az !== bz) return az - bz;
    if (a.tag === 'DIV' && b.tag !== 'DIV') return -1;
    if (a.tag !== 'DIV' && b.tag === 'DIV') return 1;
    return 0;
});

function parseColor(colorStr) {
    if (!colorStr || colorStr === 'transparent') return { hex: '000000', alpha: 0 };
    
    // CRITICAL: Must check 'srgb' BEFORE 'rgb' because 'srgb' includes the string 'rgb'!
    if (colorStr.includes('srgb')) {
        const parts = colorStr.match(/[d.]+/g);
        if (!parts || parts.length < 3) return { hex: '000000', alpha: 1 };
        const hex = parts.slice(0, 3).map(x => {
            const val = parseFloat(x);
            return Math.min(255, Math.max(0, Math.round(val * 255))).toString(16).padStart(2, '0');
        }).join('').toUpperCase();
        const alpha = parts[3] ? parseFloat(parts[3]) : 1;
        return { hex, alpha };
    }
    
    if (colorStr.includes('rgb')) {
        const parts = colorStr.match(/[d.]+/g);
        if (!parts) return { hex: '000000', alpha: 1 };
        const hex = parts.slice(0, 3).map(x => Math.min(255, Math.max(0, Math.round(parseFloat(x)))).toString(16).padStart(2, '0')).join('').toUpperCase();
        const alpha = parts[3] ? parseFloat(parts[3]) : 1;
        return { hex, alpha };
    }
    
    return { hex: '000000', alpha: 1 };
}

sortedElements.forEach(el => {
    if (el.className === 'slide-number') return;

    const x = parseFloat(el.x);
    const y = parseFloat(el.y);
    const w = parseFloat(el.width);
    const h = parseFloat(el.height);
    
    const bgInfo = parseColor(el.backgroundColor);
    const colorInfo = parseColor(el.color);
    const borderInfo = parseColor(el.borderColor);
    
    const elementOpacity = el.opacity ? parseFloat(el.opacity) : 1;
    const finalBgAlpha = bgInfo.alpha * elementOpacity;
    const finalTextColorAlpha = colorInfo.alpha * elementOpacity;
    const finalBorderAlpha = borderInfo.alpha * elementOpacity;

    // Handle Image
    let imageUrl = el.src;
    if (!imageUrl && el.backgroundImage && el.backgroundImage !== 'none') {
        const match = el.backgroundImage.match(/url\(["']?([^"']+)["']?\)/);
        if (match) imageUrl = match[1];
    }

    if (imageUrl) {
        try {
            slide.addImage({
                path: imageUrl.startsWith('http') ? imageUrl : undefined,
                data: imageUrl.startsWith('data:') ? imageUrl : undefined,
                x: x + '%', y: y + '%', w: w + '%', h: h + '%',
                sizing: { type: el.objectFit === 'contain' ? 'contain' : 'cover', w: w + '%', h: h + '%' },
                transparency: Math.round((1 - elementOpacity) * 100)
            });
        } catch (e) {
            console.warn('Failed to add image:', imageUrl.substring(0, 50));
        }
    } else if (el.tag === 'DIV' || el.tag === 'SVG' || el.tag === 'RECT' || el.tag === 'path' || el.tag === 'circle' || el.tag === 'rect') {
        const hasBg = el.backgroundColor && !el.backgroundColor.includes('rgba(0, 0, 0, 0)') && !el.backgroundColor.includes('transparent');
        const borderW = parseFloat(el.borderWidth) || 0;
        
        // Use 'ellipse' for circles (borderRadius based)
        const isCircle = el.borderRadius && (el.borderRadius.includes('50%') || parseFloat(el.borderRadius) > 20);
        const shapeType = isCircle ? 'ellipse' : 'rect';

        let radius = 0;
        if (el.borderRadius && !isCircle) {
            radius = parseFloat(el.borderRadius) / 40; 
        }

        if (hasBg || borderW > 0) {
            slide.addShape(shapeType, {
                x: x + '%', y: y + '%', w: w + '%', h: h + '%',
                fill: hasBg ? { color: bgInfo.hex, transparency: Math.round((1 - finalBgAlpha) * 100) } : null,
                line: borderW > 0 ? { color: borderInfo.hex, width: borderW * 0.75, transparency: Math.round((1 - finalBorderAlpha) * 100) } : undefined,
                rectRadius: radius > 1 ? 1 : radius
            });
        }
    }

    if (el.text && el.text.trim()) {
        // Using raw fontSize as requested
        let fontSize = parseFloat(el.fontSize); 
        
        const text = el.text.replace(/\n/g, ' ');
        
        slide.addText(text, {
            x: x + '%', y: y + '%', w: w + '%', h: h + '%',
            fontSize: fontSize,
            color: colorInfo.hex,
            transparency: Math.round((1 - finalTextColorAlpha) * 100),
            bold: parseInt(el.fontWeight) >= 600,
            fontFace: el.fontFamily.includes('Serif') ? 'Source Serif Pro' : 'Microsoft YaHei',
            align: el.textAlign || 'left',
            valign: 'top',
            margin: 0,
            isTextBox: true
        });
    }
});

const outPath = path.join(__dirname, `slide-${data.slideIndex}.pptx`);
pptx.writeFile({ fileName: outPath }).then(() => {
    console.log(`Successfully exported: ${outPath}`);
});
