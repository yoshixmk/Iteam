var ws = new WebSocket('ws://192.168.50.135:1233');

ws.onerror = function(e){
	$('#chat-area').empty()
		.addClass('alert alert-error')
		.append('<button type="button" class="close" data-dismiss="alert">x</button>',
				$('<i/>').addClass('icon-warning-sign'),
				'サーバに接続できませんでした。');
};

var token = "";
var id;
var num = 0;

function getToken(){
	for(var i = 0; i < 6; i++){
		token += "" + (Math.floor(Math.random()*16)).toString(16);
	}
	console.log("token is " + token);
	return token;
}


//サーバ接続イベント
ws.onopen = function(){
	num++;
	var tk = getToken();
	ws.send(tk);
	$('#textbox').focus();
	ws.send(JSON.stringify({
		type: 'join',
		user: userName,
		token: tk
	}));
};

var userName = 'ゲスト';
$('#user-name').append(userName);

//メッセージ受信イベント
ws.onmessage = function(event){
	var split = event.data.split(":");
	if(split[0] === token){
		id = split[1];
		return;
	}
	if(event.data.charAt(0) === '{'){
		var data = JSON.parse(event.data);
		var item = $('<li/>').append(
				$('<div/>').append($('<i/>').addClass('icon-user'))
			);

		// pushされたメッセージを解釈し、要素を生成する
		if (data.type === 'join') {
			var time = '<small>' + data.time + '</small>';
			item.addClass('alert-info')
				.children('div').children('i').after(data.user + 'が入室しました');
			item.addClass('meta chat-time').append(time);
		}
		else if (data.type === 'chat') {
			//var content = '<span>' + data.user + '</span><br>' + data.text;
			var time = '<small>' + data.time + '</small>';
			var content = data.text;
			item.addClass('well-small').children('div').html(content);
			item.addClass('meta chat-time').append(time);
		}
		else if (data.type === 'defect') {
			var time = '<small>' + data.time + '</small>';
			item.addClass('alert')
				.children('div').children('i').after(data.user + 'が退室しました');
			item.addClass('meta chat-time').append(time);
		}
		else {
			item.addClass('alert-error')
				.children('div').children('i').removeClass('icon-user').addClass('icon-warning-sign')
				.after('不正なメッセージを受信しました');
		}
		$('#chat-history').prepend( item).hide().fadeIn(500);
	}
};


// 発言イベント
textbox.onkeydown = function(event) {
	// エンターキーを押したとき
	if (event.keyCode === 13 && textbox.value.length > 0) {
		ws.send(JSON.stringify({
			type: 'chat',
			user: userName,
			text: textbox.value,
			token: token
		}));
		textbox.value = '';
	}
};

// ブラウザ終了イベント
window.onbeforeunload = function () {
	ws.send(JSON.stringify({
		type: 'defect',
		user: userName,
	}));
};
