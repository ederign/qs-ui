'use strict';

chrome.runtime.onInstalled.addListener(function() {
    console.log("background");

    setTimeout(function () {
        console.log('log background');
    }, 1000);
});


function removeHeader(headers, name) {
    for (var i = 0; i < headers.length; i++) {
        if (headers[i].name.toLowerCase() === name) {
            console.log('Removing "' + name + '" header.');
            headers.splice(i, 1);
            break;
        }
    }
}

chrome.webRequest.onHeadersReceived.addListener(
    function(details) {
        removeHeader(details.responseHeaders, 'content-security-policy');
        return {responseHeaders: details.responseHeaders};
    },
    // request filters
    {urls: ['https://*/*', 'http://*/*']},
    // extraInfoSpec (magic)
    ['blocking', 'responseHeaders', 'extraHeaders']);