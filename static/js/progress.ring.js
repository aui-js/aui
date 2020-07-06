/* ===============================
	 * progress圆环进度条
	 * versions 1.0.0
	 * cl15095344637@163.com
	 * @example:
	    progressRing({
			el: document.getElementById("canvas"), //绘制对象
			width: 130,
			height: 130,
			lineWidth: 6,
			lineCap: 'round',
			forecolor: ['#FF0034', '#F97777'],
			bgcolor: "#FFF",
			direction: true,
			tip: {text: '总进度', fontSize: 10, color: '#FF5555'},
			percent: {text: 50, fontSize: 20, color: '#FF5555'}
		});
 * ===============================
 */
function progressRing(
	{
		el,                 	//绘制对象
		width = 150, 			//宽度
		height = 150, 			//高度
		lineWidth = 3, 			//线款
		lineCap = 'round',		//运动圆环两头圆角
		direction = false, 		//绘制圆环方向 true-逆时针 | false-顺时针
		forecolor, 				//前景色(运动圆环颜色)
		bgcolor, 				//背景色
		tip = {
			text: '',			//提示文字
			fontSize: 10,		//提示文字大小
			color: '#FF5555', 	//提示文字颜色
		},
		percent = {
			type: 'number',
			text: 0, 			//百分比, 范围[0, 100]
			fontSize: 20,		//百分比文字大小
			color: '#FF5555',	//百分比文字颜色
		}		
	}
) {
	el.innerHTML = '<canvas class="canvas" width="200" height="200"></canvas>';
	var context, center_x,center_y,rad = -Math.PI*2/100,speed=0;	
	var ringTimer = setTimeout(function(){
		clearTimeout(ringTimer);
		canvas = el.querySelector('.canvas');
		context = canvas.getContext("2d");
		center_x = canvas.width / 2;
		center_y = canvas.height / 2;	
		context.width = width;
		context.height = height;
		let dpr = window.devicePixelRatio; // 假设dpr为2	
		// 获取css的宽高
		let { width: cssWidth, height: cssHeight } = canvas.getBoundingClientRect();
		// 根据dpr，扩大canvas画布的像素，使1个canvas像素和1个物理像素相等
		canvas.style.width = width + 'px';
		canvas.style.height = height + 'px';
		canvas.width = dpr * cssWidth;
		canvas.height = dpr * cssHeight;
		// 由于画布扩大，canvas的坐标系也跟着扩大，如果按照原先的坐标系绘图内容会缩小
		// 所以需要将绘制比例放大
		context.scale(dpr, dpr);
		rad = -Math.PI*2/100; 
		speed = 0; 
		var ringRunTimer = setInterval(function(){
			context.clearRect(0, 0, canvas.width, canvas.height);
			backgroundCircle();
			_tip();
			if(percent.text > 0){
				foregroundCircle(speed);				
			}
			_percent(speed);
			if(speed >= percent.text) {
				clearInterval(ringRunTimer)
				return;
			};
			speed += 1;
		},1000/60);
		//执行动画
		/* (function drawFrame(){
			window.requestAnimationFrame(drawFrame);
			context.clearRect(0, 0, canvas.width, canvas.height);
			backgroundCircle();
			_tip();
			if(percent.text > 0){
				foregroundCircle(speed);				
			}
			_percent(speed);
			if(speed >= percent.text) return;
			speed += 1;
		}()); */
	},150)
	// 绘制背景圆圈
	function backgroundCircle(){
		context.save();
		context.beginPath();
		context.lineWidth = lineWidth; //设置线宽
		var radius = center_x - context.lineWidth;
		context.lineCap = lineCap;
		context.strokeStyle = bgcolor;
		context.arc(center_x, center_y, radius, 0, Math.PI*2, true);
		context.stroke();
		context.closePath();
		context.restore();
	} 
	//绘制运动圆环
	function foregroundCircle(n){
		context.save();
		if(typeof forecolor === 'string')
		{
			context.strokeStyle = forecolor;				
		}
		else
		{
			var g = context.createLinearGradient(center_x, 0,center_x, center_y); //创建渐变对象  渐变开始点和渐变结束点
			forecolor.map(function(item, index){	
				g.addColorStop(index / forecolor.length, item); //添加颜色点	
			});
			context.strokeStyle = g; //使用渐变对象作为圆环的颜色
		}
		context.lineWidth = lineWidth;
		context.lineCap = lineCap;
		var radius = center_x - context.lineWidth;
		context.beginPath();
		context.arc(center_x, center_y, radius , -Math.PI/2, -Math.PI/2 +n*rad, true); //用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
		context.stroke();
		context.closePath();
		context.restore();
	}
	function _tip(){
		context.save(); //save和restore可以保证样式属性只运用于该段canvas元素
		context.fillStyle = tip.color;
		context.font = tip.fontSize + "px Helvetica";
		var tip_width = context.measureText(tip.text).width;
		var tip_height = tip.text ? 20 : '';
		context.fillText(tip.text, center_x - tip_width/2, center_y + tip.fontSize/2 - tip_height);
		context.restore();
	}
	//绘制文字
	function _percent(n){
		context.save(); //save和restore可以保证样式属性只运用于该段canvas元素
		context.fillStyle = percent.color;		
		if(n==0 && percent.type != 'number'){
			var text = '暂未开启';
			context.font = percent.fontSize - 10 + "px Helvetica";				
		}else{
			var text = n.toFixed(0)+"%";
			context.font = percent.fontSize + "px Helvetica";
		}
		var percent_width = context.measureText(text).width;
		var tip_height = tip.text ? 20 : '';
		context.fillText(text, center_x - percent_width/2, center_y + percent.fontSize/2 + tip_height/2);
		context.restore();
	} 
	//执行动画
	/* (function drawFrame(){
		window.requestAnimationFrame(drawFrame);
		context.clearRect(0, 0, canvas.width, canvas.height);
		backgroundCircle();
		_tip();
		_percent(speed);
		foregroundCircle(speed);
		if(speed >= percent.text) return;
		speed += 1;
	}()); */
}