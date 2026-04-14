/**
 * Utility to capture the computed layout of a slide for PPTX calibration.
 *
 * 增强版快照采集：
 * - 跳过 [data-slot-container]（只捕获叶子文字元素）
 * - 保留 [data-decoration] 元素的负坐标（不过滤）
 * - SVG 序列化时预替换 var() CSS 变量
 * - 通过 data-slot-id 精确识别内容元素
 */
export function captureSlideLayout(slideElement: HTMLElement, slideIndex: number) {
  const rect = slideElement.getBoundingClientRect();
  const elements: any[] = [];

  // 1. First Pass: Collect all candidate elements and their basic info
  const selectors = [
    'h1', 'h2', 'h3', 'p', 'img', 'li', 'span', 'div',
    'svg', 'circle', 'rect', 'path',
    '.card', '.metric-value', '.metric-label', '.quote-text', '.quote-attribution',
    // Spec engine selectors
    '[data-slot-id]', '[data-decoration]',
  ];
  
  const allNodes = Array.from(slideElement.querySelectorAll(selectors.join(',')));
  
  allNodes.forEach((el: any) => {
    const style = window.getComputedStyle(el);
    const elRect = el.getBoundingClientRect();
    
    const tagName = el.tagName.toUpperCase();
    
    // Skip internal SVG elements since we capture the entire SVG container
    if (['PATH', 'CIRCLE', 'G', 'LINE', 'POLYLINE', 'TEXT', 'RECT'].includes(tagName)) {
        if (el.closest('svg') && tagName !== 'SVG') return;
    }

    // Skip slot containers — only capture leaf text elements
    if (el.getAttribute('data-slot-container') === 'true') return;

    // Check if this element is inside a slot container and has siblings that are slot items
    // (avoid double-capturing container div text)
    const isDecoration = el.hasAttribute('data-decoration');
    const slotId = el.getAttribute('data-slot-id');

    const hasBg = style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent';
    const hasBgImage = style.backgroundImage !== 'none' && style.backgroundImage !== '';
    const bwTop = parseFloat(style.borderTopWidth) || 0;
    const bwRight = parseFloat(style.borderRightWidth) || 0;
    const bwBottom = parseFloat(style.borderBottomWidth) || 0;
    const bwLeft = parseFloat(style.borderLeftWidth) || 0;
    const hasBorder = style.borderStyle !== 'none' && (bwTop > 0 || bwRight > 0 || bwBottom > 0 || bwLeft > 0);
    const isGraphic = tagName === 'IMG' || tagName === 'SVG';
    
    // Check if this element has direct text content
    const hasText = el.innerText?.trim().length > 0;
    
    // Check if any child of this element is ALSO in our allNodes list and has text
    // For slot-id elements, trust the data attribute — they are leaf text nodes
    const hasTextChild = slotId
      ? false  // slot-id elements are already leaf nodes
      : Array.from(el.children).some((child: any) => 
          allNodes.includes(child) && child.innerText?.trim().length > 0
        );

    const shouldCaptureText = hasText && !hasTextChild && !isGraphic;

    if (!shouldCaptureText && !isGraphic && !hasBg && !hasBgImage && !hasBorder && !isDecoration) return;

    let srcData = tagName === 'IMG' ? el.src : undefined;
    let outputTag = tagName;

    if (tagName === 'SVG') {
      try {
        const clonedSvg = el.cloneNode(true);
        // Force dimensions to be explicit on the SVG for reliable parser output
        clonedSvg.setAttribute('width', elRect.width.toString());
        clonedSvg.setAttribute('height', elRect.height.toString());
        let svgString = new XMLSerializer().serializeToString(clonedSvg);
        if (style.color) {
            svgString = svgString.replace(/currentColor/gi, style.color);
        }
        // Resolve CSS variables — walk up to find the spec container for variable values
        const specContainer = el.closest('[data-spec-id]') || slideElement;
        const containerStyle = window.getComputedStyle(specContainer);
        svgString = svgString.replace(/var\(--([^,)]+)(?:,\s*([^)]+))?\)/g, (match: string, varName: string, fallback: string) => {
          // Try the element's own computed style first, then the spec container
          const resolved = style.getPropertyValue('--' + varName.trim()).trim() ||
                          containerStyle.getPropertyValue('--' + varName.trim()).trim();
          return resolved || (fallback ? fallback.trim() : match);
        });
        srcData = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
        outputTag = 'IMG';
      } catch (e) {
        console.warn('SVG serialize failed', e);
      }
    }

    elements.push({
      tag: outputTag,
      className: el.className,
      text: shouldCaptureText ? el.innerText.trim() : '',
      // Relative coordinates
      x: ((elRect.left - rect.left) / rect.width * 100).toFixed(2) + '%',
      y: ((elRect.top - rect.top) / rect.height * 100).toFixed(2) + '%',
      width: (elRect.width / rect.width * 100).toFixed(2) + '%',
      height: (elRect.height / rect.height * 100).toFixed(2) + '%',
      // Style properties
      src: srcData,
      backgroundImage: style.backgroundImage !== 'none' ? style.backgroundImage : undefined,
      backgroundColor: style.backgroundColor,
      color: style.color,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      fontFamily: style.fontFamily,
      fontStyle: style.fontStyle,
      lineHeight: style.lineHeight,
      textAlign: style.textAlign,
      opacity: style.opacity,
      zIndex: style.zIndex,
      borderRadius: style.borderRadius,
      borderWidth: style.borderWidth,
      borderTopWidth: style.borderTopWidth,
      borderRightWidth: style.borderRightWidth,
      borderBottomWidth: style.borderBottomWidth,
      borderLeftWidth: style.borderLeftWidth,
      borderColor: style.borderColor,
      borderStyle: style.borderStyle,
      objectFit: style.objectFit,
      display: style.display,
      alignItems: style.alignItems,
      justifyContent: style.justifyContent,
      verticalAlign: style.verticalAlign,
      boxShadow: style.boxShadow,
      // Spec engine metadata
      slotId: slotId || undefined,
      isDecoration: isDecoration || undefined,
      // CSS transform — extract rotate for PPTX export
      rotate: (() => {
        const tf = style.transform;
        if (!tf || tf === 'none') return undefined;
        // matrix(a,b,c,d,e,f) → angle = atan2(b,a)
        const matrixMatch = tf.match(/matrix\(([^)]+)\)/);
        if (matrixMatch) {
          const parts = matrixMatch[1].split(',').map(Number);
          if (parts.length >= 2) {
            const angle = Math.round(Math.atan2(parts[1], parts[0]) * 180 / Math.PI);
            return angle !== 0 ? angle : undefined;
          }
        }
        // rotate(Ndeg)
        const rotateMatch = tf.match(/rotate\(([-\d.]+)deg\)/);
        if (rotateMatch) {
          const angle = Math.round(parseFloat(rotateMatch[1]));
          return angle !== 0 ? angle : undefined;
        }
        return undefined;
      })(),
    });
  });
  // Spec themes render at 1920×1080 with CSS scale(0.5).
  // getBoundingClientRect returns the scaled pixel size (960×540),
  // but the actual CSS coordinate space is 1920×1080.
  // We need logicalWidth=1920 so the pptx exporter applies FONT_SCALE=0.5.
  const rootClasses = slideElement.className || '';
  const hasSpecId = !!slideElement.querySelector('[data-spec-id]');
  const isSpec = hasSpecId ||
                 rootClasses.includes('tpl-pastel-papercut') ||
                 rootClasses.includes('tpl-casual-pro') ||
                 rootClasses.includes('tpl-curve-study');
  const logicalWidth = isSpec ? 1920 : slideElement.offsetWidth;
  const logicalHeight = isSpec ? 1080 : slideElement.offsetHeight;

  return {
    timestamp: new Date().toISOString(),
    sessionId: (window as any)._pptSessionId = (window as any)._pptSessionId || `session-${new Date().getTime()}`,
    slideIndex,
    slideWidth: rect.width,
    slideHeight: rect.height,
    logicalWidth,
    logicalHeight,
    rootClasses,
    elements
  };
}

export async function saveLayoutSnapshot(data: any) {
  try {
    const response = await fetch('/api/debug/layout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.ok;
  } catch (err) {
    console.error('Failed to save layout snapshot:', err);
    return false;
  }
}
