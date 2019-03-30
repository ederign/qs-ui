// chrome.runtime.onInstalled.addListener(function() {
//   // chrome.storage.sync.set({color: '#3aa757'}, function() {
//   //   console.log('Test');
//   // });
//   chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
//     chrome.declarativeContent.onPageChanged.addRules([{
//       conditions: [new chrome.declarativeContent.PageStateMatcher({
//         pageUrl: {hostEquals: 'github.com'},
//       })
//       ],
//           actions: [new chrome.declarativeContent.ShowPageAction()]
//     }]);
//   });
// });
chrome.runtime.onInstalled.addListener(function() {
    console.log("background");

    setTimeout(function () {
        console.log('log background');

    }, 1000);
});

chrome.webRequest.onHeadersReceived.addListener(info => {
    const headers = info.responseHeaders; // original headers
    console.log("headers hack");
    for (let i=headers.length-1; i>=0; --i) {
        console.log("headers executed");
        let header = headers[i].name.toLowerCase();
        if (header === "content-security-policy") { // csp header is found
            // modify frame-src here
            headers[i].value = headers[i].value.replace("frame-src", "frame-src render.githubusercontent.com");
        }
    }
    // return modified headers
    return {responseHeaders: headers};
}, {
    urls: [ "<all_urls>" ], // match all pages
    types: [ "sub_frame" ] // for framing only
}, ["blocking", "responseHeaders"]);