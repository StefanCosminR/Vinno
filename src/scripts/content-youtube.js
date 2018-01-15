let annotatorPopupTemplate;
let annotatorActions;

getAllDependencies()
    .then(dependencies => {
        annotatorPopupTemplate = dependencies.annotatorPopup;
        annotatorActions = dependencies.annotationActionsMenu; // quick insert button

        getTotalVideoTime();
        // addDotOnProgressBar();
        addAnnotatorActions(annotatorActions, annotatorPopupTemplate);
        insertFloatingPanel(dependencies.floatingPanel, dependencies.floatingPanelContentTemplate);
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
    return dot;
}

function getTotalVideoTime() {
    let time = document.getElementsByClassName('ytp-time-duration')[0].textContent;
    console.log(estimate_time_in_seconds(time));
}


function addAnnotatorActions(template, annotatorPopupTemplate) {
    let video = document.getElementById('movie_player');
    // let [container, root] = insertAnnotator(video, template);
    let [container, root] = insertNode(video, template, 'quick-annotator-button', 'quick-annotator-button-container');
    container.style.position = 'relative';
    container.style.top = '50px';
    container.style.right = '10px';
    container.style.zIndex = '4000';
    container.style.display = 'flex';
    container.style.flexDirection = 'row-reverse';
    container.style.opacity = 0.5;

    root.querySelector('.quick__button').addEventListener('click', function(event) {

        console.log('clicked');
        let progressBarDot = addDotOnProgressBar();
        progressBarDot = document.getElementsByClassName('ytp-time-display notranslate')[0];
        progressBarDot = document.querySelector('#floating-panel').shadowRoot.querySelector('.floating-panel__container .floating-panel__content');
        let [container, shadowRoot] = insertAnnotator(progressBarDot, annotatorPopupTemplate);
        container.style.position = 'absolute';
        container.style.bottom = '50px';

        let playButton = document.querySelector('.ytp-chrome-controls .ytp-left-controls .ytp-play-button');
        playButton.click();

        document.getElementById('annotator-shadow-container').addEventListener('click', function() {
            return false;
        });
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
