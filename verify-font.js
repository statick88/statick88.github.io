const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Navigate to the portfolio
  await page.goto('file:///Users/statick/apps/private/statick88.github.io/dist/index.html');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Take screenshot
  await page.screenshot({ path: 'font-verification.png', fullPage: true });
  console.log('Screenshot saved to: font-verification.png');
  
  // Get computed styles of body element
  const computedStyles = await page.evaluate(() => {
    const body = document.body;
    const styles = window.getComputedStyle(body);
    return {
      fontFamily: styles.fontFamily,
      fontSize: styles.fontSize
    };
  });
  
  console.log('\n=== Font Verification Results ===');
  console.log('Font-family:', computedStyles.fontFamily);
  console.log('Font-size:', computedStyles.fontSize);
  
  // Check if Fira Code is present
  const hasFiraCode = computedStyles.fontFamily.toLowerCase().includes('fira code');
  console.log('\n=== Verification Status ===');
  console.log('Fira Code font detected:', hasFiraCode ? 'YES' : 'NO');
  
  if (!hasFiraCode) {
    console.log('\nWarning: Fira Code font not found in font-family stack');
    console.log('Actual font-family:', computedStyles.fontFamily);
  }
  
  await browser.close();
})();
