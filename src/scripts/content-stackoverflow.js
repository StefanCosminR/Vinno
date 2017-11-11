chrome.runtime.sendMessage("getEmbeddedHtml", function (response) {
    let destinationElement = document.getElementById('h-top-questions');
    destinationElement.style.position = 'relative';

    let container = insertAnnotator(destinationElement, response.html);

    container.style.position = 'absolute';
    container.style.zIndex = 1000;
});

