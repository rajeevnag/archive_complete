// const Chrome = require('chrome-remote-interface/lib/chrome');
//CHANGED^^
let Chrome = require('chrome-remote-interface');
let fs = require('fs');
var sleep = require('sleep');



const { SSL_OP_EPHEMERAL_RSA } = require('constants');

async function pauseCode(){
    
    //sleep anywhere between 10 and 15 seconds
    let lowerBound = 10;
    let upperBound = 20;
    let sleepTime = Math.floor(Math.random() * (upperBound - lowerBound) + lowerBound);
    // console.log('sleeping');
    sleep.sleep(sleepTime); 
    // console.log('done sleeping');

}
async function loadStuff(client){
    
    try {
        // connect to endpoint
        // client = await CDP();

        // extract domains
        const {Network, Page} = chrome;
        // setup handlers
        Network.requestWillBeSent((params) => {
            // console.log(params.request.url);
        });
        // enable events then start!
        await Network.enable();
        await Page.enable();
        
        
        
        console.log(`current URL : ${URL}`);
        await Page.navigate({url: URL});
        console.log('request about to be sent');
        await Page.loadEventFired();
        const startTime  = await chrome.Runtime.evaluate({expression: 'performance.timing.navigationStart'});
        console.log(startTime);
        const endTime = await chrome.Runtime.evaluate({expression: 'performance.timing.loadEventEnd'})
        console.log(endTime);
        
        let loadTime = endTime.result.value - startTime.result.value;
        let str = loadTime.toString();
        str += `  URL: ${URL}\n`;
        console.log(str);
        // info.push(str);

        pauseCode();
        
        
        
        
        // const output = info.join("\n");
        // console.log(output);
        console.log('about to write to file');
        fs.appendFile(fileName,str, err =>{
            if(err) return console.log(err);
        });

        // console.log(URL);
        // console.log(loadTime);



    } catch (err) {
        console.error(err);
    } finally {
        if (client) {
            await client.close();
            
        }
    }
}
var methods = {
    // loadPage: async function(URL,fileName){
    //     const CDP = require('chrome-remote-interface');
    //     let client;
        
    //     try {
    //         // connect to endpoint
    //         client = await CDP();

    //         // extract domains
    //         const {Network, Page} = client;
    //         // setup handlers
    //         Network.requestWillBeSent((params) => {
    //             // console.log(params.request.url);
    //         });
    //         // enable events then start!
    //         await Network.enable();
    //         await Page.enable();
    //         // let info = [];
    //         // for(let i = 0; i < URLS.length; ++i ){
    //         //     let curURL = URLS[i];
                
    //         //     console.log(`current URL : ${curURL}`);
    //         //     await Page.navigate({url: curURL});
    //         //     console.log('request about to be sent');
    //         //     await Page.loadEventFired();
    //         //     const startTime  = await client.Runtime.evaluate({expression: 'performance.timing.navigationStart'});
    //         //     console.log(startTime);
    //         //     const endTime = await client.Runtime.evaluate({expression: 'performance.timing.loadEventEnd'})
    //         //     console.log(endTime);
                
    //         //     let loadTime = endTime.result.value - startTime.result.value;
    //         //     let str = loadTime.toString();
    //         //     str += `  URL: ${curURL}\n`;
    //         //     console.log(str);
    //         //     info.push(str);
    //         //     pauseCode();
    //         // }
            
            
            
    //         console.log(`current URL : ${URL}`);
    //         await Page.navigate({url: URL});
    //         console.log('request about to be sent');
    //         await Page.loadEventFired();
    //         const startTime  = await client.Runtime.evaluate({expression: 'performance.timing.navigationStart'});
    //         console.log(startTime);
    //         const endTime = await client.Runtime.evaluate({expression: 'performance.timing.loadEventEnd'})
    //         console.log(endTime);
            
    //         let loadTime = endTime.result.value - startTime.result.value;
    //         let str = loadTime.toString();
    //         str += `  URL: ${URL}\n`;
    //         console.log(str);
    //         // info.push(str);

    //         // pauseCode();
            
            
            
    //         let fs = require('fs');
    //         // const output = info.join("\n");
    //         // console.log(output);
    //         fs.appendFile(fileName,str, err =>{
    //             if(err) return console.log(err);
    //         });

    //         // console.log(URL);
    //         // console.log(loadTime);



    //     } catch (err) {
    //         console.error(err);
    //     } finally {
    //          if (client) {
    //              await client.close();
                 
    //          }
    //        }
    // }
    loadPage: async function(URL,fileName){
        // const CDP = require('chrome-remote-interface');
        // let client;
        let local = false;
        
        
        let chrome = await Chrome({port:9222, local:local});
        let str; 
        try {
            // connect to endpoint
            // client = await CDP();
            
            // extract domains
            
            const {Network, Page} = chrome;
            
            // setup handlers
            Network.requestWillBeSent((params) => {
                // console.log(params.request.url);
            });
            // console.log(URL);
            // enable events then start!
            await Network.enable();
            await Page.enable();
            
            
            
            
            // console.log(`current URL : ${URL}`);
        //   URL = 'http://www.youtube.com';
            // URL = 'https://httpbin.org';
            await Page.navigate({url: URL});
            // console.log('request about to be sent');
            await Page.loadEventFired();
            const startTime  = await chrome.Runtime.evaluate({expression: 'performance.timing.navigationStart'});
            // console.log(startTime);
            const endTime = await chrome.Runtime.evaluate({expression: 'performance.timing.loadEventEnd'})
            // console.log(endTime);
            
            let loadTime = endTime.result.value - startTime.result.value;
            str = loadTime.toString();
            str += `  URL: ${URL}\n`;
            // console.log(str);
            // info.push(str);
    
            pauseCode();
            
            
            
        //   let fs = require('fs');
        //   // const output = info.join("\n");
        //   // console.log(output);
        //   fs.appendFile(fileName,str, err =>{
        //       if(err) return console.log(err);
        //   });
    
            // console.log(URL);
            // console.log(loadTime);
            
    
    
        } catch (err) {
            console.error(err);
        }
        return str;
        //   .on('error',err =>{
        //     console.log(err);
        //   })
        
        
    }
}


exports.data = methods;