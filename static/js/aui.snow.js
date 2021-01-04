/* ===============================	 
	 * 雪花飘落
	 * versions 1.0.0
	 * cl15095344637@163.com
	 * @example: 
	 * 		aui.snows({
				warp: '.aui-content',
				el: '<i class="iconfont iconxuehua snow"></i>',
			});
 * ===============================
 */
!(function($, document, window, undefined){
	var pluginName = "snow",
    defaults = {
    	warp: 'body',
    	el: '<i class="iconfont iconxuehua snow"></i>',
    	num: 100,
        width: 0, //（固定参数） 直径
        minWidth: 5, // 最大直径
        maxWidth: 20, // 最小直径
        opacity: 0, //（固定参数） 透明度
        x: 0, //（固定参数） 水平位置
        y: 0, //（固定参数） 重置位置
        z: 0, //（固定参数） z轴位置
        sx: 0, //（固定参数） 水平速度
        sy: 0, //（固定参数） 垂直速度
        dir: 'r', // 倾斜方向
        isSwing: false, // 是否左右摇摆
        stepSx: 0.02, // 左右摇摆的步长
        swingRadian: 1, // 左右摇摆的正弦函数x变量
        swingStep: 0.01, // 左右摇摆的正弦x步长
        maxSpeed: 4, // 最大速度
        minSpeed: 1, // 最小速度
        quickMaxSpeed: 10, // 快速划过的最大速度
        quickMinSpeed: 8, // 快速划过的最小速度
        quickWidth: 20, // 快速划过的宽度
        quickOpacity: 0.2, // 快速划过的透明度
        windowWidth: window.innerWidth, //窗口宽度
        windowHeight: window.innerHeight //窗口高度
    };
    
	var Snow = function(opt) {
		this._defaults = defaults;
        this._name = pluginName;
	    this.opts = opt;
	    this.init();
	}
	
	Snow.prototype = {
		init: function (reset) {
            var isQuick = Math.random() > 0.8;
			this.isSwing = Math.random() > 0.8;
			this.width = isQuick ? this.opts.quickWidth : Math.floor(Math.random() * this.opts.maxWidth + this.opts.minWidth);
			this.opacity = isQuick ? this.opts.quickOpacity : Math.random();
			this.x = Math.floor(Math.random() * (this.opts.windowWidth - this.width));
			this.y = Math.floor(Math.random() * (this.opts.windowHeight - this.width));
			
			if(reset && Math.random() > 0.8) {
				this.x = -this.width;
			} 
			else if(reset) {
				this.y = -this.width;
			}
			
			this.sy = isQuick 
				? Math.random() * this.opts.quickMaxSpeed + this.opts.quickMinSpeed 
				: Math.random() * this.opts.maxSpeed + this.opts.minSpeed;
			this.sx = this.opts.dir === 'r' ? this.sy : -this.sy;
			this.z = isQuick ? Math.random() * 300 + 200 : 0;
			this.swingStep = 0.01 * Math.random();
			this.swingRadian = Math.random() * (1.1 - 0.9) + 0.9;
        },
        setStyle: function() {
        	this.el.style.cssText = `
        		position: absolute;
	            left: 0;
	            top: 0;
	            display: inline-block;
	            width: ${this.width}px;
	            height: ${this.width}px;
	            opacity: ${this.opacity};
	            pointer-events: none;
	            transform: translate(${this.x}px, ${this.y}px);
        	`;
        	this.el.querySelector('i').style.cssText = `
        		width: ${this.width}px;
	            height: ${this.width}px;
	            font-size: ${this.width}px;
	            display: inline-block;
	            color: #FFFFFF;
        	`;
        },
        render: function() {
        	this.el = document.createElement('span');
        	this.el.classList.add('snow-item');
        	this.el.innerHTML = this.opts.el;
			this.setStyle();
			document.querySelector(this.opts.warp).appendChild(this.el);
        },
        move: function() {
        	if(this.isSwing) {
				if(this.swingRadian > 1.1 || this.swingRadian < 0.9) {
					this.swingStep = -this.swingStep;
				}
				this.swingRadian += this.swingStep;
				this.x += this.sx * Math.sin(this.swingRadian * Math.PI);
				this.y -= this.sy * Math.cos(this.swingRadian * Math.PI);
			} 
			else {
				this.x += this.sx;
				this.y += this.sy;
			}
			// 完全离开窗口执行init初始化，另外还需要修改一下init方法，因为重新出现我们是希望它的y坐标为0或者小于0，这样就不会又凭空出现的感觉，而是从天上下来的
			if(this.x < -this.width 
				|| this.x > this.opts.windowWidth 
				|| this.y > this.opts.windowHeight
			) {
				this.init(true);
				this.setStyle();
			}
			this.el.style.transform = `translate3d(${this.x}px, ${this.y}px, ${this.z}px)`;
       }
	};
	
	var Snows = function(opt) {
		this.opts = $.extend(defaults, opt, true);
		this.snowList = [];
		this.createSnows();
		this.moveSnow();
	};
	
	Snows.prototype = {
		createSnows: function() {
			this.snowList = [];
			
			for(var i = 0; i < this.opts.num; i++) {
				var snow = new Snow(this.opts);
				snow.render();
				this.snowList.push(snow);
			}
		},
		moveSnow: function() {
			window.requestAnimationFrame(() => {
				this.snowList.forEach((item) => {
					item.move();
				})
				this.moveSnow();
			})
		}
	};
	
	//将snow挂载到aui
	$.snows = function(opt) {
		new Snows(opt);
	};
})(aui, document, window);