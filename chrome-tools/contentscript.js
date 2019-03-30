console.log("Content script being executed eder!");

let githubEditor = document.querySelector('.js-code-editor');

if (githubEditor) {

    //**!!!!**
    //REMEMBER: open /Applications/Google\ Chrome.app --args --allow-running-insecure-content
    //**!!!!**

    //Sanity check
    console.log("Extension is running! 1");

    //hide current editor
    githubEditor.style.display = 'none';

    //Inserts iframe to isolate CSS and JS contexts
    let iframe = document.createElement('iframe');
    iframe.id = "gwt-iframe";
    iframe.src = "http://localhost:8080";
    iframe.style.cssText = 'width:100%;height:100%;';

    //Insert iframe where the default GitHub editor was
    let oldEditor = document.querySelector('.file');
    oldEditor.parentElement.insertBefore(iframe, oldEditor);
} else{
    console.log("not github");
}



