/**
 * @todo this is just an example of creating the shadow DOM, we need to somehow created shadow DOM'S on every page because host CSS could interfere with our own css
 */
// nothing on this script is currently used
var temp = document.getElementsByTagName('template')[0];
var host = document.getElementsByClassName('container')[0];
var root = host.createShadowRoot();

root.appendChild(document.importNode(temp.content, true));

var urlLocation = document.getElementsByClassName('URL')[0];

console.log(chrome.tabs);