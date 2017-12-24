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

let all_content_title = [];
let all_website = [];
let all_title = [];
let all_description = [];
let all_image_list = [];

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
                
                for (let j = 0; j < all_objects[uid][this_key].images_list.length; j++)
                {
                    all_content_title.push(all_objects[uid][this_key].content_title);
                    all_website.push(all_objects[uid][this_key].website);
                    all_title.push(all_objects[uid][this_key].title);
                    all_image_list.push(all_objects[uid][this_key].images_list[j]);
                    all_description.push(all_objects[uid][this_key].description);
                }

                console.log(all_image_list);
            }
        }

        fill_with_annotations();
    });
}

function fill_with_annotations() 
{ 
    let holder = document.getElementsByClassName("slideshow-container")[0];

    for (let i = 0; i < all_title.length; i++)
    {
        
        let new_photo = document.createElement("div");
        new_photo.setAttribute("class", "mySlides fade");
        if(i == 0)
            new_photo.setAttribute("style", "display: block;");
        else
            new_photo.setAttribute("style", "display: none;");
        new_photo.innerHTML = "<img src=\"" + all_image_list[i] + "\" style=\"width:100%;\"><div class=\"text\">" + "Image from annotation with title <b>\"" + all_title[i] + 
                              "\"</b> and description <b>\"" + all_description[i] + "\"</b>" + " hosted at <b>\"" + all_content_title[i] + "\"</b></div></div>";
        // TO DO 
        // maybe use URL too (from all_website)
        console.log(new_photo);
        holder.appendChild(new_photo);
    }


    document.getElementsByClassName("prev")[0].onclick = function() {
        showSlides(slideIndex = slideIndex - 1);
    }
    document.getElementsByClassName("next")[0].onclick = function() {
        showSlides(slideIndex = slideIndex + 1);
    }
}

let slideIndex = 1;
readAllAnnotationsFromFirebase();
if (all_title.length)
    showSlides(slideIndex);

function showSlides(n) {
  let slides = document.getElementsByClassName("mySlides");

  if (n > slides.length)
    slideIndex = 1;  
  if (n < 1) 
    slideIndex = slides.length;
  for (let i = 0; i < slides.length; i++)
      slides[i].style.display = "none";  

  slides[slideIndex-1].style.display = "block";  
}