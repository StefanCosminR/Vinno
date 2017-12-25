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

let all_annotations_titles = [];
let all_annotations_urls = [];
let all_annotations_websites = [];

function readAllAnnotationsFromFirebase() 
{
    let annotation_ref = database.ref("annotations/");

    annotation_ref.once('value').then(function(data) 
    {
        let all_objects = data.val();
        
        if (all_objects) 
        {
            let keys = Object.keys(all_objects[uid]);

            for (let i = 0; i < keys.length; i++) 
            {
                let this_key = keys[i];
                if (all_annotations_urls.indexOf(all_objects[uid][this_key].website) == -1)
                {
                    all_annotations_urls.push(all_objects[uid][this_key].website);
                    all_annotations_titles.push(all_objects[uid][this_key].content_title);

                    if (all_objects[uid][this_key].website.startsWith("https://tunein.com/radio/"))
                        all_annotations_websites.push("TuneIn");
                    else if (all_objects[uid][this_key].website.startsWith("https://www.youtube.com/"))
                        all_annotations_websites.push("Youtube");
                    else if (all_objects[uid][this_key].website.startsWith("https://www.vimeo.com/"))
                        all_annotations_websites.push("Vimeo");
                }
            }
        }

        fill_with_annotations();
    });
}

function main_function()
{
    let holder = document.createElement("div");

    holder.setAttribute("id", "display_content");
    document.getElementById("world").appendChild(holder);
    readAllAnnotationsFromFirebase();
            
    document.getElementById("section-11").onclick = function() {
        if (document.getElementById("display_content") == null)
        {
            let holder = document.createElement("div");

            holder.setAttribute("id", "display_content");
            document.getElementById("world").appendChild(holder);
            readAllAnnotationsFromFirebase();
        }
        else
            document.getElementById("display_content").remove();
    };
    document.getElementById("section-12").onclick = function() {
        if (document.getElementById("display_content") != null)
            document.getElementById("display_content").remove();
    };
    document.getElementById("section-13").onclick = function() {
        if (document.getElementById("display_content") != null)
            document.getElementById("display_content").remove();
    };
}


main_function();