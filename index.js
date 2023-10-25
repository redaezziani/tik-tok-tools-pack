import userAgent from 'user-agents';
import puppeteerExtra from 'puppeteer-extra';
import Stealth from 'puppeteer-extra-plugin-stealth';
import fs  from 'fs';

puppeteerExtra.use(Stealth());

(async () => {
    const browser =  await puppeteerExtra.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setUserAgent(userAgent.random().toString());
    await page.goto('https://www.tiktok.com/@chabb___');
    await page.setViewport({
        width: 1200,
        height: 800
    });

    await autoScroll(page);
    const elements = await GetAllElementBySelector(page, 'div.tiktok-x6y88p-DivItemContainerV2');
    const propertyValues = [];
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const elementHandle = await element.$('a');
        const propertyHandle = await elementHandle.getProperty('href');
        const propertyValue = await propertyHandle.jsonValue();
        propertyValues.push(propertyValue);
    }
    await saveToTextFile(propertyValues);
    await page.screenshot({
        path: 'yoursite.png',
        fullPage: true
    });
    console.log('done');
    await browser.close();
})();

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

const GetAllElementBySelector = async (page, selector) => {
    const elements = await page.$$(selector);
    return elements;
}

const saveToTextFile = async (data) => {
    fs.writeFile('data.txt', data.join('\n'), function (err) {
        if (err) return console.log(err);
        console.log('Data has been saved to data.txt');
    });
}