const PptxGenJS = require('pptxgenjs');
const path = require('path');

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';

const slide = pptx.addSlide();

// Test 1: Using instance ShapeType (if it exists)
if (pptx.ShapeType && pptx.ShapeType.OVAL) {
    slide.addText("1. ShapeType.OVAL", { x: 0.5, y: 0.5, w: 2, h: 0.5 });
    slide.addShape(pptx.ShapeType.OVAL, { x: 0.5, y: 1.0, w: 2, h: 2, fill: { color: 'FF0000' } });
}

// Test 2: Using string 'oval'
slide.addText("2. String 'oval'", { x: 3.0, y: 0.5, w: 2, h: 0.5 });
slide.addShape('oval', { x: 3.0, y: 1.0, w: 2, h: 2, fill: { color: '00FF00' } });

// Test 3: Using string 'ellipse'
slide.addText("3. String 'ellipse'", { x: 5.5, y: 0.5, w: 2, h: 0.5 });
slide.addShape('ellipse', { x: 5.5, y: 1.0, w: 2, h: 2, fill: { color: '0000FF' } });

// Test 4: Using constructor ShapeType
if (PptxGenJS.ShapeType && PptxGenJS.ShapeType.OVAL) {
    slide.addText("4. PptxGenJS.ShapeType.OVAL", { x: 8.0, y: 0.5, w: 2, h: 0.5 });
    slide.addShape(PptxGenJS.ShapeType.OVAL, { x: 8.0, y: 1.0, w: 2, h: 2, fill: { color: 'FFFF00' } });
}

// Test 5: Using 'rect' with rectRadius: 1
slide.addText("5. rect + radius:1", { x: 0.5, y: 3.5, w: 2, h: 0.5 });
slide.addShape('rect', { x: 0.5, y: 4.0, w: 2, h: 2, fill: { color: 'FF00FF' }, rectRadius: 1 });

pptx.writeFile({ fileName: path.join(process.cwd(), 'shape-test.pptx') }).then(() => {
    console.log("Shape test PPT generated: shape-test.pptx");
});
