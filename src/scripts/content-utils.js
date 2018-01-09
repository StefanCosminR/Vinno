/** ----------------- ANNOTATOR ----------------- */
function insertAnnotator(destionationElement, htmlTemplate) {
    let [container, shadowRoot] = insertNode(destionationElement, htmlTemplate, 'annotator-template', 'annotator-shadow-container');

    let image_names = [];
    let music_names = [];

    shadowRoot.getElementById('save-button').addEventListener('click', function () {
        if (verify_each_input(shadowRoot)) {

            var url = String(window.location.href);
            var content_title = ""

            if(url.indexOf("tunein") != -1)
                content_title = document.getElementById("playerTitle").innerHTML;
            else if(url.indexOf("mixcloud") != -1)
            {
                let title_wrapper = document.getElementsByClassName("title-inner-wrapper");
                content_title = title_wrapper[0].firstChild.firstChild.innerHTML;
            }
            else if(url.indexOf("youtube") != -1)
            {
                // cum se cheama video
            }
            else if(url.indexOf("vimeo") != -1)
            {
                // cum se cheama video
            }

            let title = shadowRoot.getElementById("annotator-title").value;
            let start_time = shadowRoot.getElementById("annotator-start-time").value;
            let end_time = shadowRoot.getElementById("annotator-finish-time").value;
            let description = shadowRoot.getElementById("annotator-description").value;
            let website = window.location.href;
            let [tags_list, new_description] = get_tags_from_description(description);
            let coordinates = [];
            coordinates.push(shadowRoot.getElementById("map_lat").value);
            coordinates.push(shadowRoot.getElementById("map_lng").value);

            let this_annotation = new AnnotationLayout(content_title, title, website, start_time, end_time, tags_list, new_description, image_names, music_names, coordinates);
            // debugger;
            saveAnnotationToFirebase("annotations/", this_annotation);

            removeAnnotator("annotator-shadow-container");

            image_names = [];
            music_names = [];
        }
    });

    shadowRoot.getElementById('close-button').addEventListener('click', function () {
        removeAnnotator("annotator-shadow-container");

        removeAttachmentToFirebase("removeAttachment", image_names);
        removeAttachmentToFirebase("removeAttachment", music_names);

        image_names = [];
        music_names = [];
    });

    window.onbeforeunload = function () {
        removeAttachmentToFirebase("removeAttachment", image_names);
        removeAttachmentToFirebase("removeAttachment", music_names);
    };

    let file_loader = shadowRoot.getElementById('annotator-file');
    let holder_images = shadowRoot.getElementById('images_holder');

    file_loader.addEventListener('change', function () {
        let current_files = file_loader.files;

        for (let i = 0; i < current_files.length; i++) {
            let fileReader = new FileReader();

            fileReader.onload = function (event) {
                if (current_files[i].name.endsWith(".img") || current_files[i].name.endsWith(".jpg") || current_files[i].name.endsWith(".jpeg"))
                    image_names.push(current_files[i].name);
                else if (current_files[i].name.endsWith(".mp3"))
                    music_names.push(current_files[i].name);

                saveAttachmentToFirebase("saveAttachment", {data: event.target.result, name: current_files[i].name});

                let image = document.createElement('img');
                if (current_files[i].name.endsWith(".img") || current_files[i].name.endsWith(".jpg") || current_files[i].name.endsWith(".jpeg")) {
                    image.src = window.URL.createObjectURL(current_files[i]);
                    image.setAttribute("class", "annotation-card__photo");
                }
                else if (current_files[i].name.endsWith(".mp3"))
                    image.setAttribute("class", "annotation-card__music");
                holder_images.appendChild(image);

                image.addEventListener("mouseover", function () {
                    image.src = "http://www.endlessicons.com/wp-content/uploads/2012/12/trash-icon.png";

                    image.addEventListener("click", function () {
                        let to_delete_image_names = [];
                        to_delete_image_names.push(image_names[i]);

                        if (i > -1)
                            if (image.class == "annotation-card__photo")
                                image_names.splice(i, 1);
                            else
                                music_names.splice(i, 1);

                        removeAttachmentToFirebase("removeAttachment", to_delete_image_names);
                        image.remove();
                    });
                });

                image.addEventListener("mouseout", function () {
                    image.src = window.URL.createObjectURL(current_files[i]);
                });
            };

            fileReader.readAsDataURL(current_files[i]);
        }
    });

    return [container, shadowRoot];
}

function get_tags_from_description(description) {
    let tag_list = [];
    let new_description = description;
    let all_words = description.match(/#\S+/g);

    if (all_words)
        for (let i = 0; i < all_words.length; i++) {
            let this_word = all_words[i];

            tag_list.push(this_word);
            new_description = new_description.replace(this_word, "{" + i + "}");
        }

    return [tag_list, new_description];
}

function verify_each_input(root) {
    let start_time_in_seconds = estimate_time_in_seconds(root.getElementById("annotator-start-time").value);
    let finish_time_in_seconds = estimate_time_in_seconds(root.getElementById("annotator-finish-time").value);

    if (start_time_in_seconds >= finish_time_in_seconds)
        return false;

    return true;
}

function estimate_time_in_seconds(time) {
    let each_part_of_time = String(time).split(":");
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

let annotationsSubject = new Subject();

class FloatingPanel {
    constructor(template, contentTemplate) {
        this._container = undefined;
        this._root = undefined;
        this._data = undefined;
        this._contentTemplate = contentTemplate;

        let body = document.getElementsByTagName('body')[0];
        [this._container, this._root] = insertNode(body, template, 'floating-panel-template', 'floating-panel');
        this.renderPanelStyles();
        this.addMovement();
    }

    renderPanelStyles() {
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

        this._container.setAttribute('class', 'floating-panel__container');
        this._container.setAttribute('style', css);
    }

    addMovement() {
        let mouseMoveListener = (event) => {
            this._container.style.right = document.documentElement.clientWidth - event.clientX - 200 + 'px';
        };

        let floatingPanelDragHandle = this._root.querySelector('.floating-panel__drag-handle');

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

    addDataObservable(observable) {
        observable.subscribe((data) => {
            this._data = data;
            this.updateView();
        })
    }

    updateView() {
        let annotations = '';
        this._data.forEach(annotation => {
            annotations += interpolation(this._contentTemplate, annotation);
        });
        this._root.querySelector('.floating-panel__content').innerHTML = annotations;
    }


}

function insertFloatingPanel(template, contentTemplate) {
    let floatingPanel = new FloatingPanel(template, contentTemplate);
    floatingPanel.addDataObservable(annotationsSubject);
    loadAllAnnotationsFor(window.location.href);
    /*
    let body = document.getElementsByTagName('body')[0];
    let [container, root] = insertNode(body, template, 'floating-panel-template', 'floating-panel');
    // container
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

    console.log(window.location.href);
    loadAllAnnotationsFor(window.location.href);

    annotationsSubject.subscribe(function (annotations) {
        console.log(annotations);
    });
    */
}

function loadAllAnnotationsFor(url) {
    load_annotations_from_database(url)
        .then(annotations => annotationsSubject.next(annotations));
}

function interpolation(source, tags) {

    console.log(tags);

    const regex = /({{)(\w+)(}})/gim;

    function replacer(match, braces1, word, braces2, offset, string) {
        let result = '';
        console.log(tags[word]);
        if(tags && tags[word]) {
            result = tags[word];
        }
        return result;
    }
    return source.replace(regex, replacer);
}

/**
 * @todo Resolve reloading of annotations on route change
 */
// window.onhashchange = function () {
//     alert("onhashchange = " + window.location.hash); // do something on click
// };


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
