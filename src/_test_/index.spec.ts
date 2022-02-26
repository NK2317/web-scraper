import puppeteer from 'puppeteer';
import Scraper from '../scraper';
// test to build a new scraper instance
describe('Scrape test', () => {
    test('start scraper instance', async () => {
        const buildScrapper = async () => {
            try {
                const browser = await puppeteer.launch();
                return new Scraper(browser, 3);
            } catch (e) {
                return false;
            }
        }
        expect(await buildScrapper()).toBeInstanceOf(Scraper);
    })
})
