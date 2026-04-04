const fs = require('fs');
const path = require('path');

const dir = 'w:\\3spring\\AIPPT\\debug-data\\dbg-1774844955634-mt5vct';
const files = fs.readdirSync(dir).filter(f => f.startsWith('layout-snap-') && f.endsWith('.json'));

let totalTextFiles = 0;
let results = [];

files.forEach(f => {
  const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8'));
  const elements = data.elements || [];
  
  let totalChars = 0;
  let fontSizes = new Set();
  
  elements.forEach(el => {
    if (el.type === 'text' && el.text) {
      totalChars += el.text.trim().length;
      if (el.fontSize) fontSizes.add(el.fontSize);
    }
  });

  results.push({
    slide: data.slideIndex,
    layout: data.layout,
    chars: totalChars,
    fonts: Array.from(fontSizes).join(', ')
  });
});

results.sort((a,b) => a.slide - b.slide);
results.forEach(r => {
    console.log(`[Slide ${r.slide} - ${r.layout}] Chars: ${r.chars} | Fonts: ${r.fonts}`);
});
