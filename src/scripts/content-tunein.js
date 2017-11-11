chrome.runtime.sendMessage("getEmbeddedHtml", function (response) {
    
    var all_annotations_moments = []
    var all_annotations_comments = []

	all_annotations_moments.push(["00:03", "00:10"]);
	all_annotations_comments.push("My favorite part!");

	all_annotations_moments.push(["00:15", "00:30"]);
	all_annotations_comments.push("It is ok!");

    fill_with_annotations();

	function fill_with_annotations()
	{
		for(var iterator = 0; iterator < all_annotations_moments.length; iterator++)
		{
			each_annotation_moment = all_annotations_moments[iterator];
			each_annotation_comment = all_annotations_comments[iterator];

			// var empty_time_bar = document.getElementsByClassName("anw-player__bar__progress--seek jp-seek-bar");
			// var full_time_bar = document.getElementsByClassName("anw-player__bar__progress--play jp-play-bar");
			console.log(each_annotation_moment);
			console.log(each_annotation_comment);
		}
	}

});
