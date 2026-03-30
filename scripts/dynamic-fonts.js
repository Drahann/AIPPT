const fs = require('fs');
const path = require('path');

const directories = [
  'group-01', 'group-02', 'group-03', 'group-04', 'group-05',
  'group-06', 'group-07', 'group-08', 'group-09', 'group-10'
];

const filesToProcess = ['cover.tsx', 'section-header.tsx', 'quote.tsx', 'ending.tsx'];

const basePath = path.join(__dirname, '../src/lib/templates');

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  if (!content.includes("import { fitText }")) {
    content = content.replace("import { FigmaSlideProps } from '../index'", "import { FigmaSlideProps } from '../index'\nimport { fitText } from '@/lib/utils/text-fit'");
  }

  // Find all instances of `fontSize: (\d+)`
  content = content.replace(/fontSize:\s*(\d+)/g, (match, sizeStr) => {
    const size = parseInt(sizeStr);
    if (size >= 40) {
      return `fontSize: fitText(${size}, props)`;
    }
    return match;
  });

  // Replace component signature, handling newlines
  content = content.replace(/export default function (\w+)\(\{\s*([\s\S]*?)\s*\}\s*:\s*FigmaSlideProps\)\s*\{/, "export default function $1(props: FigmaSlideProps) {\n  const { $2 } = props;");

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('Processed', filePath);
  }
}

for (const dir of directories) {
  for (const file of filesToProcess) {
    processFile(path.join(basePath, dir, file));
  }
}

console.log('Done!');
