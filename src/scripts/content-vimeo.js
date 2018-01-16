let embeddedHTML;
let annotatorActions;
let alreadyClicked = false;

// addAnnotation = function() {
//     let new_images = [];
//     let new_songs = [];

//     var playButton = document.getElementsByClassName("controls")[0].firstChild;
   
//     if (playButton.className.indexOf("state-playing") != -1) {
//         playButton.click();
//     }

//     let holder = document.getElementsByClassName("play-bar")[0];
//     let [container, root] = insertAnnotator(holder, dependences.annotatorPopup);

//     console.log(container);
//     console.log(root);
// }

insertAnnotationButton = function() {
    var sidedock = document.getElementsByClassName("sidedock")[0];
    var annotationButton = sidedock.lastChild.cloneNode(true);

    annotationButton.firstChild.firstChild.textContent = "Add Annotation";
    annotationButton.firstChild.setAttribute("hidden", "");
    annotationButton.firstChild.setAttribute("class", "rounded-box hidden");
    annotationButton.lastChild.setAttribute("class", "rounded-box");
    annotationButton.lastChild.setAttribute("aria-label", "Add Annotation");

    var svgImage = annotationButton.lastChild.firstChild.nextSibling;
    svgImage.firstChild.setAttribute("points", "5,15 0,15 0,0 20,0 20,15 15,15 10,20 10,10 5,15");
    
    sidedock.appendChild(annotationButton);
    
    annotationButton.addEventListener("click", function() {
        if(alreadyClicked == true) {
            return;
        }
        alreadyClicked = true;
        let new_images = [];
        let new_songs = [];

        var controlsDiv = document.getElementsByClassName("controls")[0];
        var playButton = controlsDiv.firstChild;
    
        if (playButton.className.indexOf("state-playing") != -1) {
            playButton.click();
        }

        //let holder = document.getElementsByClassName("play-bar")[0];
        let holder = document.createElement("div");
        holder.style.backgroundColor = "#EEF1F2";
        holder.style.display = "flex";
        holder.style.alignItems = "center";
        holder.style.justifyContent = "center";
        holder.style.zIndex = "100";

        var interfaceHolder = document.getElementById("main").firstChild;
        var innerPlayer = document.getElementsByClassName("vp-player-inner")[0];
        var fsButton = document.getElementsByClassName("fullscreen")[0];  

        // adjust the annotation container to different view modes
        // normal -> div class="controls" && button class="fullscreen" title="Enter full screen"
        // fullscreen -> button class="fullscreen" title="Exit full screen"
        // tiny -> div class="controls tiny"
        if (-1 != fsButton.title.indexOf("Enter full screen")) {
            interfaceHolder.insertBefore(holder, interfaceHolder.childNodes[1]);
        }
        else {
            holder.style.height = "95%";
            holder.style.alignItems = "flex-end";
            innerPlayer.insertBefore(holder, innerPlayer.childNodes[1]);
        }
        // fsButton.addEventListener("click", function() {
        //     console.log(fsButton.title.indexOf("Enter full screen"));
        //     if (-1 == fsButton.title.indexOf("Enter full screen")) {
        //         console.log(fsButton);
        //         //interfaceHolder.insertBefore(holder, interfaceHolder.childNodes[1]);
        //     }
        //     else {
        //         console.log(fsButton);
        //         //innerPlayer.insertBefore(holder, innerPlayer.childNodes[1]);
        //     }
        // });
        
        let [container, root] = insertAnnotator(holder, embeddedHTML);
        container.style.position = "relative"; 

        var annotatorStartTime = root.getElementById("annotator-start-time");
        var annotatorFinishTime = root.getElementById("annotator-finish-time");

        if (document.getElementsByClassName("progress")[0].childNodes[1].getAttribute("aria-valuenow") == "0") {
            annotatorStartTime.value = "00:00:00";
            annotatorFinishTime.value = "00:00:01";
        } else {
            annotatorStartTime.value = "00:" + document.getElementsByClassName("timecode")[0].firstChild.innerHTML;
            annotatorFinishTime.value = annotatorStartTime.value;
        }

        changeStyle(root.getElementById("save-button"), true);
        changeStyle(root.getElementById("close-button"), true);
        changeStyle(annotatorStartTime);
        changeStyle(annotatorFinishTime);

        let file_loader = root.getElementById("annotator-file");

        file_loader.addEventListener("change", function() {
            let current_files = file_loader.files;
            for (var i = 0; i < current_files.length; i++){
                let fileReader = new FileReader();
                fileReader.onload = function(evt) {
                    if (current_files[i].name.endsWith(".img") || current_files[i].name.endsWith(".jpg") || current_files[i].name.endsWith(".jpeg")){
                        new_images.push(evt.target.result);
                    }
                    else if(current_files[i].name.endsWith(".mp3")) {
                        new_songs.push("");
                    }
                };
                fileReader.readAsDataURL(current_files[i]);
            }
        });

        root.getElementById("save-button").addEventListener("click", function() {
            if (verify_each_input(root)) {
                let annotationInfo = {
                    annotation_title: root.getElementById("annotator-title").value,
                    start_time: root.getElementById("annotator-start-time").value,
                    end_time: root.getElementById("annotator-finish-time").value,
                    description: root.getElementById("annotator-description").value,
                    coordinates: [root.getElementById("map_lat").value, root.getElementById("map_lng").value]
                }

                console.log(annotationInfo);
            }
        });

        root.getElementById("close-button").addEventListener("click", function() {alreadyClicked = false;});
    });
}

changeStyle = function(element, HOVER=false) {
    element.style.backgroundColor = "#00adef";
    if (HOVER == true) {
        element.onmouseout = function() {
            element.style.backgroundColor = "#00adef";
        }
        element.onmouseover = function() {
            element.style.backgroundColor = "#08c";
        }
    }
}

getAllDependencies()
    .then(dependences => {
        embeddedHTML = dependences.annotatorPopup;
        annotatorActions = dependences.annotationActionsMenu;
        
        insertAnnotationButton();
    });