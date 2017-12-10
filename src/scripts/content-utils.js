/** ----------------- ANNOTATOR ----------------- */


function insertAnnotator(destionationElement, htmlTemplate) {
    var [container, shadowRoot] = insertNode(destionationElement, htmlTemplate, 'annotator-template', 'annotator-shadow-container');

    var all_images = [];

    shadowRoot.getElementById('save-button').addEventListener('click', function() {
        // we take all the data inserted in the popup

        var title = shadowRoot.getElementById("annotator-title").value;
        var start_time = shadowRoot.getElementById("annotator-start-time").value;
        var end_time = shadowRoot.getElementById("annotator-finish-time").value;
        var description = shadowRoot.getElementById("annotator-description").value;
        var website = window.location.href;


        var this_annotation = new AnnotationLayout(title, website, start_time, end_time, "tags_list", description, []);

        saveToFirebase("annotations/", this_annotation);
        saveToFirebase("images/", all_images);
    });

    var file_loader = shadowRoot.getElementById('annotator-file');
    var holder_images = shadowRoot.getElementById('images_holder');

    file_loader.addEventListener('change', function() {
        var current_files = file_loader.files;

        let fileReader = new FileReader();

        fileReader.onload = function(event) {
            // Here is the image converted in desired format
            all_images.push(event.target.result);
        };

        if (current_files.length) {
            for(var i = 0; i < current_files.length; i++) {

                fileReader.readAsDataURL(current_files[i]);

                var image = document.createElement('img');
                image.src = window.URL.createObjectURL(current_files[i]);
                image.setAttribute("class", "annotation-card__photo");
                
                holder_images.appendChild(image);
            }
        }
    });

    return [container, shadowRoot];
}

function insertAnnotatorDisplay(destionationElement, htmlTemplate) {
    return insertNode(destionationElement, htmlTemplate, 'annotator-template-display', 'annotator-shadow-container-display');
}

function removeAnnotator(containerId) {
    let element = document.getElementById(containerId);
    element.parentNode.removeChild(element);
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

