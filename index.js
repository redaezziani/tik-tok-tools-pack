import puppeteer from 'puppeteer';
import userAgent from 'user-agents';


(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.setUserAgent(userAgent.random().toString());
    await page.goto('https://www.tiktok.com/@coachzoubir');
    await page.setViewport({
        width: 1200,
        height: 800
    });

    await autoScroll(page);
    const elements = await GetAllElementBySelector(page, '.');

    for (const element of elements) {
        const aTag = await page.evaluate(element => {
            return element.parentElement; // Get the <a> tag containing the element
        }, element);
        console.log(await page.evaluate(aTag => aTag.outerHTML, aTag));
    }

    await page.screenshot({
        path: 'yoursite.png',
        fullPage: true
    });

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
