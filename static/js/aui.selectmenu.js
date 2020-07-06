/* ===============================
	 * 下拉列表选择框
	 * versions 1.0.0
	 * cl15095344637@163.com
	 * @example: 
	 	aui.selectMenu.open({
			warp: '.orderby-items',
			layer: layer, // 1,2,3...
			mask: true,
			style: {
				itemStyle: {color: "#333", textAlign: 'left', isLine: false}
			},
			data: data,
			select: function(ret){ //点击时获取下级数据
				//console.log(ret); //{value: '0', text: '昨天'}
				// ajax() ——> return获取结果
			},
		}, function(ret){
			console.log(ret)
			aui.selectMenu.close(function(){
				...
			});
		});	
 * ===============================
 */
!(function($, document, window, undefined){
    $.selectMenu = {
        opts: function(opt){
			var opts = {
				warp: 'body', //--可选参数，父容器               
                data: [], //--必选参数，菜单列表[{value: '', text: ''}]
                layer: 1, //--必选参数, 控制组件为几级，默认一级
                mask: true, //--可选参数, 是否显示遮罩
                touchClose: true, //--可选参数，遮罩是否可关闭窗口
                checkedMore: false, //--可选参数，是否多选(默认单选，多选限制最后一级可多选)
                before: null, //打开弹窗前执行
                select: null, //一级以上点击选择后执行，获取下级数据并return
                style: { //部分样式设置参数
                	width: '',
                	height: '',
                	left: '',
                	top: '',
                	padding: '',
                	background: '',
                	borderRadius: '',
                	itemStyle: {
                		textAlign: '',
                		fontSize: '',
                		color: '',
                		isLine: false, //是否显示分割线
                	},
                },
			}
			return $.extend(opts, opt, true);
		},
		data: [], //存储数据（二维数组）
        // 创建弹窗UI元素
        creat: function(opt){
            var _this = this;
            var _opts = _this.opts(opt);
            _this.data[0] = _opts.data;
            var _html = '<div class="aui-selectmenu">'
            	+'<div class="aui-mask"></div>'
            	+'<div class="aui-selectmenu-main">'
            		+'<ul class="aui-selectmenu-lists"></ul>'
            	+'</div>'
            +'</div>';
            document.querySelector('body').insertAdjacentHTML('beforeend', _html);
            _this['ui'] = {
            	warp: document.querySelector(_opts.warp),
            	selectmenu: document.querySelector('.aui-selectmenu'),
            	main: document.querySelector('.aui-selectmenu-main'),
            	mask: document.querySelector('.aui-mask'),
            	lists: document.querySelector('.aui-selectmenu-lists'),
            }
            !$.isDefine(_opts.mask) && _this.ui.mask ? _this.ui.mask.parentNode.removeChild(_this.ui.mask) : '';
            if(_opts.checkedMore){ //若参数配置组件可多选，添加重置+确定按钮
            	var _html = '<div class="aui-selectmenu-down">'
            		+'<div class="aui-selectmenu-down-btn reset">重置</div>'
            		+'<div class="aui-selectmenu-down-btn confirm">确定</div>'
            	+'</div>';
            	_this.ui.main.insertAdjacentHTML('beforeend', _html);
            	_this.ui["resetBtn"] = document.querySelector(".aui-selectmenu-down-btn.reset");
            	_this.ui["confirmBtn"] = document.querySelector(".aui-selectmenu-down-btn.confirm");      
            }
            var lists = "";
            //根据layer添加列表
            for(var i = 0; i < _opts.layer; i++){
            	lists += '<li class="aui-selectmenu-list" index="'+ i +'"><div class="aui-selectmenu-list-warp" index="'+ i +'"></div></li>';              
            }
        	_this.ui.lists.insertAdjacentHTML('beforeend', lists);
        	_this.ui["list"] = document.querySelectorAll(".aui-selectmenu-list");
        	//添加一级列表内容
        	 var item = '';
            if(_opts.data && _opts.data.length > 0){
                for(var i = 0; i < _opts.data.length; i++){
                	if(_opts.style.itemStyle && _opts.style.itemStyle.isLine && i!=_opts.data.length-1){
                		item += '<div class="aui-selectmenu-item row-after" index="'+ i +'">'+ _opts.data[i].text +'</div>';                		
                	}
                	else{
                		item += '<div class="aui-selectmenu-item" index="'+ i +'">'+ _opts.data[i].text +'</div>';
                	}
                }
                _this.ui.list[0].querySelector(".aui-selectmenu-list-warp").insertAdjacentHTML('beforeend', item);
                _this.ui["item0"] = document.querySelectorAll(".aui-selectmenu-list:nth-child(1) .aui-selectmenu-list-warp .aui-selectmenu-item");
            }
            _this.css(opt);
        },
        //样式设置
        css: function(opt){
        	var _this = this;
        	var _opts = _this.opts(opt);       	
        	//设置弹窗样式
        	if(_opts.style.top){
        		_this.ui.main.style.cssText += 'top: '+ _opts.style.top +';';
        	}
        	else{
        		_this.ui.main.style.cssText += 'top: '+ (_this.ui.warp.offsetTop + _this.ui.warp.offsetHeight) +'px;';
        	}
        	for(var m = 0; m < _this.data.length; m++){
        		_this.ui.lists.style.background = _this.ui.list[m].style.background = _opts.style.background ? _opts.style.background : '';
        	}
        	for(var i in _opts.style){
        		if(i != 'itemStyle'){
        			_this.ui.main.style[i] = _opts.style[i];
        		}
        		else{
        			for(var j in _opts.style[i]){
        				for(var m = 0; m < _this.data.length; m++){
        					for(var n = 0; n < _this.data[m].length; n++){
        						_this.ui.list[m].querySelectorAll(".aui-selectmenu-item")[n].style[j] = _opts.style[i][j];      				        					
        					}        					
        				}
        			}
        		}
        	}
        },
        // 打开弹窗
        open: function(opt, callback){
            var _this = this;
            var _opts = _this.opts(opt);
            typeof _opts.before == "function" ?  _opts.before() : '';
           	if(!document.querySelector(".aui-selectmenu")){
                _this.creat(opt);                
            }
       		_this.ui.selectmenu.style.display = 'inline-block';
       		_this.ui.selectmenu.classList.remove("hide");
       		_this.ui.selectmenu.classList.add("show");           		       	
           	_this.click(opt, callback); //引用列表点击事件
           	_this.ui.mask.addEventListener("click", function(e){
	            !_opts.touchClose ? e.preventDefault() : _this.close(callback);
	       	});
	       	if(_opts.checkedMore){
		       	//重置
		       	_this.ui.resetBtn.onclick = function(){	
		       		for(var n = 0; n < _this.data[_this.data.length-1].length; n++){			                            			
            			_this.ui.list[_this.data.length-1].querySelectorAll(".aui-selectmenu-item")[n].classList.remove("active");
            		}
	        		callback({status: 0, data: []})
	    		}
		       	//确定
	    		_this.ui.confirmBtn.onclick = function(){
	    			callback({status: 0, data: []})
	    		}	       	
	       }
        },
        // 隐藏弹窗
        close: function(callback){
            var _this = this;
            _this.ui.selectmenu.classList.remove("show");
            _this.ui.selectmenu.classList.add("hide");           	
            var timer = setTimeout(function(){
            	_this.ui && _this.ui.selectmenu ? _this.ui.selectmenu.style.display = 'none' : '';
                //_this.ui.selectmenu ? _this.ui.selectmenu.parentNode.removeChild(_this.ui.selectmenu) : '';
            	typeof callback == "function" ?  callback() : '';
                clearTimeout(timer);
            },200);
        },
        //注销弹窗
		remove: function(callback){
			var _this = this;
			_this.data = [];
            document.querySelectorAll('.aui-selectmenu').length > 0 ? _this.ui.selectmenu.parentNode.removeChild(_this.ui.selectmenu) : '';
        	typeof callback == "function" ?  callback() : '';
		},
		//item列表点击事件
		click: function(opt, callback){
			var _this = this;
			var _opts = _this.opts(opt);
			for(var m = 0; m < _opts.layer; m++){
				!(function(M){
					var items = _this.ui.list[M].querySelectorAll(".aui-selectmenu-item");
					for(var i = 0; i < items.length; i++){
	                    !(function(i){
	                        items[i].onclick = function(){
	                            var _self = this;
	                            var pindex = Number(_self.parentNode.getAttribute("index"));
	                            var index = Number(_self.getAttribute("index"));
	                            //当前点击选项设为选中且其他取消选中（多选模式下点击已选项取消当前选中状态）
	                            function changeClass(){
					            	if(!_opts.checkedMore){ //单选
					            		for(var j = 0; j < _this.ui.list[pindex].querySelectorAll(".aui-selectmenu-item").length; j++){
					                        _this.ui.list[pindex].querySelectorAll(".aui-selectmenu-item")[j].classList.remove("active");
					                    }
					                	_self.classList.add("active");	     
					            	}
					            	else{ //多选
					            		if(_opts.layer > pindex+1){ //存在下级
					            			for(var j = 0; j < _this.ui.list[pindex].querySelectorAll(".aui-selectmenu-item").length; j++){
						                        _this.ui.list[pindex].querySelectorAll(".aui-selectmenu-item")[j].classList.remove("active");
						                    }
					            			_self.classList.add("active");
					            		}
					            		else{ //最后一级
					            			if(_this.ui.list[pindex].querySelectorAll(".aui-selectmenu-item")[index].className.indexOf("active")>=0){
							            		_self.classList.remove("active");
							            	}
					            			else{
					            				_self.classList.add("active");
					            			}
					            		}
					            	}
								}
	                            //获取下级列表数据
	                            var data = typeof _opts.select == "function" ? _opts.select({status: 0, pindex: pindex, layer: _opts.layer, data: _this.data[pindex][index]}) : [];
	                            if(_opts.layer > pindex+1 && aui.isDefine(data)){ //存在下级
									var arr = []
									for(var w = 0; w < _this.data.length; w++){										
										w <= pindex ? arr.push(_this.data[w]) : '';										
									}									
									_this.data = arr;
	                            	_this.data[pindex+1] = data;                           	
	                            	var item = '';
	                            	for(var n = 0; n < _this.data[pindex+1].length; n++){
	                            		//判断是否显示分割线
		        						if(_opts.style.itemStyle && _opts.style.itemStyle.isLine && i != _this.data[pindex+1][n].length-1){
					                		item += '<div class="aui-selectmenu-item row-after" index="'+ n +'">'+ _this.data[pindex+1][n].text +'</div>';                		
					                	}
					                	else{
					                		item += '<div class="aui-selectmenu-item" index="'+ n +'">'+ _this.data[pindex+1][n].text +'</div>';
					                	}    				        					
		        					}
	                            	//点击选择时先清空下级原有元素，再插入新元素
	                            	_this.ui.list[pindex+1].querySelector(".aui-selectmenu-list-warp").innerHTML = '';
									if(data.length > 0)
									{
										_this.ui.list[pindex+1].querySelector(".aui-selectmenu-list-warp").insertAdjacentHTML('beforeend', item);										
									}
	                            	_this.css(_opts); // 为新添加的列表元素设置样式
	                            	if(_this.ui.list[pindex+1].offsetLeft < window.screen.width)
	                            	{ //关闭当前选择列表之后的所有下级列表
	                            		for(var n = 0; n < _this.ui.list.length; n++){
	                            			if(n >= pindex){	                            				
	                            				_this.ui.list[n+1] ? _this.ui.list[n+1].style.left = "100vw" : '';
	                            				_this.ui.main.style.height = _opts.checkedMore ? _this.ui.list[pindex].offsetHeight + 50 + "px" : _this.ui.list[pindex].offsetHeight + 'px';
	                            				_this.ui.lists.style.height = _this.ui.list[pindex].offsetHeight + "px";
	                            			}
	                            		}
	                            	}
	                            	//打开当前选择列表的下级列表
	                            	openNextList();
	                            	function openNextList(){
	                            		changeClass();// 当前点击选项设为选中且其他取消选中
	                            		var left = _opts.layer >= 4 ? window.screen.width / _opts.layer : 100;
	                            		_this.ui.list[pindex+1].style.left = _this.ui.list[pindex].offsetLeft + left + "px";
	                            		_this.ui.list[pindex+1].style.width = _this.ui.list[pindex].offsetWidth - left + "px";
	                            		if(_this.ui.list[pindex + 1].offsetHeight > _this.ui.list[pindex].offsetHeight)
	                            		{ //当下级列表总高度大于当前列表总高度
	                            			_this.ui.main.style.height = _opts.checkedMore ? _this.ui.list[pindex + 1].offsetHeight + "px" : _this.ui.list[pindex + 1].offsetHeight + "px";
	                            			_this.ui.lists.style.height = _this.ui.list[pindex + 1].offsetHeight + "px";
	                            		}
	                            		else{
	                            			_this.ui.main.style.height = _opts.checkedMore ? _this.ui.list[pindex].offsetHeight + "px" : _this.ui.list[pindex].offsetHeight + "px";
	                            			_this.ui.lists.style.height = 
	                            			_this.ui.list[pindex + 1].style.height = _this.ui.list[pindex].offsetHeight + "px";
	                            		}											
	                            	}
	                            	//为新添加的列表元素添加事件
	                            	var newitems = _this.ui.list[pindex+1].querySelectorAll(".aui-selectmenu-item");
	                            	for(var g = 0; g < newitems.length; g++){
	                            		!(function(G){
	                            			newitems[G].onclick = items[0].onclick;
	                            		})(g);
	                            	}
	                            }
	                            else
	                            { //当前点击为最后一级——> 执行回调，返回所选数据
	                            	changeClass();// 当前点击选项设为选中且其他取消选中
	                            	var result = [];
	                            	for(var j = 0; j < _this.data.length; j++){
	                            		result[j] = [];
	                            		for(var n = 0; n < _this.data[j].length; n++){
	                            			if(_this.ui.list[j].querySelectorAll(".aui-selectmenu-item")[n].className.indexOf("active")>=0){
	                            				result[j].push(_this.data[j][n]);
	                            			}
	                            		}
	                            	}
	                            	//当最后一级已选内容为空
	                            	if(result[result.length -1].length == 0){
	                            		result = [];
	                            	}
	                            	if(!_opts.checkedMore){ //单选模式下最后一级列表内容点击选择后就执行回调
	                            		callback({status: 0, data: result})	                            		
	                            	}
	                            	else{
	                            		//重置
	                            		_this.ui.resetBtn.onclick = function(){	                            			
		                            		for(var n = 0; n < _this.data[pindex].length; n++){			                            			
		                            			_this.ui.list[pindex].querySelectorAll(".aui-selectmenu-item")[n].classList.remove("active");
		                            		}
	                            			result = [];
	                            			callback({status: 0, data: result})
	                            		}
	                            		//确定
	                            		_this.ui.confirmBtn.onclick = function(){
	                            			callback({status: 0, data: result})
	                            		}
	                            	}
	                            }	                            
	                        }
	                    })(i);
	                }
				})(m);
			}
		}
    }
})(aui, document, window);
