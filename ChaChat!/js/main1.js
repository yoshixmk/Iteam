jQuery(function($) {

	// gps に対応しているかチェック
	if (! navigator.geolocation) {
		$('#map').text('GPSに対応したブラウザでお試しください');
		return false;
	}

	$('#map').text('GPSデータを取得します...');

	// gps取得開始
	navigator.geolocation.getCurrentPosition(function(pos) {
		// gps 取得成功
		// google map 初期化
		var myLatlng = new google.maps.LatLng(35.236185, 139.599921);
		var gmap = new google.maps.Map($('#map').get(0), {
			center: new google.maps.LatLng(35, 135),
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			zoom: 17
		});

		// 現在位置にピンをたてる
		var currentPos = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
		var currentMarker = new google.maps.Marker({
			position: myLatlng,
		});
		currentMarker.setMap(gmap);

		// 誤差を円で描く
		new google.maps.Circle({
			map: gmap,
			center: currentPos,
			radius: pos.coords.accuracy, // 単位はメートル
			strokeColor: '#0088ff',
			strokeOpacity: 0.8,
			strokeWeight: 1,
			fillColor: '#0088ff',
			fillOpacity: 0.2
		});

		// 現在地にスクロールさせる
		gmap.panTo(currentPos);

		var distance = google.maps.geometry.spherical.computeDistanceBetween(currentPos, myLatlng);
		if(pos.coords.accuracy >= distance){
			location.href = "./chachat.html";
		}

	}, function() {
		// gps 取得失敗
		$('#map').text('GPSデータを取得できませんでした');
		return false;
	});
});