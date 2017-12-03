/** ----------------- ANNOTATOR ----------------- */


function insertAnnotator(destionationElement, htmlTemplate) {
    let [container, shadowRoot] = insertNode(destionationElement, htmlTemplate, 'annotator-template', 'annotator-shadow-container');

    shadowRoot.getElementById('save-button').addEventListener('click', saveAnnotatorContent);

    return [container, shadowRoot];
}

function insertAnnotatorDisplay(destionationElement, htmlTemplate) {
    return insertNode(destionationElement, htmlTemplate, 'annotator-template-display', 'annotator-shadow-container-display');
}

function removeAnnotator(containerId) {
    let element = document.getElementById(containerId);
    element.parentNode.removeChild(element);
}

function saveAnnotatorContent() {
    console.log('saving');
}




/** ----------------- FLOATING PANEL ----------------- */

function insertFloatingPanel(template) {
    let body = document.getElementsByTagName('body')[0];
    let [container, root] = insertNode(body, template, 'floating-panel-template', 'floating-panel');
    container.setAttribute('class', 'floating-panel__container');
    let css = `
    position: fixed;
    top: 70px;
    right: 50px;
    z-index: 6000;
    width: 400px;
    height: 80vh;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 17px 16px 124px -20px rgba(0,0,0,0.75);
    `;
    container.setAttribute('style', css);


    function mouseMoveListener(event) {
        container.style.right = document.documentElement.clientWidth - event.clientX - 200 + 'px';
    }

    let floatingPanelDragHandle = root.querySelector('.floating-panel__drag-handle');

    floatingPanelDragHandle.addEventListener('mousedown', function () {
        document.addEventListener('mousemove', mouseMoveListener);
        // floatingPanelDragHandle.style.cursor = '-webkit-grabbing';
        floatingPanelDragHandle.style.cursor = 'none';
        document.getElementsByTagName('body')[0].style.cursor = 'none';
    });

    document.addEventListener('mouseup', function () {
        document.removeEventListener('mousemove', mouseMoveListener);
        floatingPanelDragHandle.style.cursor = '-webkit-grab';
        document.getElementsByTagName('body')[0].style.cursor = 'auto';
    });
}





/** ----------------- GENERAL ----------------- */

function insertNode(destinationElement, htmlTemplate, htmlTemplateId, containerId) {
    let container = createNodeContainerOnElement(destinationElement, containerId);
    let domTemplate = insertTemplateInBody(htmlTemplate, htmlTemplateId);
    let shadowDom = convertNodeToShadowDom(container);
    insertNodeInShadowDom(shadowDom, domTemplate);

    return [container, shadowDom];
}

function insertTemplateInBody(template, templateId) {
    let templateContainer = document.getElementById(templateId);
    if (templateContainer) {
        console.warn('A template with this ID already exists, overriding it');
        templateContainer.innerHTML = template;
        return templateContainer;
    } else {
        templateContainer = document.createElement('template');
        templateContainer.setAttribute('id', templateId);
        templateContainer.innerHTML = template;
        return document.getElementsByTagName('body')[0].appendChild(templateContainer);
    }
}

function createNodeContainerOnElement(destionationElement, containerId) {
    let newContent = document.createElement('div');

    newContent.setAttribute('id', containerId);

    return destionationElement.appendChild(newContent);
}

function convertNodeToShadowDom(node) {
    return node.createShadowRoot();
}

function insertNodeInShadowDom(shadowDom, node) {
    shadowDom.appendChild(document.importNode(node.content, true));
}

