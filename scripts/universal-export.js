const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE'; // 16:9

const debugDataDir = path.join(process.cwd(), 'debug-data', 'dbg-1774065021468-ccxkfd');
const outFileName = 'universal-ppt-export-new-v14.pptx';

// Parses color strings and ignores transparent colors
function parseColor(colorStr) {
    if (!colorStr || colorStr === 'rgba(0, 0, 0, 0)' || colorStr === 'transparent') {
        return null;
    }
    
    // srgb pattern: color(srgb 0.96 0.92 0.79) or color(srgb 0 0 0 / 0.86)
    if (colorStr.includes('srgb')) {
        const parts = colorStr.match(/-?\d*\.?\d+/g);
        if (parts && parts.length >= 3) {
            return parts.slice(0, 3).map(x => Math.round(parseFloat(x) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
        }
    }
    
    // rgb/rgba pattern: rgb(255, 255, 255)
    if (colorStr.includes('rgb')) {
        const parts = colorStr.match(/\d+/g);
        if (parts && parts.length >= 3) {
            return parts.slice(0, 3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('').toUpperCase();
        }
    }
    
    // Check if it's already a hex color
    if (colorStr.startsWith('#')) {
        let hex = colorStr.replace('#', '').toUpperCase();
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        } else if (hex.length === 4) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]; // strip alpha
        } else if (hex.length > 6) {
            hex = hex.substring(0, 6);
        } else if (hex.length === 1) {
            hex = hex.repeat(6);
        } else {
            hex = hex.padEnd(6, '0');
        }
        return hex;
    }
    
    return '000000'; // Default fallback
}

// Extract transparency from rgba or srgb string if available, or use the explicit opacity CSS property
function getTransparency(opacityStr, colorStr) {
    let alpha = 1;
    
    // 1. parse opacity property first
    if (opacityStr) {
        alpha = parseFloat(opacityStr);
    }
    
    // 2. parse alpha from color string if it has it (e.g. rgba(..., 0.5) or color(srgb ... / 0.86))
    if (colorStr && colorStr.includes('/')) { // handling modern color(srgb r g b / a)
        const parts = colorStr.match(/-?\d*\.?\d+/g);
        if (parts && parts.length === 4) {
            alpha *= parseFloat(parts[3]);
        }
    } else if (colorStr && colorStr.includes('rgba')) {
        const parts = colorStr.match(/-?\d*\.?\d+/g);
        if (parts && parts.length === 4) {
            alpha *= parseFloat(parts[3]);
        }
    }
    
    return 100 - Math.round(alpha * 100);
}

// Convert CSS font-family strings into standard PPTX fonts
function mapFontFamily(fontStr) {
    // Unify all fonts to Microsoft YaHei as requested
    return 'Microsoft YaHei';
}

