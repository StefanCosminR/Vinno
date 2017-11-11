const annotatorShadowContainerId = 'annotator-shadow-container';
const annotatorTemplateId = 'annotator-template';

function createShadowContainer(destination) {
    let newContent = document.createElement('div');
    newContent.setAttribute('id', annotatorShadowContainerId);

    destination.appendChild(newContent);
}

function getShadowContainer() {
    return document.getElementById(annotatorShadowContainerId);
}

function insertTemplateInBody(template) {
    let templateContainer = document.createElement('template');
    templateContainer.setAttribute('id', annotatorTemplateId);
    templateContainer.innerHTML = template;
    document.getElementsByTagName('body')[0].appendChild(templateContainer);
}

function getAnnotatorTemplate() {
    return document.getElementById(annotatorTemplateId);
}


function insertAnnotatorInShadowContainer(container, element) {
    let root = container.createShadowRoot();
    root.appendChild(document.importNode(element.content, true));
}


function insertAnnotator(destinationElement, htmlTemplate) {
    createShadowContainer(destinationElement);

    let container = getShadowContainer();

    insertTemplateInBody(htmlTemplate);

    let domTemplate = getAnnotatorTemplate();

    insertAnnotatorInShadowContainer(container, domTemplate);
}

function removeAnnotator() {
    let element = document.getElementById(annotatorShadowContainerId);
    element.parentNode.removeChild(element);
}