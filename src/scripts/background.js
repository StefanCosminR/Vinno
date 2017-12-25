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
messageCommunicationBus.registerListener('GET', function(sendResponse, link, urlsite) 
{ 
    readUserDataToFirebase(link, urlsite, sendResponse); 
});
messageCommunicationBus.registerListener('POST', function(sendResponse, link, content) 
{ 
    if (link == "saveAttachment") 
    {
        saveAttachmentToFirebase(content); 
        sendResponse(true); 
        
    }
    else if (link == "removeAttachment")
    {
        removeAttachmentToFirebase(content); 
        sendResponse(true); 
    }
    else
    {
        saveAnnotationToFirebase(link, content); 
        sendResponse(true);
    }
});


function sendFile(path) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', path, false);
    xmlHttp.send(null);
    return function(sendResponse) {
        sendResponse({html: xmlHttp.responseText});
    }
}

var config = 
{
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

auth.onAuthStateChanged(firebaseUser => 
{
    if (firebaseUser) {
        isAnonymous = firebaseUser.isAnonymous;
        uid = firebaseUser.uid;
    }
});

function readUserDataToFirebase(link, urlsite, sendResponse) 
{ 
    let past_annotations = [];
    let annotation_ref = database.ref(link + uid);

    annotation_ref.once('value').then(function(data) 
    {
        let all_objects = data.val();
        
        if (all_objects) 
        {
            let keys = Object.keys(all_objects);

            for (let i = 0; i < keys.length; i++) 
            {
                let this_key = keys[i];
                let website = all_objects[this_key].website;

                if (website.startsWith(urlsite))
                {
                    let content_title = all_objects[this_key].content_title;
                    let title = all_objects[this_key].title;
                    let start_time = all_objects[this_key].start_time;
                    let end_time = all_objects[this_key].end_time;
                    let tags_list = all_objects[this_key].tags_list;
                    let description = all_objects[this_key].description;
                    let image_list  = all_objects[this_key].images_list;
                    let music_list  = all_objects[this_key].music_list;

                    past_annotations.push(new AnnotationLayout(content_title, title, website, start_time, end_time, tags_list, description, image_list, music_list));
                }
            }
        }
        sendResponse(past_annotations);
    });
}

function saveAttachmentToFirebase(content)
{
    if (content.name.endsWith(".img") || content.name.endsWith(".jpg") || content.name.endsWith(".jpeg"))
    {
        let image_ref = storage.ref("image/" + uid + "/" + content.name);
        image_ref.putString(content.data, 'data_url');
    }
    else if (content.name.endsWith(".mp3"))
    {
        let music_ref = storage.ref("music/" + uid + "/" + content.name);
        music_ref.putString(content.data, 'data_url');
    }
}   

function removeAttachmentToFirebase(content)
{
    for (let i = 0; i < content.length; i++)
    {
        if (content[i].endsWith(".img") || content[i].endsWith(".jpg") || content[i].endsWith(".jpeg"))
        {
            let image_ref = storageRef.child("image/" + uid + "/" + content[i]);
            image_ref.delete();
        }
        else if (content[i].endsWith(".mp3"))
        {
            let music_ref = storageRef.child("music/" + uid + "/" + content[i]);
            music_ref.delete();
        }
    }
}   

function saveAnnotationToFirebase(link, content) 
{ 
    let annotation_ref = database.ref(link + uid);

    let image_list = content.images_list;
    let image_urls = [];
    let image_promises = [];

    let music_list = content.music_list;
    let music_urls = [];
    let music_promises = [];

    for (let i = 0; i < image_list.length; i++) 
        image_promises.push(storageRef.child("image/" + uid + "/" + image_list[i]).getDownloadURL());

    for (let i = 0; i < music_list.length; i++) 
        music_promises.push(storageRef.child("music/" + uid + "/" + music_list[i]).getDownloadURL());

    Promise.all(image_promises).then(function(values) 
    {
        for (let i = 0; i < values.length; i++)
           image_urls.push(values[i]);

        Promise.all(music_promises).then(function(values)
        {
            for (let i = 0; i < values.length; i++)
               music_urls.push(values[i]);

            let annotation_data = 
            {
                content_title: content.content_title,
                title: content.title,
                website: content.website,
                start_time: content.start_time,
                end_time: content.end_time,
                tags_list: content.tags_list,
                description: content.description,
                images_list: image_urls,
                music_list: music_urls
            }

            annotation_ref.push(annotation_data);
        });
    });
}
