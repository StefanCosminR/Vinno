let embeddedHtml;
let annotatorActions;

getAllDependencies()
    .then(dependencies => {
        embeddedHtml = dependencies.annotatorPopup;
        annotatorActions = dependencies.annotationActionsMenu;

        // addDotOnProgressBar();
        // addAnnotatorActions(annotatorActions);
        insertFloatingPanel(dependencies.floatingPanel);
    });



function addDotOnProgressBar() {
    let progressBar = document.getElementsByClassName('ytp-progress-bar')[0];
    let scrubber = progressBar.getElementsByClassName('ytp-scrubber-container')[0];

    let progressList = document.getElementsByClassName('ytp-ad-progress-list')[0];

    let scrubberTranslateX = scrubber.style.transform;


    let position = extractPxFromTranslateX(scrubberTranslateX);

    let dot = document.createElement('div');
    dot.setAttribute('class', 'annotator-dot ytp-ad-progress');
    dot.setAttribute('style', `left: ${position}; width: 6px; background: #42f448`);

    progressList.appendChild(dot);

    console.log(document.getElementsByClassName('annotator-dot'));
}




function addAnnotatorActions(template) {
    let video = document.getElementById('movie_player');
    let [container, root] = insertAnnotator(video, template);

    container.style.position = 'relative';
    container.style.top = '50px';
    container.style.right = '10px';
    container.style.zIndex = '4000';
    container.style.display = 'flex';
    container.style.flexDirection = 'row-reverse';
    container.style.opacity = 0.5;

    root.querySelector('.quick__button').addEventListener('click', function() {
        console.log('clicked');
    });
}


function extractPxFromTranslateX(str) {
    const regex = /(\(.*(?=\)))/g;
    // const str = `translateX(6.70436px)`;
    let m;

    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        return m[0].substr(1);
    }
}
