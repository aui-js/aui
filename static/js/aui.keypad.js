/* ===============================
	 * keypad数字键盘
	 * versions 1.0.0
	 * cl15095344637@163.com
	 * @example:
	    aui.keypad.open({
	    	type: 'point', //1、number | 2、point | 3、idcard
	    	num: 2, //小数点保留几位
	    	mask: false,
	    	// value: document.querySelector('#text').value
	    }, function(ret){
	    	console.log(ret);
	    	document.querySelector('#text').value = ret.result;
	    });
 * ===============================
 */
!(function($, document, window, undefined){
	$.keypad = {
		opts(opt){
			var opts = {
				warp: 'body', //--可选参数，父容器
				type: 'number', //类型, "number"—纯数字键盘 || "point"—带小数点键盘 || "idcard"—输入身份证号键盘
				value: '',
				num: 2, //控制小数点后保留两位
				mask: true, //--可选参数，是否显示遮罩，默认true-显示，false-隐藏
				touchClose: true, //--可选参数，触摸遮罩是否关闭模态弹窗，默认true-关闭，false-不可关闭
			}
			return $.extend(opts, opt, true);
		},
		//创建键盘元素
		creat(opt, callback){ 
			var _this = this;
			var _opts = _this.opts(opt);
			var _html = '<div class="aui-keypad">'
   				+'<div class="aui-mask"></div>'
   				+'<div class="aui-keypad-main">'
   					+'<div class="aui-keypad-top row-before row-after"><i class="iconfont icondown1"></i></div>'
   					+'<ul class="aui-keypad-middle"></ul>'
   				+'</div>'
   			+'</div>';
			document.querySelector(_opts.warp).insertAdjacentHTML('beforeend', _html);
			_this['ui'] = {
				keypad: document.querySelector(".aui-keypad"),
				main: document.querySelector(".aui-keypad-main"),
				mask: document.querySelector(".aui-mask"),
				top:  document.querySelector(".aui-keypad-top"),
				middle: document.querySelector(".aui-keypad-middle"),
			}
			!$.isDefine(_opts.mask) && _this.ui.mask ? _this.ui.mask.style.cssText = 'background: transparent;' : '';
			for(let i = 1; i <= 9; i++)
			{
				var _item = '<li class="aui-keypad-item aui-keypad-number" id="'+ i +'">'+ i +'</li>';
				_this.ui.middle.insertAdjacentHTML('beforeend', _item);				
			}
			switch (_opts.type){
				case "number":
					var _item = '<li class="aui-keypad-item aui-keypad-hide" id="number"></li>';
					_this.ui.middle.insertAdjacentHTML('beforeend', _item);
					break;
				case "point":
					var _item = '<li class="aui-keypad-item aui-keypad-point" id=".">.</li>';
					_this.ui.middle.insertAdjacentHTML('beforeend', _item);
					_this.ui['point'] = document.querySelector(".aui-keypad-point");
					aui.touchDom(_this.ui.point, "rgba(235,235,235,1)");
					break;
				case "idcard":
					var _item = '<li class="aui-keypad-item aui-keypad-card" id="x">x</li>';
					_this.ui.middle.insertAdjacentHTML('beforeend', _item);
					_this.ui['card'] = document.querySelector(".aui-keypad-card");
					aui.touchDom(_this.ui.card, "rgba(235,235,235,1)");
					break;
				default:
					var _item = '<li class="aui-keypad-item aui-keypad-hide" id="number"></li>';
					_this.ui.middle.insertAdjacentHTML('beforeend', _item);
					break;
			}			
			var _item = '<li class="aui-keypad-item aui-keypad-number aui-keypad-zero" id="0">0</li>'
					+'<li class="aui-keypad-item aui-keypad-clear" id="clear"><i class="iconfont iconjianpanshanchu"></i></li>';
			_this.ui.middle.insertAdjacentHTML('beforeend', _item);						
			_this.ui['number'] = document.querySelectorAll(".aui-keypad-number");
			_this.ui['clear'] = document.querySelector(".aui-keypad-clear");			
		},
		//打开键盘
		open(opt, callback){
			var _this = this;
			var _opts = _this.opts(opt);
			_this.creat(opt, callback);
			_this.ui.main.addEventListener("touchmove", function(e){
			    e.preventDefault();
			},{ passive: false });
			_this.ui.mask.addEventListener("click", function(e){
			    !_opts.touchClose ? e.preventDefault() : _this.close(opt);
			});
			_this.ui.mask.addEventListener("touchmove", function(e){
			    e.preventDefault()
			},{ passive: false });
			_this.ui.top.addEventListener("click", function(e){
			    _this.close(opt, callback);
			});
			for(var i = 0; i < _this.ui.number.length; i++){
				aui.touchDom(_this.ui.number[i], "rgba(235,235,235,1)");					
			}
			aui.touchDom(_this.ui.top, "rgba(235,235,235,1)");
			aui.touchDom(_this.ui.clear, "rgba(250,250,250,1)");
			_this.clickEvents(opt, callback);			
		},
		//关闭键盘
		close(opt, callback){ 
			var _this = this;
			var _opts = _this.opts(opt);
			//关闭键盘时检验最后一位是否为小数点
			if(_this.result && _this.result.indexOf('.') != -1)
			{
				if(_this.result.toString().split(".")[1].length == 0)
				{
					_this.result = _this.result.substr(0, _this.result.length - 1);					
				}
			}
			_this.ui && _this.ui.mask ? _this.ui.mask.style.animation = "aui-fade-out .2s ease-out forwards" : '';
			_this.ui ? _this.ui.main.style.cssText = 'animation: aui-slide-down-screen .3s ease-out forwards;' : '';
			var timer = setTimeout(function() {
				_this.ui ? _this.ui.keypad.style.cssText = 'animation: aui-fade-out .2s ease-out forwards;' : '';
				document.querySelector(".aui-keypad") ? document.querySelector(".aui-keypad").parentNode.removeChild(document.querySelector(".aui-keypad")) : '';
				typeof callback == "function" ?  callback({result: _this.result}) : '';
				clearTimeout(timer);
			},150);
		},
		//键盘相关事件处理
		clickEvents(opt, callback){
			var _this = this;
			var _opts = _this.opts(opt);
			_this.result  = _opts.value;
			//数字点击
			for(var i = 0; i < _this.ui.number.length; i++){
				!(function(index){
					_this.ui.number[index].onclick = function(){
						if(_opts.type == "point")
						{
							if(_this.result == '00')
							{
								_this.result = '0';
							}
						}
						if(_this.result.indexOf('.') != -1) //控制小数点后可输入位数
						{
							if(_this.result.toString().split(".")[1].length < _opts.num)
							{
								_this.result += _this.ui.number[index].innerText;
							}
						}
						else
						{
							_this.result += _this.ui.number[index].innerText;	   					   					
						}
						typeof callback == 'function' ? callback({index: _this.ui.number[index].id, result: _this.result}) : '';
					}
				})(i);
			}
			//小数点点击
			if(_opts.type == "point")
			{
				_this.ui.point.onclick = function(){
					if(_this.result == '00')
					{
						_this.result = '0';
					}
					if(_this.result.indexOf('.') == -1 && _this.result.length > 0)
					{
						_this.result += _this.ui.point.innerText; 
						typeof callback == 'function' ? callback({index: _this.ui.point.id, result: _this.result}) : '';
					}
				}
			}
			//输入身份证号键盘
			if(_opts.type == 'idcard')
			{
				_this.ui.card.onclick = function(){
					if(_this.result.length == 17)
					{
						_this.result += _this.ui.card.innerText;
						typeof callback == 'function' ? callback({index: _this.ui.card.id, result: _this.result}) : '';
					}
				}
			}
			//删除已输入内容
			_this.ui.clear.onclick = function(){
				if(_this.result.length > 0)
				{
					_this.result = _this.result.substr(0, _this.result.length - 1);
					typeof callback == 'function' ? callback({index: _this.ui.clear.id, result: _this.result}) : '';
				}
			}
		},
	}	
})(aui, document, window);
