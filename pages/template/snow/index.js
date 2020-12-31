/* ===============================	 
	 * 雪花飘落
	 * versions 1.0.0
	 * cl15095344637@163.com
	 * @param {number} bankno 银行卡号码 19位 或 16位
	 * @example: aui.snow({});
 * ===============================
 */
!(function($, document, window, undefined){
	var pluginName = "snow",
    defaults = {
    	warp: 'body',
    	el: '<i class="iconfont iconxuehua snow"></i>',
    	num: 50,
        width: 0,
        minWidth: 0,
        maxWidth: 10,
        x: 0,
        y: 0,
        z: 0,
        sx: 0,
        sy: 0,
        dir: 'r',
        stepSx: 0.02,
        isSwing: false,
        opacity: 0,
        swingRadian: 1,
        swingStep: 0.01,
        maxSpeed: 4,
        minSpeed: 1,
        quickMaxSpeed: 10,
        quickMinSpeed: 8,
        quickWidth: 80,
        quickOpacity: 0.2
    };
    
	var Snow = function(opt) {
		this._defaults = defaults;
        this._name = pluginName;
	    this.opts = $.extend(defaults, opt, true);
	    this.init();
	}
	
	Snow.prototype = {
		init: function (reset) {
            var isQuick = Math.random() > 0.8;
            this.windowWidth = document.querySelector(this.opts.warp).offsetWidth;
            this.windowHeight = document.querySelector(this.opts.warp).offsetHeight;
			this.opts.isSwing = Math.random() > 0.8;
			this.opts.width = isQuick ? this.opts.quickWidth : Math.floor(Math.random() * this.opts.maxWidth + this.opts.minWidth);
			this.opts.opacity = isQuick ? this.opts.quickOpacity : Math.random();
			this.opts.x = Math.floor(Math.random() * (this.windowWidth - this.opts.width));
			this.opts.y = Math.floor(Math.random() * (this.windowHeight - this.opts.width));
			
			if(reset && Math.random() > 0.8) {
				this.opts.x = -this.opts.width;
			} 
			else if(reset) {
				this.opts.y = -this.opts.width;
			}
			
			this.opts.sy = isQuick 
				? Math.random() * this.opts.quickMaxSpeed + this.opts.quickMinSpeed 
				: Math.random() * this.opts.maxSpeed + this.opts.minSpeed;
			this.opts.sx = this.opts.dir === 'r' ? this.opts.sy : -this.opts.sy;
			this.opts.z = isQuick ? Math.random() * 300 + 200 : 0;
			this.opts.swingStep = 0.01 * Math.random();
			this.opts.swingRadian = Math.random() * (1.1 - 0.9) + 0.9;
        },
        setStyle: function() {
        	this.el.style.cssText = `
        		position: absolute;
	            left: 0;
	            top: 0;
	            display: inline-block;
	            width: ${this.opts.width}px;
	            height: ${this.opts.width}px;
	            opacity: ${this.opts.opacity};
	            pointer-events: none;
	            transform: translate(${this.opts.x}px, ${this.opts.y}px);
        	`;
        	this.el.querySelector('i').style.cssText = `
        		width: ${this.opts.width}px;
	            height: ${this.opts.width}px;
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
        	if(this.opts.isSwing) {
				if(this.opts.swingRadian > 1.1 || this.opts.swingRadian < 0.9) {
					this.opts.swingStep = -this.opts.swingStep;
				}
				this.opts.swingRadian += this.opts.swingStep;
				this.opts.x += this.opts.sx * Math.sin(this.opts.swingRadian * Math.PI);
				this.opts.y -= this.opts.sy * Math.cos(this.opts.swingRadian * Math.PI);
			} 
			else {
				this.opts.x += this.opts.sx;
				this.opts.y += this.opts.sy;
			}
			// 完全离开窗口就调一下初始化方法，另外还需要修改一下init方法，因为重新出现我们是希望它的y坐标为0或者小于0，这样就不会又凭空出现的感觉，而是从天上下来的
			if(this.opts.x < -this.opts.width 
				|| this.opts.x > this.windowWidth 
				|| this.opts.y > this.windowHeight
			) {
				this.init(true);
				this.setStyle();
			}
			this.el.style.transform = `translate3d(${this.opts.x}px, ${this.opts.y}px, ${this.opts.z}px)`;
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
//				this.moveSnow();
			})
		}
	};
	//将snow挂载到aui
	$.snows = function(opt) {
		new Snows(opt);
	};
})(aui, document, window);