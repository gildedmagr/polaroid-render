const puppeteer = require("puppeteer");
const placeholdify = require('placeholdify');
const fs = require('fs');

const polaroidRenderPage = 'https://{0}/index.php?route=polaroid/polaroid/renderPolaroid&uid={1}&page={2}&type={3}';
let domains = fs.readFileSync(process.env.DOMAINS_DICT_PATH || 'domains.json');
let domainsMap = JSON.parse(domains);

const startRender = async (domain, uid, pages, type) => {
    const start = Date.now();
    const destinationPath = `${domainsMap[domain]}/image/polaroid/${uid}`;
    if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
    }
    const browserWidth = type === 'polaroid' ? 2040 : 1520;
    const browserHeight = type === 'polaroid' ? 3040 : 1870;
    await (async () => {
        const browser = await puppeteer.launch(
            {
                headless: true,
                ignoreHTTPSErrors: true,
                args: [
                    `--window-size=${browserWidth},${browserHeight}`,
                    '--no-sandbox'
                ],
                defaultViewport: {
                    width: browserWidth,
                    height: browserHeight
                }
            }
        );
        const page = await browser.newPage();

        for (let i = 0; i < pages; i++) {
            await page.goto(placeholdify(polaroidRenderPage, domain, uid, i, type));
            await page.screenshot({
                path: `${destinationPath}/${i}.jpg`,
                type: 'jpeg',
                quality: 100
            });
        }
        await browser.close();

    })();
    const end = Date.now();
    console.log(`Time Taken to execute = ${(end - start) / 1000} seconds`);

    return {'status': 'completed', 'pages': pages, 'time': `${(end - start) / 1000}`};
}

module.exports = {
    startRender
}