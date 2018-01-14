var config = {
    apiKey: "AIzaSyD-xBReIsLbsbWy9NtIsnUPxRWiY6OVzOM",
    authDomain: "dawnc-ea146.firebaseapp.com",
    databaseURL: "https://dawnc-ea146.firebaseio.com",
    projectId: "dawnc-ea146",
    storageBucket: "dawnc-ea146.appspot.com",
    messagingSenderId: "731731735733"
};
firebase.initializeApp(config);

var database    = firebase.database();
var storage     = firebase.storage();
var storageRef  = storage.ref();
var auth        = firebase.auth();
var isAnonymous = false;
var uid         = "";

auth.signInAnonymously();
auth.onAuthStateChanged(firebaseUser => {
    if (firebaseUser)
    {
        isAnonymous = firebaseUser.isAnonymous;
        uid         = firebaseUser.uid;
    }
});

let content_titles = [];
let titles   = [];
let websites = [];
let descriptions = [];
let start_times = [];
let end_times = [];
let tags = [];
let images = [];
let music = [];
let coordinates = [];

function readAllAnnotationsFromFirebase()
{
    let annotation_ref = database.ref("annotations/");

    annotation_ref.once('value').then(function(data) {
        let all_objects = data.val();

        if (all_objects)
        {
            let keys = Object.keys(all_objects[uid]);

            for (let i = 0; i < keys.length; i++)
            {
                let this_key = keys[i];

                content_titles.push(all_objects[uid][this_key].content_title);
                titles.push(all_objects[uid][this_key].title);
                websites.push(all_objects[uid][this_key].website);
                start_times.push(all_objects[uid][this_key].start_time);
                end_times.push(all_objects[uid][this_key].end_time);
                tags.push(all_objects[uid][this_key].tags_list);
                descriptions.push(all_objects[uid][this_key].description);
                images.push(all_objects[uid][this_key].images_list);
                music.push(all_objects[uid][this_key].music_list);
                coordinates.push(all_objects[uid][this_key].coordinates);
            }

            // console.log("Content titles: " + content_titles);
            // console.log("Titles: " + titles);
            // console.log("Descriptions: " + descriptions);
            // console.log("Start times: " + start_times);
            // console.log("End times: " + end_times);
            // console.log("Tags: " + tags);
            // console.log("Images: " + images);
            // console.log("Music: " + music);
            // console.log("Websites:" + websites);
        }
    });
}

function exportToCsv()
{
    console.log("Exporting to csv...");
}

function exportToJson()
{
    console.log("Exporting to json...");
}

function exportToXml()
{
    console.log("Exporting to xml...");
}

function main_function()
{
    // console.log("Executing main_function...");
    readAllAnnotationsFromFirebase();

    let csv = document.getElementById("exportToCsv");
    let json = document.getElementById("exportToJson");
    let xml = document.getElementById("exportToXml");

    csv.onclick = exportToCsv;
    json.onclick = exportToJson;
    xml.onclick = exportToXml;

}

main_function();
