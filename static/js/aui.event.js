!(function($, document, window, undefined) {
	var events = {
		opts: {
			eventArr: ['eventswipeleft', 'eventswiperight', 'eventslideup', 'eventslidedown', 'eventclick', 'eventlongpress'],				
		},
		//touchstart事件，delta记录开始触摸位置
		touchStart: function(event) {
			var _this = this;
			_this.delta = {};
			_this.delta.x = event.touches[0].pageX;
			_this.delta.y = event.touches[0].pageY;
			_this.delta.time = new Date().getTime();
		},
		/**
		 * touchend事件，计算两个事件之间的位移量
		 * 1、如果位移量很小或没有位移，看做点击事件
		 * 2、如果位移量较大，x大于y，可以看做平移，x>0,向右滑，反之向左滑。
		 * 3、如果位移量较大，x小于y，看做上下移动，y>0,向下滑，反之向上滑
		 * 这样就模拟的移动端几个常见的时间。
		 * */
		touchEnd: function(event) {
			var _this = this;
			let delta = _this.delta;
			delete _this.delta;
			let timegap = new Date().getTime() - delta.time;
			delta.x -= event.changedTouches[0].pageX;
			delta.y -= event.changedTouches[0].pageY;
			if (Math.abs(delta.x) < 5 && Math.abs(delta.y) < 5) {
				if (timegap < 1000) {
					if (_this['eventclick']) {
						_this['eventclick'].map(function(fn) {
							fn(event);
						});
					}
				} else {
					if (_this['eventlongpress']) {
						_this['eventlongpress'].map(function(fn) {
							fn(event);
						});
					}
				}
				return;
			}
			if (Math.abs(delta.x) > Math.abs(delta.y)) {
				if (delta.x > 0) {
					if (_this['eventswipeleft']) {
						_this['eventswipeleft'].map(function(fn) {
							fn(event);
						});
					}
				} else {
					_this['eventswiperight'].map(function(fn) {
						fn(event);
					});
				}
			} else {
				if (delta.y < 0) {
					if (_this['eventslidedown']) {
						_this['eventslidedown'].map(function(fn) {
							fn(event);
						});
					}
				} else {
					_this['eventslideup'].map(function(fn) {
						fn(event);
					});
				}
			}
		},
		bindEvent: function(dom, type, callback) {
			var _this = this;
			if (!dom) {
				aui.toast({msg: 'dom is null or undefined'}); return;
			}
			let flag = _this.opts.eventArr.some(key => dom[key]);
			if (!flag) {
				dom.addEventListener('touchstart', _this.touchStart);
				dom.addEventListener('touchend', _this.touchEnd);
			}
			if (!dom['event' + type]) {
				dom['event' + type] = [];
			}
			dom['event' + type].push(callback);
		},
		removeEvent: function(dom, type, callback) {
			var _this = this;
			if (dom['event' + type]) {
				for (let i = 0; i < dom['event' + type].length; i++) {
					if (dom['event' + type][i] === callback) {
						dom['event' + type].splice(i, 1);
						i--;
					}
				}
				if (dom['event' + type] && dom['event' + type].length === 0) {
					delete dom['event' + type];
					let flag = _this.opts.eventArr.every(key => !dom[key]);
					if (flag) {
						dom.removeEventListener('touchstart', _this.touchStart);
						dom.removeEventListener('touchend', _this.touchEnd);
					}
				}
			}
		},
			
	}
	$.on = function(dom, type, callback){
		events.bindEvent(dom, type, callback);
	};
	$.off = function(dom, type, callback){
		events.removeEvent(dom, type, callback);
	};
})(aui, document, window);