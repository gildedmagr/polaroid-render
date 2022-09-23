const puppeteer = require("puppeteer");
const placeholdify = require('placeholdify');
const fs = require('fs');
const {Image} = require('image-js');
const { emit } = require("./index");

const polaroidRenderPage = 'https://{0}/index.php?route=polaroid/polaroid/renderPolaroid&uid={1}&page={2}&type={3}';
const domains = fs.readFileSync(process.env.DOMAINS_DICT_PATH || 'domains.json');
const domainsMap = JSON.parse(domains);
const relativeDestinationPath = 'image/polaroid';
const isProd = process.env.NODE_ENV === 'production';

const startRender = async (domain, uid, pages, type) => {
    const start = Date.now();
    const destinationPath = `${domainsMap[domain]}/${relativeDestinationPath}/${uid}`;
    const links = [];
    if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, {recursive: true});
    }
    const browserWidth = type === 'polaroid' ? 2040 : 1520;
    const browserHeight = type === 'polaroid' ? 3040 : 1870;
    await (async () => {
        const browser = await puppeteer.launch(
            {
                executablePath: isProd ? '/usr/bin/google-chrome' : '',
                headless: true,
                ignoreHTTPSErrors: true,
                args: [
                    `--window-size=${browserWidth},${browserHeight}`,
                    '--no-sandbox',
                    '--disable-setuid-sandbox'
                ],
                dumpio: false,
                defaultViewport: {
                    width: browserWidth,
                    height: browserHeight
                }
            }
        );

        let copies = 1;

        const page = await browser.newPage();
        page.on('console', msg => {
            const message = msg.text();
            if (message.startsWith('copies:')) {
                copies = parseInt(msg.text().replace('copies:', ''));
            }
        });


        //const copies =3;
        for (let i = 0; i < pages; i++) {
            const url = placeholdify(polaroidRenderPage, domain, uid, i, type);
            console.log(`Going to create snapshot from: ${url}`);


            const destFile = `${destinationPath}/${i}.jpg`;
            await page.goto(url);
            await page.screenshot({
                path: destFile,
                type: 'jpeg',
                quality: 100
            });
            console.log('Snapshot has been created');
            if (copies > 1) {
                console.log(`Polaroid has ${copies} copies. Going to duplicate final image`);
                for (let copy = 1; copy < copies; copy++) {
                    const copyFile = `${destinationPath}/${i}_copy_${copy}.jpg`
                    fs.copyFileSync(destFile, copyFile);
                }
            }
            copies = 1;
            links.push(`https://${domain}/${relativeDestinationPath}/${uid}/${i}.jpg`);
        }
        await page.close();
        await browser.close();

    })();
    const end = Date.now();
    console.log(`Time Taken to execute = ${(end - start) / 1000} seconds`);

    return {'status': 'completed', 'pages': pages, 'images': links, 'time': `${(end - start) / 1000}`};
}

module.exports = {
    startRender
}