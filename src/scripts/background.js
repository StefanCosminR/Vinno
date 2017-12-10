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



let messageCommunicationBus = new MessageCommunicationBus();

messageCommunicationBus.registerListener('getEmbeddedHtml', sendFile('../src/html/annotatorTemplate.html'));
messageCommunicationBus.registerListener('getAnnotationDisplay', sendFile('../src/html/annotatorDisplay.html'));
messageCommunicationBus.registerListener('getAnnotatorActions', sendFile('../src/html/quickAnnotate.html'));
messageCommunicationBus.registerListener('getFloatingPanel', sendFile('../src/html/floatingPanel.html'));
messageCommunicationBus.registerListener('GET', function(sendResponse, link){});
messageCommunicationBus.registerListener('POST', function(sendResponse, link, content) { writeUserDataToFirebase(link, content); sendResponse(true); });


function sendFile(path) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', path, false);
    xmlHttp.send(null);
    return function(sendResponse) {
        sendResponse({html: xmlHttp.responseText});
    }
}

/**
 * @todo Maybe the request should be done asynchronously in the future, but for now synchronous request does not affect performance notably
 */

var config = {
    apiKey: "AIzaSyD-xBReIsLbsbWy9NtIsnUPxRWiY6OVzOM",
    authDomain: "dawnc-ea146.firebaseapp.com",
    databaseURL: "https://dawnc-ea146.firebaseio.com",
    projectId: "dawnc-ea146",
    storageBucket: "dawnc-ea146.appspot.com",
    messagingSenderId: "731731735733"
};

firebase.initializeApp(config);

var database = firebase.database();
var storage = firebase.storage();
var storageRef = storage.ref();
var auth = firebase.auth();
var isAnonymous = false;
var uid = "";

auth.signInAnonymously();

auth.onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        isAnonymous = firebaseUser.isAnonymous;
        uid = firebaseUser.uid;
    }
});

function writeUserDataToFirebase(link, content) { 
    var annotation_ref = database.ref(link + uid);
    var images_list_names = [];

    var images_list = content.images_list;

    for (var i = 0; i < images_list.length; i++) {
        var images_ref = storage.ref("images/" + images_list[i].name);
        images_ref.putString(images_list[i].data, 'data_url');

        images_list_names.push(images_list[i].name);
    }

    var annotation_data = {
        title: content.title,
        website: content.website,
        start_time: content.start_time,
        end_time: content.end_time,
        tags_list: content.tags_list,
        description: content.description,
        images_list: images_list_names
    }

    annotation_ref.push(annotation_data);
}
