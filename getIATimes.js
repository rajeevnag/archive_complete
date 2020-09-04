
// function getIAURL(iaURL){
const loadPageChrome = require('./launch_chrome.js');
let chromeLauncher = require('chrome-launcher');
let fs = require('fs');
var sleep = require('sleep');
const util = require('util');
const http = require('http');
const request = require('request');
const syncReq = require('sync-request');
const { exec } = require('child_process');


const { url } = require('inspector');
const { timeStamp } = require('console');
const { sync } = require('mkdirp');

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
// async function chromeStuff(URL){
//     const loadPageChrome = require('./launch_chrome.js');

//     return new Promise(resolve =>{
//         loadPageChrome.data.loadPage(URL,"./loadTimes/IA-loadtimes.txt");
//     });
    
// }
async function doLaunch(url){
    return new Promise(async (resolve,reject) =>{
        let chrome = await openChrome();  
        resolve(chrome);
        
    })
}

async function launchWebsites(page_url){
    
    // console.log(page_urls);
    
    const CDP = require('chrome-remote-interface');
    
    let info = [];
    try{
        let fileName = './loadTimes/IA-loadtimes.txt';
        // for(let i = 0; i < page_urls.length; ++i){
            try{
                let chrome = await doLaunch(page_url);
                // let chrome = await openChrome();  
                // console.log('new page');
                let res = await loadPageChrome.data.loadPage(page_url,fileName);
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
            
            
        // }   
        // console.log(info);
        
        // for(line of info){
        //     fs.appendFile(fileName,line, err =>{
        //         if(err) return console.log(err);
        //     });
        // }
        process.exit(0);
        // closeChrome();
    } catch (err){
        console.log(err);
    }
    
    

    
}
// async function doReq(URL){
    // return new Promise( (resolve,reject) =>{
    //     let res = request(URL);
    //     res.on("response", response =>{
    //         resolve(response);
    //     });
    //     res.on('error',response=>{
    //         reject(response);
    //     });
    // })
    // return new Promise((resolve, reject) => {
    //     request(URL, (error, response, body) => {
    //         if (error) reject(error);
    //         if(response == null){
    //             reject('no repsonse');
    //         }
    //         // if (response.statusCode != 200) {
    //         //     reject('Invalid status code <' + response.statusCode + '>');
    //         // }
    //         console.log('in request');
    //         console.log(response);
    //         resolve(body);
    //     });
    // });
// }

async function parseResponseWEBARCHIVE(URL,website,page_urls,urlSIZE,i){ // for web.archive.org
    
    // const httpPromise = util.promisify(http);
    // const rp = require('request-promise');
    try{
        // let res = await doReq(URL);
        let res = syncReq('GET',URL);
        
        // console.log(res);
        let body = res.getBody('utf-8');
        // console.log(body);
        sleep.sleep(1);
        
        let jsonBody = JSON.parse(body);
       
        let timeStamp = jsonBody[1][1];
        // console.log(`${i}: ${timeStamp}`);
        let pageURL = `https://web.archive.org/web/${timeStamp}/${website}`;
        page_urls.push(pageURL);
        
        console.log(i);
    }
    catch(err){
        console.log(err);
    }
    
    

    // const { statusCode } = res;
    // const contentType = res.headers['content-type'];
    
    // let error;
    // if (statusCode !== 200) {
    //     error = new Error('Request Failed.\n' +
    //                     `Status Code: ${statusCode}`);
    // } else if (!/^application\/json/.test(contentType)) {
    //     error = new Error('Invalid content-type.\n' +
    //                     `Expected application/json but received ${contentType}`);
    // }
    // if (error) {
    //     console.error(error.message);
    //     // Consume response data to free up memory
    //     res.resume();
    //     return;
    // }

    // res.setEncoding('utf8');
    // let rawData = '';
    // res.on('data', (chunk) => { rawData += chunk; });
    // res.on('end', () => {
    //     try {
    //         console.log(i);
    //         ++global.count;
    //         const parsedData = JSON.parse(rawData);
    //         // console.log(parsedData);
    //         //first construct proper URL from JSON data
                
    //         //sample URL for internet archive page
    //         // https://web.archive.org/web/20100818080605/http://www.nytimes.com/
            
    //         //code for multiple page loads
    //         // for(let i = 1; i < 3; ++i){ //2 timestamps
    //         //     let pageURL = `https://web.archive.org/web/${parsedData[i][1]}/${website}`;
    //         //     page_urls.push(pageURL);
    //         // }
    //         let pageURL = `https://web.archive.org/web/${parsedData[1][1]}/${website}`;
    //         page_urls.push(pageURL);

    //         // const pageURL = `https://web.archive.org/web/${parsedData[1][1]}/${website}`;
            
    //         if(global.count == urlSIZE){
    //             // console.log(page_urls);
    //             launchWebsites(page_urls);
                
    //         }
        
        

    //     } catch (e) {
    //         console.error(e.message);
    //     }
    //     });


    // http.get(URL, (res) => {
        
    //     })
    //     .on('error', (e) => {
    //         console.error(`Got error: ${e.message}`);
    //     });
}

function getWebsites(){
    let fs = require('fs');
    var array = fs.readFileSync('./txtfiles/IAandArquivoSites200.txt', 'utf8').toString().split('\n');
    return array;
}



async function main(){
    let iaURL = 'http://web.archive.org/cdx/search/cdx?'; //internet archive URL 
    // iaURL = getIAURL(iaURL);
    
    // let temp_url = 'http://web.archive.org/cdx/search/cdx';
    
    
    // let urls = ['http://www.nytimes.com'];
    let urls = [];
    urls = getWebsites(urls);
    page_urls = [];
    global.count = 0;
    limit = 10
    for(let i = 0; i < urls.length; ++i){
        
        var apiEndPoint = `${iaURL}url=${urls[i]}&output=json&limit=${limit}&from=2000`;
        // console.log(apiEndPoint);
        
        parseResponseWEBARCHIVE(apiEndPoint,urls[i],page_urls,urls.length,i);
        console.log(`get request ${i}`);
        
        

    }
    
    var filename = './tmp/IAURLS.txt';
    for(line of page_urls){
        line += '\n';
        fs.appendFile(filename,line, err =>{
            if(err) return console.log(err);
        });
    }
    console.log('done');
    // let arr = ['https://web.archive.org/web/20000229081303/http://www.vox.com', 'https://web.archive.org/web/20000510173740/http://www.vox.com', 'https://web.archive.org/web/20000301035207/http://www.stackoverflow.com', 'https://web.archive.org/web/20000622023239/http://www.stackoverflow.com', 'https://web.archive.org/web/20000229084655/http://www.bloomberg.com', 'https://web.archive.org/web/20000229084655/http://www.bloomberg.com'];
    // launchWebsites(arr);
}



main();


// var apiEndPoint = `${temp_url}?url=${urls[0]}&output=json&limit=10&from=2010`;
// console.log(apiEndPoint);
// parseResponse(apiEndPoint,urls[0]);