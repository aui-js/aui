/* ===============================
	 * chatbox聊天页面底部UI插件
	 * versions 1.0.0
	 * cl15095344637@163.com
	 * @example:
	    
 * ===============================
 */
!(function($, document, window, undefined){
	$.chatbox = {
		opts(opt){
			var opts = {
				warp: 'body', //--可选参数，父容器
				mask: false, //--可选参数，是否显示遮罩，默认true-显示，false-隐藏
				touchClose: true, //--可选参数，触摸遮罩是否关闭模态弹窗，默认true-关闭，false-不可关闭
				autoFocus: false, //--可选参数,是否自动获取焦点, 默认false	
				events: [], //--可选参数, 配置监听事件(录音，选择附加功能...等事件监听)
				textareaMinHeight: 40, //输入框最小高度
				textareaMaxHeight: 100, //输入框最大高度
				record: { //录音功能配置
					use: true, //是否开启录音功能
					MIN_SOUND_TIME: 800, //录音最短时间限制
				},
				emotion: { //表情功能配置
					use: true, //是否开启表情功能
					path: '', //.json文件路径
					pageHasNum: 27, //一页显示按钮数量(7 * 4 - 1)
				},
				extras: { //附加功能配置
					use: true, //是否开启附加功能
					pageHasNum: 8, //一页显示按钮数量(4 * 2)
					btns: [
						/* {title: '', icon: '', img: ''} */
					],
				},
			}			
			return $.extend(opts, opt, true);
		},		
		//创建
		creat(){ 
			var _this = this;
			var _opts = _this.data;
			return new Promise(function(resolve, reject){
				var _html = '<div class="aui-chatbox">'
					+'<div class="aui-mask"></div>'
					+'<div class="aui-chatbox-main row-before">'
						+'<div class="aui-chatbox-main-warp row-after">'
							+'<div class="aui-chatbox-left">'
								+'<div class="aui-chatbox-btn aui-chatbox-record-btn active"><i class="iconfont iconyuyin"></i></div>'
								+'<div class="aui-chatbox-btn aui-chatbox-keypad-btn"><i class="iconfont iconjianpan"></i></div>'
							+'</div>'
							+'<div class="aui-chatbox-center">'
								+'<div class="aui-chatbox-center-box aui-chatbox-center-textarea-box active">'
									+'<textarea class="aui-chatbox-textarea" placeholder="" value=""></textarea>'
								+'</div>'
								+'<div class="aui-chatbox-center-box aui-chatbox-record-start "><span>按住  说话</span></div>'								
							+'</div>'
							+'<div class="aui-chatbox-right">'
								+'<div class="aui-chatbox-btn aui-chatbox-emotion-btn active"><i class="iconfont iconbiaoqing1"></i></div>'
								+'<div class="aui-chatbox-btn aui-chatbox-keypad-btn"><i class="iconfont iconjianpan"></i></div>'
								+'<div class="aui-chatbox-btn aui-chatbox-extras-btn active"><i class="iconfont iconicon-"></i></div>'
								+'<div class="aui-chatbox-btn aui-chatbox-submit-btn "><span>发送</span></div>'
							+'</div>'
						+'</div>'
					+'</div>'
				+'</div>';
				if(document.querySelector(".aui-chatbox")) return;
				document.querySelector(_opts.warp).insertAdjacentHTML('beforeend', _html);
				_this['ui'] = {
					body: document.querySelector("body"),
					chatbox: document.querySelector(".aui-chatbox"),
					main: document.querySelector(".aui-chatbox-main"),
					mian_warp: document.querySelector('.aui-chatbox-main-warp'),
					mask: document.querySelector(".aui-mask"),
					left: document.querySelector(".aui-chatbox-left"),
					left_record_btn: document.querySelector(".aui-chatbox-left .aui-chatbox-record-btn"),
					left_keypad_btn: document.querySelector(".aui-chatbox-left .aui-chatbox-keypad-btn"),	
					center: document.querySelector(".aui-chatbox-center"),
					center_textarea_box: document.querySelector(".aui-chatbox-center-textarea-box"),
					center_textarea: document.querySelector(".aui-chatbox-textarea"),
					center_record_start: document.querySelector(".aui-chatbox-record-start"),
					center_record_end: document.querySelector(".aui-chatbox-record-end"),
					right: document.querySelector(".aui-chatbox-right"),
					right_emotion_btn: document.querySelector(".aui-chatbox-emotion-btn"),
					right_keypad_btn: document.querySelector(".aui-chatbox-right .aui-chatbox-keypad-btn"),
					right_extras_btn: document.querySelector(".aui-chatbox-right .aui-chatbox-extras-btn"),
					right_submit_btn: document.querySelector(".aui-chatbox-right .aui-chatbox-submit-btn"),
				}
				resolve();
			});						
		},	
		//初始化
		init(opt, callback){ 
			var _this = this;
			_this['data'] = _this.opts(opt);			
			_this.creat().then(function(){							
				!$.isDefine(_this.data.mask) && _this.ui.mask ? _this.ui.mask.classList.remove("active") : _this.ui.mask.classList.add("active");
				$.autoTextarea(_this.ui.center_textarea, _this.data.textareaMaxHeight, _this.data.textareaMinHeight); //跟随输入改变输入框高度
				_this.data.autoFocus ? _this.msgTextFocus() : '';
				typeof callback == 'function' ? callback() : '';
				_this.data.events.indexOf('setStyle') < 0 ? _this.setStyle() : '';
				_this.data.events.indexOf('changeInput') < 0 ? _this.changeInput() : ''; //输入检测			
				_this.data.events.indexOf('changeFocus') < 0 ? _this.changeFocus() : ''; //输入框获取焦点检测
				_this.data.events.indexOf('forbidKeypadClose') < 0 ? _this.forbidKeypadClose() : ''; //解决长按“发送”按钮，导致键盘关闭的问题；
				//———————— 录音 ————————————
				_this.data.events.indexOf('showRecord') < 0 && _this.data.record.use ? _this.showRecord() : ''; //点击左侧语音按钮显示录音区域
				_this.data.events.indexOf('hideRecord') < 0 && _this.data.record.use ? _this.hideRecord() : ''; //点击左侧键盘按钮隐藏录音区域
				_this.data.events.indexOf('createRecord') < 0 && _this.data.record.use ? _this.createRecord() : ''; // 创建录音弹窗
				_this.data.events.indexOf('recordStart') < 0 && _this.data.record.use ? _this.recordStart() : ''; //开始录音(手指按下 ' 按住 说话 ' 按钮)
				_this.data.events.indexOf('recordCancel') < 0 && _this.data.record.use ? _this.recordCancel() : ''; //取消录音(手指滑动 ' 松开 结束 ' 按钮)
				_this.data.events.indexOf('recordEnd') < 0 && _this.data.record.use ? _this.recordEnd() : ''; //结束录音(手指离开 ' 松开 结束 ' 按钮)
				//———————— 表情 ————————————
				_this.data.events.indexOf('showEmotion') < 0 && _this.data.emotion.use ? _this.showEmotion() : ''; //点击右侧表情按钮显示表情选择区域
				_this.data.events.indexOf('hideEmotion') < 0 && _this.data.emotion.use ? _this.hideEmotion() : ''; //点击右侧表情按钮隐藏表情选择区域
				_this.createEmotion();
				_this.data.events.indexOf('chooseEmotionItem') < 0 && _this.data.extras.use ? _this.chooseEmotionItem() : ''; //点击选择附加功能
				//———————— 附加功能 ————————
				_this.data.events.indexOf('showExtras') < 0 && _this.data.extras.use ? _this.showExtras() : ''; //点击右侧附加功能按钮显示附加功能选择区域
				_this.data.events.indexOf('hideExtras') < 0 && _this.data.extras.use && _this.ui.extras_container ? _this.hideExtras() : ''; //隐藏附加功能选择区域
				_this.data.events.indexOf('createExtras') < 0 && _this.data.extras.use ? _this.createExtras() : ''; //创建附加功能选择区域
				_this.data.events.indexOf('chooseExtrasItem') < 0 && _this.data.extras.use ? _this.chooseExtrasItem() : ''; //点击选择附加功能
				//———————— 发送 ———————————
				_this.data.events.indexOf('submit') < 0 ? _this.submit() : ''; //发送
			});	
		},		
		//设置样式
		setStyle(){ 
			var _this = this;
			with (_this.ui){
				if(!_this.data.record.use)
				{ //不使用——录音功能
					left.style.display = 'none';
					if(!_this.data.emotion.use)
					{ //不使用——表情功能
						right_emotion_btn.classList.remove('active');
						if(!_this.data.extras.use)
						{ //不使用——附加功能
							right_extras_btn.classList.remove('active');
							right_submit_btn.classList.add('active');						
							right.style.cssText += 'width: 75px';
							center.style.cssText += 'width: calc(100% - 75px - 10px);';							
						}
						else
						{ //使用——附加功能
							right_extras_btn.classList.add('active');
							right_submit_btn.classList.add('active');
							right.style.cssText += 'width: 115px';
							center.style.cssText += 'width: calc(100% - 115px - 10px);';		
						}
					}
					else
					{ //使用——表情功能
						right_emotion_btn.classList.add('active');
						if(!_this.data.extras.use)
						{ //不使用——附加功能
							right_extras_btn.classList.remove('active');
							right_submit_btn.classList.add('active');						
							right.style.cssText += 'width: 115px';
							center.style.cssText += 'width: calc(100% - 115px - 10px);';							
						}
						else
						{ //使用——附加功能
							if($.isDefine(center_textarea.value))
							{
								right_extras_btn.classList.remove('active');
								right_submit_btn.classList.add('active');
								right.style.cssText += 'width: 115px';
								center.style.cssText += 'width: calc(100% - 115px - 10px);';							
							}
							else
							{
								right_extras_btn.classList.add('active');
								right_submit_btn.classList.remove('active');
								right.style.cssText += 'width: 90px';
								center.style.cssText += 'width: calc(100% - 90px - 10px);';		
							}
						}						
					}
				}
				else
				{ //使用——录音功能
					left.style.display = 'inline-block';
					if(!_this.data.emotion.use)
					{ //不使用——表情功能
						right_emotion_btn.classList.remove('active');
						if(!_this.data.extras.use)
						{ //不使用——附加功能
							right_extras_btn.classList.remove('active');
							right_submit_btn.classList.add('active');						
							right.style.cssText += 'width: 75px;';
							center.style.cssText += 'width: calc(100% - 75px - 50px);';							
						}
						else
						{ //使用——附加功能
							right_extras_btn.classList.add('active');
							right_submit_btn.classList.add('active');
							right.style.cssText += 'width: 115px';
							center.style.cssText += 'width: calc(100% - 115px - 50px);';		
						}
					}
					else
					{ //使用——表情功能
						right_emotion_btn.classList.add('active');
						if(!_this.data.extras.use)
						{ //不使用——附加功能
							right_extras_btn.classList.remove('active');
							right_submit_btn.classList.add('active');						
							right.style.cssText += 'width: 115px';
							center.style.cssText += 'width: calc(100% - 115px - 50px);';							
						}
						else
						{ //使用——附加功能
							if($.isDefine(center_textarea.value))
							{
								right_extras_btn.classList.remove('active');
								right_submit_btn.classList.add('active');
								right.style.cssText += 'width: 115px';
								center.style.cssText += 'width: calc(100% - 115px - 50px);';		
							}
							else
							{
								right_extras_btn.classList.add('active');
								right_submit_btn.classList.remove('active');
								right.style.cssText += 'width: 90px';
								center.style.cssText += 'width: calc(100% - 50px - 90px);';
							}
						}						
					}
				}
				aui.touchDom(_this.ui.right_submit_btn.querySelector('span'), "#FFF", "#129611", "1px solid #129611");
			}
		},
		//输入框获取焦点
		msgTextFocus(event){
			var _this = this;
			with (_this.ui){
				center_textarea.focus();				
				var _timer = setTimeout(function() {
					clearTimeout(_timer);
					center_textarea.focus();
				}, 150);
				$.isDefine(event) ? $.preventDefault(event) : $.preventDefault();				
			}
		},
		//解决长按“发送”按钮，导致键盘关闭的问题；
		forbidKeypadClose(){
			var _this = this;
			with (_this.ui){
				function __selfPd(event){
					$.preventDefault(event);
				}
				function __selfFoucs(event){
					_this.msgTextFocus(event);
				}
				left_record_btn.addEventListener('touchmove', __selfPd, { passive: false });
				left_keypad_btn.addEventListener('touchmove', __selfPd, { passive: false });
				center_record_start.addEventListener('touchstart', __selfPd, { passive: false });
				right_emotion_btn.addEventListener('touchmove', __selfPd, { passive: false });
				right_keypad_btn.addEventListener('touchmove', __selfPd, { passive: false });
				right_extras_btn.addEventListener('touchmove', __selfPd, { passive: false });
				right_submit_btn.addEventListener('touchstart', __selfFoucs, { passive: false });
				right_submit_btn.addEventListener('drag', __selfFoucs, { passive: false });
				//滑动屏幕关闭键盘
				body.addEventListener("touchmove", function(event) {
					center_textarea.blur();
				}, { passive: false });
				mask.addEventListener("tap", function(event) {
					center_textarea.blur();
					_this.resetChatBox(); //重置聊天输入框区域
					_this.data.extras.show = false;	
					mask.classList.remove("active");
					main.style.cssText += 'bottom: 0px;';
				});
				mask.addEventListener("drag", function(event) {
					center_textarea.blur();
					_this.resetChatBox(); //重置聊天输入框区域
					_this.data.extras.show = false;	
					mask.classList.remove("active");
					main.style.cssText += 'bottom: 0px;';
				},{ passive: false });
			}
		},
		//输入检测
		changeInput(callback){
			var _this = this;
			with (_this.ui){
				center_textarea.addEventListener('input', function(){										
					_this.setStyle();
					typeof callback == 'function' ? callback() : '';
				}, false);				
			}
		},
		//输入框获取焦点检测
		changeFocus(){
			var _this = this;
			with (_this.ui){
				center_textarea.addEventListener('focus', function(){
					_this.resetChatBox(); //重置聊天输入框区域
					mask.classList.remove("active");
					_this.data.extras.show = false;	
					main.style.cssText += 'bottom: 0px;';
					this.setAttribute('readonly', 'readonly');
					setTimeout(() => {
						this.removeAttribute('readonly');
					}, 200);
				}, false);				
			}		
		},
		//重置聊天输入框区域
		resetChatBox(){
			var _this = this;
			with (_this.ui){
				if(_this.data.record.use)
				{
					left_record_btn.classList.add('active');
					left_keypad_btn.classList.remove('active');
					center_record_start.classList.remove('active');						
				}
				center_textarea_box.classList.add('active');
				if(_this.data.emotion.use)
				{
					right_emotion_btn.classList.add('active');
					right_keypad_btn.classList.remove('active');
					emotion_container.classList.add('hide');
					emotion_container.classList.remove('show');
				}					
				if(_this.data.extras.use)
				{
					extras_container.classList.add('hide');
					extras_container.classList.remove('show');
				}
			}
		},
		//点击左侧语音按钮显示录音区域
		showRecord(callback){
			var _this = this;
			with (_this.ui){
				left_record_btn.addEventListener('click', function(){
					_this.resetChatBox(); //重置聊天输入框区域
					_this.data.extras.show = false;	
					if(_this.data.record.use)
					{
						left_record_btn.classList.remove('active');
						left_keypad_btn.classList.add('active');
						center_record_start.classList.add('active');
					}
					center_textarea_box.classList.remove('active');
					mask.classList.remove("active");
					main.style.cssText += 'bottom: 0px;';
					typeof callback == 'function' ? callback() : '';
				}, false);				
			}			
		},
		//点击左侧键盘按钮隐藏录音区域
		hideRecord(callback){
			var _this = this;
			with (_this.ui){
				left_keypad_btn.addEventListener('click', function(){
					_this.resetChatBox(); //重置聊天输入框区域
					_this.data.extras.show = false;	
					if(_this.data.record.use)
					{
						left_record_btn.classList.add('active');
						left_keypad_btn.classList.remove('active');						
						center_record_start.classList.remove('active');
					}
					center_textarea_box.classList.add('active');
					center_textarea.focus();
					mask.classList.remove("active");
					main.style.cssText += 'bottom: 0px;';
					typeof callback == 'function' ? callback() : '';
				}, false);
			}				
		},
		//创建录音弹出窗
		createRecord(){
			var _this = this;
			return new Promise(function(resolve, reject){
				var _html = '<div class="aui-record-container">'
					+'<div class="aui-record-main">'
						+'<div class="aui-record-top">'
							+'<div class="aui-record-top-l"><i class="iconfont iconhuatong"></i></div>'
							+'<div class="aui-record-top-r"></div>'
						+'</div>'
						+'<div class="aui-record-tip">手指上滑，取消发送</div>'
					+'</div>'
				+'</div>';
				if(document.querySelector(".aui-record-container")) return;
				_this.ui.main.insertAdjacentHTML('beforeend', _html);
				_this.ui['record_main'] = document.querySelector('.aui-record-main');
				_this.ui['record_load'] = document.querySelector('.aui-record-top-r');
				_this.ui['record_tip'] = document.querySelector('.aui-record-tip');
				for(var i = 0; i < 8; i++)
				{
					_this.ui.record_load.insertAdjacentHTML('beforeend', '<span class="aui-record-load-span aui-record-load-span-'+ i +'" style=""></span></br>');
					if(i != 0)
					{
						document.querySelectorAll('.aui-record-load-span')[i].style.cssText += 
						'-webkit-width: calc(100% - '+ (i * 3) +'px); '
						+'width: calc(100% - '+ (i * 3) +'px);';						
					}
				}
				_this.ui['record_load_span'] = document.querySelectorAll('.aui-record-load-span');
				resolve();
			});
		},
		//开启 / 关闭录音弹窗
		setSoundAlertVisable(show){
			var _this = this;
			with (_this.ui){
				if(show)
				{
					record_main.style.cssText += 'opacity: 1; display: inline-block;';
					_this.recordLoadStart(); //开启录音动画效果
				}
				else
				{
					record_main.style.cssText += 'opacity: 0;';
					var timer = setTimeout(function(){
						record_main.style.cssText += 'display: none;';
						_this.recordLoadEnd(); //关闭录音动画效果
					},200);
				}				
			}
		},
		//开启录音动画效果
		recordLoadStart(){
			var _this = this;
			var index = [7, 6, 5, 4, 3, 2, 1, 0];
			_this.numOne = 0;
			_this.numTwo = 0;
			_this.recordOneTimer = null; 
			_this.recordTwoTimer = null; //用于清除计时器
			for(var i = 0; i < index.length - 1; i++)
			{
				_this.ui.record_load_span[i].style.cssText += 'opacity: .2';
			}
			_this.recordOneTimer = setInterval(function(){
				_this.ui.record_load_span[index[_this.numOne]].style.cssText += 'opacity: .9';
				_this.numOne++;
				if(_this.numOne >= index.length)
				{
					_this.numOne = 0;
					clearInterval(_this.recordOneTimer);										
					_this.recordTwoTimer = setInterval(function(){
						_this.ui.record_load_span[_this.numTwo].style.cssText += 'opacity: .2';
						_this.numTwo++;
						if(_this.numTwo >= index.length - 1)
						{
							_this.numTwo = 0;
							clearInterval(_this.recordTwoTimer);
							_this.recordLoadStart();										
						}
					},100)
				}
			},100)
		},
		//关闭录音动画效果
		recordLoadEnd(){
			var _this = this;
			_this.numOne = 0;
			_this.numTwo = 0;			
			clearInterval(_this.recordOneTimer);
			clearInterval(_this.recordTwoTimer);
		},
		//开始录音(手指按下 ' 按住 说话 ' 按钮)
		recordStart(callback){
			var _this = this;
			with (_this.ui){
				center_record_start.addEventListener('hold', function(event) {					
					_this.data.recordStart = true;
					_this.data.recordCancel = false;
					_this.setSoundAlertVisable(true); //开启录音弹窗
					center_record_start.querySelector('span').innerText = '松开 结束';
					center_record_start.classList.add('aui-chatbox-record-end');
					record_tip.innerHTML = "手指上划，取消发送";
					_this.startTimestamp = (new Date()).getTime();
					if(_this.stopTimer)clearTimeout(_this.stopTimer);
					typeof callback == 'function' ? callback({status: 0, msg: '录音开始'}) : '';					
				}, false);
			}	
		},
		//取消录音(手指滑动 ' 松开 结束 ' 按钮)
		recordCancel(callback){
			var _this = this;
			with (_this.ui){
				center_record_start.addEventListener('drag', function(event) {
					if (Math.abs(event.detail.deltaY) > 50) 
					{
						if (!_this.data.recordCancel) 
						{
							_this.data.recordCancel = true;
							if (!record_tip.classList.contains("cancel")) 
							{
								record_tip.classList.add("cancel");
							}
							record_tip.innerHTML = "松开手指，取消发送";
							center_record_start.querySelector('span').innerText = '松开 结束';
							center_record_start.classList.add('aui-chatbox-record-end');
							_this.recordLoadEnd();//关闭录音动画效果
							//设备录音结束逻辑
							typeof callback == 'function' ? callback({status: 0, msg: '松开手指，取消发送'}) : '';
						}
					} 
					else 
					{
						if (_this.data.recordCancel) 
						{
							_this.data.recordCancel = false;
							if (record_tip.classList.contains("cancel")) 
							{
								record_tip.classList.remove("cancel");
							}
							record_tip.innerHTML = "手指上划，取消发送";							
							_this.recordLoadStart(); //开启录音动画效果
						}
					}
				}, true);
			}	
		},
		//结束录音(手指离开 ' 松开 结束 ' 按钮)
		recordEnd(callback){
			var _this = this;
			with (_this.ui){
				center_record_start.addEventListener('release', function(event) {
					if (record_tip.classList.contains("cancel")) 
					{
						var _timer = setTimeout(function(){
							record_tip.classList.remove("cancel");
							record_tip.innerHTML = "手指上划，取消发送";
							clearTimeout(_timer);
						},200)
					}
					_this.stopTimestamp = (new Date()).getTime();
					center_record_start.querySelector('span').innerText = '按住 说话';
					center_record_start.classList.remove('aui-chatbox-record-end');
					if (_this.stopTimestamp - _this.startTimestamp < _this.data.record.MIN_SOUND_TIME) 
					{
						record_tip.innerHTML = "录音时间太短";							
						_this.data.recordCancel = true;
						_this.recordLoadEnd(); //关闭录音动画效果
						//设备录音结束逻辑
						typeof callback == 'function' ? callback({status: 10001, msg: '录音时间太短'}) : '';
						_this.stopTimer = setTimeout(function(){
							//关闭录音弹窗
							_this.setSoundAlertVisable(false);
						},500);
					}else{
						//关闭录音弹窗
						_this.setSoundAlertVisable(false);
						if(_this.data.recordCancel == false)
						{
							//设备录音结束逻辑
							typeof callback == 'function' ? callback({status: 0, msg: '录音结束'}) : '';
						}
					}
				}, false);
			}	
		},
		//点击右侧表情按钮显示表情选择区域
		showEmotion(callback){
			var _this = this;
			with (_this.ui){
				right_emotion_btn.addEventListener('click', function(){
					_this.resetChatBox(); //重置聊天输入框区域
					_this.data.extras.show = false;	
					if(_this.data.emotion.use)
					{
						right_emotion_btn.classList.remove('active');
						right_keypad_btn.classList.add('active');
						_this.ui.mask.classList.add("active");
						main.style.cssText += 'bottom: 260px;';
						emotion_container.classList.remove('hide');
						emotion_container.classList.add('show');
					}					
					typeof callback == 'function' ? callback() : '';
				}, false);
			}	
		},
		//点击右侧键盘按钮隐藏表情选择区域
		hideEmotion(callback){
			var _this = this;
			with (_this.ui){
				right_keypad_btn.addEventListener('click', function(){
					_this.resetChatBox(); //重置聊天输入框区域
					_this.data.extras.show = false;	
					center_textarea.focus();
					if(_this.data.emotion.use)
					{
						right_emotion_btn.classList.add('active');
						right_keypad_btn.classList.remove('active');
						emotion_container.classList.add('hide');
						emotion_container.classList.remove('show');
						mask.classList.remove("active");
						main.style.cssText += 'bottom: 0px;';
					}					
					typeof callback == 'function' ? callback() : '';
				}, false);
			}	
		},
		//创建表情选择区域
		createEmotion(){
			var _this = this;
			return new Promise(function(resolve, reject){
				var _html = '<div class="aui-emotion-container hide">'
					+'<div class="aui-emotion-main mui-slider">'
						+'<div class="aui-emotion-pages mui-slider-group"></div>'
						+'<div class="aui-emotion-paginations mui-slider-indicator"></div>'
					+'</div>'
				+'</div>';
				if(document.querySelector(".aui-emotion-container")) return;
				_this.ui.main.insertAdjacentHTML('beforeend', _html);
				_this.ui['emotion_container'] = document.querySelector('.aui-emotion-container');
				_this.ui['emotion_main'] = document.querySelector('.aui-emotion-main');
				_this.ui['emotion_pages'] = document.querySelector('.aui-emotion-pages');
				_this.ui['emotion_paginations'] = document.querySelector('.aui-emotion-paginations');	
				function getEmotion(){
					return  new Promise(function(callback){
						$.ajax({url: _this.data.emotion.path + _this.data.emotion.file, type: 'get'}).then(function(ret){
							callback(ret);
						});
					});
				}
				getEmotion().then(function(ret){					
					var btns = [], _html = '';
					if(!ret){return}
					for(var i = 0, len = ret.length; i < len; i += _this.data.emotion.pageHasNum)
					{
						btns.push(ret.slice(i, i + _this.data.emotion.pageHasNum));
					}
					for(var i = 0; i < btns.length; i++)
					{
						_this.ui.emotion_pages.insertAdjacentHTML('beforeend', '<div class="mui-slider-item aui-emotion-page"></div>');
						_html = '';
						for(var j = 0; j < btns[i].length; j++)
						{
							_html +=  '<div class="aui-emotion-item" pindex="'+ i +'" index="'+ (i * _this.data.emotion.pageHasNum + j) +'" data-name="'+btns[i][j].name+'" data-text="'+btns[i][j].text+'">'
								+'<div class="aui-emotion-item-img"><img src="'+ _this.data.emotion.path + btns[i][j].name +'.png"></div>'
							+'</div>'
						}
						_html += '<div class="aui-emotion-page-delete"><i class="iconfont iconjianpanshanchu"></i></div>'
						document.querySelectorAll('.aui-emotion-page')[i].insertAdjacentHTML('beforeend', _html);
						_this.ui['emotion_item'] = document.querySelectorAll('.aui-emotion-item');
						if(btns.length > 1)
						{
							_this.ui.emotion_paginations.insertAdjacentHTML('beforeend', '<div class="mui-indicator aui-emotion-pagination"></div>');
							document.querySelectorAll('.aui-emotion-pagination')[0].classList.add('mui-active');						
						}
					}
					//表情删除
					_this.ui['emotion_delete'] = document.querySelectorAll('.aui-emotion-page-delete');
					for(var i = 0; i < _this.ui.emotion_delete.length; i++)
					{
						_this.ui.emotion_delete[i].onclick = function(){
							var length = this.dataset.text.length;
							var _arr = _this.ui.center_textarea.value.split('[');
							length = _arr[_arr.length - 1].length + 1;
							_this.ui.center_textarea.value = _this.ui.center_textarea.value.substring(0, _this.ui.center_textarea.value.length - length);
						}
					}
					_this.ui['emotion_item'] = document.querySelectorAll('.aui-emotion-item');
					if(btns.length > 1)
					{
						var slider = _this.ui.emotion_main;
						var group = slider.querySelector('.aui-emotion-pages');
						var items = mui('.aui-emotion-page', group);
						//克隆第一个节点
						var first = items[0].cloneNode(true);
						first.classList.add('mui-slider-item-duplicate');
						//克隆最后一个节点
						var last = items[items.length - 1].cloneNode(true);
						last.classList.add('mui-slider-item-duplicate');
						//处理是否循环逻辑，若支持循环，需支持两点：
						//1、在.mui-slider-group节点上增加.mui-slider-loop类
						//2、重复增加2个循环节点，图片顺序变为：N、1、2...N、1
						var sliderApi = mui(slider).slider();					
					}	
				});
				resolve();
			});
		},
		//点击选择表情
		chooseEmotionItem(callback){
			var _this = this;
			_this.ui['emotion_item'] = document.querySelectorAll('.aui-emotion-item');
			var _timer = setTimeout(function(){
				clearTimeout(_timer);
				with (_this.ui){
					for(var i = 0; i < emotion_item.length; i++)
					{
						aui.touchDom(emotion_item[i].querySelector('.aui-emotion-item-img'), "#CDCDCD")				
						!(function(index){
							emotion_item[index].onclick = function(){
								//console.log(this.dataset.name);
								center_textarea.value = center_textarea.value + this.dataset.text;
								for(var i = 0; i < emotion_delete.length; i++)
								{
									emotion_delete[i].setAttribute('data-text', this.dataset.text);
								}
								if(center_textarea.scrollHeight > _this.data.textareaMinHeight)
								{
									if(center_textarea.scrollHeight > _this.data.textareaMaxHeight)
									{
										center_textarea.style.height = _this.data.textareaMaxHeight + 'px';
									}
									else{
										center_textarea.style.height = center_textarea.scrollHeight + 'px';
									}
								}
								center_textarea.scrollTop = center_textarea.scrollHeight;
								// right_emotion_btn.classList.add('active');
								if(_this.data.extras.use)
								{ //使用——附加功能
									if($.isDefine(center_textarea.value))
									{
										right_extras_btn.classList.remove('active');
										right_submit_btn.classList.add('active');
										right.style.cssText += 'width: 115px';
										center.style.cssText += 'width: calc(100% - 115px - 50px);';							
									}
								}	
								var result = {
									status: 0, 
									msg: '表情选择', 
									data: {
										index: index,
										name: this.dataset.name,
										text: this.dataset.text
									}
								};								
								typeof callback == 'function' ? callback(result) : '';							
							};						
						})(i);						
					}
				}
			},300);
		},
		//点击右侧附加功能按钮显示附加功能选择区域
		showExtras(callback){
			var _this = this;
			with (_this.ui){
				right_extras_btn.addEventListener('click', function(){
					_this.resetChatBox(); //重置聊天输入框区域
					//console.log(_this.data.extras.show);
					if(_this.data.extras.use && !_this.data.extras.show)
					{						
						_this.data.extras.show = true;
						mask.classList.add("active");
						main.style.cssText += 'bottom: 260px;';
						extras_container.classList.remove('hide');
						extras_container.classList.add('show');
					}
					else
					{
						_this.data.extras.show = false;						
						center_textarea.focus();
						_this.hideExtras(); //隐藏附加功能选择区域						
					}
					typeof callback == 'function' ? callback() : '';
				}, false);
			}	
		},
		//隐藏附加功能选择区域
		hideExtras(){
			var _this = this;
			with (_this.ui){
				if(_this.data.extras.use)
				{
					_this.data.extras.show = false;
					mask.classList.remove("active");
					main.style.cssText += 'bottom: 0px;';
					extras_container.classList.add('hide');
					extras_container.classList.remove('show');
				}
			}	
		},		
		//创建附加功能弹窗
		createExtras(){
			var _this = this;
			return new Promise(function(resolve, reject){
				var _html = '<div class="aui-extras-container hide">'
					+'<div class="aui-extras-main mui-slider">'
						+'<div class="aui-extras-pages mui-slider-group"></div>'
						+'<div class="aui-extras-paginations mui-slider-indicator"></div>'
					+'</div>'
				+'</div>';
				if(document.querySelector(".aui-extras-container")) return;
				_this.ui.main.insertAdjacentHTML('beforeend', _html);
				_this.ui['extras_container'] = document.querySelector('.aui-extras-container');
				_this.ui['extras_main'] = document.querySelector('.aui-extras-main');
				_this.ui['extras_pages'] = document.querySelector('.aui-extras-pages');
				_this.ui['extras_paginations'] = document.querySelector('.aui-extras-paginations');
				var btns = [], _html = '';
				for(var i = 0, len = _this.data.extras.btns.length; i < len; i += _this.data.extras.pageHasNum)
				{
					btns.push(_this.data.extras.btns.slice(i, i + _this.data.extras.pageHasNum));
				}
				for(var i = 0; i < btns.length; i++)
				{
					_this.ui.extras_pages.insertAdjacentHTML('beforeend', '<div class="mui-slider-item aui-extras-page"></div>');
					_html = '';
					for(var j = 0; j < btns[i].length; j++)
					{
						_html +=  '<div class="aui-extras-item" pindex="'+ i +'" index="'+ (i * _this.data.extras.pageHasNum + j) +'">';
							if(btns[i][j].img)
							{
								_html += '<div class="aui-extras-item-img"><img src="'+ btns[i][j].img +'"></div>';								
							}
							if(btns[i][j].icon)
							{
								_html += '<div class="aui-extras-item-icon"><i class="iconfont '+ btns[i][j].icon +'"></i></div>';								
							}
							_html += '<p>'+ btns[i][j].title +'</p>'
						+'</div>'
					}
					document.querySelectorAll('.aui-extras-page')[i].insertAdjacentHTML('beforeend', _html);
					_this.ui['extras_item'] = document.querySelectorAll('.aui-extras-item');
					if(btns.length > 1)
					{
						_this.ui.extras_paginations.insertAdjacentHTML('beforeend', '<div class="mui-indicator aui-extras-pagination"></div>');
						document.querySelectorAll('.aui-extras-pagination')[0].classList.add('mui-active');						
					}
				}
				if(btns.length > 1)
				{
					var slider = _this.ui.extras_main;
					var group = slider.querySelector('.aui-extras-pages');
					var items = mui('.aui-extras-page', group);
					//克隆第一个节点
					var first = items[0].cloneNode(true);
					first.classList.add('mui-slider-item-duplicate');
					//克隆最后一个节点
					var last = items[items.length - 1].cloneNode(true);
					last.classList.add('mui-slider-item-duplicate');
					//处理是否循环逻辑，若支持循环，需支持两点：
					//1、在.mui-slider-group节点上增加.mui-slider-loop类
					//2、重复增加2个循环节点，图片顺序变为：N、1、2...N、1
					var sliderApi = mui(slider).slider();					
				}				
				resolve();
			});
		},
		//点击选择附加功能
		chooseExtrasItem(callback){
			var _this = this;
			_this.ui['extras_item'] = document.querySelectorAll('.aui-extras-item');
			var _timer = setTimeout(function(){
				clearTimeout(_timer);
				with (_this.ui){
					for(var i = 0; i <_this.data.extras.btns.length; i++)
					{
						if(_this.data.extras.use)
						{
							$.isDefine(_this.data.extras.btns[i].img)
							? aui.touchDom(extras_item[i].querySelector('.aui-extras-item-img'), "#CDCDCD")
							: aui.touchDom(extras_item[i].querySelector('.aui-extras-item-icon'), "#CDCDCD");						
							!(function(index){
								extras_item[index].onclick = function(){
									_this.hideExtras(); //隐藏附加功能选择区域
									var result = {
										status: 0, 
										msg: '附加功能选择', 
										data: {
											index: index,
											title: _this.data.extras.btns[index].title,
											icon: _this.data.extras.btns[index].icon,
											img: _this.data.extras.btns[index].img
										}
									};								
									typeof callback == 'function' ? callback(result) : '';							
								};						
							})(i);
						}
					}
				}
			},300);
		},
		//发送
		submit(callback){
			var _this = this;
			with (_this.ui){
				right_submit_btn.addEventListener('release', function(event) {
					_this.msgTextFocus(event);
					event.preventDefault();
					center_textarea.style.height = _this.data.textareaMinHeight + 'px';
					var result = {
						status: 0,
						msg: '操作成功',
						data: {
							value: center_textarea.value
						}
					};
					var text = center_textarea.value;
					center_textarea.value = '';
					_this.setStyle();
					typeof callback == 'function' ? callback(result) : '';				
				}, false);
			}
		},
		//事件监听
		addEventListener({name = ''}, callback){
			var _this = this;
			!_this.data.events ? _this.data.events = [] : '';
			_this.data.events.push(name);
			with (_this.ui){
				switch (name){
					case 'changeInput': //输入检测
						_this.changeInput(callback);
						break;
					case 'showRecord': //点击左侧语音按钮显示录音区域
						_this.showRecord(callback);
						break;
					case 'hideRecord': //点击左侧键盘按钮隐藏录音区域
						_this.hideRecord(callback);
						break;
					case 'recordStart': //开始录音(手指按下 ' 按住 说话 ' 按钮)
						_this.recordStart(callback);
						break;
					case 'recordCancel': //取消录音(手指滑动 ' 松开 结束 ' 按钮)
						_this.recordCancel(callback);
						break;
					case 'recordEnd': //结束录音(手指离开 ' 松开 结束 ' 按钮)
						_this.recordEnd(callback);
						break;
					case 'showEmotion': //点击右侧表情按钮显示表情选择区域
						_this.showEmotion(callback);
						break;
					case 'hideEmotion': //点击右侧表情按钮隐藏表情选择区域
						_this.hideEmotion(callback);
						break;
					case 'chooseEmotionItem': //点击选择表情
						_this.chooseEmotionItem(callback);
						break;
					case 'showExtras': //点击右侧附加功能按钮显示附加功能选择区域
						_this.showExtras(callback);
						break;
					case 'hideExtras': //隐藏附加功能选择区域
						_this.hideExtras(callback);
						break;
					case 'chooseExtrasItem': //点击选择附加功能
						_this.chooseExtrasItem(callback);
						break;
					case 'submit': //发送
						_this.submit(callback);
						break;
					default:
						break;
				}				
			}
		},
	}
})(aui, document, window);
