getAllDependencies().then(dependencies => {
    let annotations_from_database = [];
    let annotations_inserted_now  = 0;
    let automatic_display         = false;
    /*--------------------------------------------------------------------------------------------------------------------------------------------*/
    function main_function()
    {
        get_annotations_from_database();
        add_annotations_insert_button();

        let trigger = setInterval(function() {
            let full_time = document.getElementById("scrubberDuration");

            if (full_time != null && full_time.innerHTML != "00:00")
            {
                chrome.storage.local.get("show_annotations", function (result) {
                    if (result.show_annotations)
                        chrome.storage.local.get("automatic_display", function (result) {
                            console.clear();

                            automatic_display = result.automatic_display;

                            for (let i = 0; i < annotations_from_database.length; i++)
                                if (annotations_from_database[i].song_title == document.getElementById("playerTitle").innerHTML)
                                    add_annotation_for_display(i, annotations_from_database[i].annotation_title, estimate_time_in_seconds(annotations_from_database[i].start_time), 
                                                               estimate_time_in_seconds(annotations_from_database[i].end_time), estimate_time_in_seconds(full_time.innerHTML));

                            if (automatic_display)
                                actions_upon_automatic_showing_annotations();
                            else
                                for (let i = 0; i < annotations_from_database.length; i++)
                                    if (annotations_from_database[i].song_title == document.getElementById("playerTitle").innerHTML)
                                        actions_upon_hover_annotations(i, annotations_from_database[i].annotation_title, annotations_from_database[i].start_time, 
                                                                       annotations_from_database[i].end_time, annotations_from_database[i].tags, annotations_from_database[i].description, 
                                                                       annotations_from_database[i].image_list, annotations_from_database[i].music_list, annotations_from_database[i].coordinates);

                            clearInterval(trigger);
                        });
                });
            }
        }, 500);
    }
    /*--------------------------------------------------------------------------------------------------------------------------------------------*/
    function get_annotations_from_database()
    {
        annotations_from_database = [];

        let all_annotations = load_annotations_from_database("https://tunein.com/radio/");

        all_annotations.then(function(result) { 
            for (let i = 0; i < result.length; i++) 
            {
                let each_annotation = {
                    song_title       : result[i].content_title,
                    annotation_title : result[i].title,
                    start_time       : result[i].start_time,
                    end_time         : result[i].end_time
                };

                if (result[i].tags_list)
                {
                    let tags_list   = result[i].tags_list;
                    let description = result[i].description;
                    
                    for (let j = 0; j < tags_list.length; j++)
                        description = description.replace("{" + j + "}", tags_list[j]);
                    
                    each_annotation.tags        = tags_list;
                    each_annotation.description = description;
                }   
                else
                {
                    each_annotation.tags        = [];
                    each_annotation.description = result[i].description;
                }

                if (result[i].images_list)
                    each_annotation.image_list = result[i].images_list;
                else
                    each_annotation.image_list = [];

                if (result[i].music_list)
                    each_annotation.music_list = result[i].music_list;
                else
                    each_annotation.music_list = [];

                if (result[i].coordinates)
                    each_annotation.coordinates = result[i].coordinates;
                else
                    each_annotation.coordinates = [];

                annotations_from_database.push(each_annotation);
                annotations_from_database.sort(function(first, second) { return estimate_time_in_seconds(first.start_time) - estimate_time_in_seconds(second.start_time); });
                annotations_inserted_now = annotations_from_database.length;
            }
        });
    }
    /*--------------------------------------------------------------------------------------------------------------------------------------------*/
    function add_annotations_insert_button()
    {
        let authentification_bar_holder = document.getElementsByClassName("auth-links__container___rSeFg")[0];

        let new_button_a    = document.createElement("a");
        let new_button_span = document.createElement("span");
        let new_button_i    = document.createElement("i");

        new_button_i.setAttribute("class", "icons__icon-dot___GHWpv auth-links__divider___1pb-I");

        new_button_span.setAttribute("style", "font-family:inherit;");
        new_button_span.innerHTML = "Insert Annotation";

        new_button_a.appendChild(new_button_span);

        new_button_a.setAttribute("class", "auth-links__whiteLink___3tT0y auth-links__link___GsWd7 auth-links__baseMuiTransition___1AQHm");
        new_button_a.setAttribute("role",  "button");
        new_button_a.setAttribute("id",    "add_annotation_button");

        authentification_bar_holder.appendChild(new_button_i);
        authentification_bar_holder.appendChild(new_button_a);

        actions_upon_annotations_insert_button();
    }
    /*--------------------------------------------------------------------------------------------------------------------------------------------*/
    function actions_upon_annotations_insert_button()
    {
        let button_holder = document.getElementById("add_annotation_button");

        button_holder.addEventListener("click", function() {
            document.getElementById("playerActionButton").click();

            let [container, root] = insertAnnotator(document.getElementById("content"), dependencies.annotatorPopup);

            container.style.position = "fixed";
            container.style.bottom   = "10%";
            container.style.left     = "25%";
            container.style.zIndex   = 100;

            root.getElementById("annotator-start-time").value  = "00:" + document.getElementById("scrubberElapsed").innerHTML;
            root.getElementById("annotator-finish-time").value = root.getElementById("annotator-start-time").value;

            let new_image_list  = []
            let new_music_list  = [];

            let file_loader = root.getElementById("annotator-file");

            file_loader.addEventListener("change", function() {
                let current_files = file_loader.files;

                for (let i = 0; i < current_files.length; i++) 
                {
                    let fileReader = new FileReader();
        
                    fileReader.onload = function(event) {
                        if (current_files[i].name.endsWith(".img") || current_files[i].name.endsWith(".jpg") || current_files[i].name.endsWith(".jpeg"))
                            new_image_list.push(event.target.result);
                        if (current_files[i].name.endsWith(".mp3"))
                            new_music_list.push("");
                    };

                    fileReader.readAsDataURL(current_files[i]);
                }
            });

            root.getElementById("save-button").addEventListener("click", function() {
                if (verify_each_input(root))
                {
                    let song_title       = document.getElementById("playerTitle").innerHTML;
                    let annotation_title = root.getElementById("annotator-title").value;
                    let start_time       = root.getElementById("annotator-start-time").value;
                    let end_time         = root.getElementById("annotator-finish-time").value;
                    let description      = root.getElementById("annotator-description").value;
                    let coordinates      = [root.getElementById("map_lat").value, root.getElementById("map_lng").value];

                    let [tags, ] = get_tags_from_description(description);
                    
                    annotations_inserted_now = annotations_inserted_now + 1;

                    add_annotation_for_display(annotations_inserted_now, annotation_title, estimate_time_in_seconds(start_time), estimate_time_in_seconds(end_time), 
                                               estimate_time_in_seconds(document.getElementById("scrubberDuration").innerHTML));

                    if (automatic_display)
                        get_annotations_from_database();
                    else
                        actions_upon_hover_annotations(annotations_inserted_now, annotation_title, start_time, end_time, tags, description, new_image_list, new_music_list, coordinates);

                    document.getElementById("playerActionButton").click();
                }
            });
        });
    }
    /*--------------------------------------------------------------------------------------------------------------------------------------------*/
    function add_annotation_for_display(iterator, annotation_title, start_time, end_time, full_time)
    {
        let time_bar_holder = document.getElementById("scrubber").childNodes[0].childNodes[0];

        let new_annotation = document.createElement("div");
        new_annotation.setAttribute("id", annotation_title + "_" + iterator);

        let start_push_pixels = start_time * time_bar_holder.offsetWidth / full_time;
        let final_push_pixels = (end_time - start_time) / full_time * 100;

        let style_for_new_annotate = "position: absolute; height: 100%; transition: margin 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms; left: " + start_push_pixels + 
                                     "px; background-color: rgb(255, 0, 0); width: calc(" + final_push_pixels +"%); ";

        new_annotation.setAttribute("style", style_for_new_annotate);

        time_bar_holder.appendChild(new_annotation);
    }
    /*--------------------------------------------------------------------------------------------------------------------------------------------*/
    function actions_upon_automatic_showing_annotations()
    {
        let trigger = setInterval(function() { 
            let current_time = estimate_time_in_seconds(document.getElementById("scrubberElapsed").innerHTML);
            let is_over_song = -1;

            for (let i = 0; i < annotations_from_database.length; i++)
                if (annotations_from_database[i].song_title == document.getElementById("playerTitle").innerHTML &&
                    current_time >= estimate_time_in_seconds(annotations_from_database[i].start_time)           &&
                    current_time <= estimate_time_in_seconds(annotations_from_database[i].end_time))
                {
                    is_over_song = i;
                    break;
                }
            
            if (is_over_song == -1 && document.getElementById("annotator-shadow-container-display"))
                removeAnnotator("annotator-shadow-container-display");

            if (is_over_song != -1 && !document.getElementById("annotator-shadow-container-display"))
            {
                let each_annotation = document.getElementById(annotations_from_database[is_over_song].annotation_title + "_" + is_over_song);

                let [container, root] = insertAnnotatorDisplay(document.getElementById("content"), dependencies.annotatorDisplay);

                container.style.position = "fixed";
                container.style.bottom   = "10%";
                container.style.left     = "25%";
                container.style.zIndex   = 100;

                let attachments_holder = root.getElementById("images_holder");

                root.getElementById("annotator-title").value = each_annotation.id.split("_")[0];

                root.getElementById("annotator-start-time").value      = annotations_from_database[is_over_song].start_time;
                root.getElementById("annotator-finish-time").value     = annotations_from_database[is_over_song].end_time;
                root.getElementById("annotator-description").innerHTML = annotations_from_database[is_over_song].description;

                let tags = annotations_from_database[is_over_song].description.match(/ #\S+/g);
                if (tags)
                    for (let j = 0; j < tags.length; j++)
                        root.getElementById("annotator-description").innerHTML = root.getElementById("annotator-description").innerHTML.replace(tags[j], 
                                                                                 '<span style="color: #1E90FF">'+ tags[j] + "</span>");

                for (let j = 0; j < annotations_from_database[is_over_song].image_list.length; j++)
                {
                    let new_image = document.createElement("img");
                    new_image.src = annotations_from_database[is_over_song].image_list[j];
                    new_image.setAttribute("class", "annotation-card__photo");

                    attachments_holder.appendChild(new_image);
                }

                for (let j = 0; j < annotations_from_database[is_over_song].music_list.length; j++)
                {
                    let new_image = document.createElement("img");
                    new_image.setAttribute("class", "annotation-card__music");

                    attachments_holder.appendChild(new_image);
                }

                root.getElementById("map_lat").value = annotations_from_database[is_over_song].coordinates[0];
                root.getElementById("map_lng").value = annotations_from_database[is_over_song].coordinates[1];
            }
        }, 500);
    }
    /*--------------------------------------------------------------------------------------------------------------------------------------------*/
    function actions_upon_hover_annotations(iterator, annotation_title, start_time, end_time, tags, description, image_list, music_list, coordinates)
    {
        let each_annotation = document.getElementById(annotation_title + "_" + iterator);

        each_annotation.addEventListener("mouseover", function() {
            let [container, root] = insertAnnotatorDisplay(document.getElementById("content"), dependencies.annotatorDisplay);

            container.style.position = "fixed";
            container.style.bottom   = "10%";
            container.style.left     = "25%";
            container.style.zIndex   = 100;

            let attachments_holder = root.getElementById("images_holder");

            root.getElementById("annotator-title").value = each_annotation.id.split("_")[0];

            root.getElementById("annotator-start-time").value      = start_time;
            root.getElementById("annotator-finish-time").value     = end_time;
            root.getElementById("annotator-description").innerHTML = description;

            let tags = description.match(/ #\S+/g);
            if (tags)
                for (let j = 0; j < tags.length; j++)
                    root.getElementById("annotator-description").innerHTML = root.getElementById("annotator-description").innerHTML.replace(tags[j], 
                                                                             '<span style="color: #1E90FF">'+ tags[j] + "</span>");

            for (let j = 0; j < image_list.length; j++)
            {
                let new_image = document.createElement("img");
                new_image.src = image_list[j];
                new_image.setAttribute("class", "annotation-card__photo");

                attachments_holder.appendChild(new_image);
            }

            for (let j = 0; j < music_list.length; j++)
            {
                let new_image = document.createElement("img");
                new_image.setAttribute("class", "annotation-card__music");

                attachments_holder.appendChild(new_image);
            }

            root.getElementById("map_lat").value = coordinates[0];
            root.getElementById("map_lng").value = coordinates[1];
        });

        each_annotation.addEventListener("mouseout", function() {
            removeAnnotator("annotator-shadow-container-display");
        });
    }
    /*--------------------------------------------------------------------------------------------------------------------------------------------*/
    main_function();
    /*--------------------------------------------------------------------------------------------------------------------------------------------*/
});

