var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

var user_count = 0;

//當新的使用者連接進來的時候
io.on('connection', function(socket){   //io是連線 socket可以是不同的(一個or多個,命名不同即可)看function收到哪一個socket

	//新user
	socket.on('add user',function(msg){
		socket.username = msg;
		console.log("new user:"+msg+" logged.");
		io.emit('add user',{
			username: socket.username
		});
	});

	//新room
	socket.on('add room',function(msg){
		socket.chatRoom = msg;
		console.log("new room:"+ msg +" added.");
		io.emit('add room',{
			chatRoom: socket.chatRoom
		});
	});

	//監聽新訊息事件
	socket.on('chat message', function(msg){

		console.log(socket.username+":"+msg);

  		//發佈新訊息
		io.emit('chat message', {
			username:socket.username,
			msg:msg
		});
	});

	//監聽加入聊天室事件


	//left
	socket.on('disconnect',function(){
		console.log(socket.username+" left.");
		io.emit('user left',{
			username:socket.username
		});
	});


});

//指定port
http.listen(process.env.PORT || 3000, function(){
	console.log('listening on *:3000');
});