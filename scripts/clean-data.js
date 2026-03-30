const fs = require('fs');
const path = require('path');

const sessionName = 'dbg-1774065021468-ccxkfd';
const manifestPath = path.join(__dirname, '..', 'debug-data', sessionName, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const entry = manifest.entries.find(e => e.stage === 'outline.repaired');
let payload = entry.payload;

// Robust extraction: find "slides": [ ... ]
const startIdx = payload.indexOf('"slides": [');
const endIdx = payload.lastIndexOf(']');

if (startIdx === -1 || endIdx === -1) {
    console.error('Could not find slides array in payload');
    process.exit(1);
}

const slidesStr = payload.substring(startIdx + 11, endIdx + 1);

// We still have unescaped quotes in the middle. 
// Let's use a regex to only match valid JSON structure and fix the rest.
// OR: Just use the fact that each slide object is { ... }
const slides = [];
const slideMatches = slidesStr.match(/\{[\s\S]*?\}(?=,\s*\{|\s*\])/g);

// Actually, let's just use the manifest's payload but escape it properly.
// The issue is quotes inside speakerNotes.
payload = payload.replace(/"speakerNotes":\s*"([\s\S]*?)"(?=\s*[,}\n])/g, (match, p1) => {
    return '"speakerNotes": ' + JSON.stringify(p1);
});

try {
    const data = JSON.parse(payload);
    fs.writeFileSync(path.join(__dirname, 'clean-slides.json'), JSON.stringify(data.slides, null, 2));
    console.log('Successfully dumped clean-slides.json');
} catch (e) {
    console.error('Still failing:', e.message);
    // Final fallback: use a very aggressive regex
    const cleanPayload = payload.replace(/\\"/g, '"').replace(/"/g, '\\"'); // too complex
}
