/** ----------------- ANNOTATOR ----------------- */
function insertAnnotator(destionationElement, htmlTemplate) {
    let [container, shadowRoot] = insertNode(destionationElement, htmlTemplate, 'annotator-template', 'annotator-shadow-container');

    let all_images_data = [];
    let all_images_names = [];

    shadowRoot.getElementById('save-button').addEventListener('click', function() {

        if (verify_each_input(shadowRoot))
        {
            // we take all the data inserted in the popup

            let title = shadowRoot.getElementById("annotator-title").value;
            let start_time = shadowRoot.getElementById("annotator-start-time").value;
            let end_time = shadowRoot.getElementById("annotator-finish-time").value;
            let description = shadowRoot.getElementById("annotator-description").value;
            let website = window.location.href;
            let [tags_list, new_description] = get_tags_from_description(description);

            let all_images = [];
            for (let i = 0; i < all_images_data.length; i++)
                all_images.push({ data: all_images_data[i], name: all_images_names[i] });

            let this_annotation = new AnnotationLayout(title, website, start_time, end_time, tags_list, new_description, all_images);

            saveToFirebase("annotations/", this_annotation);

            removeAnnotator("annotator-shadow-container");
        }
    });    

    let file_loader = shadowRoot.getElementById('annotator-file');
    let holder_images = shadowRoot.getElementById('images_holder');

    file_loader.addEventListener('change', function() {
        let current_files = file_loader.files;

        for (let i = 0; i < current_files.length; i++) {
            all_images_names.push(current_files[i].name);
            let fileReader = new FileReader();
            
            fileReader.onload = function(event) {
                all_images_data.push(event.target.result);
            };

            fileReader.readAsDataURL(current_files[i]);

            let image = document.createElement('img');
            image.src = window.URL.createObjectURL(current_files[i]);
            image.setAttribute("class", "annotation-card__photo");
            
            holder_images.appendChild(image);
        }
    });

    return [container, shadowRoot];
}

function get_tags_from_description(description)
{
    let tags_list = [];
    let new_description = description;
    let all_words = description.match(/#\S+/g);

    if(all_words)
        for (let i = 0; i < all_words.length; i++)
        {
            let this_word = all_words[i];

            tags_list.push(this_word);
            new_description = new_description.replace(this_word, "{" + i + "}");
        }

    return [tags_list, new_description];
}

function verify_each_input(root)
{
    let start_time_in_seconds = estimate_time_in_seconds(root.getElementById("annotator-start-time").value);
    let finish_time_in_seconds = estimate_time_in_seconds(root.getElementById("annotator-finish-time").value);

    if (start_time_in_seconds >= finish_time_in_seconds)
        return false;
    return true;
}   

function estimate_time_in_seconds(time)
{
    let each_part_of_time = time.split(":");
    if (each_part_of_time.length == 3)
        return Number(each_part_of_time[0]) * 3600 + Number(each_part_of_time[1]) * 60 + Number(each_part_of_time[2]);
    else
        return Number(each_part_of_time[0]) * 60 + Number(each_part_of_time[1]);
}

function insertAnnotatorDisplay(destionationElement, htmlTemplate) {
    return insertNode(destionationElement, htmlTemplate, 'annotator-template-display', 'annotator-shadow-container-display');
}

function removeAnnotator(containerId) {
    let element = document.getElementById(containerId);
    element.parentNode.removeChild(element);
}

/** ----------------- DATABASE RELATED --------------- */
function load_annotations_from_database(urlsite) {
    return getFromFirebase("annotations/", urlsite);
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

