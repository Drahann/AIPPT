/**
 * Utility to capture the computed layout of a slide for PPTX calibration.
 */
export function captureSlideLayout(slideElement: HTMLElement, slideIndex: number) {
  const rect = slideElement.getBoundingClientRect();
  const elements: any[] = [];

  // 1. First Pass: Collect all candidate elements and their basic info
  const selectors = [
    'h1', 'h2', 'h3', 'p', 'img', 'li', 'span', 'div',
    'svg', 'circle', 'rect', 'path',
    '.card', '.metric-value', '.metric-label', '.quote-text', '.quote-attribution'
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
    const hasTextChild = Array.from(el.children).some((child: any) => 
      allNodes.includes(child) && child.innerText?.trim().length > 0
    );

    const shouldCaptureText = hasText && !hasTextChild && !isGraphic;

    if (!shouldCaptureText && !isGraphic && !hasBg && !hasBgImage && !hasBorder) return;

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
      boxShadow: style.boxShadow
    });
  });

  return {
    timestamp: new Date().toISOString(),
    sessionId: (window as any)._pptSessionId = (window as any)._pptSessionId || `session-${new Date().getTime()}`,
    slideIndex,
    slideWidth: rect.width,
    slideHeight: rect.height,
    logicalWidth: slideElement.offsetWidth,
    logicalHeight: slideElement.offsetHeight,
    rootClasses: slideElement.className,
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
