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
                
                console.log(all_objects[uid][this_key].content_title);
                
            }
        }

        fill_with_annotations();
    });
}

function fill_with_annotations() 
{ 
    console.log("asd");
}   
console.log("asd");