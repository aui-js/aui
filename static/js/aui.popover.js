/* ===============================
	 * popover弹出菜单
	 * versions 1.0.0
	 * cl15095344637@163.com
	 * @example: 
	 	aui.popover.open({
			warp: '.aui-header-right',
			items: [], //[{name: "", color: "", icon: "", fontSize: "", textAlign: ""}]
			mask: true,
			location: 'bottom'
		},function(ret){
			console.log(ret);
		})	
 * ===============================
 */
!(function($, document, window, undefined){
    $.popover = {
        opts: function(opt){
			var opts = {
				warp: 'body', //--可选参数，父容器               
                items: [], //--必选参数，菜单列表[{name: "", color: "", icon: "iconfont icongfont-right", iconColor: '', img: "", fontSize: "", textAlign: ""}]
                location: 'top',
                mask: false,
                touchClose: true
			}
			return $.extend(opts, opt, true);
		},
        // 创建弹窗UI元素
        creat: function(opt){
            var _this = this;
            var _opts = _this.opts(opt);
            var _html = '<div class="aui-popover">'
            	+'<div class="aui-mask"></div>'
            	+'<div class="aui-popover-main"><ul class="aui-popover-items"></ul><span class="aui-popover-triangle"></span></div>'
            +'</div>';
            document.querySelector('body').insertAdjacentHTML('beforeend', _html);
            _this['ui'] = {
            	warp: document.querySelector(_opts.warp),
            	popover: document.querySelector('.aui-popover'),
            	main: document.querySelector('.aui-popover-main'),
            	mask: document.querySelector('.aui-mask'),
            	lists: document.querySelector('.aui-popover-items'),
            	triangle: document.querySelector('.aui-popover-triangle')
            }
            !$.isDefine(_opts.mask) && _this.ui.mask ? _this.ui.mask.parentNode.removeChild(_this.ui.mask) : '';
            _opts.warp == 'body' ? _this.ui.triangle.parentNode.removeChild(_this.ui.triangle) : '';
            if(_opts.items.length <= 0) { $.toast({msg: "Parameter 'items' not set"}); return false; }
			var _html = '';
        	for(var i in _opts.items){
        		if($.isDefine(_opts.items[i].icon))
        		{
        			_html += '<li class="aui-popover-item row-after"><i class="iconfont '+ _opts.items[i].icon +'"></i><span>'+ _opts.items[i].name +'</span></li>'
        		}
        		else
        		{
					if($.isDefine(_opts.items[i].img)){
						_html += '<li class="aui-popover-item row-after"><img src="'+ _opts.items[i].img +'"><span>'+ _opts.items[i].name +'</span></li>'
					}
					else{
						_html += '<li class="aui-popover-item row-after"><span>'+ _opts.items[i].name +'</span></li>'						
					}
        		}
        	}
        	_this.ui.lists.insertAdjacentHTML('beforeend', _html);
        	_this.ui['item'] = document.querySelectorAll('.aui-popover-item');        	
            _this.css(opt);
        },
        //样式设置
        css: function(opt){
        	var _this = this;
        	var _opts = _this.opts(opt);
        	//设置菜单弹窗位置
        	switch (_opts.location){
        		case 'top': //使用时设置弹窗显示到触发元素“上”方
        			if(_this.ui.warp.offsetTop >= _this.ui.main.offsetHeight + 10)
        			{ //触发元素距顶部距离大于弹窗高度 + 20，则设置位置位于触发元素“上”方
        				_this.ui.main.style.cssText += "top: "+ (_this.ui.warp.offsetTop - _this.ui.main.offsetHeight - 10 )+"px;";
        				_this.ui.triangle.style.cssText += "top: "+ (_this.ui.main.offsetHeight - 10) +"px;";
        			}
        			else
        			{ //否则反之
        				_this.ui.main.style.cssText += "top: "+ (_this.ui.warp.offsetTop + _this.ui.warp.offsetHeight + 10) +"px;";
        				_this.ui.triangle.style.cssText += "top: -6px;";
        			}        			
        			break;
        		case 'bottom': //使用时设置弹窗显示到触发元素“下”方
        			if(window.screen.height - _this.ui.warp.offsetHeight - _this.ui.warp.offsetTop >= _this.ui.main.offsetHeight + 10)
        			{ //触发元素距底部距离大于弹窗高度 + 20，则设置位置位于触发元素“下”方
        				_this.ui.main.style.cssText += "top: "+ (_this.ui.warp.offsetTop + _this.ui.warp.offsetHeight + 10) +"px;";
        				_this.ui.triangle.style.cssText += "top: -6px;";
        			}
        			else
        			{ //否则反之
        				_this.ui.main.style.cssText += "top: "+ (_this.ui.warp.offsetTop - _this.ui.main.offsetHeight - 10) +"px;";
        				_this.ui.triangle.style.cssText += "top: "+ (_this.ui.main.offsetHeight - 10) +"px;";
        			}
        			break;
        		default:
        			break;
        	}
        	_this.ui.main.style.cssText += "left: "+ (_this.ui.warp.offsetLeft + _this.ui.warp.offsetWidth / 2 - _this.ui.main.offsetWidth / 2) +"px;";
			_this.ui.triangle.style.cssText += "left: "+ ((_this.ui.main.offsetWidth - 12) / 2) +"px;";
			if(_this.ui.main.offsetLeft + _this.ui.main.offsetWidth >= window.screen.width)
			{ //超出右边界
				_this.ui.main.style.cssText += "left: auto; right: 7px;";
				_this.ui.triangle.style.cssText += "left: auto; right: "+ (window.screen.width - _this.ui.warp.offsetLeft - _this.ui.warp.offsetWidth / 2 - Math.sqrt(_this.ui.triangle.offsetWidth * _this.ui.triangle.offsetWidth * 2) + 5) +"px;";
			}
			if(_this.ui.main.offsetLeft <= 0)
			{ //超出左边界
				_this.ui.main.style.cssText += "left: 7px; right: auto;";
				_this.ui.triangle.style.cssText += "left: "+ (_this.ui.warp.offsetLeft + _this.ui.warp.offsetWidth / 2 - Math.sqrt(_this.ui.triangle.offsetWidth * _this.ui.triangle.offsetWidth * 2) + 5) +"px; right: auto";
			}	
			if(_opts.items.length > 0)
			{
				for(var i in _opts.items)
				{
					$.isDefine(_opts.items[i].color) ? _this.ui.item[i].querySelector("span").style.color = _opts.items[i].color : "";
					$.isDefine(_opts.items[i].fontSize) ? _this.ui.item[i].querySelector("span").style.fontSize = _opts.items[i].fontSize : "";
					$.isDefine(_opts.items[i].textAlign) ? _this.ui.item[i].style.textAlign = _opts.items[i].textAlign : "";
					$.isDefine(_opts.items[i].iconColor) ? _this.ui.item[i].querySelector("i").style.color = _opts.items[i].iconColor : "";
				}
			}
        },
        // 初始化弹窗
        open: function(opt, callback){
            var _this = this;
            var _opts = _this.opts(opt);
            if(!document.querySelector(".aui-popover")){
                _this.creat(opt);
            }
			_this.ui.main.addEventListener("touchmove", function(e){
	            e.preventDefault();
	       	},{ passive: false });
	       	_this.ui.popover.addEventListener("touchmove", function(e){
	            e.preventDefault();
	       	},{ passive: false });
	       	if(!$.isDefine(_opts.mask)){
	       		_this.ui.popover.addEventListener("click", function(e){
		            !_opts.touchClose ? e.preventDefault() : _this.close();
		       	});
	       	}
	       	_this.ui.mask.addEventListener("click", function(e){
	            !_opts.touchClose ? e.preventDefault() : _this.close();
	       	});
			_this.ui.mask.addEventListener("touchmove", function(e){
	            e.preventDefault();
	       	},{ passive: false });
	       	for (var i = 0; i < _opts.items.length; i++)
			{				
				!function(j){
					$.touchDom(_this.ui.item[j], "#EFEFEF");
					_this.ui.item[j].addEventListener("click", function(e){
						var _self = this;
						_this.close();
						var timer = setTimeout(function(){
							clearTimeout(timer);
							typeof callback == "function" ?  callback({el: _self, index: j}) : '';
						},200);
					});
				}(i);
			}
        },
        // 隐藏弹窗
        close: function(){
            var _this = this;
            _this.ui.main.style.animation = "aui-fade-out .2s ease-out forwards";
			_this.ui.mask ? _this.ui.mask.style.animation = "aui-fade-out .2s ease-out forwards" : '';
			var timer = setTimeout(function() {
				_this.ui.popover ? _this.ui.popover.parentNode.removeChild(_this.ui.popover) : '';
				clearTimeout(timer);				
			},200);
        },

    }
})(aui, document, window);
