import puppeteer from 'puppeteer';
import Scraper from '../scraper';
import { Spinner } from 'cli-spinner';

export default async function initServer(requestInParallel: number) {
    const spinner = new Spinner('starting browser.. %s');
    spinner.setSpinnerString('|/-\\');
    spinner.start();
    try {
        const browser = await puppeteer.launch();
        spinner.stop();
        console.clear();
        console.log('Scrapping process started!');
        const scrapper = new Scraper(browser, requestInParallel);
        await scrapper.start();
        await browser.close();
    } catch (e) {
        console.error('Promgram crashed');
        console.error(e);
    } finally {
        spinner.stop();
    }
}
