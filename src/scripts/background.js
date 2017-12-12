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
messageCommunicationBus.registerListener('GET', function(sendResponse, link, urlsite) { readUserDataToFirebase(link, urlsite, sendResponse); });
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

function readUserDataToFirebase(link, urlsite, sendResponse) { 
    let all_past_annotations = [];
    let annotation_ref = database.ref(link + uid);

    annotation_ref.once('value').then(function(data) {
        let all_objects = data.val();
        
        if (all_objects) {
            let keys = Object.keys(all_objects);

            for (let i = 0; i < keys.length; i++) {
                let this_key = keys[i];
                let website = all_objects[this_key].website;

                if (website.startsWith(urlsite))
                {
                    let title = all_objects[this_key].title;
                    let start_time = all_objects[this_key].start_time;
                    let end_time = all_objects[this_key].end_time;
                    let tags_list = all_objects[this_key].tags_list;
                    let description = all_objects[this_key].description;
                    let images_list  = all_objects[this_key].images_list;

                    all_past_annotations.push(new AnnotationLayout(title, website, start_time, end_time, tags_list, description, images_list));
                }
            }
        }
        sendResponse(all_past_annotations);
    });
}

function writeUserDataToFirebase(link, content) { 
    let annotation_ref = database.ref(link + uid);
    let images_list_links = [];
    let images_list = content.images_list;

    let all_images_promises = [];

    if (images_list.length != 0)
        for (let i = 0; i < images_list.length; i++) {
            let images_ref = storage.ref("images/" + uid + "/" + images_list[i].name);
            let j = i;
            images_ref.putString(images_list[j].data, 'data_url').then(() => { 
                all_images_promises.push(storageRef.child("images/" + uid + "/" + images_list[j].name).getDownloadURL());

                if (j == images_list.length - 1)
                {
                    Promise.all(all_images_promises).then(values => { 
                        for (let i = 0; i < values.length; i++)
                            images_list_links.push(values[i]);

                        let annotation_data = {
                            title: content.title,
                            website: content.website,
                            start_time: content.start_time,
                            end_time: content.end_time,
                            tags_list: content.tags_list,
                            description: content.description,
                            images_list: images_list_links
                        }

                        annotation_ref.push(annotation_data);
                    });
                }
            });
        }
    else
    {
        let annotation_data = {
            title: content.title,
            website: content.website,
            start_time: content.start_time,
            end_time: content.end_time,
            tags_list: content.tags_list,
            description: content.description,
            images_list: images_list_links
        }

        annotation_ref.push(annotation_data);
    }
}
