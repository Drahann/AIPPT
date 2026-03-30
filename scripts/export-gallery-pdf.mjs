import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function exportGallery() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const packId = 'group-04'; // Theme 4
  const url = `http://localhost:3000/gallery/export?packId=${packId}`;
  
  console.log(`Navigating to ${url}...`);
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    
    // Wait for all slides to render
    await page.waitForSelector('.slide-container');
    
    // Give some time for animations (framer-motion) to settle
    await page.waitForTimeout(2000);
    
    const outputPath = path.join(process.cwd(), `gallery-theme-04.pdf`);
    
    console.log(`Generating PDF: ${outputPath}...`);
    await page.pdf({
      path: outputPath,
      width: '960px',
      height: '540px',
      printBackground: true,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    });
    
    console.log('PDF export successful!');
  } catch (err) {
    console.error('Export failed:', err);
  } finally {
    await browser.close();
  }
}

exportGallery();
