/*--------------------------------------------------------------------------------------------------------------------------------------------*/
var config = {
    apiKey: "AIzaSyD-xBReIsLbsbWy9NtIsnUPxRWiY6OVzOM",
    authDomain: "dawnc-ea146.firebaseapp.com",
    databaseURL: "https://dawnc-ea146.firebaseio.com",
    projectId: "dawnc-ea146",
    storageBucket: "dawnc-ea146.appspot.com",
    messagingSenderId: "731731735733"
};
/*--------------------------------------------------------------------------------------------------------------------------------------------*/
firebase.initializeApp(config);
/*--------------------------------------------------------------------------------------------------------------------------------------------*/
var database    = firebase.database();
var storage     = firebase.storage();
var storageRef  = storage.ref();
var auth        = firebase.auth();
var isAnonymous = false;
var uid         = "";
/*--------------------------------------------------------------------------------------------------------------------------------------------*/
auth.signInAnonymously();
/*--------------------------------------------------------------------------------------------------------------------------------------------*/
auth.onAuthStateChanged(firebaseUser => {
    if (firebaseUser) 
    {
        isAnonymous = firebaseUser.isAnonymous;
        uid         = firebaseUser.uid;
    }
});
/*--------------------------------------------------------------------------------------------------------------------------------------------*/
let all_annotations_titles   = [];
let all_annotations_urls     = [];
let all_annotations_websites = [];
/*--------------------------------------------------------------------------------------------------------------------------------------------*/
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
                    else if (all_objects[uid][this_key].website.startsWith("https://www.mixcloud.com/"))
                        all_annotations_websites.push("MixCloud");
                }
            }
        }

        fill_with_annotations();
    });
}
/*--------------------------------------------------------------------------------------------------------------------------------------------*/
function fill_with_annotations() 
{   
    let content      = document.getElementById("display_content");
    let all_websites = ["TuneIn", "Youtube", "Vimeo", "MixCloud"];

    for (let i = 0; i < all_websites.length; i++)
        if (all_annotations_websites.indexOf(all_websites[i]) != -1)
        {
            let new_website = document.createElement("div");
            let innerHTML_string = "<div class=\"accordion\"><div class=\"section\"><input type=\"radio\" name=\"accordion-1\" id=\"section-" + 
                                    i + "\"value=\"toggle\"/><label for=\"section-" + i + "\">";

            if (all_websites[i] == "TuneIn" || all_websites[i] == "MixCloud")
                innerHTML_string =  innerHTML_string + "<i class=\"fa fa-volume-up\"></i>";
            else if (all_websites[i] == "Youtube")
                innerHTML_string =  innerHTML_string + "<i class=\"fa fa-youtube-play\"></i>";
            else if (all_websites[i] == "Vimeo")
                innerHTML_string =  innerHTML_string + "<i class=\"fa fa-vimeo\"></i>";

            innerHTML_string = innerHTML_string + "<span>" + all_websites[i] + "</span></label>" + "<div class=\"content\"><ul id=\"all_annotations-" + 
                               i +  "\"></ul></div></div></div></div>";

            new_website.innerHTML = innerHTML_string;
            content.appendChild(new_website);

            let holder = document.getElementById("all_annotations-" + i);

            for (let j = 0; j < all_annotations_titles.length; j++)
                if (all_annotations_websites[j] == all_websites[i])
                {
                    let new_annotate_list_item       = document.createElement("li");
                    let new_annotate_list_item_image = document.createElement("i");
                    let new_annotate_list_item_link  = document.createElement("a");

                    new_annotate_list_item_image.setAttribute("class", "fa fa-check-circle-o");

                    new_annotate_list_item.appendChild(new_annotate_list_item_image);
                    new_annotate_list_item_link.setAttribute("href", all_annotations_urls[j]);
                    new_annotate_list_item_link.innerHTML = all_annotations_titles[j];
                    new_annotate_list_item.appendChild(new_annotate_list_item_link);

                    holder.appendChild(new_annotate_list_item);
                }
        }
}
/*--------------------------------------------------------------------------------------------------------------------------------------------*/
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
}
/*--------------------------------------------------------------------------------------------------------------------------------------------*/
main_function();
/*--------------------------------------------------------------------------------------------------------------------------------------------*/