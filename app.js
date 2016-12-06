$(document).ready(function() {
	var ENTER_KEY = 13;

	// load comments for forum
	$.get('http://localhost:8081/get_comments', function(response, status) {
			var responseParsed = JSON.parse(response);
			$("#comment_section").append(responseParsed.comment);
		}
	);


	//  append comment
	$("#type_comment").on('keyup', function(event) {
		if (event.keyCode == ENTER_KEY) {
			// gets value of form elements like input, select, textarea
			var comment = $("#type_comment").val();
			$("#type_comment").val("");
			// $("#comment_section").append("<p>" + comment + "<p>");		
			var comment = {
				"comment": comment,
				"timeStamp": Date(),
				"userName": "Antony Toron",
				"forumType": "Boxing"
			}

			connection.send(JSON.stringify(comment));
		}
	});

	var connection = new WebSocket('ws://localhost:8080');

	connection.onopen = function() {
		console.log("connected on client side");
	};

	connection.onmessage = function(message) {
		var data = JSON.parse(message.data);
		$("#comment_section").append(
			"<div style='border: 1px solid black; padding: 10px'>" + 
			"<p>" + data.userName + "<p>" + 
			"<p>" + data.timeStamp + ": " + data.comment + "<p>"
			+ "</div>"
			);

	};
	//  going to have to use ajax load for comments
	//  maybe on lifecycle of 1 second or 3 seconds? 
	//  only update those differences between current state
	//  and what it is on server?
	// $("#click").click(function(event) {
	// 	event.preventDefault();
	// 	$("#comment_section").append("<p>Random Text<p>");
	// });

});