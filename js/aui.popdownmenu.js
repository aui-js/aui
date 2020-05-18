/* ===============================
	 * popdownmenu底部弹出窗口
	 * versions 1.0.0
	 * cl15095344637@163.com
	 * @example:
	    aui.popdownMenu({
			mask: true,
			touchClose: true,
			html: '',
			theme: 1,
		},function(ret){
			console.log(ret.index);
		});
 * ===============================
 */
!(function($, document, window, undefined){
	$.popdownMenu = {
		opts: function(opt){
			var opts = {
				warp: 'body', //--可选参数，父容器
				mask: true, //--可选参数，是否显示遮罩，默认true-显示，false-隐藏
				touchClose: true, //--可选参数，触摸遮罩是否关闭模态弹窗，默认true-关闭，false-不可关闭
				html: [], //--必选参数，菜单列表[{name: "", icon: ""}]
			}
			return $.extend(opts, opt, true);
		},
		creat: function(opt, callback){ //创建
			var _this = this;
			var _opts = _this.opts(opt);
			var _html = '<div class="aui-popdownmenu">'
				+'<div class="aui-mask"></div>'
				+'<div class="aui-popdownmenu-main">'
					+_opts.html
				+'</div>'
			+'</div>';
			if(document.querySelector(".aui-popdownmenu")) return;
			document.querySelector(_opts.warp).insertAdjacentHTML('beforeend', _html);
			_this.ui = {
				warp: document.querySelector(_opts.warp),
				popdownmenu: document.querySelector(".aui-popdownmenu"),
				main: document.querySelector(".aui-popdownmenu-main"),
				mask: document.querySelector(".aui-mask")
			}
			!$.isDefine(_opts.mask) && _this.ui.mask ? _this.ui.mask.parentNode.removeChild(_this.ui.mask) : '';
			/*_this.ui.main.addEventListener("touchmove", function(e){
	            e.preventDefault();
	       	},{ passive: false });*/
	       	_this.ui.mask.addEventListener("click", function(e){
	            !_opts.touchClose ? e.preventDefault() : _this.close(opt, callback);
	       	});
			_this.ui.mask.addEventListener("touchmove", function(e){
	            e.preventDefault()
	       	},{ passive: false });
			_this.css(opt);
		},
		css: function(opt){ //设置特定样式
			var _this = this;
			var _opts = _this.opts(opt);
			_this.ui.main.style.left = (_this.ui.warp.offsetWidth - _this.ui.main.offsetWidth) / 2 + "px";
		},
		open: function(opt, callback){ //显示
			var _this = this;
			var _opts = _this.opts(opt);
			_this.creat(opt, callback);
			_this.ui.popdownmenu.classList.add("show");
			var timer = setTimeout(function() {
				typeof callback == "function" ?  callback({type: 'open'}) : '';
				clearTimeout(timer);
			},200);
		},
		close: function(opt, callback){ //隐藏
			var _this = this;
			var _opts = _this.opts(opt);
			_this.ui.popdownmenu.classList.add("hide");
			var timer = setTimeout(function() {
				_this.ui.popdownmenu ? _this.ui.popdownmenu.parentNode.removeChild(_this.ui.popdownmenu) : '';
				typeof callback == "function" ?  callback({type: 'close'}) : '';
				clearTimeout(timer);
			},200);
		}
	}
})(aui, document, window);
