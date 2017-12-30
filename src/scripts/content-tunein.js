getAllDependencies()
	.then(dependencies => {

        let all_annotations_content_title = [];
        let all_annotations_titles = [];
        let all_annotations_start_time = [];
        let all_annotations_end_time = [];
        let all_annotations_tags = [];
        let all_annotations_description = [];
        let all_annotations_images_list = [];
        let all_annotations_music_list = [];
        let all_annotations_coordinates = [];

        let all_new_annotations = [];

        let all_annotations_total_number = 0;

        function main_function()
        {
            get_all_annotations();

            add_insert_annotation_button();

            let trigger = setInterval(function() {
                let full_time = document.getElementById("scrubberDuration");

                if (full_time != null && full_time.innerHTML != "00:00")
                {
                    fill_with_annotations(full_time.innerHTML);
                    clearInterval(trigger);
                }
            }, 1000);
        }

        function get_all_annotations()
        {
            let all_annotations = load_annotations_from_database("https://tunein.com/radio/");

            all_annotations.then(function(result) { 
                for (let i = 0; i < result.length; i++) 
                {
                    let this_annotation = result[i];

                    all_annotations_content_title.push(this_annotation.content_title);
                    all_annotations_titles.push(this_annotation.title);
                    all_annotations_start_time.push(this_annotation.start_time);
                    all_annotations_end_time.push(this_annotation.end_time);

                    if (this_annotation.tags_list)
                    {
                        let tags_list = this_annotation.tags_list;
                        let description = this_annotation.description;
                        
                        for (let j = 0; j < tags_list.length; j++)
                            description = description.replace("{" + j + "}", tags_list[j]);
                        
                        all_annotations_tags.push(tags_list);
                        all_annotations_description.push(description);
                    }   
                    else
                    {
                        all_annotations_tags.push([]);
                        all_annotations_description.push(this_annotation.description);
                    }
                    
                    if (this_annotation.images_list)
                        all_annotations_images_list.push(this_annotation.images_list);
                    else
                        all_annotations_images_list.push([]);

                    if (this_annotation.music_list)
                        all_annotations_music_list.push(this_annotation.music_list);
                    else
                        all_annotations_music_list.push([]);

                    if (this_annotation.coordinates)
                        all_annotations_coordinates.push(this_annotation.coordinates);
                    else
                        all_annotations_coordinates.push([]);
                }

                all_annotations_total_number = result.length;
            });
        }

        function add_insert_annotation_button()
        {
            let authentification_bar = document.getElementsByClassName("auth-links__container___rSeFg")[0];

            let new_annotate_button = document.createElement("a");
            let new_annotate_span = document.createElement("span");
            let new_annotate_separator = document.createElement("i");

            new_annotate_separator.setAttribute("class", "icons__icon-dot___GHWpv auth-links__divider___1pb-I");
            authentification_bar.appendChild(new_annotate_separator);

            new_annotate_span.setAttribute("style", "font-family:inherit;");
            new_annotate_span.innerText = "Insert Annotation";
            new_annotate_button.appendChild(new_annotate_span);

            new_annotate_button.setAttribute("class", "auth-links__whiteLink___3tT0y auth-links__link___GsWd7 auth-links__baseMuiTransition___1AQHm");
            new_annotate_button.setAttribute("role", "button");
            new_annotate_button.setAttribute("id", "add_annotation_button");

            authentification_bar.appendChild(new_annotate_button);

            let created_button = document.getElementById("add_annotation_button");

            created_button.addEventListener("click", function() {
                // we add a new popup

                document.getElementById("playerActionButton").click();

                let holder = document.getElementById("content");
                let [container, root] = insertAnnotator(holder, dependencies.annotatorPopup);

                let all_new_images = []
                let all_new_songs = [];

                container.style.position = "fixed";
                container.style.bottom = "10%";
                container.style.left = "25%";
                container.style.zIndex = 100;

                root.getElementById("annotator-start-time").value = "00:" + document.getElementById("scrubberElapsed").innerHTML;
                root.getElementById("annotator-finish-time").value = root.getElementById("annotator-start-time").value;

                let file_loader = root.getElementById('annotator-file');

                file_loader.addEventListener('change', function() {
                    let current_files = file_loader.files;

                    for (let i = 0; i < current_files.length; i++) 
                    {
                        let fileReader = new FileReader();
            
                        fileReader.onload = function(event) 
                        {
                            if (current_files[i].name.endsWith(".img") || current_files[i].name.endsWith(".jpg") || current_files[i].name.endsWith(".jpeg"))
                                all_new_images.push(event.target.result);
                            else if (current_files[i].name.endsWith(".mp3"))
                                all_new_songs.push("");
                        };
                        fileReader.readAsDataURL(current_files[i]);
                    }
                });

                root.getElementById("save-button").addEventListener("click", function() {
                    if (verify_each_input(root))
                    {
                        let content_title = document.getElementById("playerTitle").innerHTML;
                        let title = root.getElementById("annotator-title").value;
                        let start_time = root.getElementById("annotator-start-time").value;
                        let end_time = root.getElementById("annotator-finish-time").value;
                        let description = root.getElementById("annotator-description").value;
                        let coordinates = [];
                        coordinates.push(root.getElementById("map_lat").value);
                        coordinates.push(root.getElementById("map_lng").value);

                        all_annotations_total_number = all_annotations_total_number + 1;
                        let [tags_list, new_description] = get_tags_from_description(description);
                        
                        add_annotation_to_the_list(all_annotations_total_number, content_title, title, start_time, end_time, 
                                                   tags_list, description, all_new_images, all_new_songs, coordinates, document.getElementById("scrubberDuration").innerHTML);

                        document.getElementById("playerActionButton").click();
                    }
                });
            });
        }

        function fill_with_annotations(full_time)
        {
            for (let i = 0; i < all_annotations_titles.length; i++)
                if (all_annotations_content_title[i] == document.getElementById("playerTitle").innerHTML)
                    add_annotation_to_the_list(i, all_annotations_content_title[i], all_annotations_titles[i], all_annotations_start_time[i], 
                                               all_annotations_end_time[i], all_annotations_tags[i], 
                                               all_annotations_description[i], all_annotations_images_list[i], 
                                               all_annotations_music_list[i], all_annotations_coordinates[i], full_time);
        }

        function add_annotation_to_the_list(iterator, content_title, title, start_time, end_time, tags_list, description, images_list, music_list, coordinates, full_time)
        {
            // we display the popup on the loading area

            let full_time_bar = document.getElementById("scrubber").childNodes[0].childNodes[0];

            let new_annotation = document.createElement("div");
            new_annotation.setAttribute("id", title + "_" + iterator);

            let new_annotate_start_time_in_seconds = estimate_time_in_seconds(start_time);
            let new_annotate_finish_time_in_seconds = estimate_time_in_seconds(end_time);

            let start_push_pixels = new_annotate_start_time_in_seconds * full_time_bar.offsetWidth / estimate_time_in_seconds(full_time);
            let final_push_pixels = (new_annotate_finish_time_in_seconds - new_annotate_start_time_in_seconds) / estimate_time_in_seconds(full_time) * 100;

            let style_for_new_annotate = "position: absolute; height: 100%; transition: margin 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms; left: " + start_push_pixels + "px; background-color: rgb(255, 0, 0); width: calc(" + final_push_pixels +"%); ";
            new_annotation.setAttribute("style", style_for_new_annotate);

            full_time_bar.appendChild(new_annotation);

            let created_annotation = document.getElementById(title + "_" + iterator);
            
            add_listener_for_annotation(created_annotation, start_time, end_time, tags_list, description, images_list, music_list, coordinates);
        }

        function add_listener_for_annotation(annotation, start_time, end_time, tags_list, description, images_list, music_list, coordinates)
        {
            annotation.addEventListener("mouseover", function() {
                if (document.getElementById("annotator-shadow-container") == null)
                {
                    // we start to hover a popup

                    let holder = document.getElementById("content");
                    let [container, root] = insertAnnotatorDisplay(holder, dependencies.annotatorDisplay);

                    container.style.position = "fixed";
                    container.style.bottom = "10%";
                    container.style.left = "25%";
                    container.style.zIndex = 100;

                    // we set the title, start / finish time and description text for the hover popup

                    let holder_images = root.getElementById('images_holder');

                    root.getElementById("annotator-title").value = annotation.id.split("_")[0];

                    root.getElementById("annotator-start-time").value = start_time;
                    root.getElementById("annotator-finish-time").value = end_time;
                    root.getElementById("annotator-description").innerHTML = description;

                    let all_words = description.match(/#\S+/g);
                    if(all_words)
                        for (let i = 0; i < all_words.length; i++)
                            root.getElementById("annotator-description").innerHTML = root.getElementById("annotator-description").innerHTML.replace(all_words[i], 
                                                                                     '<span style="color: #1E90FF">'+ all_words[i] + '</span>');

                    for (let i = 0; i < images_list.length; i++)
                    {
                        let image = document.createElement('img');
                        image.src = images_list[i];
                        image.setAttribute("class", "annotation-card__photo");

                        holder_images.appendChild(image);
                    }

                    for (let i = 0; i < music_list.length; i++)
                    {
                        let image = document.createElement('img');
                        image.setAttribute("class", "annotation-card__music");

                        holder_images.appendChild(image);
                    }

                    root.getElementById("map_lat").value = coordinates[0];
                    root.getElementById("map_lng").value = coordinates[1];
                }
            });

            annotation.addEventListener("mouseout", function() {
                // we finish to hover a popup

                removeAnnotator("annotator-shadow-container-display");
            });
        }

        main_function();
	});

