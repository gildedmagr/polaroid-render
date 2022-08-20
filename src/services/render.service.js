const puppeteer = require("puppeteer");
const placeholdify = require('placeholdify');
const fs = require('fs');

const polaroidRenderPage = 'https://{0}/index.php?route=polaroid/polaroid/renderPolaroid&uid={1}&page={2}';
let domains = fs.readFileSync(process.env.DOMAINS_DICT_PATH || 'domains.json');
let domainsMap = JSON.parse(domains);
console.log(domainsMap);

const renderPolaroid = async (domain, uid, pages) => {
    console.log(domainsMap[domain]);
    const start = Date.now();
    const destinationPath = `${domainsMap[domain]}/image/polaroid/${uid}`;
    if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
    }
    await (async () => {
        const browser = await puppeteer.launch(
            {
                headless: true,
                ignoreHTTPSErrors: true,
                args: [`--window-size=2040,3040`],
                defaultViewport: {
                    width: 2040,
                    height: 3040
                }
            }
        );
        const page = await browser.newPage();

        for (let i = 0; i < pages; i++) {
            await page.goto(placeholdify(polaroidRenderPage, domain, uid, i));
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

    return {'status': 'ok'};
}

module.exports = {
    renderPolaroid
}