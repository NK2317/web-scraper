
import { Browser, Page } from 'puppeteer';
import { printDrug, promiseResolver, slicer } from '../util';

/*  here is the scrapping loginc, the instance of this class
    recives a browser and the number of request to handle in parallel.
*/
export default class Scraper {
    private readonly browser: Browser;
    private readonly alphaSections: string = 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,0-9';
    private readonly siteURL: string = 'https://www.drugs.com';
    private promisesInParallel: number = 1;

    constructor(browser: Browser, promisesInParallel: number) {
        this.browser = browser;
        this.promisesInParallel = promisesInParallel;
    }

    // returns a page with the targeted url
    async scanPage(section: string): Promise<Page> {
        const url: string = `${this.siteURL}${section}`;
        const page: Page = await this.browser.newPage();
        await page.goto(url);
        return page;
    }

    // returns the drug-list based on some letter - term (example a, b, c, '1-9')
    async scrapDrugListByLink(linkName: string): Promise<string[]> {
        const page: Page = await this.scanPage(linkName);
        const content: string[] = await page.evaluate(() => {
            const target = 'ul[class="ddc-list-column-2"]';
            const list = document.querySelector(target)?.getElementsByTagName('a') || [];
            const urls = [];
            for (const a of list) {
                urls.push(a.attributes['0'].value);
            }
            return urls;
        });
        await page.close();
        return content || [];
    }

    //scraps a drug page and returns the related dosage content
    async scrapDrug(linkName: string): Promise<string[]> {
        const page: Page = await this.scanPage(linkName);
        const content: string[] = await page.evaluate(() => {
            let currentElement = document.querySelector('#dosage')?.nextElementSibling;
            const sections = [];
            while(currentElement?.tagName === 'P') {
                sections.push(currentElement.innerHTML);
                currentElement = currentElement.nextElementSibling;
            }
            return sections;
        });
        await page.close();
        return content || [];
    }

    //prints in parallel the sections given.
    async printDrugsSections(sections: string[]): Promise<void> {
        let baseDir: string = __dirname;
        const promises = sections.map( section => 
            promiseResolver({
                promise: this.scrapDrug(section),
                drug: section
            })
        )
        const res = await Promise.all(promises);
        for (const section of res) {
            const { data, drug } = section;
            const text: string = data.join('\n\n');
            printDrug(baseDir, text, drug);
        }
    }

    //start scrapping!
    async start(): Promise<void> {
        for (const letter of this.alphaSections.split(',')) {
            try {
                const dict: string[] = await this.scrapDrugListByLink(`/alpha/${letter}.html`);
                const sliced = slicer(this.promisesInParallel, dict);
                for (const pice of sliced) {
                    await this.printDrugsSections(pice);
                }
            } catch (e) {
                console.error(`ERROR SCRAPPING PAGE: ${this.siteURL}/alpha/${letter}.html`);
                console.error(e);
            }
        }
    }

    async stop(): Promise<number> {
        this.browser.close();
        return 0;
    }
}
