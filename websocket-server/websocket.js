var WebSocketServer = require('websocket').server;
var http = require('http');
var express = require('express'); // can require express and do get that way
var HttpDispatcher = require('httpdispatcher');
var dispatcher = new HttpDispatcher();
var forums = {};

var clients = [];

var app = express();


// dispatcher.onGet("/get_comments", function(request, response) {
// 	console.log(request);
// 	res.end("Hi");
// })

app.get('/get_comments', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
  	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	// console.log(request);
	var obj = forums['Boxing'];
	var comment = "";
	if (obj == undefined)
		comment = "";
	else {
		object = obj.commentArray;

		// for (var i = 0; i < obj.length; i++) {
		// 	console.log(obj[i].index);
		// 	comment += "<div id='" + obj[i].index + "' \
		// 	class='well'>" + 
		// 	"<button type='button' id='" + obj[i].index + "' aria-label='Close' data-dismiss='modal' class='close'>" +
		// 	"<span aria-hidden='true'>&times</span>" + 
		// 	"</button>" +
		// 	"<p>" + obj[i].userName + "</p>" + 
		// 	"<p>" + obj[i].timeStamp + ": " 
		// 	+ obj[i].comment + "</p>" +
		// 	"</div>" ;
		// }
		// console.log(object);
		var length = Object.keys(object).length;
		var keys = Object.keys(object);
		// console.log(keys);
		for (var i = 0; i < keys.length; i++) {
			// console.log(object);
			// console.log(object.keys[i]);
			var temp = keys[i];
			comment += "<div id='" + object[temp].index + "' \
			class='well'>" + 
			"<button type='button' id='" + object[temp].index + "' aria-label='Close' data-dismiss='modal' class='close'>" +
			"<span aria-hidden='true'>&times</span>" + 
			"</button>" +
			"<p>" + object[temp].userName + "</p>" + 
			"<p>" + object[temp].timeStamp + ": " 
			+ object[temp].comment + "</p>" +
			"</div>" ;
		}
	}

	response.send(JSON.stringify({
		"comment": comment,
	}));
});

// app.get('/delete_comment', function(request, response) {
// 	response.header("Access-Control-Allow-Origin", "*");
//   	response.header("Access-Control-Allow-Headers", "Session, Origin, X-Requested-With, Content-Type, Accept");
//   	var obj = forums['Boxing'];
//   	if (obj == undefined)
//   		console.log("trying to delete a comment that does not exist");

//   	var index = request.query.index;
//   	console.log(index);

//   	obj.commentArray()

//   	// obj.splice
//   	// response.send("Successful delete");
// });

var server = app.listen(8081, function() {
	console.log("express listening...");
})





var server = http.createServer(function(request, response) {

});
server.listen(8080, function() { console.log("listening...")});

wsServer = new WebSocketServer({
	httpServer: server
});

wsServer.on('request', function(request) {
	console.log("connected");
	var connection = request.accept(null, request.origin);

	//  can use this in hashmap~?
	var index = clients.push(connection) - 1;

	connection.on('message', function(message) {
		if (message.type === 'utf8') {
			// maybe should be pushing only the string format here
			// so less expensive on client side
			var data = JSON.parse(message.utf8Data);
			if (data.requestType == "POST") {
				var comment = data.comment;
				if (forums[comment.forumType] == undefined) {
					var commentArray = {};
					comment.index = 0;
					// commentArray.push(comment);
					commentArray[comment.index] = comment;
					forums[comment.forumType] = {
						"commentArray": commentArray,
						"amountOfComments": 1
					}
				}
				else {
					comment.index = forums[comment.forumType].amountOfComments;
					// console.log(comment.index);
					// forums[comment.forumType].commentArray.push(comment);
					forums[comment.forumType].commentArray[comment.index] = comment;
					forums[comment.forumType].amountOfComments++;
				}
				//  send this new comment to only those that are on the forum accordingly
				for (var i = 0; i < clients.length; i++) {
					clients[i].sendUTF(JSON.stringify({
						"comment": comment,
						"index": forums[comment.forumType].amountOfComments - 1,
						"requestType": "POST"
					}))
				}
			}
			else if (data.requestType == "DELETE") {
				var forumType = data.forumType;
				var index = data.index;
				var array = forums[forumType].commentArray;
				if (array.length == 1)
					forums[forumType].commentArray = {};
				else {
					// console.log(forums[forumType].commentArray);
					// forums[forumType].commentArray.splice(index, 1);
					// console.log(forums[forumType].commentArray);
					// console.log(forums[forumType]);
					delete forums[forumType].commentArray[index];

										// console.log(forums[forumType]);

				}

				for (var i = 0; i < clients.length; i++) {
					clients[i].sendUTF(JSON.stringify({
						"index": index,
						"requestType": "DELETE"
					}))
				}

			}
		}

		// console.log(forums);
	});

	connection.on('close', function(connection) {
		console.log("connection closed");
	});
});