function parseColor(colorStr) {
    if (!colorStr) return { hex: '000000', alpha: 1 };
    
    // Handle rgb/rgba
    if (colorStr.includes('rgb')) {
        const parts = colorStr.match(/[\d.]+/g);
        if (!parts) return { hex: '000000', alpha: 1 };
        const hex = parts.slice(0, 3).map(x => Math.round(parseFloat(x)).toString(16).padStart(2, '0')).join('').toUpperCase();
        const alpha = parts[3] ? parseFloat(parts[3]) : 1;
        return { hex, alpha };
    }
    
    // Handle color(srgb R G B / A)
    if (colorStr.includes('srgb')) {
        const parts = colorStr.match(/(\d+\.?\d*)/g);
        if (!parts || parts.length < 3) return { hex: '000000', alpha: 1 };
        const hex = parts.slice(0, 3).map(x => Math.round(parseFloat(x) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
        const alpha = parts[3] ? parseFloat(parts[3]) : 1;
        return { hex, alpha };
    }
    
    return { hex: '000000', alpha: 1 };
}

const testStrings = [
    "color(srgb 1 1 1 / 0.92)",
    "color(srgb 0 0 0 / 0.38)",
    "rgb(255, 255, 255)",
    "rgba(0, 0, 0, 0.5)",
    "color(srgb 0.423529 0.423529 0.423529 / 0.92)"
];

testStrings.forEach(s => {
    const res = parseColor(s);
    console.log(`Input: ${s}`);
    console.log(`Hex: ${res.hex}, Alpha: ${res.alpha}, Transparency: ${Math.round((1 - res.alpha)*100)}`);
    console.log('---');
});
