import fs from 'fs';
import { parseDocx } from './src/lib/parser/docx-parser';

async function test() {
  const files = fs.readdirSync('.').filter(f => f.endsWith('.docx'));
  if (files.length === 0) {
    console.log('No docx files found in current directory for testing.');
    return;
  }

  for (const file of files) {
    console.log(`\nTesting file: ${file}`);
    const buffer = fs.readFileSync(file);
    const { chunks } = await parseDocx(buffer);
    
    chunks.forEach(chunk => {
      console.log(`Chunk ${chunk.order} (${chunk.heading}):`);
      if (chunk.tables) {
        console.log('  [TABLES FOUND]:');
        chunk.tables.forEach((t, i) => console.log(`  Table ${i}: ${t.substring(0, 100)}...`));
      } else {
        console.log('  [No tables found]');
      }
    });
  }
}

test().catch(console.error);
