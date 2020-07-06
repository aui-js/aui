/* ===============================
 	使用百度地图的相关操作
   ===============================
 */
!(function($, document, window, undefined){
	/*  获取当前位置
	 * @param {string} id 显示地图的 dom 元素ID
	 * @example: aui.getLocation("map", function(ret){})
	 */
	$.getLocation = function(id, callback){
		var _this = this;
        var map = new BMap.Map(id);
        map.enableScrollWheelZoom(true);
        map.centerAndZoom(new BMap.Point(116.501573, 39.900877), 16);
        var geoc = new BMap.Geocoder();
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r) {
            if(this.getStatus() == BMAP_STATUS_SUCCESS) {
                //新建中心点 并将地图中心移动过去
		        var centerPoint = new BMap.Point(r.longitude,r.latitude);
		        map.panTo(centerPoint);
		        map.setCenter(centerPoint);
                geoc.getLocation(new BMap.Point(r.point.lng,r.point.lat), function(rs) {
                	//console.log(rs);
                    var ret = {
                    	lng: rs.point.lng,
                    	lat: rs.point.lat,
                    	address: rs.address
                    }
                    typeof callback == "function" ? callback(ret) : '';
                });
            } else {
                $.toast({msg: '无法定位到您的当前位置'});
            }
        },{
            enableHighAccuracy: true
        });
	}
	/*  打开百度地图选择当前位置
	 * @param {string} id 显示地图的 dom 元素ID
	 * @example: aui.openMap("map", function(ret){})
	 */
	$.openMap = function(id, callback){
        var _this = this;
        var map = new BMap.Map(id);
        map.enableScrollWheelZoom(true);
        map.centerAndZoom(new BMap.Point(116.501573, 39.900877), 16);
        var geoc = new BMap.Geocoder();
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r) {
            if(this.getStatus() == BMAP_STATUS_SUCCESS) {
               //新建中心点 并将地图中心移动过去
		        var centerPoint = new BMap.Point(r.longitude,r.latitude);
		        map.panTo(centerPoint);
		        map.setCenter(centerPoint);
	            var mk = new BMap.Marker(new BMap.Point(r.point.lng,r.point.lat));
	            map.addOverlay(mk);
                geoc.getLocation(new BMap.Point(r.point.lng,r.point.lat), function(rs) {                   
                    var ret = {
                    	lng: rs.point.lng,
                    	lat: rs.point.lat,
                    	address: rs.address
                    }
                    typeof callback == "function" ? callback(ret) : '';
                });
                map.addEventListener("dragend", function() {
                    var centerPoint = map.getCenter();
                    map.clearOverlays();
                    //清空原来的标注
                    var marker = new BMap.Marker(new BMap.Point(centerPoint.lng, centerPoint.lat));
                    map.addOverlay(marker);
                    //增加点  
                    marker.setPosition(400, 400);
                    var point = new BMap.Point(centerPoint.lng, centerPoint.lat);
                    var gc = new BMap.Geocoder();
                    gc.getLocation(point, function(rs){                       
                        var ret = {
	                    	lng: rs.point.lng,
	                    	lat: rs.point.lat,
	                    	address: rs.address
	                    }
                    	typeof callback == "function" ? callback(ret) : '';
                    });
                });
            } else {
                $.toast({msg: '无法定位到您的当前位置'});
            }
        },{
            enableHighAccuracy: true
        });
	}
})(aui, document, window);