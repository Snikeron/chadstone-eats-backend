const puppeteer = require('puppeteer');
const fs = require('fs')

void (async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://www.chadstone.com.au/dining');

        const Restaurants = [];
        const restaurant = '#content > div > div:nth-of-type(3) > div > section:nth-of-type(2) > div > div:nth-of-type(2) > div > div:nth-child(INDEX) > a > div:nth-child(2) > h4';

        const restaurantsDiv = await page.evaluate((sel) => {
            return document.querySelectorAll(sel).length;
            }, '#content > div > div:nth-of-type(3) > div > section:nth-of-type(2) > div > div:nth-of-type(2) > div > div');

        console.log(restaurantsDiv);
        
        for ( let i=1; i <=  restaurantsDiv; i++) {
            let restaurantSelector = restaurant.replace("INDEX", i);

            let restaurantName = await page.evaluate((sel) => {
                return document.querySelector(sel).textContent;
            }, restaurantSelector);

            console.log(restaurantName);

            Restaurants.push({
                id: i,
                Name: restaurantName
            });
        }

        fs.writeFile(`${__dirname}/../db.json`, JSON.stringify({
            Restaurants
        }), (err) => {
            if (err) throw err;
            console.log(`${Restaurants.length} items written to JSON`);
        });

        await browser.close();
    } catch (error) {
        console.log(error);
    }
})();