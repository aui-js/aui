//<script src="https://webapi.amap.com/maps?v=1.4.15&key=02e6e70bec31ec123367a3d8101a9602"></script>	

//高德地图相关操作
!(function($, document, window, undefined){
	$.amap = {
		map: null,
		marker: null,
		markerArr: [],
		opts: function(opt){
			var opts = {
				center: [108.948024,34.263161], //中心点坐标
				zoom: 15, //缩放比例
				marker: { //覆盖物
					data: [], //[{icon: '../../img/icon/service_img_blue.png', position: [108.948024,34.263161], rotate: 0, id: 0, offset: {lng: 0, lat: 0}}]  ——|——icon:图标 | position：位置 | rotate： 旋转角度 | offset： 偏移量 
					size: [25, 31] //图标大小 //[25, 31]
				},
			}
			return $.extend(opts, opt, true);
		},
		//初始化地图
		init: function(opt){
			var _this = this;
			var _opts = _this.opts(opt);
			_this.map = new AMap.Map('map', {
		        center: _opts.center, 
		        zoom: _opts.zoom,
		        mapStyle: 'amap://styles/ac617ee5ac942dc438bc8ae1b99b7939',
		        resizeEnable: true,
		        viewMode: '3D', //开启3D视图,默认为关闭
		        buildingAnimation: true, //楼块出现是否带动画
		    });				
		},		
		//获取当前位置
		getLocation: function(callback) {
			var _this = this;				
		   _this.map.plugin('AMap.Geolocation', function() {
		        geolocation = new AMap.Geolocation({
		            enableHighAccuracy : true, //是否使用高精度定位，默认:true
		            timeout : 10000, //超过10秒后停止定位，默认：无穷大		            
		            zoomToAccuracy : true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false		            
		        });
		        geolocation.getCurrentPosition();
		        //返回定位信息
		        AMap.event.addListener(geolocation, 'complete', function(data){							
					posX = data.position.getLng();
					poxY = data.position.getLat();
					console.log(data);
					typeof callback == 'function' ? callback(data) : '';					
				});
		        //返回定位出错信息
		        AMap.event.addListener(geolocation, 'error', function(data){
					console.log(data);
					app.toast("定位失败");
				});
		    });
		},
		//把经纬度解析成地址信息
		geocoder: function({lng, lat, cityCode = "全国"}, callback) {
			var _this = this;
			var lnglatXY = new AMap.LngLat(lng, lat);
			_this.map.plugin('AMap.Geocoder', function() {
				var geocoder = new AMap.Geocoder({
					city : cityCode, //城市，默认：“全国”
					radius : 1000 //范围，默认：500
				});
				geocoder.getAddress(lnglatXY, function(status, result) {
					//console.log(result);
					if (status === 'complete' && result.info === 'OK') {
						var geocode = result.regeocode;
						//console.log(geocode.formattedAddress);
						typeof callback == 'function' ? callback(geocode) : '';
					}
				});
				
			});
		},
		//重置地图缩放级别以及中心位置
		resetCenterZoom: function(opt){
			var _this = this;
			var _opts = _this.opts(opt);
			_this.map.setZoom(_opts.zoom); //设置地图层级
			_this.map.setCenter(_opts.center); //设置地图中心点
		},
		//添加多个标记物
		addMarker: function(opt, callback){
			var _this = this;
			var _opts = _this.opts(opt);
			//重置地图缩放级别以及中心位置
			_this.resetCenterZoom({
				center: _opts.marker.data[0].position,
				zoom: 9
			});				
			_this.marker = null, _this.markerArr = [];
			for(var i = 0; i < _opts.marker.data.length; i++){
				_this.marker = new AMap.Marker({
					map: _this.map,
					clickable: true,
					icon: new AMap.Icon({            
						image: _opts.marker.data[i].icon,
						size: new AMap.Size(_opts.marker.size[0], _opts.marker.size[1]),  //图标大小new AMap.Size(25, 31) 18,46 | 25,31
					}),        
					position: _opts.marker.data[i].position, //位置
					autoRotation: true, //可旋转
					offset: new AMap.Pixel(_opts.marker.data[i].offset.lng, _opts.marker.data[i].offset.lat), //偏移量
					angle: $.isDefine(_opts.marker.data[i].rotate) ? _opts.marker.data[i].rotate : 0 //点标记的旋转角度，用于改变车辆行驶方向
				});
				if(aui.isDefine(_opts.marker.data[i].text)){
					_this.marker.setMap(_this.map);				
					// 设置label标签
					// label默认蓝框白底左上角显示，样式className为：amap-marker-label
					_this.marker.setLabel({
						offset: new AMap.Pixel(1, 1),  //设置文本标注偏移量
						content: "<div class='info' style='font-size: 13px; border: none; background: transparent;'>"+ _opts.marker.data[i].text +"</div>", //设置文本标注内容
						direction: 'bottom' ,//设置文本标注方位
						angle: $.isDefine(_opts.marker.data[i].rotate) ? _opts.marker.data[i].rotate : 0 //点标记的旋转角度，用于改变车辆行驶方向
					});					
				}
				_this.markerArr.push(_this.marker);
			}
			_this.map.add(_this.markerArr);
			//处理覆盖物点击事件
			for(var i = 0; i < _opts.marker.data.length; i++){
				!(function(i){
					_this.markerArr[i].on("click", function(e){	
						//重置地图缩放级别以及中心位置
						_this.resetCenterZoom({
							center: [_opts.marker.data[i].position[0], _opts.marker.data[i].position[1] - 0.0795],
							zoom: 11
						});						
						typeof callback == "function" ? callback(_opts.marker.data[i]) : '';
					})	
				})(i);
			}
		},
		//删除多个标记物
		removeMarker: function(callback){
			var _this = this;
			_this.map.remove(_this.markerArr);
			typeof callback == "function" ? callback() : '';
		},
		//删除所有覆盖物——aui.amap.clearMarker();	
		clearMarker: function(callback){
			var _this = this;
			_this.map.clearMap();
			typeof callback == "function" ? callback() : '';
		},
		// 获取可见区域起始经纬度
		getBounds: function(){
			var _this = this;
			//console.log(_this.map.getBounds('southWest', 'northEast'));
			var allData = _this.map.getBounds('southWest', 'northEast');
			var southWest = {lat: (allData.southwest.lat * 1000000).toFixed(0), lng: (allData.southwest.lng * 1000000).toFixed(0)}; //西南角
			var northEast = {lat: (allData.northeast.lat * 1000000).toFixed(0), lng: (allData.northeast.lng * 1000000).toFixed(0)}; //东北角
			return [southWest, northEast];
		},
		
	}
})(aui, document, window);
