function saveAnnotationToFirebase(link, content) {
    chrome.runtime.sendMessage({method: 'POST', link, content}, function (response) {
    });
}

function saveAttachmentToFirebase(link, content) {
	    chrome.runtime.sendMessage({method: 'POST', link, content}, function (response) {
    });
}

function removeAttachmentToFirebase(link, content) {
        chrome.runtime.sendMessage({method: 'POST', link, content}, function (response) {
    });
}

function getFromFirebase(link, urlsite) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({method: 'GET', link, content:urlsite}, function (response) {
            resolve(response);
        });
    });
}

