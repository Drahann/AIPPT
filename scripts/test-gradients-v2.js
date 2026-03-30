const PptxGenJS = require('pptxgenjs');
const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';

let slide = pptx.addSlide();
slide.addText('PptxGenJS Gradient Syntax Test (Alternative Approaches)', { x: 0.5, y: 0.2, w: 9, h: 0.5, fontSize: 24, bold: true, color: '334155' });

// 1. Legacy Syntax (v2.x style)
slide.addText('1. Legacy Syntax (color1, color2)', { x: 0.5, y: 1.0, w: 4.5, h: 0.3, fontSize: 14 });
slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: 1.3, w: 4.5, h: 1.5,
    fill: { type: 'gradient', color1: '3B82F6', color2: 'EF4444', angle: 0 }
});

// 2. Decimal Positions (0.0 to 1.0)
slide.addText('2. Decimal Positions (0.0 to 1.0)', { x: 6.0, y: 1.0, w: 4.5, h: 0.3, fontSize: 14 });
slide.addShape(pptx.ShapeType.rect, {
    x: 6.0, y: 1.3, w: 4.5, h: 1.5,
    fill: { type: 'gradient', angle: 90, gStops: [
        { color: '3B82F6', pos: 0.0 },
        { color: '10B981', pos: 1.0 }
    ]}
});

// 3. String Type (type: "linear")
slide.addText('3. String Type (type: "linear")', { x: 0.5, y: 3.2, w: 4.5, h: 0.3, fontSize: 14 });
slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: 3.5, w: 4.5, h: 1.5,
    fill: { type: 'linear', angle: 45, gStops: [
        { color: '3B82F6', pos: 0 },
        { color: 'EF4444', pos: 100 }
    ]}
});

// 4. Background Fill (instead of shape)
slide.addText('4. Background Gradient', { x: 6.0, y: 3.2, w: 4.5, h: 0.3, fontSize: 14 });
// We can't easily show background on sub-area, but let's try a shape with 'path' fill if it exists? No.
// Let's try explicit 'fill' with hex color as fallback
slide.addShape(pptx.ShapeType.rect, {
    x: 6.0, y: 3.5, w: 4.5, h: 1.5,
    fill: '3B82F6', // Solid fallback
    gradient: { type: 'linear', angle: 0, stops: [ { color: '3B82F6', pos: 0 }, { color: 'FFFFFF', pos: 100 } ] } // Some libs use 'gradient' key
});

// 5. Array of colors (Some other libs use this)
slide.addText('5. Array of colors (Common in many UI libs)', { x: 0.5, y: 5.4, w: 4.5, h: 0.3, fontSize: 14 });
slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: 5.7, w: 4.5, h: 1.5,
    fill: ['3B82F6', 'EF4444']
});

// 6. Direct color with transparency mix
slide.addText('6. Semi-transparent Solid (Fallback for Glass)', { x: 6.0, y: 5.4, w: 4.5, h: 0.3, fontSize: 14 });
slide.addShape(pptx.ShapeType.rect, {
    x: 6.0, y: 5.7, w: 4.5, h: 1.5,
    fill: { color: '3B82F6', transparency: 50 }
});

const outFile = 'gradient-test-case-v2.pptx';
console.log('Generating test PPTX v2...');
pptx.writeFile({ fileName: outFile }).then(fileName => {
    console.log(`SUCCESS! Created: ${fileName}`);
}).catch(err => {
    console.error('ERROR:', err);
});
