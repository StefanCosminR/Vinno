let embeddedHTML;
let annotatorActions;

addAnnotatorActions = function(template) {
    var target = document.getElementsByClassName("clip-categories")[0];

    console.log(target);
}

getAllDependencies()
    .then(dependences => {
        embeddedHTML = dependences.annotatorPopup;
        annotatorActions = dependences.annotationActionsMenu;

        //addDotOnProgressBar();
        addAnnotatorActions(annotatorActions);
    });

