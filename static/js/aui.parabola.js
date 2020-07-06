/* ===============================
	 * parabola抛物线(加入购物车)
	 * versions 1.0.0
	 * cl15095344637@163.com
	 * @example:
	    aui.parabola({
			origin: '', //@param  {[object]} origin [起点元素]
			target: '', //@param  {[object]} target [目标点元素]
			element: '', //@param  {[object]} element [要运动的元素]
			radian: '', //@param  {[number]} radian [抛物线弧度]
			time: '', //@param  {[number]} time [动画执行时间]
			callback: '', //@param  {[function]} callback [抛物线执行完成后回调]
		});
 * ===============================
 */
!(function($, document, window, undefined){
	$.parabola = {
		opts: function(opt){
			var opts = {
				origin: '', //@param  {[object]} origin [起点元素]
				target: '', //@param  {[object]} target [目标点元素]
				element: '', //@param  {[object]} element [要运动的元素]
				radian: '', //@param  {[number]} radian [抛物线弧度]
				time: '', //@param  {[number]} time [动画执行时间]
				callback: '', //@param  {[function]} callback [抛物线执行完成后回调]
			}
			return $.extend(opts, opt, true);
		},
		//初始化
		init(opt){ 
			var _this = this;
			_this.$ = function(selector) {
				return document.querySelector(selector);
			};
			if(_this.timer){return false;};
			_this.b = 0;
			_this.INTERVAL = 15;
			_this.config = _this.opts(opt) || {};
			// 起点
			_this.origin = _this.$(_this.config.origin) || null;
			// 终点
			_this.target = _this.$(_this.config.target) || null;
			// 运动的元素
			_this.element = _this.$(_this.config.element) || null;
			// 曲线弧度
			_this.radian = _this.config.radian || 0.010;
			// 运动时间(ms)
			_this.time = _this.config.time || 1000;
			var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
			_this.originX = _this.origin.getBoundingClientRect().left;
			_this.originY = _this.origin.getBoundingClientRect().top + scrollTop;
			_this.targetX = _this.target.getBoundingClientRect().left + _this.target.getBoundingClientRect().width/2 - _this.element.getBoundingClientRect().width/2;
			_this.targetY = _this.target.getBoundingClientRect().top + scrollTop;

			_this.diffx = _this.targetX - _this.originX;
			_this.diffy = _this.targetY - _this.originY;
			_this.speedx = _this.diffx / _this.time;

			// 已知a, 根据抛物线函数 y = a*x*x + b*x + c 将抛物线起点平移到坐标原点[0, 0]，终点随之平移，那么抛物线经过原点[0, 0] 得出c = 0;
			// 终点平移后得出：y2-y1 = a*(x2 - x1)*(x2 - x1) + b*(x2 - x1)
			// 即 diffy = a*diffx*diffx + b*diffx;
			// 可求出常数b的值
			_this.b = (_this.diffy - _this.radian * _this.diffx * _this.diffx) / _this.diffx;
			_this.element.style.left = `${_this.originX}px`;
			_this.element.style.top = `${_this.originY}px`;
		},
		// 确定动画方式
		moveStyle() {
			var _this = this;
			var moveStyle = 'position',
				testDiv = document.createElement('input');
			if('placeholder' in testDiv) {
				['', 'ms', 'moz', 'webkit'].forEach(function(pre) {
					var transform = pre + (pre ? 'T' : 't') + 'ransform';
					if(transform in testDiv.style) {
						moveStyle = transform;
					}
				});
			}
			return moveStyle;
		},
		//移动
		move() {
			var start = new Date().getTime(),
				moveStyle = this.moveStyle(),
				_this = this;
			if(_this.timer){return false;};
			_this.element.style.left = `${_this.originX}px`;
			_this.element.style.top = `${_this.originY}px`;
			_this.element.style[moveStyle] = 'translate(0px,0px)';
			_this.element.style.display = 'inline-block';
			_this.timer = null;
			_this.timer = setInterval(function() {
				if(new Date().getTime() - start > _this.time) {
					_this.element.style.left = `${_this.targetX}px`;
					_this.element.style.top = `${_this.targetY}px`;
					_this.element.style.display = 'none';
					typeof _this.config.callback === 'function' && _this.config.callback();
					clearInterval(_this.timer);
					_this.timer = null;
					return;
				}
				var x = _this.speedx * (new Date().getTime() - start);
				var y = _this.radian * x * x + _this.b * x;
				if(moveStyle === 'position') {
					_this.element.style.left = `${x + _this.originX}px`;
					_this.element.style.top = `${y + _this.originY}px`;
				} else {
					if(window.requestAnimationFrame) {
						window.requestAnimationFrame(function(){
							_this.element.style[moveStyle] =
								'translate(' + x + 'px,' + y + 'px)';
						});
					} else {
						_this.element.style[moveStyle] =
							'translate(' + x + 'px,' + y + 'px)';
					}
				}
			}, _this.INTERVAL);
			return _this;
		}
	}
})(aui, document, window);