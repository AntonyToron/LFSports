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
		for (var i = 0; i < obj.length; i++) {
			comment += "<div \
			style='border: 1px solid black; padding: 10px'>" + 
			"<p>" + obj[i].userName + "<p>" + 
			"<p>" + obj[i].timeStamp + ": " 
			+ obj[i].comment + "<p>" +
			"</div>" ;
		}
	}

	response.send(JSON.stringify({
		"comment": comment
	}));
});

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
			var comment = JSON.parse(message.utf8Data);
			if (forums[comment.forumType] == undefined) {
				var commentArray = [];
				commentArray.push(comment);
				forums[comment.forumType] = commentArray;
			}
			else {
				forums[comment.forumType].push(comment);
			}
			//  send this new comment to only those that are on the forum accordingly
			for (var i = 0; i < clients.length; i++) {
				clients[i].sendUTF(JSON.stringify(comment))
			}
		}

		// console.log(forums);
	});

	connection.on('close', function(connection) {
		console.log("connection closed");
	});
});