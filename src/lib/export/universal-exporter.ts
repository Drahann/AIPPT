import PptxGenJS from 'pptxgenjs'

function parseGradient(gradientStr: string | null, w: number, h: number): string | null {
  if (!gradientStr || !gradientStr.includes('gradient')) return null;
  
  const colorMatches = gradientStr.match(/(rgba?\(.*?\)|#[a-fA-F0-9]{3,8}|hsla?\(.*?\))/g);
  if (!colorMatches || colorMatches.length < 2) return null;

  let x1 = "0%", y1 = "0%", x2 = "100%", y2 = "0%";
  if (gradientStr.includes('to bottom') || gradientStr.includes('90deg')) {
    x1 = "0%"; y1 = "0%"; x2 = "0%"; y2 = "100%";
  } else if (gradientStr.includes('to bottom right') || gradientStr.includes('45deg')) {
    x1 = "0%"; y1 = "0%"; x2 = "100%"; y2 = "100%";
  }

  const stops = colorMatches.map((match, idx) => {
    const hex = parseColor(match);
    const opacity = (100 - getTransparency(null, match)) / 100;
    const pos = Math.round((idx / (colorMatches.length - 1)) * 100);
    return `<stop offset="${pos}%" stop-color="#${hex}" stop-opacity="${opacity}"/>`;
  }).join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops}</linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`;
  
  const base64 = typeof btoa !== 'undefined' ? btoa(unescape(encodeURIComponent(svg))) : Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

function parseColor(colorStr: string | null, sideIndex?: number): string | null {
  if (!colorStr || colorStr === 'rgba(0, 0, 0, 0)' || colorStr === 'transparent') return null;

  // Handle shorthand lists like "color1 color2 color3 color4" or "rgb1 rgb2 rgb3 rgb4"
  if (sideIndex !== undefined && colorStr.includes(' ')) {
    // Regex to split colors correctly even if they contain spaces inside rgb/color-mix
    // We match complete color patterns: rgb(...), rgba(...), color(...), #HEX, etc.
    const colorPatterns = colorStr.match(/(rgba?\(.*?\)|color\(.*?\)|#[a-fA-F0-9]{3,8}|[a-zA-Z]+)/g);
    if (colorPatterns && colorPatterns.length >= 4) {
      return parseColor(colorPatterns[sideIndex]);
    } else if (colorPatterns && colorPatterns.length === 2) {
      // Shorthand for top/bottom, left/right
      return parseColor(colorPatterns[sideIndex % 2]);
    }
  }

  if (colorStr.includes('color-mix')) {
    // Extract first color from color-mix(in srgb, #HEX 80%, transparent) or similar
    const innerMatch = colorStr.match(/(rgba?\(.*?\)|#[a-fA-F0-9]{3,8}|hsla?\(.*?\))/);
    if (innerMatch) return parseColor(innerMatch[0]);
  }

  if (colorStr.includes('srgb')) {
    const parts = colorStr.match(/-?\d*\.?\d+/g);
    if (parts && parts.length >= 3) {
      return parts.slice(0, 3).map(x => {
        let val = Math.round(parseFloat(x) * 255);
        if (val < 0) val = 0;
        if (val > 255) val = 255;
        return val.toString(16).padStart(2, '0');
      }).join('').toUpperCase();
    }
  }
  
  if (colorStr.includes('rgb')) {
    const parts = colorStr.match(/\d+/g);
    if (parts && parts.length >= 3) {
      return parts.slice(0, 3).map(x => parseInt(x, 10).toString(16).padStart(2, '0')).join('').toUpperCase();
    }
  }
  
  if (colorStr.startsWith('#')) {
    let hex = colorStr.replace('#', '').toUpperCase();
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    else if (hex.length === 4) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    else if (hex.length > 6) hex = hex.substring(0, 6);
    else if (hex.length === 1) hex = hex.repeat(6);
    else hex = hex.padEnd(6, '0');
    return hex;
  }
  
  return '000000';
}

function getTransparency(opacityStr: string | null, colorStr: string | null): number {
  let alpha = 1;
  if (opacityStr) alpha = parseFloat(opacityStr);
  
  if (colorStr) {
    if (colorStr.includes('/') || colorStr.includes('rgba')) {
      const parts = colorStr.match(/-?\d*\.?\d+/g);
      // For color(srgb r g b / a) it usually has 4 numbers
      // For rgba(r, g, b, a) it has 4 numbers
      if (parts && parts.length >= 4) {
        alpha *= parseFloat(parts[parts.length - 1]);
      }
    } else if (colorStr.includes('color-mix')) {
       // match color-mix(in srgb, #HEX 25%, transparent)
       const percentMatch = colorStr.match(/(\d+)%/);
       if (percentMatch && colorStr.includes('transparent')) {
         alpha *= (parseInt(percentMatch[1], 10) / 100);
       }
    }
  }
  return 100 - Math.round(alpha * 100);
}

function mapDashType(styleStr: string | null): "solid" | "dash" | "dashDot" | "lgDash" | "lgDashDot" | "lgDashDotDot" | "sysDash" | "sysDot" {
  if (!styleStr) return 'solid';
  const s = styleStr.toLowerCase();
  if (s.includes('dashed')) return 'dash';
  if (s.includes('dotted')) return 'sysDot';
  return 'solid';
}

function mapFontFamily(fontStr: string | null): string {
  // Unify all fonts to Microsoft YaHei as requested
  return 'Microsoft YaHei';
}

export async function generateUniversalPptx(snapshots: any[], title?: string): Promise<Buffer> {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE'; // 16:9 960x540
  pptx.title = title || 'Presentation';

  snapshots.sort((a, b) => a.slideIndex - b.slideIndex);

  snapshots.forEach((snapData) => {
    const slide = pptx.addSlide();
    const elements = snapData.elements || [];
    const slideW = snapData.slideWidth || 960;
    
    const sorted = [...elements].sort((a, b) => {
      const az = a.zIndex === 'auto' ? 0 : parseInt(a.zIndex) || 0;
      const bz = b.zIndex === 'auto' ? 0 : parseInt(b.zIndex) || 0;
      if (az === bz) {
        if (a.tag === 'DIV' && b.tag !== 'DIV') return -1;
        if (a.tag !== 'DIV' && b.tag === 'DIV') return 1;
        return 0;
      }
      return az - bz;
    });

    let baseLogicalWidth = snapData.logicalWidth || 960;
    // Check rootClasses and elements for 1920px markers
    if (baseLogicalWidth === 1920 || 
        (snapData.rootClasses && typeof snapData.rootClasses === 'string' && snapData.rootClasses.includes('w-[1920px]')) ||
        (elements.some((e: any) => typeof e.className === 'string' && e.className.includes('w-[1920px]')))) {
      baseLogicalWidth = 1920;
    }
    const FONT_SCALE = 960 / baseLogicalWidth;
    const WEIGHT_COEFF = 1.2; // Global font-weight boost as requested

    sorted.forEach((el) => {
      if (el.opacity === "0" || el.display === "none") return;

      const x = parseFloat(el.x) + '%';
      const y = parseFloat(el.y) + '%';
      let parsedW = parseFloat(el.width);
      if (el.text && el.text.trim() !== '') {
        if (parsedW < 10) parsedW *= 1.15;
        else if (parsedW < 25) parsedW *= 1.10;
        else if (parsedW <= 50) parsedW *= 1.05;
      }
      const w = parsedW + '%';
      const h = parseFloat(el.height) + '%';

      const fontColor = parseColor(el.color);
      const borderColor = parseColor(el.borderColor);
      let fgTransparency = getTransparency(el.opacity, el.color);
      let bgTransparency = getTransparency(el.opacity, el.backgroundColor);
      
      let fill: any = null;
      let gradientData: string | null = null;
      let bgColor = parseColor(el.backgroundColor);
      // Fallback for linear-gradients (common in covers/backgrounds)
      if (!bgColor && el.backgroundImage && el.backgroundImage.includes('gradient')) {
        gradientData = parseGradient(el.backgroundImage, parseFloat(el.width) * 10, parseFloat(el.height) * 10);
      } else if (bgColor) {
        fill = { color: bgColor, transparency: bgTransparency };
      }

      const borderWidth = (parseFloat(el.borderWidth) || 0) * FONT_SCALE;
      const bwTop = (parseFloat(el.borderTopWidth) || 0) * FONT_SCALE;
      const bwRight = (parseFloat(el.borderRightWidth) || 0) * FONT_SCALE;
      const bwBottom = (parseFloat(el.borderBottomWidth) || 0) * FONT_SCALE;
      const bwLeft = (parseFloat(el.borderLeftWidth) || 0) * FONT_SCALE;

      const fontSize = (parseFloat(el.fontSize) || 16) * FONT_SCALE;
      const weightRaw = parseInt(el.fontWeight, 10) || 400;
      const isBold = (weightRaw * WEIGHT_COEFF) >= 600;

      if (el.tag && el.tag.toLowerCase() === 'svg') {
         if (el.svgHtml) {
             const coloredSvg = el.svgHtml.replace(/currentColor/g, fontColor ? `#${fontColor}` : '#000000');
             const base64 = typeof btoa !== 'undefined' ? btoa(unescape(encodeURIComponent(coloredSvg))) : Buffer.from(coloredSvg).toString('base64');
             slide.addImage({ data: `data:image/svg+xml;base64,${base64}`, x: x as any, y: y as any, w: w as any, h: h as any });
         }
         return;
      }

      let imageUrl = el.src || null;
      if (!imageUrl && el.backgroundImage && el.backgroundImage !== 'none') {
        const match = el.backgroundImage.match(/url\(["']?([^"']+)["']?\)/);
        if (match) imageUrl = match[1];
      }

      if (imageUrl || gradientData) {
        const finalImg = imageUrl || gradientData;
        if (finalImg && (finalImg.startsWith('http') || finalImg.startsWith('data:'))) {
          slide.addImage({
            path: finalImg.startsWith('http') ? finalImg : undefined,
            data: finalImg.startsWith('data:') ? finalImg : undefined,
            x: x as any, y: y as any, w: w as any, h: h as any,
            sizing: { type: (el.objectFit === 'contain' ? 'contain' : 'cover') as any, w: w as any, h: h as any }
          });
        }
      } else if (fill || borderWidth > 0 || bwTop > 0 || bwRight > 0 || bwBottom > 0 || bwLeft > 0) {
        let effectiveBorderWidth = borderWidth;
        let effectiveBorderColor = borderColor || '000000';
        let wVal = parseFloat(el.width);
        let hVal = parseFloat(el.height);

        let hasAsym = false;
        if ((bwTop > 0 || bwBottom > 0 || bwLeft > 0 || bwRight > 0) &&
            (bwTop !== bwBottom || bwLeft !== bwRight || bwTop !== bwLeft)) {
          hasAsym = true;
          effectiveBorderWidth = 0;
        }

        if (!hasAsym && borderWidth === 0 && bgColor) {
          if (wVal > 0 && wVal < 0.25) wVal = 0.25;
          if (hVal > 0 && hVal < 0.25) hVal = 0.25;
          if (bgTransparency > 75) bgTransparency = 75;
        }

        const isFrostedGlass = el.className?.includes('backdrop-blur') || el.className?.includes('comparison-contrast-card');

        const dashType = mapDashType(el.borderStyle);

        const shapeProps: any = {
          x: x as any, y: y as any,
          w: (wVal + '%') as any,
          h: (hVal + '%') as any,
          fill: fill || { transparency: 100 },
          line: (!hasAsym && effectiveBorderWidth > 0) ? { color: effectiveBorderColor, width: effectiveBorderWidth, dashType, transparency: getTransparency(el.opacity, el.borderColor) } : undefined,
        };

        // Inject Frosted Glass Simulation
        if (isFrostedGlass) {
          shapeProps.fill = { color: 'FFFFFF', transparency: 12 }; // More transparent for better blend
          shapeProps.line = { color: 'FFFFFF', width: 0.9, transparency: 36 }; // Sharper highlight
          shapeProps.shadow = {
            type: 'outer',
            color: '000000',
            blur: 32,
            offset: 6,
            opacity: 0.08,
            angle: 45
          };
        }

        const radiusRaw = parseFloat(el.borderRadius);
        if (el.borderRadius === "50%" || (radiusRaw && radiusRaw > 100)) {
          slide.addShape(pptx.ShapeType.ellipse, shapeProps);
        } else {
          if (radiusRaw > 0) {
            // Logical pixel shorter side for radius scaling (conservative approach)
            const shorterSide = Math.min(wVal * slideW / 100, hVal * (snapData.slideHeight || 540) / 100);
            shapeProps.rectRadius = radiusRaw / (shorterSide || 1); // direct ratio to shorter side
            if (shapeProps.rectRadius > 1) shapeProps.rectRadius = 1; 
            if (el.className?.includes('rounded-full')) shapeProps.rectRadius = 0.5;
            slide.addShape(pptx.ShapeType.roundRect, shapeProps);
          } else {
            slide.addShape(pptx.ShapeType.rect, shapeProps);
          }
        }

        if (hasAsym) {
          const px = parseFloat(el.x);
          const py = parseFloat(el.y);
          
          const drawSideLine = (bw: number, sideX: number, sideY: number, sideW: number, sideH: number, sideIdx: number) => {
            if (bw <= 0) return;
            const sideColorStr = el.borderColor;
            const sideColor = parseColor(sideColorStr, sideIdx) || effectiveBorderColor;
            const sideTrans = getTransparency(el.opacity, sideIdx !== undefined && sideColorStr.includes(' ') ? sideColorStr.match(/(rgba?\(.*?\)|color\(.*?\)|#[a-fA-F0-9]{3,8}|[a-zA-Z]+)/g)?.[sideIdx] || sideColorStr : sideColorStr);
            const sideStyle = sideIdx === 0 ? el.borderTopStyle : sideIdx === 1 ? el.borderRightStyle : sideIdx === 2 ? el.borderBottomStyle : el.borderLeftStyle;
            slide.addShape(pptx.ShapeType.line, {
              x: sideX + '%' as any,
              y: sideY + '%' as any,
              w: sideW + '%' as any,
              h: sideH + '%' as any,
              line: { color: sideColor, width: bw, dashType: mapDashType(sideStyle || el.borderStyle), transparency: sideTrans }
            });
          };

          drawSideLine(bwTop, px, py, wVal, 0, 0);
          drawSideLine(bwBottom, px, py + hVal, wVal, 0, 2);
          drawSideLine(bwLeft, px, py, 0, hVal, 3);
          drawSideLine(bwRight, px + wVal, py, 0, hVal, 1);
        }
      }

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

        slide.addText(el.text, {
          x: x as any, y: y as any, w: w as any, h: h as any,
          fontSize,
          color: fontColor || '000000',
          bold: isBold,
          fontFace: mapFontFamily(el.fontFamily),
          align: align as any,
          valign: valign as any,
          transparency: fgTransparency,
          margin: 0,
          wrap: true 
        });
      }
    });

  });

  return pptx.write({ outputType: 'nodebuffer' }) as Promise<Buffer>;
}
