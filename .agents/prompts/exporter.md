# Exporter Subagent Task: Native PPTX Hard Line-Break Engine

## Role & Model Selection
- **Role**: PPTX Exporter & Coordinates Engineer
- **Recommended Model**: High-capability logic model (due to complex geometric math and PPTXGenJS APIs).

## Context
Currently, the `universal-exporter.ts` takes absolute DOM positions (`x, y, w, h`) and uses `pptxgenjs` to write text boxes. However, PPTXGenJS's native `wrap: true` feature causes slight inconsistencies in line breaks compared to the Chrome/Web rendering.

## Task Domain
You will ONLY modify `src/lib/export/universal-exporter.ts`. Do NOT modify frontend CSS or the backend generation logic. You will rely on the `pretext` library.

## Specific Instructions
1. **Pretext Integration in Exporter**:
   - Before calling `slide.addText()`, check if the string is longer than a single sentence.
   - Call `pretext.layoutWithLines(text, fontStr, width)` (matching the exact font family, size and width retrieved from the DOM snapshot).
2. **Coordinate Matrix Overriding**:
   - Disable `wrap: true` in the `pptxgenjs.addText` config.
   - Map the returned Pretext line breaks `\n` into the PPTX text string OR create independent `shape: 'rect'` text containers for EACH line with the exact `y` coordinates computed by pretext.
   - (Note: if `\n` works perfectly, just insert `\n` at the exact cut-points determined by pretext).
3. **Fidelity Verification**:
   - Ensure you handle font scaling (`FONT_SCALE`) adjustments faithfully before passing `width` to pretext.

## Expected Output
Generate a test `.pptx` and confirm that line wrapping accurately reflects exactly how pretext breaks the line visually. Return a short breakdown of the `addText` rewrite logic.
