import { exit, openStdin } from 'process';
import initServer from './server';

const stdin = openStdin();
console.clear();
console.log('Please enter how many drugs do you want to scrapp in parallel, (we recommend no more than 5)');
console.log('Remember you can kill the process with ctrl+c');

stdin.addListener('data', (d) => {
    console.clear();
    const number = parseInt(d.toString().trim());
    initServer(number).then(() => {
        console.log('Scrapping process finishied, you can find all the recors in the drugs folder.');
        exit(0);
    }).catch(e => {
        console.error('app crashed, unhandled exception');
        console.error(e);
        exit(0);
    });
});
