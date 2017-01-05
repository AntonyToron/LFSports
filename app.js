$(document).ready(function() {
	var ENTER_KEY = 13;
	var index = 0;
	// load comments for forum
	$.get('http://localhost:8081/get_comments', function(response, status) {
			var responseParsed = JSON.parse(response);
			$("#comment_section").append(responseParsed.comment);

			// can add delay
			$("#comment_section").animate({ scrollTop: $('#comment_section').prop("scrollHeight")}, 0);
		}
	);

	// scroll to bottom of div
	// $("#comment_section").scrollTop($("#comment_section")[0].scrollHeight);


	//  append comment
	$("#type_comment").on('keyup', function(event) {
		if (event.keyCode == ENTER_KEY) {
			// gets value of form elements like input, select, textarea
			$("#type_comment").blur();
			var comment = $("#type_comment").val();
			$("#type_comment").val("");
			// $("#comment_section").append("<p>" + comment + "<p>");		
			var comment = {
				"comment": comment,
				"timeStamp": Date(),
				"userName": "Antony Toron",
				"forumType": "Boxing"
			}
			var object = {
				"comment": comment,
				"requestType": "POST",
			}

			connection.send(JSON.stringify(object));
		}
	});

	var connection = new WebSocket('ws://localhost:8080');

	connection.onopen = function() {
		console.log("connected on client side");
	};



	connection.onmessage = function(message) {
		// can later change this to class media
		var rawData = JSON.parse(message.data);
		if (rawData.requestType == "POST") {
			var data = rawData.comment;
			var index = rawData.index;
			var commentDiv = $("<div></div");
			commentDiv.attr("id", index);
			var commentName = $("<p></p>").text(data.userName);
			var comment = $("<p></p>").text(data.timeStamp + ": " + data.comment);
			var closeButton = $("<button></button>");
			var innerSpan = $("<span></span>").html("&times;");
			closeButton.attr("aria-label", "Close");
			closeButton.attr("data-dismiss", "modal");
			closeButton.attr("type", "button");
			closeButton.attr("id", index);
			var timeStamp = data.timeStamp;

			innerSpan.attr("aria-hidden", "true");
			closeButton.addClass("close");
			closeButton.append(innerSpan);
			
			commentDiv.addClass("well");
			commentDiv.append(closeButton);
			commentDiv.append(commentName);
			commentDiv.append(comment);
			$("#comment_section").append(commentDiv);
			// commentDiv.insertBefore("#type_comment");
			// scroll back down to element
			$("#comment_section").animate
			({ scrollTop: $('#comment_section').prop("scrollHeight")}, 1000);
		}
		else if (rawData.requestType == "DELETE") {
			var element = $("#" + rawData.index);
			element.hide(300, function() {element.remove();});
			console.log("successful delete");
		}
		// $("#comment_section").append(
		// 	"<div class='well'>" + 
		// 	"<p>" + data.userName + "<p>" + 
		// 	"<p>" + data.timeStamp + ": " + data.comment + "<p>"
		// 	+ "</div>"
		// 	);

	};


	//  for deleting comments
	$(document.body).on('click', 'button', function(event) {
		if (this.class="close") {
			var element = $("#" + this.id);
			element.hide(300, function() {element.remove();});
			var object = {
				"index" : this.id,
				"requestType": "DELETE",
				"forumType": "Boxing"
			}
			connection.send(JSON.stringify(object));
		}
	});
	//  going to have to use ajax load for comments
	//  maybe on lifecycle of 1 second or 3 seconds? 
	//  only update those differences between current state
	//  and what it is on server?
	// $("#click").click(function(event) {
	// 	event.preventDefault();
	// 	$("#comment_section").append("<p>Random Text<p>");
	// });
	// NEXT STEP - add index in backend for an every 
			// comment in a forum for easy deletion, and implement
			// deletion on backend.
			// closeButton.click(function(event) {
			// 	$("#" + this.id).remove();
			// 	console.log(this);
			// 	console.log(event);
			// 	// $.ajax({
			// 	// 	url: "http://localhost:8081/delete_comment",
			// 	// 	type: 'POST',
			// 	// 	crossDomain: true,
			// 	// 	dataType: 'jsonp',
			// 	// 	data: {
			// 	// 		"index": this.id
			// 	// 	},
			// 	// });
			// 	var object = {
			// 		"index" : this.id,
			// 		"requestType": "DELETE",
			// 		"forumType": "Boxing"
			// 	}
			// 	connection.send(JSON.stringify(object));
			// });

});