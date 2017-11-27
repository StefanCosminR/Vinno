/**
 * @description here we map routes where we want the extension to be clickable
 */

chrome.tabs.onUpdated.addListener(function (tab_id, data, tab) {
    if (tab && tab.url) {
        if (tab.url.indexOf("stackoverflow") !== -1) {
            chrome.pageAction.show(tab_id);
        }
        else if (tab.url.indexOf("tunein") !== -1) {
            chrome.pageAction.show(tab_id);
        }
        else if (tab.url.indexOf('youtube') !== -1) {
            chrome.pageAction.show(tab_id);
        }
        else if (tab.url.indexOf("vimeo") !== -1) {
            chrome.pageAction.show(tab_id);
        }
    }
});

/**
 * @todo Maybe the request should be done asynchronously in the future, but for now synchronous request does not affect performance notably
 */
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request === "getEmbeddedHtml") {
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.open('GET', "../src/html/annotatorTemplate.html", false);
            xmlHttp.send(null);
            sendResponse({html: xmlHttp.responseText});
        } else if(request === 'getAnnotationDisplay') {
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.open('GET', '../src/html/annotatorDisplay.html', false);
            xmlHttp.send(null);
            sendResponse({html: xmlHttp.responseText});
        } else if(request === 'getAnnotatorActions') {
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.open('GET', '../src/html/quickAnnotate.html', false);
            xmlHttp.send(null);
            sendResponse({html: xmlHttp.responseText});
        } else if(request === 'getFloatingPanel') {
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.open('GET', "../src/html/floatingPanel.html", false);
            xmlHttp.send(null);
            sendResponse({html: xmlHttp.responseText});
        }
    });