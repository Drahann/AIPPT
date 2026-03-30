import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const workspaceRoot = path.resolve(process.cwd(), "..");
const specificStylesRoot = path.join(workspaceRoot, "specific styles");
const figmaSlidesRoot = path.join(workspaceRoot, "figma-slides");
const overrideRoot = path.join(process.cwd(), "scripts", "figma-screenshot-overrides");
const outputName = "figma-screenshot.png";

const googleFontsHref =
  "https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;600&family=Cutive+Mono&family=IBM+Plex+Serif:wght@400;500;600&family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Radio+Canada+Big:wght@400;500;600;700&family=Rethink+Sans:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,300;400;600&family=Work+Sans:wght@400;500;600;700&display=swap";

async function walk(dir, matcher) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await walk(fullPath, matcher)));
      continue;
    }
    if (!matcher || matcher(fullPath)) {
      results.push(fullPath);
    }
  }
  return results;
}

async function collectSpecificStyleTargets() {
  const mdFiles = await walk(
    specificStylesRoot,
    (filePath) =>
      filePath.endsWith(".md") &&
      !filePath.includes(`${path.sep}assets${path.sep}`) &&
      path.dirname(filePath) !== specificStylesRoot,
  );

  const targets = [];
  for (const filePath of mdFiles) {
    const content = await fs.readFile(filePath, "utf8");
    const match = content.match(/Figma 节点 `(\d+:\d+)`/);
    if (!match) {
      continue;
    }
    targets.push({
      mdPath: filePath,
      folder: path.dirname(filePath),
      nodeId: match[1],
      outputPath: path.join(path.dirname(filePath), outputName),
    });
  }

  targets.sort((a, b) => a.nodeId.localeCompare(b.nodeId, "en"));
  return targets;
}

async function buildSlideSourceIndex() {
  const mdFiles = await walk(figmaSlidesRoot, (filePath) => filePath.endsWith(".md"));
  const index = new Map();
  for (const filePath of mdFiles) {
    const baseName = path.basename(filePath, ".md");
    const match = baseName.match(/^slide-(\d+)-(\d+)$/);
    if (!match) {
      continue;
    }
    index.set(`${match[1]}:${match[2]}`, filePath);
  }
  return index;
}

function extractTsx(codeMarkdown) {
  const match = codeMarkdown.match(/```tsx\r?\n([\s\S]*?)```/);
  return match ? match[1].trim() : null;
}

async function loadRenderableSource(sourcePath) {
  const raw = await fs.readFile(sourcePath, "utf8");
  if (sourcePath.endsWith(".tsx")) {
    return raw.trim();
  }
  return extractTsx(raw);
}

