/* ===============================
	 * actionMenu底部菜单
	 * versions 1.0.0
	 * cl15095344637@163.com
	 * @example:
	    aui.actionMenu({
			title: '分享至',
			mask: true,
			touchClose: true,
			items: [
				{name: "微信", icon: "../../img/weixin.png"},
				{name: "朋友圈", icon: "../../img/pengyouquan.png"},
				{name: "QQ", icon: "../../img/QQ.png"},
				{name: "微博", icon: "../../img/weibo.png"}
			],
			cancle: "取消",
			theme: 1,
			location: "bottom"
		},function(ret){
			console.log(ret.index);				
		});
 * ===============================
 */
!(function($, document, window, undefined){
	var actionMenu = new Object();
	actionMenu = {
		opts: function(opt){
			var opts = {
				warp: 'body', //--可选参数，父容器
				mask: true, //--可选参数，是否显示遮罩，默认true-显示，false-隐藏
				touchClose: true, //--可选参数，触摸遮罩是否关闭模态弹窗，默认true-关闭，false-不可关闭
				items: [], //--必选参数，菜单列表[{name: "", icon: "", iconColor: "", img: ""}]
				cancle: "", //--可选参数，取消按钮
				location: 'bottom', //--可选参数，位置 <1、bottom:位于底部，从底部弹出显示>、<2、middle:位于页面中心位置>
				theme: 1, //--可选参数，主题样式
			}
			return $.extend(opts, opt, true);
		},
		creat: function(opt, callback){ //创建
			var _this = this;
			var _opts = _this.opts(opt);
			var _html = '<div class="aui-actionmenu">'
				+'<div class="aui-mask"></div>'
				+'<div class="aui-actionmenu-main">'
					+'<div class="aui-actionmenu-title">'+ _opts.title +'</div>'
					+'<ul class="aui-actionmenu-items"></ul>'
					+'<div class="aui-actionmenu-cancle" index="0">'+ _opts.cancle +'</div>'
				+'</div>'
			+'</div>';
			if(document.querySelector(".aui-actionmenu")) return;
			document.querySelector(_opts.warp).insertAdjacentHTML('beforeend', _html);
			var ui = {
				main: document.querySelector(".aui-actionmenu-main"),
				title: document.querySelector(".aui-actionmenu-title"),
				mask: document.querySelector(".aui-mask"),
				items: document.querySelector(".aui-actionmenu-items"),
				item: document.querySelectorAll(".aui-actionmenu-item"),
				cancle: document.querySelector(".aui-actionmenu-cancle")
			}
			!$.isDefine(_opts.title) && ui.title ? ui.title.parentNode.removeChild(ui.title) : '';
			!$.isDefine(_opts.mask) && ui.mask ? ui.mask.parentNode.removeChild(ui.mask) : '';
			!$.isDefine(_opts.cancle) && ui.cancle ? ui.cancle.parentNode.removeChild(ui.cancle) : '';
			if($.isDefine(_opts.items))
			{
				for(var i = 0; i < _opts.items.length; i++)
				{
					if($.isDefine(_opts.items[i].img)){
						ui.items.insertAdjacentHTML('beforeend', '<li class="aui-actionmenu-item" index="'+ (Number(i) + 1) +'"><img src="'+ _opts.items[i].img +'" /><p>'+ _opts.items[i].name +'</p></li>');						
					}
					else{
						if($.isDefine(_opts.items[i].icon)){
							ui.items.insertAdjacentHTML('beforeend', '<li class="aui-actionmenu-item" index="'+ (Number(i) + 1) +'"><i class="iconfont '+ _opts.items[i].icon +'" /></i><p>'+ _opts.items[i].name +'</p></li>');						
						}
						else{
							ui.items.insertAdjacentHTML('beforeend', '<li class="aui-actionmenu-item no-icon" index="'+ (Number(i) + 1) +'"><p>'+ _opts.items[i].name +'</p></li>');						
						}
					}
					ui["item"] = document.querySelectorAll(".aui-actionmenu-item");
					!(function(j){
						$.touchDom(ui.item[j], "#EFEFEF");
						ui.item[j].addEventListener("click", function(e){
							_this.hide(opt);
							var index = Number(this.getAttribute("index"));
							var timer = setTimeout(function() {
								clearTimeout(timer);
								typeof callback == "function" ?  callback({index: index}) : '';
							},200);
						});
					})(i);
				}
			}
			$.touchDom(ui.cancle, "#EFEFEF");
			ui.cancle.addEventListener("click", function(e){
				_this.hide(opt);
				var index = Number(this.getAttribute("index"));
				var timer = setTimeout(function() {
					clearTimeout(timer);
					typeof callback == "function" ?  callback({index: index}) : '';
				},200);
			});
			ui.main.addEventListener("touchmove", function(e){
	            e.preventDefault();
	       	},{ passive: false });
	       	ui.mask.addEventListener("click", function(e){
	            !_opts.touchClose ? e.preventDefault() : _this.hide(opt);
	       	});
			ui.mask.addEventListener("touchmove", function(e){
	            e.preventDefault()
	       	},{ passive: false });
			_this.css(opt);
		},
		css: function(opt){ //设置特定样式
			var _this = this;
			var _opts = _this.opts(opt);
			var ui = {
				warp: document.querySelector(_opts.warp),
				actionmenu: document.querySelector(".aui-actionmenu"),
				main: document.querySelector(".aui-actionmenu-main"),
				title: document.querySelector(".aui-actionmenu-title"),
				item: document.querySelectorAll(".aui-actionmenu-item"),
			}
			switch (_opts.theme){
				case 1:
					ui.actionmenu.classList.add('aui-actionmenu-style-1');
					if(_opts.location == "bottom")
					{ //位于底部，从底部弹出显示
						ui.actionmenu.classList.add('aui-actionmenu-bottom');
					}
					else if(_opts.location == "middle")
					{ //位于页面中心位置
						ui.actionmenu.classList.add('aui-actionmenu-middle');
						ui.main.style.top = (ui.main.parentNode.offsetHeight - ui.main.offsetHeight) / 2 + "px";
						//console.log($.isDefine(_opts.cancle));
						if($.isDefine(_opts.cancle))
						{
							ui.item[ui.item.length-1].style.borderBottomLeftRadius = ui.item[ui.item.length-1].style.borderBottomRightRadius = "0px";
						}
					}
					if($.isDefine(_opts.title))
					{
						ui.item[0].style.borderTopLeftRadius = ui.item[0].style.borderTopRightRadius = "0px";
						_opts.title.length >= 15 ? ui.title.style.textAlign = "left" : ui.title.style.textAlign = "center";
					}
					break;
				case 2:
					ui.actionmenu.classList.add('aui-actionmenu-style-2');
					if(_opts.location == "bottom")
					{ //位于底部，从底部弹出显示
						ui.actionmenu.classList.add('aui-actionmenu-bottom');
					}
					else if(_opts.location == "middle")
					{ //位于页面中心位置
						ui.actionmenu.classList.add('aui-actionmenu-middle');
						ui.main.style.top = (ui.main.parentNode.offsetHeight - ui.main.offsetHeight) / 2 + "px";
					}
					break;
				default:
					break;
			}
			ui.main.style.left = (ui.warp.offsetWidth - ui.main.offsetWidth) / 2 + "px";
			if($.isDefine(_opts.items))
			{
				for(var i = 0; i < _opts.items.length; i++)
				{
					$.isDefine(_opts.items[i].color) ? ui.item[i].style.color = _opts.items[i].color : "";
					$.isDefine(_opts.items[i].fontSize) ? ui.item[i].style.fontSize = _opts.items[i].fontSize : "";
					$.isDefine(_opts.items[i].textAlign) ? ui.item[i].style.textAlign = _opts.items[i].textAlign : "";
					$.isDefine(_opts.items[i].iconColor) ? ui.item[i].querySelector('i').style.color = _opts.items[i].iconColor : "";
				}
			}
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
				actionmenu: document.querySelector(".aui-actionmenu"),
				main: document.querySelector(".aui-actionmenu-main"),
				mask: document.querySelector(".aui-mask"),
			}
			if(_opts.theme == 1 && _opts.location == "bottom")
			{
				ui.main.style.animation = "aui-slide-down .2s ease-out forwards";
			}
			else if(_opts.theme == 2 && _opts.location == "bottom")
			{
				ui.main.style.animation = "aui-slide-down-screen .2s ease-out forwards";
			}
			else
			{
				ui.main.style.animation = "aui-fade-out .2s ease-out forwards";
			}
			ui.mask ? ui.mask.style.animation = "aui-fade-out .2s ease-out forwards" : '';
			var timer = setTimeout(function() {
				ui.actionmenu ? ui.actionmenu.parentNode.removeChild(ui.actionmenu) : '';
				typeof callback == "function" ?  callback() : '';
				clearTimeout(timer);
			},200);
		}
	}
	$.actionMenu = function(opt, callback){
		actionMenu.show(opt, callback);
	};
})(aui, document, window);