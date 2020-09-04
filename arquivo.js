

const loadPageChrome = require('./launch_chrome.js');
let chromeLauncher = require('chrome-launcher');
let fs = require('fs');
var sleep = require('sleep');
var { PythonShell } = require('python-shell');

const { url } = require('inspector');
const { launch } = require('chrome-launcher');
    
function getRandomNum(){
    let lowerBound = 1;
    let upperBound = 300;
    let num = Math.floor(Math.random() * (upperBound - lowerBound) + lowerBound);
    return num;
}

async function openChrome(){
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
    const { exec } = require('child_process');
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
    
    console.log(page_urls);
    
    const CDP = require('chrome-remote-interface');
    
    let info = [];
    try{
        let fileName = './loadTimes/arquivoLoadTimes.txt';
        for(let i = 0; i < page_urls.length; ++i){
            
            let chrome = await openChrome();        
            console.log('new page');
            let res = await loadPageChrome.data.loadPage(page_urls[i],fileName);
            info.push(res);
            console.log('post page');
            closeChrome();
            let sleepTime = 2;
            sleep.sleep(sleepTime); 
            
        }   
        console.log(info);
        
        for(line of info){
            fs.appendFile(fileName,line, err =>{
                if(err) return console.log(err);
            });
        }
        // closeChrome();
    } catch (err){
        console.log(err);
    }
    
    

    
}

async function parseResponseWEBARCHIVE(URL,website,page_urls,urlSIZE){ // for web.archive.org
    const http = require('http');
    
    http.get(URL, (res) => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];
        
        let error;
        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                            `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
            error = new Error('Invalid content-type.\n' +
                            `Expected application/json but received ${contentType}`);
        }
        if (error) {
            console.error(error.message);
            // Consume response data to free up memory
            res.resume();
            return;
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
                parser = new DOMParser();
                xmlDoc = parser.parseFromString(txt, "text/xml");
                let temp = xmlDoc.getElementsByTagName("url")[0].childNodes[0].nodeValue;
                console.log(temp);

                ++global.count;
                
                
                //first construct proper URL from JSON data
                    
                //sample URL for internet archive page
                // https://web.archive.org/web/20100818080605/http://www.nytimes.com/
                
                //code for multiple page loads
                // for(let i = 1; i < parsedData.length; ++i){
                //     pageURL = `https://web.archive.org/web/${parsedData[i][1]}/${website}`;
                //     page_urls.push(pageURL);
                // }

                for(let i = 1; i < 3; ++i){ //2 timestamps
                    pageURL = `https://web.archive.org/web/${parsedData[i][1]}/${website}`;
                    page_urls.push(pageURL);
                }
    
                // const pageURL = `https://web.archive.org/web/${parsedData[1][1]}/${website}`;
                
                if(global.count == urlSIZE){
                    console.log(page_urls);
                    launchWebsites(page_urls);
                    
                }
            
            

            } catch (e) {
                console.error(e.message);
            }
        });
        })
        .on('error', (e) => {
            console.error(`Got error: ${e.message}`);
        });
}

function getWebsites(){
    
    var array = fs.readFileSync('IAandArquivoSites200.txt', 'utf8').toString().split('\n');
    return array;
}

function getTimestampsArquivo(URL){
    

    var options = {
        args: [URL]
    };
    // console.log(`getting timestamps for ${URL}`);

    let temp = [];
    PythonShell.run('getArquivoTimes.py', options, function (err, results) {
        if (err) throw err;
    });

    sleep.sleep(3)

    let array = fs.readFileSync('./tmp/arquivoTimes.txt', 'utf8').toString().split('\n');
    return array;

}

async function main(){
    let iaURL = 'http://web.archive.org/cdx/search/cdx?'; //internet archive URL 
    // iaURL = getIAURL(iaURL);
    
    // let temp_url = 'http://web.archive.org/cdx/search/cdx';
    
    
    // let urls = ['http://www.nytimes.com'];
    let urls = [];
    urls = getWebsites(urls);
    // urls = ['abraham-lincoln-papers','ancestral-voices','amazing-grace'];

    let page_urls = [];
    global.count = 0;
    

    
    
    
    for(let i = 0; i < urls.length; ++i){
        
        let apiEndPoint = `http://arquivo.pt/textsearch?versionHistory=${urls[i]}&maxItems=1`;
        // console.log(apiEndPoint);
        let arr = getTimestampsArquivo(apiEndPoint)
        console.log(`${arr[0]}       : ${i} `);
        
        page_urls.push(arr[0]);
        
        
        
    }
    console.log("URLS LOADED");
    console.log(page_urls);
    
    var filename = './tmp/arquivoURLS.txt';
    for(line of page_urls){
        line += '\n';
        fs.appendFile(filename,line, err =>{
            if(err) return console.log(err);
        });
    }

    // launchWebsites(page_urls);
    
}



main();
    
    
    // var apiEndPoint = `${temp_url}?url=${urls[0]}&output=json&limit=10&from=2010`;
    // console.log(apiEndPoint);
    // parseResponse(apiEndPoint,urls[0]);