function saveToFirebase(link, content) {
    chrome.runtime.sendMessage({method: 'POST', link, content}, function (response) {
        console.log(response);
    });
}

function getFromFirebase(link) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({method: 'GET', link}, function (response) {
            console.log(response);
            resolve(response);
        });
    });
}

