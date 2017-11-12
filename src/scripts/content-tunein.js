chrome.runtime.sendMessage("getEmbeddedHtml", function (response) {

	function estimate_time_in_seconds(time)
	{
		var each_part_of_time = time.split(":")
		return Number(each_part_of_time[0]) * 60 + Number(each_part_of_time[1])
	}

	function mouse_inside_annotation(div)
	{
		console.log("IN");
		console.log(div);

	    // let destinationElement = document.getElementById('scrubber');
	    // destinationElement.style.position = 'relative';

	    // let container = insertAnnotator(destinationElement, response.html);

	    // container.style.position = 'absolute';
	    // container.style.zIndex = 1000;
	}

	function mouse_outside_annotation(div)
	{
		console.log("OUT");
		console.log(div);

		// removeAnnotator();
	}

	function fill_with_annotations(full_time)
	{
		var full_time_bar = document.getElementById("scrubber").childNodes[0].childNodes[0];
		// var past_time_bar = full_time_bar.childNodes[0]
		// var future_time_bar = full_time_bar.childNodes[1]

		for(var iterator = 0; iterator < all_annotations_moments.length; iterator++)
		{
			each_annotation_moment = all_annotations_moments[iterator];
			each_annotation_comment = all_annotations_comments[iterator];

			var new_annotate = document.createElement("div");
			new_annotate.setAttribute("id", each_annotation_comment);

			var new_annotate_start_time_in_seconds = estimate_time_in_seconds(each_annotation_moment[0])
			var new_annotate_finish_time_in_seconds = estimate_time_in_seconds(each_annotation_moment[1])

			var start_push_pixels = new_annotate_start_time_in_seconds * full_time_bar.offsetWidth / estimate_time_in_seconds(full_time);
			var final_push_pixels = (new_annotate_finish_time_in_seconds - new_annotate_start_time_in_seconds) / estimate_time_in_seconds(full_time) * 100;
			var style_for_new_annotate = "position: absolute; height: 100%; transition: margin 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms; left: " + start_push_pixels + "px;right:60px; background-color: rgb(255, 0, 0); width: calc(" + final_push_pixels +"%); "
			
			new_annotate.setAttribute("style", style_for_new_annotate);

			full_time_bar.appendChild(new_annotate);

			var created_annotate = document.getElementById(each_annotation_comment);
			console.log(created_annotate);
			created_annotate.addEventListener("mouseover", mouse_inside_annotation(each_annotation_comment));
			created_annotate.addEventListener("mouseout", mouse_outside_annotation(each_annotation_comment));
		}
	}


    var all_annotations_moments = []
    var all_annotations_comments = []

	all_annotations_moments.push(["01:00", "04:00"]);
	all_annotations_comments.push("My favorite part!");

	all_annotations_moments.push(["07:00", "13:00"]);
	all_annotations_comments.push("It is ok!");


	var trigger = setInterval(function(){ 
	    var full_time = document.getElementById("scrubberDuration");
	    
	    if (full_time != null && full_time.innerHTML != "00:00")
	    {
        	fill_with_annotations(full_time.innerHTML);
	    	clearInterval(trigger);
        }
	}, 1000);

});