async function runUniversalExport() {
    console.log(`[Universal Export Engine starting...]`);
    
    const allFiles = fs.readdirSync(debugDataDir).filter(f => f.endsWith('.json') && f.startsWith('layout-snap'));
    
    // For each slideIndex, find the file with the highest timestamp (handles incremental snapshots)
    const latestFilesByIndex = {};
    allFiles.forEach(f => {
        const match = f.match(/layout-snap-(\d+)-(\d+)\.json/);
        if (match) {
            const ts = parseInt(match[1], 10);
            const slideIndex = parseInt(match[2], 10);
            if (!latestFilesByIndex[slideIndex] || latestFilesByIndex[slideIndex].ts < ts) {
                latestFilesByIndex[slideIndex] = { file: f, ts: ts };
            }
        }
    });
    
    const files = Object.values(latestFilesByIndex).map(x => x.file);
    
    console.log(`=> Found ${files.length} unique snapshot slides (merged latest timestamps).`);
    
    // Map to objects and sort by internal slideIndex
    let snapshots = files.map(filename => {
        const fileData = fs.readFileSync(path.join(debugDataDir, filename), 'utf8');
        return { filename, data: JSON.parse(fileData) };
    });
    
    snapshots.sort((a, b) => a.data.slideIndex - b.data.slideIndex);

    snapshots.forEach((snapObj, idx) => {
        const slideIndex = snapObj.data.slideIndex;
        console.log(`Processing PPT Slide ${idx + 1} (Index: ${slideIndex})`);
        
        const slide = pptx.addSlide();
        const elements = snapObj.data.elements;
        const slideW = snapObj.data.slideWidth || 960;
        const slideH = snapObj.data.slideHeight || 540;

        // Sort elements by zIndex to ensure backgrounds render beneath text
        const sorted = [...elements].sort((a, b) => {
            const az = a.zIndex === 'auto' ? 0 : parseInt(a.zIndex) || 0;
            const bz = b.zIndex === 'auto' ? 0 : parseInt(b.zIndex) || 0;
            // Also enforce DOM order slightly by giving DIVs an earlier draw order if zIndex is identical
            if (az === bz) {
                if (a.tag === 'DIV' && b.tag !== 'DIV') return -1;
                if (a.tag !== 'DIV' && b.tag === 'DIV') return 1;
                return 0;
            }
            return az - bz;
        });

        sorted.forEach(el => {
            // Ignore fully invisible
            if (el.opacity === "0" || el.display === "none") return;
            
            // X, Y, W, H are perfectly translated. Slide uses WIDE layout implicitly mapping % to exact fit.
            const x = parseFloat(el.x) + '%';
            const y = parseFloat(el.y) + '%';
            let parsedW = parseFloat(el.width);
            if (el.text && el.text.trim() !== '') {
                // Tiered text box expansion:
                if (parsedW < 10) parsedW *= 1.15;
                else if (parsedW < 25) parsedW *= 1.10;
                else if (parsedW <= 50) parsedW *= 1.05;
            }
            const w = parsedW + '%';
            const h = parseFloat(el.height) + '%';

            // Extract styles
            const bgColor = parseColor(el.backgroundColor);
            const fontColor = parseColor(el.color);
            const borderColor = parseColor(el.borderColor);
            
            // Scaling modifier: Compare the PPTX 960 width with the true logical CSS base width of the slide!
            // E.g. Generic templates use 960px (Factor: 1.0). Group templates use 1920px (Factor: 0.5!).
            let baseLogicalWidth = snapObj.data.logicalWidth || 960;
            if (snapObj.data.elements.some(e => typeof e.className === 'string' && e.className.includes('w-[1920px]'))) {
                baseLogicalWidth = 1920;
            }
            const FONT_SCALE = 960 / baseLogicalWidth; 
            const borderWidth = (parseFloat(el.borderWidth) || 0) * FONT_SCALE; 
            const bwTop = (parseFloat(el.borderTopWidth) || 0) * FONT_SCALE;
            const bwRight = (parseFloat(el.borderRightWidth) || 0) * FONT_SCALE;
            const bwBottom = (parseFloat(el.borderBottomWidth) || 0) * FONT_SCALE;
            const bwLeft = (parseFloat(el.borderLeftWidth) || 0) * FONT_SCALE;
            
            let fontSize = (parseFloat(el.fontSize) || 16) * FONT_SCALE;      
            
            const isBold = parseInt(el.fontWeight) >= 600;
            let fgTransparency = getTransparency(el.opacity, el.color);
            let bgTransparency = getTransparency(el.opacity, el.backgroundColor);

            // 1. Draw Images
            let imageUrl = el.src || null;
            if (!imageUrl && el.backgroundImage && el.backgroundImage !== 'none') {
                 const match = el.backgroundImage.match(/url\(["']?([^"']+)["']?\)/);
                 if (match) imageUrl = match[1];
            }

            if (imageUrl) {
                try {
                    slide.addImage({
                        path: imageUrl.startsWith('http') ? imageUrl : undefined,
                        data: imageUrl.startsWith('data:') ? imageUrl : undefined,
                        x, y, w, h,
                        sizing: { type: el.objectFit === 'contain' ? 'contain' : 'cover', w: w, h: h }
                    });
                } catch(e) {
                    // silently ignore image fetch fails in batch mode
                }
            } 
            // 2. Draw Vector Shapes (Rectangles/Ellipses)
            else if (bgColor || borderWidth > 0 || bwTop > 0 || bwRight > 0 || bwBottom > 0 || bwLeft > 0) {
                let effectiveBorderWidth = borderWidth;
                let effectiveBorderColor = borderColor || '000000';
                
                let wVal = parseFloat(el.width);
                let hVal = parseFloat(el.height);

                // Check if this box has assymetrical/single-sided borders (common for dividers)
                // If so, we draw it without a universal native border out of the box...
                let hasAsymmetricBorders = false;
                if ((bwTop > 0 || bwBottom > 0 || bwLeft > 0 || bwRight > 0) && (bwTop !== bwBottom || bwLeft !== bwRight || bwTop !== bwLeft)) {
                    hasAsymmetricBorders = true;
                    effectiveBorderWidth = 0; // Disable native universal border rendering
                }

                // If purely a background fill with very thin dimension, clamp it for PowerPoint visibility
                if (!hasAsymmetricBorders && borderWidth === 0 && bgColor) {
                    if (wVal > 0 && wVal < 0.25) wVal = 0.25;
                    if (hVal > 0 && hVal < 0.25) hVal = 0.25;
                    if (bgTransparency > 75) bgTransparency = 75; // Prevent extremely faint blocks from vanishing 
                }

                const shapeProps = {
                    x, y, 
                    w: wVal + '%', 
                    h: hVal + '%',
                    fill: bgColor ? { color: bgColor, transparency: bgTransparency } : { transparency: 100 },
                    line: (!hasAsymmetricBorders && effectiveBorderWidth > 0) ? { color: effectiveBorderColor, width: effectiveBorderWidth } : undefined,
                };
                
                try {
                    const radiusRaw = parseFloat(el.borderRadius);
                    if (el.borderRadius === "50%" || (radiusRaw && radiusRaw > 100)) {
                        slide.addShape(pptx.ShapeType.ellipse, shapeProps);
                    } else {
                        if (radiusRaw > 0) {
                            shapeProps.rectRadius = radiusRaw / (parseFloat(el.width) || slideW) * 2;
                            if (shapeProps.rectRadius > 1) shapeProps.rectRadius = 1;
                        }
                        slide.addShape('rect', shapeProps);
                    }
                    
                    // Explicitly draw independent lines for asymmetric CSS borders to mimic HTML CSS accurately
                    if (hasAsymmetricBorders) {
                        const px = parseFloat(el.x);
                        const py = parseFloat(el.y);
                        
                        if (bwTop > 0) {
                            slide.addShape(pptx.ShapeType.line, { x: px + '%', y: py + '%', w: wVal + '%', h: 0, line: { color: effectiveBorderColor, width: bwTop } });
                        }
                        if (bwBottom > 0) {
                            slide.addShape(pptx.ShapeType.line, { x: px + '%', y: (py + hVal) + '%', w: wVal + '%', h: 0, line: { color: effectiveBorderColor, width: bwBottom } });
                        }
                        if (bwLeft > 0) {
                            slide.addShape(pptx.ShapeType.line, { x: px + '%', y: py + '%', w: 0, h: hVal + '%', line: { color: effectiveBorderColor, width: bwLeft } });
                        }
                        if (bwRight > 0) {
                            slide.addShape(pptx.ShapeType.line, { x: (px + wVal) + '%', y: py + '%', w: 0, h: hVal + '%', line: { color: effectiveBorderColor, width: bwRight } });
                        }
                    }
                } catch(err) {
                    console.error("Shape Render Error! bgColor:", bgColor, "borderColor:", borderColor);
                    throw err;
                }
            }

            // 3. Draw Text
            if (el.text && el.text.trim() !== '') {
                let align = 'left';
                if (el.textAlign === 'center' || el.justifyContent === 'center') align = 'center';
                if (el.textAlign === 'right' || el.justifyContent === 'flex-end' || el.justifyContent === 'end') align = 'right';

                let valign = 'top'; 
                if (el.display === 'flex') {
                    if (el.alignItems === 'center') valign = 'middle';
                    if (el.alignItems === 'flex-end') valign = 'bottom';
                } else if (el.verticalAlign === 'middle') {
                    valign = 'middle';
                }

                try {
                    slide.addText(el.text, {
                        x, y, w, h,
                        fontSize: fontSize,
                        color: fontColor || '000000',
                        bold: isBold,
                        fontFace: mapFontFamily(el.fontFamily),
                        align: align,
                        valign: valign,
                        transparency: fgTransparency,
                        margin: 0, 
                        wrap: true 
                    });
                } catch(err) {
                    console.error("Text Render Error! fontColor:", fontColor || '000000');
                    throw err;
                }
            }
        });
    });

    const outPath = path.join(process.cwd(), outFileName);
    await pptx.writeFile({ fileName: outPath });
    console.log(`\n[Done] Successfully generated full presentation to: ${outPath}`);
}

runUniversalExport().catch(err => {
    console.error("Export Failed:", err);
});
