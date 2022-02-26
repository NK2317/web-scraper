import fs from 'fs';

//Prints the drug information in a new text file
export function printDrug(baseDir: string, txt: string, sectionName: string): void {
    const dir = baseDir.replace('build/scraper', 'drugs');
    const drugName = sectionName
        .replace('/', '')
        .replace(/\//g, '_')
        .replace('.html', '');
    const fileName = `${dir}/${drugName}.txt`;
    fs.writeFile(fileName, txt, (err: any) => {
        if (err) {
            console.error(err);
        }
        console.log(`\nDrug: ${drugName} scrapped!`);
    });
}

type ResolverParamType = {
    drug: string,
    promise: Promise<any>
}

type ResolverReturnType = {
    data: any,
    drug: string
}
// resolve a promise (get the drug information) and returns an object with the corresponding data
export async function promiseResolver({ drug, promise }: ResolverParamType): Promise<ResolverReturnType> {
    try {
        const data = await promise;
        return { data, drug };
    } catch (e) {
        console.error(e);
        return { data: false, drug };
    }
}

// slice an array in pices and return a new array with slices of the original
// slicer(2, [1,2,3,4]) returns [[1,2], [3,4]];
export function slicer(cutEvery: number, array: Array<any>): Array<any> {
    const pices = [];
    let currentArray = [];
    for (let i = 0; i < array.length; i++) {
        if ((i + 1) % cutEvery === 0) {
            currentArray.push(array[i]);
            pices.push(currentArray);
            currentArray = [];
        } else {
            currentArray.push(array[i]);
            if (!array[i +1]) {
                pices.push(currentArray);
            }
        }
    }
    return pices;
}
