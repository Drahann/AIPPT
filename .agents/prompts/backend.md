# Backend Subagent Task: Pretext Measurement Engine & AI Feedback Loop

## Role & Model Selection
- **Role**: Backend Node.js / AI Pipeline Engineer
- **Recommended Model**: High-capability logic model (e.g., GPT-4o, Claude-3.5-Sonnet) due to critical AI loop integration.

## Context
We are upgrading AIPPT to a "Content-Driven Typographic Engine" using `@chenglou/pretext`. The frontend will rely on a decoupled typographic scale (`H1~H3`, `B1~B4`) supplied by the backend.

## Task Domain
You are responsible ONLY for the backend text measurement logic and AI generation validation loop.
Do NOT touch CSS or React frontend rendering.

## Specific Instructions
1. **Dependency**: Install `@chenglou/pretext`.
2. **Measurement Utility (`src/lib/utils/pretext-engine.ts`)**:
   - Create a service that initializes Pretext fonts.
   - Define the Typographic Scale constants for `Heading` (H1: 24, H2: 22, H3: 20) and `Body` (B1: 16, B2: 14, B3: 13, B4: 12).
   - Implement `calculateOptimalTypo(text, type, maxWidth, maxHeight)` which steps down from Tier 1 to lowest Tier until `text` fits the box. Returns the fitted tier (e.g., `"B2"`).
3. **Bounding Box Data (`src/lib/layout-specs.ts`)**:
   - Update 28 template definitions to include `bounds: { title: {w,h}, body: {w,h} }` representing absolute pixels assuming a 1920x1080 canvas.
4. **AI Generation Hook (`src/lib/ai/slide-gen.ts`)**:
   - After receiving the JSON from the LLM, iterate through text fields.
   - Run the Pretext utility against the defined bounding box.
   - If even `H3` or `B4` overflows, trigger a secondary fast LLM call to compress the specific text field.
   - Mutate the slide JSON to inject `typographyParams: { headingLevel, bodyLevel }`.

## Expected Output
Complete the implementation and run tests. Reply with a summary of the backend system architecture you've established.
