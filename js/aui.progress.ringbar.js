/* ===============================
	 * progress进度条
	 * versions 1.0.0
	 * cl15095344637@163.com
	 * @example:
	    aui.progress.init({
			el: document.getElementById("canvas"), //绘制对象
			width: 150, //宽度
			height: 150, //高度
			lineWidth: 3, //线宽
			percent: 100, //绘制百分比, 范围[0, 100]
			forecolor: ['#FF7777', '#FF3333'], //前景色(运动圆环颜色)
			bgcolor: ["#FFF"], //背景色
			color: '#FF5555', //数字颜色
			fontSize: 20
		});
 * ===============================
 */
!(function($, document, window, undefined){
	$.progress = {
		opts(opt){
			var opts = {
				warp: 'body', //--可选参数，父容器
				el: '', //绘制对象
				width: 150, //宽度
				height: 150, //高度
				lineWidth: 3, //线款
				percent: 100, //绘制百分比, 范围[0, 100]
				forecolor: ['#FF7777', '#FF3333'], //前景色(运动圆环颜色)
				bgcolor: ["#FFF"], //背景色
				color: '#FF5555', //数字颜色
				fontSize: 20
			}
			return $.extend(opts, opt, true);
		},
		init(opt) {
			var _this = this;
			_this.data = _this.opts(opt);		   
		    _this.context = _this.data.el.getContext("2d");
			_this.data.el.style.cssText += 'width: ' + _this.data.width + 'px; height: ' + _this.data.height + 'px;';
		    _this.center_x = _this.data.el.width / 2;
		    _this.center_y = _this.data.el.height / 2;
		    _this.rad = Math.PI*2/100; 
		    var speed = 0;            
		    //执行动画
		    (function drawFrame(){
		        window.requestAnimationFrame(drawFrame);
		        _this.context.clearRect(0, 0, _this.data.el.width, _this.data.el.height);
		        _this.backgroundCircle();
		        _this.text(speed);
		        _this.foregroundCircle(speed);
		        if(speed >= _this.data.percent){return};
		        speed += 1;
		    }());    
		},
		// 绘制背景圆圈
		backgroundCircle(){
			var _this = this;
		    _this.context.save();
		    _this.context.beginPath();
		    _this.context.lineWidth = _this.data.lineWidth; //设置线宽
		    var radius = _this.center_x - _this.context.lineWidth;
		    _this.context.lineCap = "round";
		    // _this.context.strokeStyle = _this.data.bgcolor;
			if(typeof _this.data.bgcolor === 'string')
			{
				_this.context.strokeStyle = _this.data.bgcolor;				
			}
			else
			{
				var g = _this.context.createLinearGradient(_this.center_x, 0,_this.center_x, _this.center_y); //创建渐变对象  渐变开始点和渐变结束点
				_this.data.bgcolor.map(function(item, index){	
					g.addColorStop(index / _this.data.bgcolor.length, item); //添加颜色点	
				});
				_this.context.strokeStyle = g; //使用渐变对象作为圆环的颜色
			}
		    _this.context.arc(_this.center_x, _this.center_y, radius, 0, Math.PI*2, false);
		    _this.context.stroke();
		    _this.context.closePath();
		    _this.context.restore();
		},
		//绘制运动圆环
		foregroundCircle(n){
			var _this = this;
		    _this.context.save();			
			if(typeof _this.data.forecolor === 'string')
			{
				_this.context.strokeStyle = _this.data.forecolor;				
			}
			else
			{
				var g = _this.context.createLinearGradient(_this.center_x, 0,_this.center_x, _this.center_y); //创建渐变对象  渐变开始点和渐变结束点
				_this.data.forecolor.map(function(item, index){	
					g.addColorStop(index / _this.data.forecolor.length, item); //添加颜色点	
				});
				_this.context.strokeStyle = g; //使用渐变对象作为圆环的颜色
			}
		    _this.context.lineWidth = _this.data.lineWidth; //设置线宽
		    _this.context.lineCap = "round";
		    var radius = _this.center_x - _this.context.lineWidth;
		    _this.context.beginPath();
		    _this.context.arc(_this.center_x, _this.center_y, radius , -Math.PI/2, -Math.PI/2 +n*_this.rad, false); //用于绘制圆弧_this.context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
		    _this.context.stroke();
		    _this.context.closePath();
		    _this.context.restore();
		},
		//绘制文字
		text(n){
			var _this = this;
		    _this.context.save(); //save和restore可以保证样式属性只运用于该段canvas元素
		    _this.context.fillStyle = _this.data.color;
		    _this.context.font = _this.data.fontSize + "px Helvetica";
		    var text_width = _this.context.measureText(n.toFixed(0)+"%").width;
		    _this.context.fillText(n.toFixed(0)+"%", _this.center_x-text_width/2, _this.center_y + _this.data.fontSize/2);
		    _this.context.restore();
		} 
	}
})(aui, document, window);
