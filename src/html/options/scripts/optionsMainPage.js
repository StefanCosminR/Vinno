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
                }
            }
        }

        fill_with_annotations();
    });
}

function fill_with_annotations() 
{
    let holder = document.getElementById("all_annotations");

    for (let i = 0; i < all_annotations_titles.length; i++)
    {
        let new_annotate_list_item = document.createElement("li");
        let new_annotate_list_item_image = document.createElement("i");
        let new_annotate_list_item_link = document.createElement("a");

        if (all_annotations_urls[i].startsWith("https://tunein.com/radio/"))
            new_annotate_list_item_image.setAttribute("class", "fa fa-volume-up");
        else if (all_annotations_urls[i].startsWith("https://www.youtube.com/"))
            new_annotate_list_item_image.setAttribute("class", "fa fa-youtube-play");
        else if (all_annotations_urls[i].startsWith("https://www.vimeo.com/"))
            new_annotate_list_item_image.setAttribute("class", "fa fa-vimeo");

        new_annotate_list_item.appendChild(new_annotate_list_item_image);
        new_annotate_list_item_link.setAttribute("href", all_annotations_urls[i]);
        new_annotate_list_item_link.innerHTML = all_annotations_titles[i];
        new_annotate_list_item.appendChild(new_annotate_list_item_link);

        holder.appendChild(new_annotate_list_item);
    }
}

function main_function()
{
    readAllAnnotationsFromFirebase();
}


main_function();