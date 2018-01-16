/*--------------------------------------------------------------------------------------------------------------------------------------------*/
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
                content_title = document.getElementsByClassName("title-inner-wrapper")[0].firstChild.firstChild.innerHTML;
            else if(url.indexOf("youtube") != -1)
            {
                content_title = document.title;
            }
            else if(url.indexOf("vimeo") != -1)
            {
                // de completat "content_title" -> cum se cheama video-ul
            }

            let title                        = shadowRoot.getElementById("annotator-title").value;
            let start_time                   = shadowRoot.getElementById("annotator-start-time").value;
            let end_time                     = shadowRoot.getElementById("annotator-finish-time").value;
            let description                  = shadowRoot.getElementById("annotator-description").value;
            let website                      = window.location.href;
            let [tags_list, new_description] = get_tags_from_description(description);
            let coordinates                  = [shadowRoot.getElementById("map_lat").value, shadowRoot.getElementById("map_lng").value];

            let this_annotation = new AnnotationLayout(content_title, title, website, start_time, end_time, tags_list, new_description, image_names, music_names, coordinates);
            saveAnnotationToFirebase("annotations/", this_annotation);

            removeAnnotator("annotator-shadow-container");

            image_names = [];
            music_names = [];
        }

        return [container, shadowRoot];
    });

    let closeButton = shadowRoot.getElementById('close-button');
    if(closeButton) {
        closeButton.addEventListener('click', function () {
            removeAnnotator("annotator-shadow-container");

            removeAttachmentToFirebase("removeAttachment", image_names);
            removeAttachmentToFirebase("removeAttachment", music_names);

            image_names = [];
            music_names = [];
        });
    }


    window.onbeforeunload = function () {
        removeAttachmentToFirebase("removeAttachment", image_names);
        removeAttachmentToFirebase("removeAttachment", music_names);
    };

    let file_loader   = shadowRoot.getElementById('annotator-file');
    let holder_images = shadowRoot.getElementById('images_holder');

    file_loader.addEventListener('change', function () {
        let current_files = file_loader.files;

        for (let i = 0; i < current_files.length; i++)
        {
            let fileReader = new FileReader();

            fileReader.onload = function (event) {
                if (current_files[i].name.endsWith(".img") || current_files[i].name.endsWith(".jpg") || current_files[i].name.endsWith(".jpeg"))
                    image_names.push(current_files[i].name);
                if (current_files[i].name.endsWith(".mp3"))
                    music_names.push(current_files[i].name);

                saveAttachmentToFirebase("saveAttachment", { data: event.target.result, name: current_files[i].name });

                let image = document.createElement('img');

                if (current_files[i].name.endsWith(".img") || current_files[i].name.endsWith(".jpg") || current_files[i].name.endsWith(".jpeg"))
                {
                    image.src = window.URL.createObjectURL(current_files[i]);
                    image.setAttribute("class", "annotation-card__photo");
                }
                else if (current_files[i].name.endsWith(".mp3"))
                    image.setAttribute("class", "annotation-card__music");

                holder_images.appendChild(image);
            };

            fileReader.readAsDataURL(current_files[i]);
        }
    });

    return [container, shadowRoot];
}
/*--------------------------------------------------------------------------------------------------------------------------------------------*/
function get_tags_from_description(description) {
    let tag_list = [];
    let new_description = description;
    let all_words = description.match(/ #\S+/g);

    if (all_words)
        for (let i = 0; i < all_words.length; i++) {
            let this_word = all_words[i];

            tag_list.push(this_word);
            new_description = new_description.replace(this_word, "{" + i + "}");
        }

    return [tag_list, new_description];
}
/*--------------------------------------------------------------------------------------------------------------------------------------------*/
function verify_each_input(root)
{
    let start_time_in_seconds  = estimate_time_in_seconds(root.getElementById("annotator-start-time").value);
    let finish_time_in_seconds = estimate_time_in_seconds(root.getElementById("annotator-finish-time").value);

    if (start_time_in_seconds >= finish_time_in_seconds)
        return false;

    return true;
}
/*--------------------------------------------------------------------------------------------------------------------------------------------*/
function estimate_time_in_seconds(time)
{
    let each_part_of_time = String(time).split(":");

    if (each_part_of_time.length == 3)
        return Number(each_part_of_time[0]) * 3600 + Number(each_part_of_time[1]) * 60 + Number(each_part_of_time[2]);
    else
        return Number(each_part_of_time[0]) * 60 + Number(each_part_of_time[1]);
}
/*--------------------------------------------------------------------------------------------------------------------------------------------*/
function load_annotations_from_database(urlsite)
{
    return getFromFirebase("annotations/", urlsite);
}
/*--------------------------------------------------------------------------------------------------------------------------------------------*/


/** ----------------- FLOATING PANEL ----------------- */

function insertAnnotatorDisplay(destionationElement, htmlTemplate) {
    return insertNode(destionationElement, htmlTemplate, 'annotator-template-display', 'annotator-shadow-container-display');
}

function removeAnnotator(containerId) {
    let element = document.getElementById(containerId);
    element.parentNode.removeChild(element);
}

let annotationsSubject = new Subject();

class FloatingPanel {
    constructor(template, contentTemplate) {
        this._container = undefined;
        this._root = undefined;
        this._data = undefined;
        this._contentTemplate = contentTemplate;
        this._images = [];
        this._music = [];

        let body = document.getElementsByTagName('body')[0];
        [this._container, this._root] = insertNode(body, template, 'floating-panel-template', 'floating-panel');

        let events = [];
        for (let property in document.getElementsByTagName('body')[0]) {
            let match = property.match(/^on(.*)/)
            if (match) {
                events.push(match[1]);
            }
        }

        events.forEach(event => {
            this._container.addEventListener(event, function(e) {
                if(e.preventBubble) {
                    e.preventBubble();
                    e.preventDefault();
                }
                // console.log('something triggered');
            });
        });

        console.log(events.join(' '));

        this.renderPanelStyles();
        this.addMovement();
        // console.log(window.myGoogle);
        // setTimeout(() => {console.log("my google: ", window); console.log(document.test2);}, 4000);
        // setTimeout(() => { this._placeMapAtCurrentLocation(); }, 18000);
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

        let documentFragment = document.createDocumentFragment();
        let domParser = new DOMParser();

        documentFragment.appendChild(this.getAnnotatorCreator());

        this._data.forEach(annotation => {
            annotation.description = this._augmentTextWithLinks(annotation.description);
            let augmentedContent = interpolation(this._contentTemplate, annotation);
            if(annotation.tags_list) {
                for (let i = 0; i < annotation.tags_list.length; i++)
                    augmentedContent = augmentedContent.replace("{" + i + "}", `<span class="tag">${annotation.tags_list[i]}<\/span>`);
            }

            // augmentedContent = this._augmentTextWithLinks(augmentedContent)

            let contentNode = domParser.parseFromString(augmentedContent, 'text/html');
            if(annotation.images_list) {


                let photosContainer = contentNode.getElementsByClassName('annotation-card__photos')[0];
                let imagesHtml = '';
                annotation.images_list.forEach(image => {
                    imagesHtml += `
                <div class="annotation-card__photo" style="background-image: url('${image}')"></div>
                `;
                });
                photosContainer.innerHTML = imagesHtml;
            }
            documentFragment.appendChild(contentNode.body.firstChild);

        });

        this._root.querySelector('.floating-panel__content').appendChild(documentFragment);

        this.processContent();
    }

    processContent() {
        // let photosContainer = this._root.querySelectorAll('.annotation-card__photos');
        // photosContainer.forEach(annotation => {
        //     // if (annotation.childNodes.length <= 1) { // this number is very very very weird
        //     //     annotation.style.display = 'none';
        //     // }
        // });

        let descriptionInput = this._root.querySelector('.annotation-card__text');
        descriptionInput.addEventListener('input', (e) => {
            this._addColorHashtagsInInput(descriptionInput);
        })
    }

    getAnnotatorCreator() {
        let template = document.createElement('form');
        template.setAttribute('id', 'annotator-creator-container');
        template.innerHTML = interpolation(this._contentTemplate, {});

        let inputs = template.querySelectorAll('input');
        for (let i = 0; i < inputs.length; ++i) {
            inputs[i].removeAttribute('readonly');
        }

        let descriptionArea = template.querySelector('.annotation-card__text');
        descriptionArea.setAttribute('contenteditable', 'true');

        let saveButton = template.querySelector('.annotation-card__action-button');
        saveButton.textContent = 'Save';
        saveButton.removeAttribute('style');
        saveButton.addEventListener('click', (event) => {
            event.preventDefault();
            let annotatorData = this.getAnnotatorCreatorContent();
            let description = template.getElementsByClassName('annotation-card__text')[0].textContent;
            let [tagsList, parsedDescription] = get_tags_from_description(description);
            let videoTitle = document.querySelector('#info-contents h1.title').textContent;
            let websiteUrl = window.location.href;
            // console.log(videoTitle);
            // console.log(annotatorData.title);

            let newAnnotationData = new AnnotationLayout(
                annotatorData.content_title || '',
                videoTitle,
                websiteUrl || '',
                annotatorData.start_time || '',
                annotatorData.end_time || '',
                tagsList, parsedDescription, this._images, this._music, [0, 0]);

            saveAnnotationToFirebase('annotations/', newAnnotationData);
        });

        let photoContainer = template.querySelector('.annotation-card__photos');
        photoContainer.innerHTML = `
        <input id="file-uploader" type="file" multiple style="display: none"/>
        <label for="file-uploader" class="annotation-card__photo annotation-card__photo-insert"></label>
`;
        photoContainer.style.display = 'initial';
        // console.log(photoContainer);
        photoContainer.removeAttribute('style');
        // console.log(photoContainer);

        this._fileLoaderAction(photoContainer.querySelector('#file-uploader'), photoContainer);

        return template;
    }

    getAnnotatorCreatorContent() {
        let form = this._root.querySelector('form');
        let data = {};
        let formData = new FormData(form);
        for (let pair of formData.entries()) {
            data[pair[0]] = pair[1];
        }

        return data;
    }

    _addColorHashtagsInInput(element) {
        let changedDescription = element.textContent;
        let tags = changedDescription.match(/#\S+(?=\s)/g);

        if (tags)
            for (let i = 0; i < tags.length; i++) {
                let tag = tags[i];
                changedDescription = changedDescription.replace(tag, `<span class='tag'>${tag}</span>`);
            }
        element.innerHTML = changedDescription;
        console.log(changedDescription);
        this._placeCaretAtEnd(element);

        console.log(tags);

    }

    _placeCaretAtEnd(el) {
        el.focus();
        if (typeof window.getSelection !== "undefined"
            && typeof document.createRange !== "undefined") {
            const range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (typeof document.body.createTextRange !== "undefined") {
            const textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
        }
    }

    _placeMapAtCurrentLocation() {
        console.log(window.myGoogle);
        let map = new window.myGoogle.maps.Map(this._root.querySelector("#map"), {
            center: {lat: 47.1584549, lng: 27.601441799999975},
            zoom: 13,
            mapTypeId: "roadmap"
        });
        // window.myGoogle = google;
        // Create the search box and link it to the UI element.
        let input = this._root.querySelector("#pac-input");
        let searchBox = new window.myGoogle.maps.places.SearchBox(input);
        map.controls[window.myGoogle.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener("bounds_changed", function () {
            searchBox.setBounds(map.getBounds());
        });

        searchBox.addListener("places_changed", function () {
            let place = searchBox.getPlaces()[0];

            // For each place, get the icon, name and location.
            let bounds = new google.maps.LatLngBounds();

            this._root.querySelector("#map_lat").value = place.geometry.location.lat();
            this._root.querySelector("#map_lng").value = place.geometry.location.lng();

            bounds.union(place.geometry.viewport);
            map.fitBounds(bounds);
        });
    }

    _augmentTextWithLinks(text) {
        let augmentedText = text;

        let linkRegex = /((http[s]?)(:\/\/)((\S)+))/g;
        const regex = /((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/g;
        let links = text.match(linkRegex);

        if(links) {
            links.forEach(link => {
                let linkArr = link.split(regex);
                console.log(linkArr);
                if(linkArr[3].indexOf('youtube') !== -1) {
                    let videoId = linkArr[7].substring(3);
                    console.log(videoId);
                    augmentedText = augmentedText.replace(link, `<iframe class="embedded-video" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`);
                } else if(linkArr[3].indexOf('wikipedia') !== -1) {
                    let wikiName = linkArr[6].replace('_', ' ');
                    augmentedText = augmentedText.replace(link, `
                        <a href="${link}">${wikiName}</a>
                    `);
                }
                // augmentedText = augmentedText.replace(tag, `<iframe class='tag'>${tag}</iframe>`);
            })

        }
        return augmentedText;
    }

    _fileLoaderAction(fileLoader, photoContainer) {
        fileLoader.addEventListener('change', () => {
            let current_files = fileLoader.files;
            let holder_images = photoContainer;


            let self = this;

            for (let i = 0; i < current_files.length; i++) {
                let fileReader = new FileReader();


                fileReader.onload = function (event) {

                    console.log(event);

                    if (current_files[i].name.endsWith(".img") || current_files[i].name.endsWith(".jpg") || current_files[i].name.endsWith(".jpeg"))
                        self._images.push(current_files[i].name);
                    else if (current_files[i].name.endsWith(".mp3"))
                        self._music.push(current_files[i].name);

                    console.log('saving to firebase');

                    saveAttachmentToFirebase("saveAttachment", {data: event.target.result, name: current_files[i].name});

                    let image = document.createElement('img');
                    console.log(current_files[i]);
                    if (current_files[i].name.endsWith(".img") || current_files[i].name.endsWith(".jpg") || current_files[i].name.endsWith(".jpeg") || current_files[i].name.endsWith('.png')) {
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
                            to_delete_image_names.push(self._images[i]);

                            if (i > -1)
                                if (image.class == "annotation-card__photo")
                                    self._images.splice(i, 1);
                                else
                                    self._music.splice(i, 1);

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
    }

}

function insertFloatingPanel(template, contentTemplate) {
    let floatingPanel = new FloatingPanel(template, contentTemplate);
    floatingPanel.addDataObservable(annotationsSubject);
    loadAllAnnotationsFor(window.location.href);
}

function loadAllAnnotationsFor(url) {
    load_annotations_from_database(url)
        .then(annotations => annotationsSubject.next(annotations));
}

annotationsSubject.subscribe((ann) => console.log(ann));

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

window.addEventListener('popstate', function() {
    console.log('TRIGGERED POP STATE');
});


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
        templateContainer.parentNode.removeChild(templateContainer);
        // templateContainer.innerHTML = template;
        // return templateContainer;
        templateContainer = document.createElement('template');
        templateContainer.setAttribute('id', templateId);
        templateContainer.innerHTML = template;
        return document.getElementsByTagName('body')[0].appendChild(templateContainer);
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
