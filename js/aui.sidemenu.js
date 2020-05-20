/* ===============================
	 * 侧滑菜单
	 * versions 1.0.0
	 * cl15095344637@163.com
	 * @example:
	    aui.sidemenu.init({
	    	warp: '.aui-container',
	    	content: '#aui-sidemenu-wapper',
	    	position: _this.position.data[_this.position.currentIndex].position,
	    	moveType: _this.list.data[_this.list.currentIndex].moveType,
	    	moves: ['.aui-container'],
	    	mask: true,
	    	maskTapClose: true,
	    	drag: {
	    		use: true,
	    		//start: _this.dragcallback,
	    		//move: _this.dragcallback,
	    		end: function(ret){
	    			console.log(ret)
	    		}
	    	},
	    	style: {
	    		w: '70vw',
	    		h: '100vh',
	    		bg: '#333'
	    	},
	    }).then(function(ret){
	    	console.log(ret)
	    });
		aui.sidemenu.setData({ //设置配置数据
			position: 'right',
			moveType: 'main-move'
		}).then(function(ret){
			//console.log(ret)
		});
 * ===============================
 */
!(function($, document, window, undefined){
	$.sidemenu = {
		data: {
			warp: 'body', //--可选参数，父容器
			content: '', //--必选参数，侧滑菜单元素
			moves: [], //--可选参数，跟随拖动元素；[header——页面头部, .content——页面内容部分] (moveType设置为"all-move" 或 "menu-move"时，此参数必须配置)
			moveType: 'main-move', // ['main-move': '主页面移动，侧滑菜单固定'] ['menu-move': '侧滑菜单移动，主页面固定'] ['all-move': '主页面+侧滑菜单都移动']
			mask: true, //--可选参数，是否显示遮罩，默认true-显示，false-隐藏
			maskTapClose: true, //--可选参数，触摸遮罩是否关闭模态弹窗，默认true-关闭，false-不可关闭
			position: 'left', //--可选参数，侧滑菜单初始化位置，默认位于页面左侧 [left: '左侧', right: '右侧']
			speed: 10, //--可选参数，打开、关闭页面速度[值越大，速度越快]
			drag: {
				use: true, //--可选参数，是否开启拖动打开、关闭菜单[true: 开启 | false: 关闭]
				start: null, //--可选参数，开始拖动回调
				move: null, //--可选参数，拖动中回调
				end: null, //--可选参数，拖动结束
			}, 
			style: {
				w: '80vw',
				h: '100vh',
				bg: '#333'
			},
		},
		opts: function(opt){
			return $.extend(this.data, opt, true);
		},
		init: function(opt){ //初始化
			var _this = this;
			_this.data = _this.opts(opt);
			return new Promise(function(resolve, reject){
				Promise.all([
					_this._creat(opt), 
					_this._setStyle(opt),
					_this.drag(opt)
				]).then(function(ret){
					//console.log(ret);
					resolve({status: 0, data: {event: 'init'}});
				});				
			});
		},
		setData: function(opt){ //设置菜单配置数据
			var _this = this;
			_this.data = _this.opts(opt);
			return new Promise(function(resolve, reject){
				Promise.all([ 
					_this._creat(opt), 
					_this._setStyle(opt),
					_this.drag(opt)
				]).then(function(ret){
					//console.log(ret);										
					resolve({status: 0, data: {event: 'setData'}});
				});			
			});
		},
		query: function(el){
			return document.querySelector(el);
		},
		_creat: function(opt){ //创建
			var _this = this;	
			_this.data = _this.opts(opt);
			return new Promise(function(resolve, reject){
				var _html = '<aside class="aui-sidemenu hide">'
					+'<div class="aui-sidemenu-main">'+ _this.query(_this.data.content).innerHTML || '' +'</div>'
				+'</aside>';
				_this.query(".aui-sidemenu") ? _this.query(".aui-sidemenu").parentNode.removeChild(_this.query(".aui-sidemenu")) : '';
				_this.query('body').insertAdjacentHTML('beforeend', _html);
				_this.query(_this.data.content).style.display = 'none';
				_this.ui = {
					warp: _this.query(_this.data.warp) || '',
					container: _this.query('.aui-sidemenu') || '',
					main: _this.query('.aui-sidemenu-main') || '',
					mask: _this.query('.aui-sidemenu').querySelector('.aui-mask') || ''
				};						
				resolve({status: 0, data: {event: 'creat'}});
			});
		},
		_setStyle: function(opt){ //设置样式
			var _this = this;
			_this.data = _this.opts(opt);
			return new Promise(function(resolve, reject){
				switch (_this.data.moveType){
					case 'main-move': //主页面移动，菜单不动
						_this.ui.container.classList.add('fixed');
						_this.ui.container.classList.remove('move');
						_this.ui.container.classList.remove('scale');
						_this.query('body').style.background = '';
						break;
					case 'menu-move': //主页面不动，菜单移动
						_this.ui.container.classList.remove('fixed');
						_this.ui.container.classList.add('move');
						_this.ui.container.classList.remove('scale');
						_this.query('body').style.background = '';
						break;
					case 'all-move': //整体移动
						_this.ui.container.classList.remove('fixed');
						_this.ui.container.classList.add('move');
						_this.ui.container.classList.remove('scale');
						_this.query('body').style.background = '';						
						break;
					case 'scale-move': //缩放式侧滑(类手机QQ)
						_this.ui.container.classList.add('fixed');
						_this.ui.container.classList.add('scale');
						_this.ui.container.classList.remove('move');
						_this.ui.warp.style.transformOrigin = _this.data.position + ' center';
						_this.query('body').style.background = _this.data.style.bg;
						break;
					default:
						break;
				}
				switch (_this.data.position){
					case 'left': //位于页面左侧
						_this.ui.container.classList.add('left');
						_this.ui.container.classList.remove('right');
						break;
					case 'right': //位于页面右侧
						_this.ui.container.classList.remove('left');
						_this.ui.container.classList.add('right');
						break;
					default:
						break;
				}
				_this.ui.warp.style.position = 'relative';
				_this.ui.warp.style.zIndex = '1';
				_this.ui.warp.style.transform = '';
				_this.ui.container.style.width = _this.data.style.w;
				_this.ui.container.style.height = _this.data.style.h;
				_this.ui.container.style.background = _this.data.style.bg;
				resolve({status: 0, data: {event: 'setStyle'}});
			});
		},
		open: function(opt){ //打开
			var _this = this;
			_this.data = _this.opts(opt);
			return new Promise(function(resolve, reject){
				var i = Math.abs(_this.oLeft);
				clearInterval(window.openTimer);
				clearInterval(window.closeTimer);
				window.openTimer = setInterval(function(){
					i += _this.data.speed;
					switch (_this.data.position){
						case 'left': //位于页面左侧
							if(i >= _this.ui.container.offsetWidth)
							{
								i = _this.ui.container.offsetWidth;
								_this.oLeft = _this.ui.container.offsetWidth;
								clearInterval(window.openTimer);
							}
							if(_this.data.moveType == 'menu-move' || _this.data.moveType == 'all-move')
							{
								_this.ui.container.style.left = -_this.ui.container.offsetWidth + i + 'px';							
							}
							if(_this.data.moveType == 'main-move' || _this.data.moveType == 'all-move' || _this.data.moveType == 'scale-move')
							{
								_this.data.moves.forEach(function(item, index){
									_this.query(item).style.left = i + 'px';
								})
							}
							if(_this.data.moveType == 'menu-move' || _this.data.moveType == 'main-move' || _this.data.moveType == 'all-move')
							{
								_this.ui.mask ? _this.ui.mask.style.left = i - 1 + 'px' : '';								
							}
							if(_this.data.moveType == 'scale-move')
							{
								if(i * 0.2 / _this.ui.container.offsetWidth < 0){
									var scaleNum = 0;
								}
								else if(i * 0.2 / _this.ui.container.offsetWidth > 0.2){
									var scaleNum = 0.2;
								}
								else{
									var scaleNum = i * 0.2 / _this.ui.container.offsetWidth;
								}
								scaleNum = Math.floor(scaleNum * 100) / 100;
								_this.ui.container.style.transform = 'scale('+ (0.8 + scaleNum) +')';
								_this.ui.warp.style.transform = 'scale('+  (1 - scaleNum) +')';
							}
							break;
						case 'right': //位于页面右侧
							if(i >= _this.ui.container.offsetWidth)
							{
								i = _this.ui.container.offsetWidth;
								_this.oLeft = -_this.ui.container.offsetWidth;
								clearInterval(window.openTimer);
							}
							if(_this.data.moveType == 'menu-move' || _this.data.moveType == 'all-move')
							{
								_this.ui.container.style.right = -_this.ui.container.offsetWidth + i + 'px';							
							}
							if(_this.data.moveType == 'main-move' || _this.data.moveType == 'all-move' || _this.data.moveType == 'scale-move')
							{
								_this.data.moves.forEach(function(item, index){
									_this.query(item).style.left = 'auto';
									_this.query(item).style.right = i + 'px';
								})
							}							
							if(_this.data.moveType == 'menu-move' || _this.data.moveType == 'main-move' || _this.data.moveType == 'all-move')
							{
								_this.ui.mask ? _this.ui.mask.style.left = 'auto' : '';
								_this.ui.mask ? _this.ui.mask.style.right = i - 1 + 'px' : '';
							}
							if(_this.data.moveType == 'scale-move')
							{
								if(i * 0.2 / _this.ui.container.offsetWidth < 0){
									var scaleNum = 0;
								}
								else if(i * 0.2 / _this.ui.container.offsetWidth > 0.2){
									var scaleNum = 0.2;
								}
								else{
									var scaleNum = i * 0.2 / _this.ui.container.offsetWidth;
								}
								scaleNum = Math.floor(scaleNum * 100) / 100;
								_this.ui.container.style.transform = 'scale('+ (0.8 + scaleNum) +')';
								_this.ui.warp.style.transform = 'scale('+  (1 - scaleNum) +')';
							}
							break;
						default:
							break;
					}
					
				},5);
				_this._show(opt);
				resolve({status: 0, data: {event: 'open'}});
			});
		},
		close: function(opt){ //关闭
			var _this = this;
			_this.data = _this.opts(opt);
			return new Promise(function(resolve, reject){
				var i = Math.abs(_this.oLeft);
				clearInterval(window.openTimer);
				clearInterval(window.closeTimer);
				window.closeTimer = setInterval(function(){
					i -= _this.data.speed;
					switch (_this.data.position){
						case 'left': //位于页面左侧
							if(i <= 0)
							{
								i = 0;
								_this.oLeft = 0;
								clearInterval(window.closeTimer);
							}
							if(_this.data.moveType == 'menu-move' || _this.data.moveType == 'all-move')
							{
								_this.ui.container.style.left = -_this.ui.container.offsetWidth + i + 'px';							
							}
							if(_this.data.moveType == 'main-move' || _this.data.moveType == 'all-move' || _this.data.moveType == 'scale-move')
							{
								_this.data.moves.forEach(function(item, index){
									_this.query(item).style.left = i + 'px';
								})
							}
							if(_this.data.moveType == 'menu-move' || _this.data.moveType == 'main-move' || _this.data.moveType == 'all-move')
							{
								_this.ui.mask ? _this.ui.mask.style.left = i - 1 + 'px' : '';								
							}
							if(_this.data.moveType == 'scale-move')
							{
								if(i * 0.2 / _this.ui.container.offsetWidth < 0){
									var scaleNum = 0;
								}
								else if(i * 0.2 / _this.ui.container.offsetWidth > 0.2){
									var scaleNum = 0.2;
								}
								else{
									var scaleNum = i * 0.2 / _this.ui.container.offsetWidth;
								}
								scaleNum = Math.floor(scaleNum * 100) / 100;
								_this.ui.container.style.transform = 'scale('+ (0.8 + scaleNum) +')';
								_this.ui.warp.style.transform = 'scale('+  (1 - scaleNum) +')';								
							}
							break;
						case 'right': //位于页面右侧
							if(i <= 0)
							{
								i = 0;
								_this.oLeft = 0;
								clearInterval(window.closeTimer);
							}
							if(_this.data.moveType == 'menu-move' || _this.data.moveType == 'all-move')
							{
								_this.ui.container.style.right = -_this.ui.container.offsetWidth + i + 'px';							
							}
							if(_this.data.moveType == 'main-move' || _this.data.moveType == 'all-move' || _this.data.moveType == 'scale-move')
							{
								_this.data.moves.forEach(function(item, index){
									_this.query(item).style.left = 'auto';
									_this.query(item).style.right = i + 'px';
								})
							}
							if(_this.data.moveType == 'menu-move' || _this.data.moveType == 'main-move' || _this.data.moveType == 'all-move')
							{
								_this.ui.mask ? _this.ui.mask.style.left = 'auto' : '';
								_this.ui.mask ? _this.ui.mask.style.right = i - 1 + 'px' : '';
							}
							if(_this.data.moveType == 'scale-move')
							{
								if(i * 0.2 / _this.ui.container.offsetWidth < 0){
									var scaleNum = 0;
								}
								else if(i * 0.2 / _this.ui.container.offsetWidth > 0.2){
									var scaleNum = 0.2;
								}
								else{
									var scaleNum = i * 0.2 / _this.ui.container.offsetWidth;
								}
								scaleNum = Math.floor(scaleNum * 100) / 100;
								_this.ui.container.style.transform = 'scale('+ (0.8 + scaleNum) +')';
								_this.ui.warp.style.transform = 'scale('+  (1 - scaleNum) +')';
							}
							break;
						default:
							break;
					}
					
				},5)
				_this._hide(opt);
				resolve({status: 0, data: {event: 'close'}});
			});
		},
		_show: function(opt){ //显示
			var _this = this;
			_this.data = _this.opts(opt);
			return new Promise(function(resolve, reject){
				_this.ui.container.classList.add('show');
				_this.ui.container.classList.remove('hide');
				!_this.query(".aui-mask") ? _this.ui.warp.insertAdjacentHTML('beforeend', '<div class="aui-mask"></div>') : '';
				_this.ui.mask = _this.query(".aui-mask");
				if(_this.data.maskTapClose)
				{
					if($.isDefine(_this.ui.mask))
					{
						_this.ui.mask.onclick = function(){ //点击遮罩关闭菜单
							_this.close({speed: 10});
						}
					}
				}
				resolve({status: 0, data: {event: 'show'}});
			});
		},
		_hide: function(opt){ //隐藏
			var _this = this;
			_this.data = _this.opts(opt);
			return new Promise(function(resolve, reject){
				_this.ui.container.classList.add('hide');
				_this.ui.container.classList.remove('show');
				_this.query(".aui-mask") ? _this.query(".aui-mask").parentNode.removeChild(_this.query(".aui-mask")) : '';
				resolve({status: 0, data: {event: 'hide'}});
			});
		},
		drag: function(opt){ //拖动
			var _this = this;
			_this.data = _this.opts(opt);
			return new Promise(function(resolve, reject){
				_this.oL = 0, _this.oLeft = 0, _this.oT = 0, _this.oTop = 0;
				if(!_this.data.drag.use){return;}
				_this._touchstart(opt);
				_this._touchmove(opt);
				_this._touchend(opt);
				resolve({status: 0, data: {event: 'drag'}});				
			});
		},
		_touchstart: function(opt){
			var _this = this;
			_this.data = _this.opts(opt);
			_this.ui.warp.ontouchstart = function(e){
				var ev = e || window.event;
				var touch = ev.targetTouches[0];
				switch (_this.data.position){
					case 'left': //位于页面左侧
						if(_this.oLeft == 0)
						{
							_this.oL = touch.clientX;
						}
						else{
							_this.oL = touch.clientX - (_this.ui.container.offsetWidth - Math.abs(_this.ui.container.offsetLeft));
						}
						break;
					case 'right': //位于页面右侧
						if(_this.oLeft == 0)
						{
							_this.oL = touch.clientX;
						}
						else{
							_this.oL = touch.clientX + (_this.ui.warp.offsetWidth - Math.abs(_this.ui.container.offsetLeft));
						}
						break;
					default:
						break;
				}
				_this.oT = touch.clientY - _this.ui.container.offsetTop;
				clearInterval(window.openTimer);
				clearInterval(window.closeTimer);
				typeof _this.data.drag.start === 'function' ? _this.data.drag.start({status: 0, msg: '拖动开始', data: {event: 'drag'}}) : '';
			}
		},
		_touchmove: function(opt){
			var _this = this;
			_this.data = _this.opts(opt);
			_this.ui.warp.ontouchmove = function(e) {
				var _self = this;
				var ev = e || window.event;
				var touch = ev.targetTouches[0];
				_this.oLeft = touch.clientX - _this.oL;
				_this.oTop = touch.clientY - _this.oT;
				if(Math.abs(_this.oTop) - Math.abs(_this.oLeft) > 1){_this.oLeft = _this.oTop = 0; return;}
				switch (_this.data.position){
					case 'left': //位于页面左侧
						if(_this.oLeft < 0)
						{
							_this.oLeft = 0;
							_this._hide(opt);
						}
						else if(_this.oLeft > _this.ui.container.offsetWidth)
						{
							_this.oLeft = _this.ui.container.offsetWidth;
							_this._show(opt);
						}
						if(_this.data.moveType == 'menu-move' || _this.data.moveType == 'all-move')
						{
							_this.ui.container.style.left = -_this.ui.container.offsetWidth + _this.oLeft + 'px';					
						}
						if(_this.data.moveType == 'main-move' || _this.data.moveType == 'all-move' || _this.data.moveType == 'scale-move')
						{
							_this.data.moves.forEach(function(item, index){					
								_this.query(item).style.left = _this.oLeft + 'px';
								_this.query(item).style.right = 'auto';
							})					
						}
						if(_this.data.moveType == 'menu-move' || _this.data.moveType == 'main-move' || _this.data.moveType == 'all-move')
						{
							_this.ui.mask ? _this.ui.mask.style.left = _this.oLeft - 1 + 'px' : '';							
						}
						if(_this.data.moveType == 'scale-move')
						{
							if(_this.oLeft * 0.2 / _this.ui.container.offsetWidth < 0){
								var scaleNum = 0;
							}
							else if(_this.oLeft * 0.2 / _this.ui.container.offsetWidth > 0.2){
								var scaleNum = 0.2;
							}
							else{
								var scaleNum = _this.oLeft * 0.2 / _this.ui.container.offsetWidth;
							}
							scaleNum = Math.floor(scaleNum * 1000) / 1000;
							_this.ui.container.style.transform = 'scale('+ (0.8 + scaleNum) +')';
							_this.ui.warp.style.transform = 'scale('+  (1 - scaleNum) +')';
						}
						break;
					case 'right': //位于页面右侧
						if(_this.oLeft < -_this.ui.container.offsetWidth)
						{
							_this.oLeft = -_this.ui.container.offsetWidth;
							_this._show(opt);
						}
						else if(_this.oLeft >= 0)
						{
							_this.oLeft = 0;
							_this._hide(opt);
						}
						if(_this.data.moveType == 'menu-move' || _this.data.moveType == 'all-move')
						{
							_this.ui.container.style.right = -_this.ui.container.offsetWidth - _this.oLeft + 'px';					
						}
						if(_this.data.moveType == 'main-move' || _this.data.moveType == 'all-move' || _this.data.moveType == 'scale-move')
						{
							_this.data.moves.forEach(function(item, index){		
								_this.query(item).style.left = 'auto';
								_this.query(item).style.right = -_this.oLeft + 'px';
							})					
						}						
						if(_this.data.moveType == 'menu-move' || _this.data.moveType == 'main-move' || _this.data.moveType == 'all-move')
						{
							_this.ui.mask ? _this.ui.mask.style.left = 'auto' : '';
							_this.ui.mask ? _this.ui.mask.style.right = -_this.oLeft - 1 + 'px' : '';
						}
						if(_this.data.moveType == 'scale-move')
						{
							if(-_this.oLeft * 0.2 / _this.ui.container.offsetWidth < 0){
								var scaleNum = 0;
							}
							else if(-_this.oLeft * 0.2 / _this.ui.container.offsetWidth > 0.2){
								var scaleNum = 0.2;
							}
							else{
								var scaleNum = -_this.oLeft * 0.2 / _this.ui.container.offsetWidth;
							}
							scaleNum = Math.floor(scaleNum * 1000) / 1000;
							_this.ui.container.style.transform = 'scale('+ (0.8 + scaleNum) +')';
							_this.ui.warp.style.transform = 'scale('+  (1 - scaleNum) +')';
						}
						break;
					default:
						break;
				}							
				typeof _this.data.drag.move === 'function' ? _this.data.drag.move({status: 0, msg: '拖动中', data: {event: 'drag'}}) : '';
			}
		},
		_touchend: function(opt){
			var _this = this;
			_this.data = _this.opts(opt);
			_this.ui.warp.ontouchend = function() {
				var _self = this;	
				if(Math.abs(_this.oTop) - Math.abs(_this.oLeft) > 1){_this.oLeft = _this.oTop = 0; _this.close({speed: 10}); return;}
				switch (_this.data.position){
					case 'left': //位于页面左侧
						if(_this.oLeft < _this.ui.container.offsetWidth / 2)
						{
							_this.close(opt);
							var msg = '菜单关闭';
						}
						else
						{
							_this.open(opt);
							var msg = '菜单开启';
						}
						break;
					case 'right': //位于页面右侧
						if(Math.abs(_this.oLeft) < _this.ui.container.offsetWidth / 2)
						{
							_this.close(opt);
							var msg = '菜单关闭';
						}
						else
						{
							_this.open(opt);
							var msg = '菜单开启';
						}
						break;
					default:
						break;
				}
				typeof _this.data.drag.end === 'function' ? _this.data.drag.end({status: 0, msg: msg, data: {event: 'drag'}}) : '';
			}
		},
	}
})(aui, document, window);
