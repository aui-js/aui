/* ===============================
 	微信网页相关操作
   ===============================
 */
!(function($, document, window, undefined){
	/***  微信分享提示弹窗  */
	var wxShareModal = new Object();
	wxShareModal = {
		opts: function(opt){
			var opts = {
				warp: 'body', //--可选参数，父容器
				mask: true, //--可选参数，是否显示遮罩，默认true-显示，false-隐藏
				touchClose: true, //--可选参数，触摸遮罩是否关闭模态弹窗，默认true-关闭，false-不可关闭
				img: "https://xbjz1.oss-cn-beijing.aliyuncs.com/upload/default/fenxiang.png"
			}
			return $.extend(opts, opt, true);
		},
		creat: function(opt, callback){ //创建
			var _this = this;
			var _opts = _this.opts(opt);
			var _html = '<div class="aui-wxshare">'
				+'<div class="aui-mask"></div>'
				+'<div class="aui-wxshare-main">'
					+'<ul class="aui-wxshare-img"><img src="'+ _opts.img +'"></ul>'
				+'</div>'
			+'</div>';
			if(document.querySelector(".aui-wxshare")) return;
			document.querySelector(_opts.warp).insertAdjacentHTML('beforeend', _html);
			var ui = {
				main: document.querySelector(".aui-wxshare-main"),
				mask: document.querySelector(".aui-mask"),
			}
			!$.isDefine(_opts.mask) && ui.mask ? ui.mask.parentNode.removeChild(ui.mask) : '';
			typeof callback == "function" ?  callback() : '';
			ui.main.addEventListener("click", function(e){
	            !_opts.touchClose ? e.preventDefault() : _this.hide(opt);
	       	});
			ui.main.addEventListener("touchmove", function(e){
	            e.preventDefault();
	       	},{ passive: false });
	       	ui.mask.addEventListener("click", function(e){
	            !_opts.touchClose ? e.preventDefault() : _this.hide(opt);
	       	});
			ui.mask.addEventListener("touchmove", function(e){
	            e.preventDefault();
	       	},{ passive: false });
			_this.css(opt);
		},
		css: function(opt){ //设置特定样式
			var _this = this;

		},
		show: function(opt, callback){ //显示
			var _this = this;
			var _opts = _this.opts(opt);
			_this.creat(opt, callback);
		},
		hide: function(opt, callback){ //隐藏
			var _this = this;
			var _opts = _this.opts(opt);
			var ui = {
				wxshare: document.querySelector(".aui-wxshare"),
				main: document.querySelector(".aui-wxshare-main"),
				mask: document.querySelector(".aui-mask"),
			}
			ui.main.style.animation = "aui-fade-out .2s ease-out forwards";
			ui.mask ? ui.mask.style.animation = "aui-fade-out .2s ease-out forwards" : '';
			var timer = setTimeout(function() {
				ui.wxshare ? ui.wxshare.parentNode.removeChild(ui.wxshare) : '';
				clearTimeout(timer);
			},200);
		}
	}
	$.wxShareModal = function(opt, callback){
		wxShareModal.show(opt, callback);
	};
	//隐藏右上角按钮
	$.wxHideOptionMenu = function(){
		document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
		    WeixinJSBridge.call('hideOptionMenu');
		});
	}
	//显示右上角按钮
	$.wxShowOptionMenu = function(){
		document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
		    WeixinJSBridge.call('showOptionMenu');
		});
	}
	//隐藏微信底部自带导航栏
	$.wxHideToolbar = function(){
		document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
		    WeixinJSBridge.call('hideToolbar');
		});
	}
	//显示微信底部自带导航栏
	$.wxShowToolbar = function(){
		document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
		    WeixinJSBridge.call('showToolbar');
		});
	}
	//分享配置
	$.wxConfig = function(data){
		wx.config({
			debug: false,
			appId: data.appId,
			timestamp: data.timestamp,
			nonceStr: data.nonceStr,
			signature: data.signature,
			jsApiList: [
            	"onMenuShareTimeline",//分享朋友圈接口
            	"onMenuShareAppMessage",//分享给朋友接口
            	"onMenuShareQQ",
            	'onMenuShareWeibo',
            	'getLocation'
        	]
		})
	}
	//分享
	$.wxShare = function({imgUrl, link, title, desc}){
		wx.ready(function () {
		    var shareData = {
		        "imgUrl" : imgUrl, // 分享显示的缩略图地址
		        "link" :  link,    // 分享地址
		        "title" : title,   // 分享标题
		        "desc" : desc,     // 分享描述
		    }
		    wx.onMenuShareTimeline(shareData);
		    wx.onMenuShareAppMessage(shareData);
		    wx.onMenuShareQQ(shareData);
		    wx.onMenuShareWeibo(shareData);
		})
	}
})(aui, document, window);