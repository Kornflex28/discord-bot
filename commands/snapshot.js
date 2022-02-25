require('dotenv').config();
const puppeteer = require('puppeteer');
const webarchive_url = 'https://web.archive.org/save/';

module.exports = {
    name: 'snapshot',
    description: 'Créer une snapshot d\'une URL',
    args: true,
    usage: '<url>',
    async execute(message, args) {
        let page_url = args[0];
        // console.log(`Snapshot of ${page_url}`)
        const browser = await puppeteer.launch({
            headless: true
        });
          const page = await browser.newPage();
          await page.setDefaultNavigationTimeout(0); 
          await page.goto(webarchive_url);
          await page.type('[id="web-save-url-input"]', page_url);
          await page.click('.web-save-button');
          await page.waitForTimeout(1000*2)
          await browser.close();
    }
}
