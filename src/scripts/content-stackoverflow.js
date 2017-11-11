
/**
 *
 * @todo positioning css from .annotator-container should be handled by each page individually
 */
chrome.runtime.sendMessage("getEmbeddedHtml", function (response) {
    let destinationElement = document.getElementById('h-top-questions');
    destinationElement.style.position = 'relative';

    insertAnnotator(destinationElement, response.html);
});

