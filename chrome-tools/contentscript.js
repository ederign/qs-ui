console.log("Content script being executed eder!");
//hide current editor
let github = document.querySelector('.js-code-editor');
if (github) {
    console.log("github");
    document.querySelector('.js-code-editor').style.display = 'none';
// var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
// if (!location.ancestorOrigins.contains(extensionOrigin)) {
    let iframe = document.createElement('iframe');
    iframe.id = "parentIframe";
    iframe.src = chrome.runtime.getURL('frame.html');

    iframe.style.cssText = 'width:100%;height:100%;';
    let oldEditor = document.querySelector('.file');
    oldEditor.parentElement.insertBefore(iframe, oldEditor);

    // window.addEventListener('message', function(event) {
    //     console.log('page javascript got message:', event);
    // });
    //
    // setTimeout(function() {
    //     console.log('page javascript sending message');
    //     window.postMessage({ type: 'page_js_type',
    //             text: "Hello from the page's javascript!"},
    //         '*' /* targetOrigin: any */);
    // }, 2000);

}
else{

    // window.addEventListener('message', function(event) {
    //     console.log('content_script.js got message:', event);
    //     // check event.type and event.data
    // });
    //
    // setTimeout(function () {
    //     window.gwtEditorBeans;
    //     console.log('cs sending message');
    //     window.postMessage({ type: 'content_script_type',
    //             text: 'Hello from content_script.js!'},
    //         '*' /* targetOrigin: any */ );
    // }, 1000);

}



