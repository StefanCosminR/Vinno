function saveToFirebase(link, content) {
    chrome.runtime.sendMessage({method: 'POST', link, content}, function (response) {
        console.log(response);
    });
}

function getFromFirebase(link, urlsite) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({method: 'GET', link, content:urlsite}, function (response) {
            console.log(response);
            resolve(response);
        });
    });
}

