function getEmbeddedHtml() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage("getEmbeddedHtml", function (response) {
            resolve(response.html);
        });
    })
}

function getAnnotationDisplay() {
    return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage("getAnnotationDisplay", function (response) {
        resolve(response.html);
    });
})
}

function getAnnotationActions() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage('getAnnotatorActions', function(response) {
            resolve(response.html);
        });
    })
}

function getFloatingPanel() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage('getFloatingPanel', function(response) {
            resolve(response.html);
        });
    })
}

function getAllDependencies() {
    return new Promise((resolve, reject) => {
        let dependencies = {};
        getEmbeddedHtml()
            .then(response => {
                dependencies.annotatorPopup = response;
                return getAnnotationActions();
            })
            .then(response => {
                dependencies.annotationActionsMenu = response;
                return getFloatingPanel();

            })
            .then(response => {
                dependencies.floatingPanel = response;
                return getAnnotationDisplay();
            })
            .then(response => {
                dependencies.annotatorDisplay = response;
                resolve(dependencies);
            })
            .catch(err => reject(err));
    });

}