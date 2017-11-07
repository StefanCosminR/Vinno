/**
 * @description here we map routes where we want the extension to be clickable
 */

chrome.tabs.onUpdated.addListener(function(tab_id, data, tab) {
    if(tab.url.indexOf("stackoverflow") !== -1) {
        chrome.pageAction.show(tab_id);
    }

});