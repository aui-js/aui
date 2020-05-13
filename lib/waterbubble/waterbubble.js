/**
 * 水球图 wataerbubble
 * @author fiona23 (fiona_fanmy@163.com)
 */

(function($) {
	$.fn.waterbubble = function(options) {
		var config = $.extend({
			radius: 100, //球半径
			lineWidth: undefined, //线宽
			data: 0.5, //数据
			waterColor: '#FB6802', //球颜色
			textColor: '#FF0002', //文字颜色
			font: '', //字体
			wave: true, //是否显示波纹
			txt: undefined, //文字内容
			animation: true //是否动画显示
		}, options);

		var canvas = this[0];
		config.lineWidth = config.lineWidth ? config.lineWidth : config.radius / 24;

		var waterbubble = new Waterbubble(canvas, config);

		return this;
	}


	function Waterbubble(canvas, config) {
		this.refresh(canvas, config);
	}

	Waterbubble.prototype = {
		refresh: function(canvas, config) {
			canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
			this._init(canvas, config)
		},

		_init: function(canvas, config) {
			var radius = config.radius;
			var lineWidth = config.lineWidth;
			context = canvas.getContext("2d");
			canvas.width = radius * 2 + lineWidth;
			canvas.height = radius * 2 + lineWidth;
			let dpr = window.devicePixelRatio; // 假设dpr为2
			// 获取css的宽高
			let { width: cssWidth, height: cssHeight } = canvas.getBoundingClientRect();
			// 根据dpr，扩大canvas画布的像素，使1个canvas像素和1个物理像素相等
			canvas.style.width = radius * 2 + lineWidth + 'px';
			canvas.style.height = radius * 2 + lineWidth + 'px';
			canvas.width = dpr * cssWidth;
			canvas.height = dpr * cssHeight;
			// 由于画布扩大，canvas的坐标系也跟着扩大，如果按照原先的坐标系绘图内容会缩小
			// 所以需要将绘制比例放大
			context.scale(dpr, dpr);
			this._buildShape(canvas, config);
		},

		_buildShape: function(canvas, config) {

			var ctx = canvas.getContext('2d');

			var gap = config.lineWidth * 2;
			//raidus of water
			var r = config.radius - gap;
			var data = config.data;
			var lineWidth = config.lineWidth

			var waterColor = config.waterColor;
			var textColor = config.textColor;
			var font = config.font;

			var wave = config.wave

			// //the center of circle
			var x = config.radius + lineWidth / 2;
			var y = config.radius + lineWidth / 2;

			ctx.beginPath();

			ctx.arc(x, y, config.radius, 0, Math.PI * 2);
			ctx.lineWidth = lineWidth;
			ctx.strokeStyle = waterColor;
			ctx.stroke();
			//if config animation true
			if (config.animation) {
				this._animate(ctx, r, data, lineWidth, waterColor, x, y, wave)
			} else {
				this._fillWater(ctx, r, data, lineWidth, waterColor, x, y, wave);
			}

			if (typeof config.txt == 'string') {
				this._drawText(ctx, textColor, font, config.radius, data, x, y, config.txt);
			}

			return;
		},

		_fillWater: function(ctx, r, data, lineWidth, waterColor, x, y, wave) {
			ctx.beginPath();

			ctx.globalCompositeOperation = 'destination-over';

			//start co-ordinates
			var sy = r * 2 * (1 - data) + (y - r);
			var sx = x - Math.sqrt((r) * (r) - (y - sy) * (y - sy));
			//middle co-ordinates
			var mx = x;
			var my = sy;
			//end co-ordinates
			var ex = 2 * mx - sx;
			var ey = sy;

			var extent; //extent

			if (data > 0.9 || data < 0.1 || !wave) {
				extent = sy
			} else {
				extent = sy - (mx - sx) / 4
			}

			ctx.beginPath();

			ctx.moveTo(sx, sy)
			ctx.quadraticCurveTo((sx + mx) / 2, extent, mx, my);
			ctx.quadraticCurveTo((mx + ex) / 2, 2 * sy - extent, ex, ey);

			var startAngle = -Math.asin((x - sy) / r)
			var endAngle = Math.PI - startAngle;

			ctx.arc(x, y, r, startAngle, endAngle, false)

			ctx.fillStyle = waterColor;
			ctx.fill()
		},

		_drawText: function(ctx, textColor, font, radius, data, x, y, txt) {
			ctx.globalCompositeOperation = 'source-over';

			var size = font ? font.replace(/\D+/g, '') : 0.4 * radius;
			ctx.font = font ? font : 'bold ' + size + 'px Microsoft Yahei';

			txt = txt.length ? txt : data * 100 + '%'

			var sy = y + size / 2;
			var sx = x - ctx.measureText(txt).width / 2

			ctx.fillStyle = textColor;
			ctx.fillText(txt, sx, sy)
		},

		_animate: function(ctx, r, data, lineWidth, waterColor, x, y, wave) {
			var datanow = {
				value: 0
			};
			var requestAnimationFrame = window.requestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame ||
				window.webkitRequestAnimationFrame || function(func) {
					setTimeout(func, 16);
				};
			var self = this;
			var update = function() {
				if (datanow.value < data - 0.01) {
					datanow.value += (data - datanow.value) / 15
					self._runing = true;
				} else {
					self._runing = false;
				}
			}
			var step = function() {
				self._fillWater(ctx, r, datanow.value, lineWidth, waterColor, x, y, wave);
				update();
				if (self._runing) {
					requestAnimationFrame(step);
				}
			}
			step(ctx, r, datanow, lineWidth, waterColor, x, y, wave)
		}
	}
}(jQuery));
