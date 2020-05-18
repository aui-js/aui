/* ===============================
	 * progress条形进度条
	 * versions 1.0.0
	 * cl15095344637@163.com
	 * @example:
	    progressLine({
			el: document.getElementById("canvas"), //绘制对象
			width: 100,
			height: 7,
			borderRadius: 10,
			forecolor: ['#FF0034', '#F97777'],
			bgcolor: "rgba(200,0,0,.1)",				
			percent: {showText: true, text: 80, fontSize: 14, color: '#FF5555'}	
		});
 * ===============================
 */
function progressLine(
	{
		el,                 	//绘制对象
		width = 200, 			//宽度
		height = 5, 			//高度		
		borderRadius = 20, 		//圆角
		margin = 0,				//margin
		forecolor, 				//前景色
		bgcolor, 				//背景色		
		percent = {
			showText: true,		//是否显示百分比数字
			text: 0, 			//百分比, 范围[0, 100]
			fontSize: 20,		//百分比文字大小
			color: '#FF5555',	//百分比文字颜色
		}		
	},
callback) {	
	creat();
	var speed = 0; 
	var _main = el.querySelector('.progress-line-main');	
	var _animate = el.querySelector('.progress-line-animate');
	var _text = el.querySelector('.progress-line-percent');
	function creat(){
		var _html = 
			'<div class="progress-line-main">'
				+'<div class="progress-line-animate"></div>'
			+'</div>'
			+'<div class="progress-line-percent"></div>';
		el.insertAdjacentHTML('beforeend', _html);		
	}
	function backgroundLine(){			
		_main.style.width = width;
		_main.style.height = height + 'px';
		_main.style.display = 'inline-block';
		_main.style.background = bgcolor;
		_main.style.borderRadius = borderRadius + 'px';
		el.style.margin = margin;
		_main.style.overflow = 'hidden';
		_main.style.verticalAlign = 'middle';
	}
	function foregroundLine(n){
		_animate.style.width = n + '%';
		_animate.style.height = height + 'px';
		_animate.style.borderRadius = borderRadius + 'px';
		if(typeof forecolor === 'string')
		{
			_animate.style.background = forecolor;				
		}
		else
		{			
			_animate.style.background = 'linear-gradient(to right, '+ forecolor[0] +', '+ forecolor[1] +')';
		}
	}
	//绘制文字
	function _percent(n){
		_text.style.marginLeft = '10px';
		_text.style.fontSize = percent.fontSize + 'px';
		_text.style.display = 'inline-block';
		_text.style.color = percent.color;
		_text.style.verticalAlign = 'middle';
		_text.innerText = n.toFixed(0)+"%";
	}
	var lineRunTimer = setInterval(function(){
		backgroundLine();
		foregroundLine(speed);
		_percent(speed);
		if(speed >= percent.text) {
			clearInterval(lineRunTimer)
			var __timer = setTimeout(function(){
				clearTimeout(__timer);
				typeof callback == 'function' ? callback() : '';
			},200);
			return;
		};
		speed += 1;
	},1000/60);
	//执行动画
	/* (function drawFrame(){
		window.requestAnimationFrame(drawFrame);
		backgroundLine();
		foregroundLine(speed);
		_percent(speed);
		if(speed >= percent.text) return;
		speed += 1;
	}()); */
}