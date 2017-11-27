let embeddedHTML;
let annotatorActions;

addAnnotatorActions = function(template) {
    let target = document.getElementsByClassName("clip-categories")[0];
    let [container, root] = insertAnnotator(target, template);

    container.style.position = "relative";

    //root.querySelector(".")

    
}

getAllDependencies()
    .then(dependences => {
        embeddedHTML = dependences.annotatorPopup;
        annotatorActions = dependences.annotationActionsMenu;

        //addDotOnProgressBar();
        addAnnotatorActions(annotatorActions);
    });

