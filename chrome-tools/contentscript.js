
var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
if (!location.ancestorOrigins.contains(extensionOrigin)) {
    var iframe = document.createElement('iframe');

    
    // Must be declared at web_accessible_resources in manifest.json
    iframe.src = chrome.runtime.getURL('frame.html');
 
    iframe.style.cssText = 'width:100%;height:100%;';

var oldEditor = document.querySelector('.file') 
  
//filter only for github TODO
if(oldEditor != null){
  oldEditor.parentElement.insertBefore(iframe, oldEditor)
  console.log("0");
}
else{
  console.log("1");
}
}
