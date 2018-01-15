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
let all_content_title = [];
let all_website       = [];
let all_title         = [];
let all_description   = [];
let all_playlist      = [];
let player            = document.getElementById("audio");
let current_song      = -1;
let play_state        = false;
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
                
                if (all_objects[uid][this_key].music_list)
                    for (let j = 0; j < all_objects[uid][this_key].music_list.length; j++)
                    {
                        all_content_title.push(all_objects[uid][this_key].content_title);
                        all_website.push(all_objects[uid][this_key].website);
                        all_title.push(all_objects[uid][this_key].title);
                        all_playlist.push(all_objects[uid][this_key].music_list[j]);
                        all_description.push(all_objects[uid][this_key].description);
                        
                        current_song = 0;
                    }
            }
        }
        
        fill_with_annotations();
    });
}
/*--------------------------------------------------------------------------------------------------------------------------------------------*/
function switchPlayState(current) 
{
    player.src = all_playlist[current];

    if(play_state) 
    {
        document.getElementById("play").setAttribute("class", "play-button paused");
        player.pause();
        play_state = false;
    } 
    else 
    {
        document.getElementById("play").setAttribute("class", "play-button playing");
        player.play();
        play_state = true;
    }
}
/*--------------------------------------------------------------------------------------------------------------------------------------------*/
function fill_with_annotations() 
{   
    let holder = document.getElementById("list");

    for (let i = 0; i < all_playlist.length; i++)
    {
        let new_song = document.createElement("li");
        new_song.setAttribute("id", "song_" + i);
        
        new_song.innerHTML = "<i class=\"fa fa-check-circle-o\"></i><a><span>" + "Song from annotation with title <b>\"" + all_title[i] + 
                             "\"</b> and description <b>\"" + all_description[i] + "\"</b>" + " hosted at <b>\"" + all_content_title[i] + "\"";
        // TO DO 
        // maybe use URL too (from all_website)
        holder.appendChild(new_song);

        document.getElementById("song_" + i).onclick = function() {
            switchPlayState(i);

            for (let j = 0; j < all_playlist.length; j++)
            {
                let this_song = document.getElementById("song_" + j).childNodes[0];
                this_song.setAttribute("style", "color: #36b4a7;")
            }

            let this_song = document.getElementById("song_" + i).childNodes[0];
            this_song.setAttribute("style", "color: red;")
        };
    }

    document.getElementById("play").onclick = function() {
        if (current_song != -1)
            switchPlayState(current_song);
    };
}  
/*--------------------------------------------------------------------------------------------------------------------------------------------*/
readAllAnnotationsFromFirebase();
/*--------------------------------------------------------------------------------------------------------------------------------------------*/