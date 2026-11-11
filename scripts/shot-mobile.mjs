// Temporary: screenshots of the live site at phone and tablet widths, one Chrome, one page at a time.
import fs from "node:fs";
import puppeteer from "puppeteer-core";

const chrome = ["C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"].find((p) => fs.existsSync(p));
const out = process.argv[2];
const shots = [
  { name: "phone-home", url: "https://diyama.online/", w: 390, h: 844 },
  { name: "phone-build", url: "https://diyama.online/build", w: 390, h: 844 },
  { name: "tablet-home", url: "https://diyama.online/", w: 820, h: 1180 },
];
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ["--no-sandbox", "--disable-gpu", "--renderer-process-limit=1"] });
try {
  for (const s of shots) {
    const page = await browser.newPage();
    await page.setViewport({ width: s.w, height: s.h, deviceScaleFactor: 1, isMobile: s.w < 500, hasTouch: s.w < 500 });
    await page.goto(s.url, { waitUntil: "networkidle2", timeout: 60000 });
    // walk the page so whileInView animations have fired
    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < height; y += s.h / 2) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await new Promise((r) => setTimeout(r, 120));
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: `${out}/${s.name}.png`, fullPage: true });
    console.log(s.name, "height", await page.evaluate(() => document.body.scrollHeight));
    await page.close();
  }
} finally {
  await browser.close();
}