function normalizeFontTokens(tsx) {
  const replacements = [
    [/Crimson_Pro:[A-Za-z]+/g, "Crimson Pro"],
    [/Rethink_Sans:[A-Za-z]+/g, "Rethink Sans"],
    [/Source_Serif_Pro:[A-Za-z]+/g, "Source Serif 4"],
    [/Radio_Canada_Big:[A-Za-z]+/g, "Radio Canada Big"],
    [/Work_Sans:[A-Za-z]+/g, "Work Sans"],
    [/Cutive_Mono:[A-Za-z]+/g, "Cutive Mono"],
    [/IBM_Plex_Serif:[A-Za-z]+/g, "IBM Plex Serif"],
    [/Plus_Jakarta_Sans:[A-Za-z]+/g, "Plus Jakarta Sans"],
    [/Inter:[A-Za-z]+/g, "Inter"],
    [/Geist_Mono:[A-Za-z]+/g, "ui-monospace"],
    [/Geist:[A-Za-z]+/g, "system-ui"],
    [/_/g, " "],
  ];

  let result = tsx;
  for (const [pattern, replacement] of replacements) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

function rewriteAssetConstants(tsx, slideDir) {
  return tsx.replace(
    /const\s+([A-Za-z0-9_]+)\s*=\s*["']\.\/([^"']+)["'];/g,
    (_whole, varName, relPath) => {
      const assetUrl = pathToFileURL(path.join(slideDir, relPath)).href;
      return `const ${varName} = ${JSON.stringify(assetUrl)};`;
    },
  );
}

function rewriteExports(tsx) {
  return tsx
    .replace(/export\s+default\s+function\s+Frame/g, "function Frame")
    .replace(/export\s+default\s+Frame\s*;?/g, "");
}

function buildHtmlDocument(tsx, title) {
  const safeTitle = title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, initial-scale=1.0" />
    <title>${safeTitle}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="${googleFontsHref}" rel="stylesheet" />
    <script>
      tailwind = {
        config: {
          theme: {
            extend: {}
          }
        }
      };
    </script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
      html, body {
        margin: 0;
        padding: 0;
        width: 1920px;
        height: 1080px;
        overflow: hidden;
        background: transparent;
      }
      body {
        font-family: Inter, system-ui, sans-serif;
      }
      #root {
        width: 1920px;
        height: 1080px;
      }
      #root > * {
        width: 1920px;
        height: 1080px;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/babel" data-presets="react">
      ${tsx}
      const root = ReactDOM.createRoot(document.getElementById("root"));
      root.render(React.createElement(Frame));
    </script>
  </body>
</html>`;
}

async function renderTarget(browser, target, sourcePath) {
  const extractedTsx = await loadRenderableSource(sourcePath);
  if (!extractedTsx) {
    throw new Error(`No tsx block found in ${sourcePath}`);
  }

  const slideDir = path.dirname(sourcePath);
  const tsx = rewriteExports(rewriteAssetConstants(normalizeFontTokens(extractedTsx), slideDir));
  const html = buildHtmlDocument(tsx, `${target.nodeId} preview`);
  const htmlPath = path.join(slideDir, "__preview-export.html");
  await fs.writeFile(htmlPath, html, "utf8");

  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080, deviceScaleFactor: 1 },
  });

  try {
    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
    await page.waitForFunction(() => {
      const root = document.getElementById("root");
      return !!root && root.children.length > 0;
    });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: target.outputPath, type: "png" });
  } finally {
    await page.close();
    await fs.rm(htmlPath, { force: true });
  }
}

async function main() {
  const targets = await collectSpecificStyleTargets();
  const sourceIndex = await buildSlideSourceIndex();
  const overrideIndex = new Map([
    ["2:75", path.join(overrideRoot, "2-75.tsx")],
    ["2:97", path.join(overrideRoot, "2-97.tsx")],
  ]);
  const missing = [];
  const manifest = [];

  const browser = await chromium.launch();
  try {
    for (const target of targets) {
      const sourcePath = sourceIndex.get(target.nodeId) ?? overrideIndex.get(target.nodeId);
      if (!sourcePath) {
        missing.push({
          nodeId: target.nodeId,
          folder: target.folder,
          reason: "No matching figma-slides source markdown found",
        });
        continue;
      }

      try {
        await renderTarget(browser, target, sourcePath);
        manifest.push({
          nodeId: target.nodeId,
          folder: target.folder,
          sourcePath,
          outputPath: target.outputPath,
          status: "ok",
        });
        console.log(`OK  ${target.nodeId} -> ${target.outputPath}`);
      } catch (error) {
        missing.push({
          nodeId: target.nodeId,
          folder: target.folder,
          sourcePath,
          reason: error instanceof Error ? error.message : String(error),
        });
        console.log(`ERR ${target.nodeId} -> ${target.folder}`);
      }
    }
  } finally {
    await browser.close();
  }

  const reportPath = path.join(specificStylesRoot, "figma-screenshot-export-report.json");
  await fs.writeFile(
    reportPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        outputName,
        totalTargets: targets.length,
        exported: manifest.length,
        failed: missing.length,
        manifest,
        missing,
      },
      null,
      2,
    ),
    "utf8",
  );

  if (missing.length > 0) {
    console.error(`Completed with ${missing.length} failures. See ${reportPath}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Exported ${manifest.length} screenshots. Report: ${reportPath}`);
}

await main();
