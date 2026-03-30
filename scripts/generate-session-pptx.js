const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
const SESSION_NAME = 'dbg-1774061015441-9yr17x';
const SESSION_DIR = path.join(process.cwd(), 'debug-data', SESSION_NAME);
const OUTPUT_FILENAME = `full-session-export-${SESSION_NAME}.pptx`;
const FONT_SCALE = 1.0; 

const SLIDE_W = 10; // 10 inches is default width for PptxGenJS standard, but we use percentages
const SLIDE_H = 5.625; // 16:9 ratio

async function generateFullSessionPPT() {
    console.log(`[Export] Starting full session export for: ${SESSION_NAME}`);
    
    if (!fs.existsSync(SESSION_DIR)) {
        console.error(`Error: Session directory not found: ${SESSION_DIR}`);
        return;
    }

    // Find all layout-snap-*.json files
    const files = fs.readdirSync(SESSION_DIR)
        .filter(f => f.startsWith('layout-snap-') && f.endsWith('.json'))
        .sort((a, b) => {
            // Sort by slide index (the number after the last hyphen before .json)
            const idxA = parseInt(a.split('-').pop());
            const idxB = parseInt(b.split('-').pop());
            return idxA - idxB;
        });

    if (files.length === 0) {
        console.error("No snapshots found in session directory.");
        return;
    }

    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE'; // 16:9

    for (const file of files) {
        const filePath = path.join(SESSION_DIR, file);
        console.log(`[Export] Processing: ${file}`);
        
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            const slide = pptx.addSlide();
            
            // Sort elements: zIndex first, then by tag
            const sortedElements = [...data.elements].sort((a, b) => {
                const az = parseInt(a.zIndex) || 0;
                const bz = parseInt(b.zIndex) || 0;
                if (az !== bz) return az - bz;
                if (a.tag === 'DIV' && b.tag !== 'DIV') return -1;
                if (a.tag !== 'DIV' && b.tag === 'DIV') return 1;
                return 0;
            });

            sortedElements.forEach(el => {
                if (el.className === 'slide-number') return;

                const x = parseFloat(el.x);
                const y = parseFloat(el.y);
                const w = parseFloat(el.width);
                const h = parseFloat(el.height);
                const opacity = el.opacity ? Math.round(parseFloat(el.opacity) * 100) : 100;

                // Handle Image (IMG or background-image)
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
                            sizing: { type: el.objectFit === 'contain' ? 'contain' : 'cover', w: w + '%', h: h + '%' }
                        });
                    } catch (e) {
                        console.warn('Failed to add image:', file, imageUrl.substring(0, 50));
                    }
                } else if (el.tag === 'DIV' || el.tag === 'SVG' || el.tag === 'RECT') {
                    // Render background shape
                    const hexBg = parseColor(el.backgroundColor);
                    const hasBg = el.backgroundColor && !el.backgroundColor.includes('rgba(0, 0, 0, 0)') && !el.backgroundColor.includes('transparent');
                    const borderW = parseFloat(el.borderWidth) || 0;
                    
                    if (hasBg || borderW > 0) {
                        slide.addShape('rect', {
                            x: x + '%', y: y + '%', w: w + '%', h: h + '%',
                            fill: hasBg ? { color: hexBg, transparency: 100 - opacity } : null,
                            line: borderW > 0 ? { color: parseColor(el.borderColor), width: borderW * 0.75 } : undefined,
                            rectRadius: el.borderRadius ? parseFloat(el.borderRadius) / 50 : 0
                        });
                    }
                }

                if (el.text && el.text.trim()) {
                    const hexColor = parseColor(el.color);
                    let fontSize = parseFloat(el.fontSize);
                    if (fontSize > 30) fontSize = fontSize * 0.95; // Slight calibration

                    const text = el.text.replace(/\n/g, ' ');
                    const widthBuffer = text.length < 10 ? 1.2 : 1.05;

                    slide.addText(text, {
                        x: x + '%', y: y + '%', w: (w * widthBuffer) + '%', h: (h * 1.1) + '%',
                        fontSize: fontSize * FONT_SCALE,
                        color: hexColor,
                        transparency: 100 - opacity,
                        bold: parseInt(el.fontWeight) >= 600,
                        fontFace: el.fontFamily.includes('Serif') ? 'Source Serif Pro' : 'Microsoft YaHei',
                        align: 'left',
                        valign: 'top',
                        margin: 0
                    });
                }
            });
        } catch (err) {
            console.error(`Error processing ${file}:`, err);
        }
    }

    const fullOutputPath = path.join(process.cwd(), OUTPUT_FILENAME);
    await pptx.writeFile({ fileName: fullOutputPath });
    console.log(`\n[Success] Full PPTX generated: ${fullOutputPath}`);
}

function parseColor(colorStr) {
    if (!colorStr) return '000000';
    if (colorStr.includes('rgb')) {
        const parts = colorStr.match(/\d+/g);
        if (!parts) return '000000';
        return parts.slice(0, 3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('').toUpperCase();
    }
    if (colorStr.includes('srgb')) {
        const parts = colorStr.match(/0?\.\d+|1\.0|0/g);
        if (!parts || parts.length < 3) return '000000';
        return parts.slice(0, 3).map(x => Math.round(parseFloat(x) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
    }
    return '000000';
}

generateFullSessionPPT();
