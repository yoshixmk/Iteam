var ws = require('websocket.io');

var user_info = [];
var user_flag = false;

var server = ws.listen(1233, function(){
	console.log('Server running at 192.168.50.135:1234');
});

var num = 0;
server.on('connection', function(socket){
	num++;
	socket.on('message', function(data){
		var d = new Date();
		var id = "" + d.getMinutes() + d.getSeconds();
		var usernum = server.clients.length;

		if(data.length == 6){
			user_info.push(data + ":" + id);
			return;
		}

//		for(var i = 0; i < usernum; i++){
			data = JSON.parse(data);
//			var split = user_info[i].split(':');
//			if(split[0] == data.token ){
//				data = user_info[i];
				data.time = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
	       				+ " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
				data.user += id;	
				data = JSON.stringify(data);
				console.log(data);
				user_flag = true;
//				break;
//			}
//		};
		if(!user_flag){
			user_info.push(data + ":" + id);
			data = user_info[usernum - 1];
		}
		server.clients.forEach(function(client){
			client.send(data);
		});
	});
});
