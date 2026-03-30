const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../src/lib/export/pack-pptx-configs.ts');
const exporterPath = path.join(__dirname, '../src/lib/export/pptx-exporter.ts');

function processConfigs() {
  let content = fs.readFileSync(configPath, 'utf8');

  // Groups that were scaled 2x in React: 02, 04, 06, 07, 09
  // We need to double their fxW, fxH and fontSize inside their blocks.
  const groupsToScale = ['group02Config', 'group04Config', 'group06Config', 'group07Config', 'group09Config'];

  for (const group of groupsToScale) {
    const startIndex = content.indexOf(`const ${group}: PackPptxConfig = {`);
    if (startIndex === -1) continue;
    
    let nextBlockIndex = content.indexOf('// ===', startIndex);
    if (nextBlockIndex === -1) nextBlockIndex = content.length;

    let block = content.substring(startIndex, nextBlockIndex);
    
    // Replace fxW(X) -> fxW(X*2)
    block = block.replace(/fxW\((\d+(?:\.\d+)?)\)/g, (m, num) => `fxW(${parseFloat(num) * 2})`);
    // Replace fxH(X) -> fxH(X*2)
    block = block.replace(/fxH\((\d+(?:\.\d+)?)\)/g, (m, num) => `fxH(${parseFloat(num) * 2})`);
    // Replace fontSize: X -> fontSize: X*2 where X is a number
    block = block.replace(/fontSize:\s*(\d+(?:\.\d+)?)/g, (m, num) => `fontSize: ${parseFloat(num) * 2}`);

    content = content.substring(0, startIndex) + block + content.substring(nextBlockIndex);
  }

  // Next: Add align: 'center' and fit: 'shrink' to titles if missing
  // Basically anywhere we have `s.addText(title, {` or `s.addText(slide.title, {`
  content = content.replace(/s\.addText\((title(?:\.toUpperCase\(\))?|slide\.title|title \|\| '[^']+'), \{([\s\S]*?)\}\)/g, (match, titleExpr, optionsStr) => {
    let newOptions = optionsStr;
    if (!newOptions.includes("align: 'center'")) {
      newOptions = newOptions.replace(/,\s*valign/g, ", align: 'center', valign");
      if (!newOptions.includes("align: 'center'")) { // fallback
         newOptions = newOptions.replace(/\s*\}\n*$/g, ",\n    align: 'center',\n  }");
      }
    }
    if (!newOptions.includes("fit: 'shrink'")) {
      newOptions = newOptions.replace(/\s*\}\n*$/g, ", fit: 'shrink' }");
    }
    return `s.addText(${titleExpr}, {${newOptions}})`;
  });

  fs.writeFileSync(configPath, content, 'utf8');
}

function processExporter() {
  let content = fs.readFileSync(exporterPath, 'utf8');
  
  // Add align: 'center' and fit: 'shrink' to standard slide.titles
  content = content.replace(/s\.addText\(slide\.title,\s*\{([\s\S]*?)\}\)/g, (match, optionsStr) => {
    let newOptions = optionsStr;
    if (!newOptions.includes("align: 'center'")) {
      newOptions = newOptions.replace(/\s*\}/g, ", align: 'center' }");
    }
    if (!newOptions.includes("fit: 'shrink'")) {
      newOptions = newOptions.replace(/\s*\}/g, ", fit: 'shrink' }");
    }
    return `s.addText(slide.title, {${newOptions}})`;
  });

  fs.writeFileSync(exporterPath, content, 'utf8');
}

processConfigs();
processExporter();
console.log('PPTX export configs scaled and aligned.');
