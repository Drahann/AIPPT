const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../src/lib/export/pptx-exporter.ts');
let content = fs.readFileSync(file, 'utf8');

// The blocks look like this:
//   s.addText(slide.title, {
//     x: 0.8, y: 0.5, w: 11.5, h: 1,
//     fontSize: 28, fontFace: fH, color: hexToRgb(c.text), bold: true,
//   })

// We want to add align: 'center' and fit: 'shrink' if not present in the addText block for slide.title.
let parts = content.split('s.addText(slide.title, {');
for (let i = 1; i < parts.length; i++) {
  let endIdx = parts[i].indexOf('})');
  let block = parts[i].substring(0, endIdx);
  
  if (!block.includes("align: 'center'")) {
    block = block + " align: 'center',\n   ";
  }
  if (!block.includes("fit: 'shrink'")) {
    block = block + " fit: 'shrink',\n   ";
  }
  
  parts[i] = block + parts[i].substring(endIdx);
}

fs.writeFileSync(file, parts.join('s.addText(slide.title, {'), 'utf8');
console.log('pptx-exporter.ts updated');
