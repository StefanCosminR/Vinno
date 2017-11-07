var temp = document.getElementsByTagName('template')[0];
var host = document.getElementsByClassName('container')[0];
var root = host.createShadowRoot();

root.appendChild(document.importNode(temp.content, true));