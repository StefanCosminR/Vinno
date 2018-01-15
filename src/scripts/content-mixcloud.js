getAllDependencies()
	.then(dependencies => {

        let annotations_content_title = [];
        let annotations_title = [];
        let annotations_description = [];
        let annotations_start_time = [];
        let annotations_end_time = [];
        let annotations_tags = [];
        let annotations_images = [];
        let annotations_music = [];

        let annotations_number = 0;
        let new_annotations = [];

        function main_function()
        {
            get_all_annotations();

            add_insert_annotation_button();

            let trigger = setInterval(function() {
                let full_time = document.getElementsByClassName("player-time end-time")[0];

                if (full_time != null)
                {
										full_time = full_time.innerText.substr(1, full_time.length);
                    fill_with_annotations(full_time.innerHTML);
                    clearInterval(trigger);
										// console.log("Full time: " + full_time);
                }
            }, 1000);
        }

        function get_all_annotations()
        {

					let showing_panel;
					chrome.storage.local.get('show_floating_panel', function (result) {
					    showing_panel = result.show_floating_panel;
					});
            let annotations = load_annotations_from_database("https://www.mixcloud.com/");

            annotations.then(function(result) {
                for (let i = 0; i < result.length; i++)
                {
                    let current_annotation = result[i];

                    annotations_content_title.push(current_annotation.content_title);
                    annotations_title.push(current_annotation.title);
                    annotations_start_time.push(current_annotation.start_time);
                    annotations_end_time.push(current_annotation.end_time);

                    if (current_annotation.tags_list)
                    {
                        let tags_list = current_annotation.tags_list;
                        let description = current_annotation.description;

                        for (let j = 0; j < tags_list.length; j++)
                            description = description.replace("{" + j + "}", tags_list[j]);

                        annotations_tags.push(tags_list);
                        annotations_description.push(description);
                    }
                    else
                    {
                        annotations_tags.push([]);
                        annotations_description.push(current_annotation.description);
                    }

                    if (current_annotation.images_list)
                        annotations_images.push(current_annotation.images_list);
                    else
                        annotations_images.push([]);

                    if (current_annotation.music_list)
                        annotations_music.push(current_annotation.music_list);
                    else
                        annotations_music.push([]);
                }

                annotations_number = result.length;

								// console.log("Finished getting annotations...");
								// console.log("Annotations number:" + annotations_number);
                //
								// console.log("Content titles: " + annotations_content_title);
								// console.log("Titles: " + annotations_title);
								// console.log("Descriptions: " + annotations_description);
								// console.log("Start times: " + annotations_start_time);
								// console.log("End times: " + annotations_end_time);
								// console.log("Tags: " + annotations_tags);
								// console.log("Images: " + annotations_images);
								// console.log("Music: " + annotations_music);

            });
        }

        function add_insert_annotation_button()
        {
						let auth_bars = document.getElementsByClassName("user-actions guest");
            let authentification_bar = auth_bars[0];
						// console.log("Authentification bar: " + authentification_bar);

						let or = document.createElement("em");
						or.innerText = "or";
						authentification_bar.appendChild(or);

						let span = document.createElement("span");
						span.innerText = "Insert Annotation";
						span.id = "add_annotation_span";
						authentification_bar.appendChild(span);

            let created_span = document.getElementById("add_annotation_span");

            created_span.addEventListener("click", function() {
								let new_images = [];
								let new_songs = [];

								document.getElementsByClassName("play-icon state")[0].click();

								let holder = document.getElementsByClassName("player-waveform")[0];
								// debugger;
                let [container, root] = insertAnnotator(holder, dependencies.annotatorPopup);

                container.style.position = "fixed";
                container.style.bottom = "10%";
                container.style.left = "25%";
                container.style.zIndex = 100;

                root.getElementById("annotator-start-time").value = "00:" + document.getElementsByClassName("player-time")[0].innerHTML;
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
                                new_images.push(event.target.result);
                            else if (current_files[i].name.endsWith(".mp3"))
                                new_songs.push("");
                        };
                        fileReader.readAsDataURL(current_files[i]);
                    }
                });

                root.getElementById("save-button").addEventListener("click", function() {
                    if (verify_each_input(root))
                    {
												let title_wrapper = document.getElementsByClassName("title-inner-wrapper");

												let content_title = title_wrapper[0].firstChild.firstChild.innerHTML;
                        let title = root.getElementById("annotator-title").value;
                        let start_time = root.getElementById("annotator-start-time").value;
                        let end_time = root.getElementById("annotator-finish-time").value;
                        let description = root.getElementById("annotator-description").value;

												console.log("Content title:" + content_title);
												console.log("Title: " + title);
												console.log("Description: " + description);
												console.log("Start time: " + start_time);
												console.log("End time: " + end_time);

                        annotations_number = annotations_number + 1;
                        let [tags_list, new_description] = get_tags_from_description(description);

												let full_time = document.getElementsByClassName("player-time end-time")[0];

                        add_annotation_to_the_list(annotations_number, content_title, title, start_time, end_time,
                                                   tags_list, description, new_images, new_songs, full_time);

                        document.getElementsByClassName("pause-icon state")[0].click();
                    }
                });
            });
        }

        function fill_with_annotations(full_time)
        {
            for (let i = 0; i < annotations_title.length; i++)
						{
							let content_title = document.getElementsByClassName("title-inner-wrapper")[0].firstChild.firstChild.innerHTML;
							if (annotations_content_title[i] == content_title)
									add_annotation_to_the_list(i, annotations_content_title[i], annotations_title[i], annotations_start_time[i],
																						 annotations_end_time[i], annotations_tags[i], annotations_description[i],
																						 annotations_images[i], annotations_music[i], full_time);
						}
        }

        function add_annotation_to_the_list(iterator, content_title, title, start_time, end_time, tags_list, description, images_list, music_list, full_time)
        {
            // display the popup
						console.log("Adding annotation to the list...");

						var full_time = document.getElementsByClassName("player-time end-time")[0].innerText;
						full_time = full_time.substr(1, full_time.length);

            let full_time_bar = document.getElementsByClassName("player-scrubber-buffered")[0];

            let new_annotation = document.createElement("div");
            new_annotation.setAttribute("id", title + "_" + iterator);

            let new_annotate_start_time_in_seconds = estimate_time_in_seconds(start_time);
            let new_annotate_finish_time_in_seconds = estimate_time_in_seconds(end_time);

            let start_push_pixels = new_annotate_start_time_in_seconds * full_time_bar.offsetWidth / estimate_time_in_seconds(full_time);
            let final_push_pixels = (new_annotate_finish_time_in_seconds - new_annotate_start_time_in_seconds) / estimate_time_in_seconds(full_time) * 100;

            let style_for_new_annotate = "position: absolute; height: 100%; transition: margin 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms; left: " + start_push_pixels + "px; background-color: rgb(255, 0, 0); width: calc(" + final_push_pixels +"%); ";
            new_annotation.setAttribute("style", style_for_new_annotate);

						// debugger;

            full_time_bar.appendChild(new_annotation);

            let created_annotation = document.getElementById(title + "_" + iterator);

            add_listener_for_annotation(created_annotation, start_time, end_time, tags_list, description, images_list, music_list);
        }

        function add_listener_for_annotation(annotation, start_time, end_time, tags_list, description, images_list, music_list)
        {
					// debugger;
            annotation.addEventListener("mouseover", function() {
                // we start to hover a popup
								// debugger;

                let holder = document.getElementsByClassName("player-waveform")[0];
                let [container, root] = insertAnnotatorDisplay(holder, dependencies.annotatorDisplay);

                container.style.position = "fixed";
                container.style.bottom = "10%";
                container.style.left = "25%";
                container.style.zIndex = 100;

                // we set the title, start + finish time and description text for the annotator display

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
            });

            annotation.addEventListener("mouseout", function() {
                // we finish to hover a popup
                removeAnnotator("annotator-shadow-container-display");
            });
        }

        main_function();
	});
