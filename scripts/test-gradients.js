const PptxGenJS = require('pptxgenjs');
const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';

let slide = pptx.addSlide();
slide.addText('PptxGenJS Gradient Test Showcase', { x: 0.5, y: 0.2, w: 9, h: 0.5, fontSize: 24, bold: true, color: '334155' });

// 1. Basic Linear Gradient (0 deg)
slide.addText('1. Linear 0deg (Left to Right)', { x: 0.5, y: 1.0, w: 4.5, h: 0.3, fontSize: 14 });
slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: 1.3, w: 4.5, h: 1.5,
    fill: { type: 'gradient', angle: 0, gStops: [
        { color: '3B82F6', pos: 0 },
        { color: 'EF4444', pos: 100 }
    ]}
});

// 2. Linear Gradient 90 deg (Top to Bottom)
slide.addText('2. Linear 90deg (Top to Bottom)', { x: 6.0, y: 1.0, w: 4.5, h: 0.3, fontSize: 14 });
slide.addShape(pptx.ShapeType.rect, {
    x: 6.0, y: 1.3, w: 4.5, h: 1.5,
    fill: { type: 'gradient', angle: 90, gStops: [
        { color: '3B82F6', pos: 0 },
        { color: '10B981', pos: 100 }
    ]}
});

// 3. Multi-stop Gradient
slide.addText('3. Multi-stop (3 colors, 45deg)', { x: 0.5, y: 3.2, w: 4.5, h: 0.3, fontSize: 14 });
slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: 3.5, w: 4.5, h: 1.5,
    fill: { type: 'gradient', angle: 45, gStops: [
        { color: '3B82F6', pos: 0 },
        { color: 'FFFFFF', pos: 50 },
        { color: 'EF4444', pos: 100 }
    ]}
});

// 4. Gradient with Transparency (CSS match for ComparisonSlide)
slide.addText('4. Gradient with Transparency (0% -> 100%)', { x: 6.0, y: 3.2, w: 4.5, h: 0.3, fontSize: 14 });
slide.addShape(pptx.ShapeType.rect, {
    x: 6.0, y: 3.5, w: 4.5, h: 1.5,
    fill: { type: 'gradient', angle: 0, gStops: [
        { color: '3B82F6', pos: 0, transparency: 0 },
        { color: '3B82F6', pos: 100, transparency: 100 }
    ]}
});

// 5. Radial Gradient
slide.addText('5. Radial Gradient', { x: 0.5, y: 5.4, w: 4.5, h: 0.3, fontSize: 14 });
slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: 5.7, w: 4.5, h: 1.5,
    fill: { type: 'gradient', style: 'radial', gStops: [
        { color: 'F59E0B', pos: 0 },
        { color: 'B45309', pos: 100 }
    ]}
});

// 6. Frosted Glass Style (Combined Transparency Gradient)
slide.addText('6. Frosted Glass Emulation', { x: 6.0, y: 5.4, w: 4.5, h: 0.3, fontSize: 14 });
slide.addShape(pptx.ShapeType.rect, {
    x: 6.0, y: 5.7, w: 4.5, h: 1.5,
    fill: { type: 'gradient', angle: 135, gStops: [
        { color: 'FFFFFF', pos: 0, transparency: 10 },
        { color: 'FFFFFF', pos: 100, transparency: 60 }
    ]},
    line: { color: 'FFFFFF', width: 2 }
});

const outFile = 'gradient-test-case.pptx';
console.log('Generating test PPTX...');
pptx.writeFile({ fileName: outFile }).then(fileName => {
    console.log(`SUCCESS! Created: ${fileName}`);
    console.log('You can find this file in the project root directory.');
}).catch(err => {
    console.error('ERROR:', err);
});
