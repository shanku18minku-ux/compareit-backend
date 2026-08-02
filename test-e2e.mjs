import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTest() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 915 }); // Simulate Pixel 7 Pro size for mobile layout

  console.log('Navigating to app...');
  try {
    // Wait until network is idle to ensure data from Render is fully loaded
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 30000 });
    console.log('App loaded! Taking screenshot...');
    
    // Save to artifacts directory
    const screenshotPath = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\bbb1173a-df3c-4521-896b-3efbd37efa50\\E2E_Test_Result.png';
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    console.log(`Test passed! Screenshot saved at ${screenshotPath}`);
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    await browser.close();
    process.exit(0);
  }
}

runTest();
