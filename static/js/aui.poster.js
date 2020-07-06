/* ===============================
	 * poster广告弹窗
	 * versions 1.0.0
	 * cl15095344637@163.com
	 * @example:
	    aui.poster({
			image: 'https://xbjz1.oss-cn-beijing.aliyuncs.com/upload/default/share.png'
		});
 * ===============================
 */
!(function($, document, window, undefined){
	var poster = new Object();
	poster = {
		opts: function(opt){
			var opts = {
				warp: 'body', //--可选参数，父容器
				mask: true, //--可选参数，是否显示遮罩，默认true-显示，false-隐藏
				touchClose: true, //--可选参数，触摸遮罩是否关闭模态弹窗，默认true-关闭，false-不可关闭
				image: '', //图片
			}
			return $.extend(opts, opt, true);
		},
		creat: function(opt, callback){ //创建
			var _this = this;
			var _opts = _this.opts(opt);
			var _html = '<div class="aui-poster">'
				+'<div class="aui-mask"></div>'
				+'<div class="aui-poster-main">'
					+'<img class="aui-poster-img" src="'+ _opts.image +'">'
					+'<img class="aui-poster-close" src="https://xbjz1.oss-cn-beijing.aliyuncs.com/upload/default/gz-close.png">'
				+'</div>'
			+'</div>';
			if(document.querySelector(".aui-poster")) return;
			document.querySelector(_opts.warp).insertAdjacentHTML('beforeend', _html);
			_this['ui'] = {
				poster: document.querySelector(".aui-poster"),
				main: document.querySelector(".aui-poster-main"),
				mask: document.querySelector(".aui-mask"),
				image: document.querySelector(".aui-poster-img"),
				closeBtn: document.querySelector(".aui-poster-close")
			}			
			!$.isDefine(_opts.mask) && _this.ui.mask ? _this.ui.mask.parentNode.removeChild(_this.ui.mask) : '';	
			_this.ui.image.addEventListener("click", function(e){
				_this.hide(opt);				
				var timer = setTimeout(function() {
					clearTimeout(timer);
					typeof callback == "function" ?  callback() : '';
				},200);
			});
			_this.ui.closeBtn.addEventListener("click", function(e){
				_this.hide(opt);				
				var timer = setTimeout(function() {
					clearTimeout(timer);
					typeof callback == "function" ?  callback() : '';
				},200);
			});
			_this.ui.main.addEventListener("touchmove", function(e){
	            e.preventDefault();
	       	},{ passive: false });
	       	_this.ui.mask.addEventListener("click", function(e){
	            !_opts.touchClose ? e.preventDefault() : _this.hide(opt);
	       	});
			_this.ui.mask.addEventListener("touchmove", function(e){
	            e.preventDefault()
	       	},{ passive: false });
		},		
		show: function(opt, callback){ //显示
			var _this = this;
			var _opts = _this.opts(opt);
			_this.creat(opt, callback);			
			_this.ui.poster.style.cssText = 'display: inline-block;';
			_this.ui.mask ? _this.ui.mask.style.animation = "aui-fade-in .2s ease-out forwards" : '';
			_this.ui.main.style.cssText = 'animation: aui-slide-up_to_middle .3s ease-out forwards;';
		},
		hide: function(opt, callback){ //隐藏
			var _this = this;
			var _opts = _this.opts(opt);
			_this.ui.poster.style.cssText = 'animation: aui-fade-out .2s ease-out forwards;';
			var timer = setTimeout(function() {
				_this.ui.poster ? _this.ui.poster.parentNode.removeChild(_this.ui.poster) : '';
				typeof callback == "function" ?  callback() : '';
				clearTimeout(timer);
			},150);
		}
	}
	$.poster = function(opt, callback){
		poster.show(opt, callback);
	};
})(aui, document, window);
