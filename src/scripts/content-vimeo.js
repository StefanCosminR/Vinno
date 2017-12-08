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

    storage: {
        annotations: [
          {
            id: "1",
            site: "https://www.youtube.com/watch?v=x-sbLkkEuwg",
            timestamp: "03-12-2017::18:48:34",
            startTime: "12:02",
            endTime: "12:33",
            keywords: ["music", "album", "JaymesYoung"],
            content: "<h1>Second song</h1><br><img>$1</img><br><img>$2</img><br>",
            images: ["1", "2"] // array with the images in annotation
          }],
        tags: ["album", "music", "programming","podcast"],
        noImages: "2", // number of images
        images1: [{id: "1", bytes: []}, {id: "2", bytes: []}], // images with id between 1 and 10
        favourites: ["1"] // array with the id of an annotation
        folder1: {id: "1", name: "Programming", annotations: ["2", "3"]}
      }