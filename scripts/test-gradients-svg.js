const PptxGenJS = require('pptxgenjs');
const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';

function svgGradientToBase64(width, height, colorFrom, colorTo, angle = 0) {
  // Simple angle to SVG coordinate mapping (approximate for 0 and 90)
  let x1 = "0%", y1 = "0%", x2 = "100%", y2 = "0%";
  if (angle === 90) { x1 = "0%"; y1 = "0%"; x2 = "0%"; y2 = "100%"; }
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <defs>
        <linearGradient id="g" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
          <stop offset="0%" stop-color="${colorFrom}" stop-opacity="1"/>
          <stop offset="100%" stop-color="${colorTo}" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
    </svg>`;

  const base64 = Buffer.from(svg).toString('base64');
  return "image/svg+xml;base64," + base64;
}

let slide = pptx.addSlide();
slide.addText('PptxGenJS SVG Gradient Test', { x: 0.5, y: 0.2, w: 9, h: 0.5, fontSize: 24, bold: true });

// 1. Horizontal Gradient (Solid to Transparent)
slide.addText('1. SVG Horizontal (Solid to Transparent)', { x: 0.5, y: 1.0, w: 4.5, h: 0.3, fontSize: 14 });
slide.addImage({
    data: svgGradientToBase64(1000, 200, "#3B82F6", "#3B82F6", 0),
    x: 0.5, y: 1.3, w: 4.5, h: 1.5
});

// 2. Vertical Gradient
slide.addText('2. SVG Vertical', { x: 6.0, y: 1.0, w: 4.5, h: 0.3, fontSize: 14 });
slide.addImage({
    data: svgGradientToBase64(200, 1000, "#EF4444", "#EF4444", 90),
    x: 6.0, y: 1.3, w: 4.5, h: 1.5
});

// 3. Multi-color SVG (Manual)
const multiSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3B82F6"/>
      <stop offset="50%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#EF4444"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
</svg>`;
slide.addText('3. SVG Multi-color Diagonal', { x: 0.5, y: 3.2, w: 4.5, h: 0.3, fontSize: 14 });
slide.addImage({
    data: "image/svg+xml;base64," + Buffer.from(multiSvg).toString('base64'),
    x: 0.5, y: 3.5, w: 4.5, h: 1.5
});

const outFile = 'gradient-test-case-svg.pptx';
console.log('Generating SVG-based test PPTX...');
pptx.writeFile({ fileName: outFile }).then(fileName => {
    console.log(`SUCCESS! Created: ${fileName}`);
}).catch(err => {
    console.error('ERROR:', err);
});
