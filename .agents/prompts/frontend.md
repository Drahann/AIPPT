# Frontend Subagent Task: Fluid CSS Refactoring & Content-Driven Layouts

## Role & Model Selection
- **Role**: Frontend React / CSS Expert
- **Recommended Model**: Standard model (excellent at CSS Variables and Flexbox/Grid).

## Context
We are abandoning rigid `max-height` and static `grid-columns` in AIPPT. The backend will now deliver a highly precise `{ typographyParams: { headingLevel: "H2", bodyLevel: "B1" } }` in the slide JSON, guaranteeing the text will fit inside the container visually.

## Task Domain
You are responsible ONLY for the frontend components and CSS architecture. Do NOT modify the Node.js backend generation pipelines or PPTX exporter.

## Specific Instructions
1. **CSS Variables Controller (`SlideRenderer.tsx` & Data mapping)**:
   - Accept the `typographyParams` from the slide data.
   - Map `H1~H3` and `B1~B4` into inline CSS variables (e.g., `--dynamic-heading-fs`, `--dynamic-body-fs`, `--dynamic-line-height`) on the root of each slide/card component.
2. **Remove Constraints (`src/styles/slide-layouts.css`)**:
   - Strip out ALL `max-height`, `overflow: hidden`, and `line-clamp` properties from `.slide-body` and `.card-body`. The text is virtually guaranteed to fit now.
3. **Fluid Layouts (Flex Basis & Masonry)**:
   - For `layout-cards-3`, `layout-staggered-cards`, swap `grid-template-columns: repeat(X, 1fr)` to a `flex` layout. Allow cards to take up `flex-basis: auto; flex-grow: var(--content-weight)` if the backend passes a custom weight based on token count.
   - For `layout-image-text`, allow the text container to be `fit-content` and the image container to absorb the remaining layout space `flex: 1`.
4. **Fluid Spacing**:
   - Update `padding` inside cards to use `clamp()` scaling based on the active body font size, ensuring small text retains tighter paddings.

## Expected Output
Verify the CSS renders perfectly with mock layout data injected with `H1/B2` variables. Provide a summary of affected CSS components.
