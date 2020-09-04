const loadPageChrome = require('./launch_chrome.js');
let chromeLauncher = require('chrome-launcher');
let fs = require('fs');
var sleep = require('sleep');
const { exec } = require('child_process');

function getWebsites(fileName){
    
    var array = fs.readFileSync(fileName, 'utf8').toString().split('\n');
    return array;
}
function getRandomNum(){
    let lowerBound = 1;
    let upperBound = 300;
    let num = Math.floor(Math.random() * (upperBound - lowerBound) + lowerBound);
    return num;
}
async function openChrome(){
    //only works for python
    // var { PythonShell } = require('python-shell');
    
    // PythonShell.run('openChrome.py', function (err, results) {
    //     if (err) throw err;
    // });
    // var sleep = require('sleep');
    // //sleep for 2 seconds 
    // sleep.sleep(2); 
    let userNum = getRandomNum();

    let launchObject = {
        port: 9222,
        chromeFlags: [
        `--user-data-dir=./chrome_users/${userNum}`,
        // `--user-data-dir=./chrome_users/2`,
        '--no-first-run', 
        '--no-default-browser-check',
        
        ]
        };
    let chrome = await chromeLauncher.launch(launchObject);
    return chrome;
}
function closeChrome(){
    //can use js here to close chrome instance
    
    let closeCMD = 'pkill Chrome';


    exec(closeCMD, (err, stdout, stderr) => {
        if (err) {
            //some err occurred
            console.error(err)
        } else {
            // the *entire* stdout and stderr (buffered)
            console.log(`stdout: ${stdout}`);
            
        }
        });

}


async function launchWebsites(page_urls){
        
    let info = [];
    
    let fileName = './loadTimes/archiveISLoadTimes.txt';
    for(let i = 0; i < page_urls.length; ++i){
        try{
            let chrome = await openChrome();        
            // console.log('new page');
            let res = await loadPageChrome.data.loadPage(page_urls[i],fileName);
            info.push(res);
            // console.log('post page');
            closeChrome();
            let sleepTime = 2;
            sleep.sleep(sleepTime); 
            fs.appendFile(fileName,res,err =>{
                if(err) return console.log(err)
            });
            console.log(`${i} completed`);
        } catch (err){
            console.log(err);
        }
    }   
    // for(line of info){
    //     fs.appendFile(fileName,line, err =>{
    //         if(err) return console.log(err);
    //     });
    // }
    process.exit(0);
    // closeChrome();
    
}
function main(){
    fileName = './tmp/arquivoURLS.txt';
    page_urls = getWebsites(fileName);
    launchWebsites(page_urls);
}
main();
    

    
