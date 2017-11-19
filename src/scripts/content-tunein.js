getAllDependencies()
	.then(dependencies => {
        function main_function()
        {
            show_added_annotations_until_now();

            var all_annotations_moments = []
            var all_annotations_comments = []

            all_annotations_moments.push(["01:00", "04:00"]);
            all_annotations_comments.push("My favorite part!");

            all_annotations_moments.push(["07:00", "13:00"]);
            all_annotations_comments.push("It is ok!");

            add_insert_annotation_button();

            var trigger = setInterval(function(){
                var full_time = document.getElementById("scrubberDuration");

                if (full_time != null && full_time.innerHTML != "00:00")
                {
                    fill_with_annotations(full_time.innerHTML, all_annotations_moments, all_annotations_comments);
                    clearInterval(trigger);
                }
            }, 1000);
        }

        function show_added_annotations_until_now()
        {
            var holder = document.getElementById("content");
            var container = insertAnnotator(holder, dependencies.annotatorPopup);


            container.style.position = "fixed";
            container.style.top = "30%";
            container.style.right = "0%";
            container.style.zIndex = 1000;
        }

        function add_insert_annotation_button()
        {
            var authentification_bar = document.getElementsByClassName("auth-links__container___rSeFg")[0];

            var new_annotate_button = document.createElement("a");
            var new_annotate_span = document.createElement("span");
            var new_annotate_separator = document.createElement("i");

            new_annotate_separator.setAttribute("class", "icons__icon-dot___GHWpv auth-links__divider___1pb-I");
            authentification_bar.appendChild(new_annotate_separator);

            new_annotate_span.setAttribute("style", "font-family:inherit;");
            new_annotate_span.innerText = "Add Annotation";
            new_annotate_button.appendChild(new_annotate_span);

            new_annotate_button.setAttribute("class", "auth-links__whiteLink___3tT0y auth-links__link___GsWd7 auth-links__baseMuiTransition___1AQHm");
            new_annotate_button.setAttribute("role", "button");
            new_annotate_button.setAttribute("id", "add_annotation_button");
            authentification_bar.appendChild(new_annotate_button);

            var created_button = document.getElementById("add_annotation_button");

            created_button.addEventListener("click", function() {
                console.log("ADDED");

                document.getElementById("playerActionButton").click();

                var current_time_passed = document.getElementById("scrubberElapsed").innerHTML;

                var holder = document.getElementById("content");
                var [container, root] = insertAnnotator(holder, dependencies.annotatorPopup);

                container.style.position = "fixed";
                container.style.bottom = "10%";
                container.style.left = "25%";
                container.style.zIndex = 100;

                // removeAnnotator();
                // document.getElementById("playerActionButton").click();
            });
        }

        function fill_with_annotations(full_time, annotations_moments, annotations_comments)
        {
            for (var iterator = 0; iterator < annotations_moments.length; iterator++)
                add_annotation_to_the_list(annotations_moments[iterator],  annotations_comments[iterator], full_time);
        }

        function add_annotation_to_the_list(annotation_moment, annotation_comment, full_time)
        {
            var full_time_bar = document.getElementById("scrubber").childNodes[0].childNodes[0];

            var new_annotation = document.createElement("div");
            new_annotation.setAttribute("id", annotation_comment);

            var new_annotate_start_time_in_seconds = estimate_time_in_seconds(annotation_moment[0])
            var new_annotate_finish_time_in_seconds = estimate_time_in_seconds(annotation_moment[1])

            var start_push_pixels = new_annotate_start_time_in_seconds * full_time_bar.offsetWidth / estimate_time_in_seconds(full_time);
            var final_push_pixels = (new_annotate_finish_time_in_seconds - new_annotate_start_time_in_seconds) / estimate_time_in_seconds(full_time) * 100;
            var style_for_new_annotate = "position: absolute; height: 100%; transition: margin 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms; left: " + start_push_pixels + "px; background-color: rgb(255, 0, 0); width: calc(" + final_push_pixels +"%); "

            new_annotation.setAttribute("style", style_for_new_annotate);
            full_time_bar.appendChild(new_annotation);

            var created_annotation = document.getElementById(annotation_comment);
            add_listener_for_annotation(created_annotation, annotation_comment, annotation_moment);
        }

        function estimate_time_in_seconds(time)
        {
            var each_part_of_time = time.split(":")
            return Number(each_part_of_time[0]) * 60 + Number(each_part_of_time[1])
        }

        function add_listener_for_annotation(annotation, comment, time_moments)
        {
            annotation.addEventListener("mouseover", function() {
                console.log("OVER ANNOTATION LINE");

                var holder = document.getElementById("content");
                var [container, root] = insertAnnotator(holder, dependencies.annotatorPopup);

                container.style.position = "fixed";
                container.style.bottom = "10%";
                container.style.left = "25%";
                container.style.zIndex = 100;

            });

            annotation.addEventListener("mouseout", function() {
                console.log("OUT ANNOTATION LINE");

                removeAnnotator();
            });
        }

        main_function();
	});

