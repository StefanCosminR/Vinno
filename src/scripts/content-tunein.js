getAllDependencies()
	.then(dependencies => {
        var all_annotations_moments = [];
        var all_annotations_titles = [];
        var all_annotations_comments = [];

        function main_function()
        {
            // show_added_annotations_until_now(dependencies);
            load_annotations_from_database();

            all_annotations_moments.push(["01:00", "04:00"]);
            all_annotations_titles.push("My favorite part!");
            all_annotations_comments.push("This is by far the best part of the track!");

            all_annotations_moments.push(["07:00", "13:00"]);
            all_annotations_titles.push("It is ok...");
            all_annotations_comments.push("This on the other hand... eh");

            add_insert_annotation_button();

            var trigger = setInterval(function(){
                var full_time = document.getElementById("scrubberDuration");

                if (full_time != null && full_time.innerHTML != "00:00")
                {
                    fill_with_annotations(full_time.innerHTML);
                    clearInterval(trigger);
                }
            }, 1000);
        }

        function show_added_annotations_until_now(dependencies)
        {
            // we fill the panel with all the annotations

            embeddedHtml = dependencies.annotatorPopup;
            annotatorActions = dependencies.annotationActionsMenu;

            insertFloatingPanel(dependencies.floatingPanel);
        }

        function add_insert_annotation_button()
        {
            // we add "Insert Annotation button"

            var authentification_bar = document.getElementsByClassName("auth-links__container___rSeFg")[0];

            var new_annotate_button = document.createElement("a");
            var new_annotate_span = document.createElement("span");
            var new_annotate_separator = document.createElement("i");

            new_annotate_separator.setAttribute("class", "icons__icon-dot___GHWpv auth-links__divider___1pb-I");
            authentification_bar.appendChild(new_annotate_separator);

            new_annotate_span.setAttribute("style", "font-family:inherit;");
            new_annotate_span.innerText = "Insert Annotation";
            new_annotate_button.appendChild(new_annotate_span);

            new_annotate_button.setAttribute("class", "auth-links__whiteLink___3tT0y auth-links__link___GsWd7 auth-links__baseMuiTransition___1AQHm");
            new_annotate_button.setAttribute("role", "button");
            new_annotate_button.setAttribute("id", "add_annotation_button");

            authentification_bar.appendChild(new_annotate_button);

            var created_button = document.getElementById("add_annotation_button");

            created_button.addEventListener("click", function() {
                // we add a new popup

                document.getElementById("playerActionButton").click();

                var holder = document.getElementById("content");
                var [container, root] = insertAnnotator(holder, dependencies.annotatorPopup);

                container.style.position = "fixed";
                container.style.bottom = "10%";
                container.style.left = "25%";
                container.style.zIndex = 100;

                root.getElementById("annotator-start-time").value = "00:" + document.getElementById("scrubberElapsed").innerHTML;
                root.getElementById("annotator-finish-time").value = root.getElementById("annotator-start-time").value;

                // removeAnnotator("annotator-shadow-container");
                // document.getElementById("playerActionButton").click();
            });
        }

        function fill_with_annotations(full_time)
        {
            for (var iterator = 0; iterator < all_annotations_moments.length; iterator++)
                add_annotation_to_the_list(all_annotations_moments[iterator],  all_annotations_titles[iterator], full_time);
        }

        function add_annotation_to_the_list(this_annotation_moment, this_annotation_title, full_time)
        {
            // we display the popup on the loading area

            var full_time_bar = document.getElementById("scrubber").childNodes[0].childNodes[0];

            var new_annotation = document.createElement("div");
            new_annotation.setAttribute("id", this_annotation_title);

            var new_annotate_start_time_in_seconds = estimate_time_in_seconds(this_annotation_moment[0]);
            var new_annotate_finish_time_in_seconds = estimate_time_in_seconds(this_annotation_moment[1]);

            var start_push_pixels = new_annotate_start_time_in_seconds * full_time_bar.offsetWidth / estimate_time_in_seconds(full_time);
            var final_push_pixels = (new_annotate_finish_time_in_seconds - new_annotate_start_time_in_seconds) / estimate_time_in_seconds(full_time) * 100;
            var style_for_new_annotate = "position: absolute; height: 100%; transition: margin 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms; left: " + start_push_pixels + "px; background-color: rgb(255, 0, 0); width: calc(" + final_push_pixels +"%); ";

            new_annotation.setAttribute("style", style_for_new_annotate);
            full_time_bar.appendChild(new_annotation);

            var created_annotation = document.getElementById(this_annotation_title);
            add_listener_for_annotation(created_annotation, this_annotation_moment);
        }

        function estimate_time_in_seconds(time)
        {
            var each_part_of_time = time.split(":");
            return Number(each_part_of_time[0]) * 60 + Number(each_part_of_time[1]);
        }

        function add_listener_for_annotation(annotation, this_annotation_moment)
        {
            annotation.addEventListener("mouseover", function() {
                // we start to hover a popup

                var holder = document.getElementById("content");
                var [container, root] = insertAnnotatorDisplay(holder, dependencies.annotatorDisplay);

                container.style.position = "fixed";
                container.style.bottom = "10%";
                container.style.left = "25%";
                container.style.zIndex = 100;


                // we set the title, start / finish time and description text for the hover popup

                root.getElementById("annotator-title").value = annotation.id;

                for (var iterator = 0; iterator < all_annotations_moments.length; iterator++)
                    if (all_annotations_titles[iterator] == annotation.id)
                    {
                        root.getElementById("annotator-start-time").value = all_annotations_moments[iterator][0];
                        root.getElementById("annotator-finish-time").value = all_annotations_moments[iterator][1];
                        root.getElementById("annotator-description").value = all_annotations_comments[iterator];
                        break;
                    }

            });

            annotation.addEventListener("mouseout", function() {
                // we finish to hover a popup

                removeAnnotator("annotator-shadow-container-display");
            });
        }

        main_function();
	});

