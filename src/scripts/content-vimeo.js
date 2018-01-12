let embeddedHTML;
let annotatorActions;

addAnnotatorActions = function(template) {
    let target = document.getElementsByClassName("clip-categories")[0];
    let [container, root] = insertAnnotator(target, template);

    container.style.position = "relative";

    //root.querySelector(".")

    
}

insertAnnotationButton = function() {
    var sidedock = document.getElementsByClassName("sidedock")[0];
    var annotationButton = sidedock.lastChild
                            .cloneNode(true);

    annotationButton.firstChild.firstChild.textContent = "Add Annotation";
    
    sidedock.appendChild(annotationButton);

    console.log(annotationButton);
    
}

getAllDependencies()
    .then(dependences => {
        embeddedHTML = dependences.annotatorPopup;
        annotatorActions = dependences.annotationActionsMenu;

        insertAnnotationButton();
        //addDotOnProgressBar();
        //addAnnotatorActions(annotatorActions);
    });