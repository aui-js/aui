/*!
 * =====================================================
 * AUI  移动端UI组件库
 * versions 1.0.0
 * cl15095344637@163.com
 * git: https://github.com/aui-js/aui
 * =====================================================
 */
!(function(document, window, undefined){
	"use strict";
	var aui = new Object();
	aui = {
		/***对象合并(可实现多层对象深度合并)
		   @param {Object} opts 原始参数
		   @param {Object} opt 新参数
		   @param {bool} override 是否合并重置
		   @example: aui.extend("原始参数", "新参数", true);
		 */
		extend(opts, opt, override) {
			var _this = this;
			for (var p in opt) {
				try {
					// Property in destination object set; update its value.
					if ( opt[p].constructor == Object ) {
						opts[p] = _this.extend(opts[p], opt[p]);			
					} 
					else {
						opts[p] = opt[p];			
					}				
				} catch(e) {
				  // Property in destination object not set; create it and set its value.
				  opts[p] = opt[p];				
				}
			}			
		  return opts;
		},
		/***打开新页面
		   @param {string} url 页面路径
		   @param {Object} opts 参数 {id: ''}
		   @example: aui.openWin("index.html", {id: 1})
		*/
		openWin(url, opts){
			var _this = this;
			var str = '?';
			for(var i in opts){
				if(_this.isDefine(opts[i])){
					str += i + '=' + opts[i] + '&';
				}
			}
			window.location.href = _this.isDefine(opts) ? url + str : url;
		},		
		/***关闭页面
		   @example: aui.closeWin()
		*/
		closeWin(callback){
			//直接关闭页面，并向后台发送数据
			if(typeof callback == "function"){
				if(window.addEventListener) {
					window.addEventListener("beforeunload", callback, false);
				} else {
					window.attachEvent("onbeforeunload", callback, false);
				}
			}
			window.history.back(-1);
		},
		/***截取URL中字符串(可获取中文内容)
   		    aui.getUrlstr('id');
   		*/
   		getUrlstr(str){
   			var reg = new RegExp("(^|&)" + str + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return decodeURI(r[2]); return null;
   		},
		/***判断字符串是否为空
		   @param {string} str 变量
		   @example: aui.isDefine("变量");
		*/
		isDefine(str){
			if (str == null || str == "" || str == "undefined" || str == undefined || str == "null" || str == "(null)" || str == 'NULL' || typeof (str) == 'undefined'){
				return false;
			}else{
				str = str + "";
				str = str.replace(/\s/g, "");
				if (str == ""){return false;}
				return true;
			}
		},
		/***引入 js / css 文件
		   @example: aui.import('js/aui.picker.js')
		   @example: aui.import(['js/aui.picker.js', 'css/aui.picker.css'])
		*/
		import(url){	
			var _this = this;
			switch (url.constructor){
				case Array:
					for(const [index, item] of url.entries()){
						creat(item);
					}
					break;
				case String:
					creat(url);
					break;
				default:
					break;
			}
			function creat(file){
				if(/^.+?\.js$/.test(file))
				{ //JS文件引入
					var script = document.createElement("script");
					script.setAttribute("type", "text/javascript");
					script.setAttribute("src", file);
					document.querySelector('head').appendChild(script);
				}
				if(/^.+?\.css$/.test(file))
				{ //CSS文件引入
					var css = document.createElement('link');
					css.rel = 'stylesheet';
					css.type = 'text/css';
					css.href = file;		
					document.querySelector('head').appendChild(css);	
				}			
			}
		},		
		//生成随机数
	    random(Min, Max) {
		    var Range = Max - Min;
		    var Rand = Math.random();
		    if(Math.round(Rand * Range)==0){
		        return Min + 1;
		    }else if(Math.round(Rand * Max)==Max)
		    {
		        index++;
		        return Max - 1;
		    }else{
		        var num = Min + Math.round(Rand * Range) - 1;
		        return num;
		    }
		},
		/***去除字符串中空格
		 	@param {string} str 字符串
		 	@param {Boolean} flag {false: 去除前后空格 | true: 去除全部空格}
   			@example: aui.space(str, true);
   		*/
   		space(str, flag){
   			var result;
		    result = str.replace(/(^\s+)|(\s+$)/g, "");
		    if (flag) //flag==false -->去除前后空格；flag==true -->去除全部空格
		    {
		        result = result.replace(/\s/g, "");
		    }
		    return result;
   		},
		/*** 触摸改变元素背景色/字体色/边框
		  	@param {string} dom 元素对象 如： document.querySelector(".list")
		  	@param {string} bg 背景色("#EFEFEF")
		  	@param {string} color 字体色("#333")
		  	@param {string} border 边框("1px solid #ccc")
		  	@example: aui.touchDom(document.querySelector(".list"), '#EFEFEF');
		 */
		touchDom(dom, bg, color, border){
			var _this = this;
			var bg_old = _this.getStyle(dom).backgroundColor,
				color_old = _this.getStyle(dom).color,
				border_old = _this.getStyle(dom).border;
			dom.addEventListener("touchstart", function(e){
				_this.isDefine(bg) ? dom.style.background = bg : dom.style.background =  bg_old;
				_this.isDefine(color) ? dom.style.color = color : dom.style.color = color_old;
				_this.isDefine(border) ? dom.style.border = border : dom.style.border = border_old;
			});
			dom.addEventListener("touchmove", function(e){
				dom.style.background = bg_old;
				dom.style.color = color_old;
				dom.style.border = border_old;
			});
			dom.addEventListener("touchend", function(e){
				dom.style.background = bg_old;
				dom.style.color = color_old;
				dom.style.border = border_old;
			});
		},
		/***阻止元素默认事件
		 * @param {Object} e
		 */
		preventDefault(e){
	        if ( e && e.preventDefault ){ 
			    e.preventDefault(); 
	        }
			else{ 
			    window.event.returnValue = false; 								
			    return false; 
			} 
	   	},
		/***获取元素css样式
		 	@param {string} el dom元素 如：document.querySelector("<div>")
		 	@example: aui.getStyle(document.querySelector("div")).width;
		 */
		getStyle(el){
			return window.getComputedStyle(el, null);
		},
		/***获取标签元素 十六进制 背景色
		 	@param {string} el dom元素 如：document.querySelector("<div>")
		 	@example: aui.getHexBgColor(document.querySelector("div"));
		*/
		getHexBgColor(el){
			var str = [];
			var rgb = el.style.backgroundColor.split('(');
			for(var k = 0; k < 3; k++)
			{
				str[k] = parseInt(rgb[1].split(',')[k]).toString(16);
			}
			str = '#' + str[0] + str[1] + str[2];
			return str;
		},
		/***获取标签元素 十六进制 字体色
		    @param {string} el dom元素 如：document.querySelector("<div>")
		 	@example: aui.getHexColor(document.querySelector("div"));
		*/
		getHexColor(el){
			var str = [];
			var rgb = el.style.color.split('(');
			for(var k = 0; k < 3; k++)
			{
				str[k] = parseInt(rgb[1].split(',')[k]).toString(16);
			}
			str = '#' + str[0] + str[1] + str[2];
			return str;
		},
		/*** 根据输入的文本自动改变textarea框的高度   
		  	@param {string} el 元素对象 如： document.querySelector(".list")
		  	@param {number} maxHeight 最大高度
		  	@param {number} minHeight 最小高度
		  	@example: aui.autoTextarea(document.querySelector("#textarea"), 300, 100);
		 */
		autoTextarea(el, maxHeight, minHeight){
			el.onchange = el.oninput = el.onpaste = el.oncut = el.onkeydown = el.onkeyup = el.onfocus = el.onblur = function(){
				var height,style=this.style;
		        this.style.height = minHeight + 'px';
		        if (this.scrollHeight > minHeight)
		        {
			        if (maxHeight && this.scrollHeight > maxHeight)
			        {
			            height = maxHeight;
			            style.overflowY = 'scroll';
			        }
			        else
			        {
			            height = this.scrollHeight;
			            style.overflowY = 'hidden';
			        }
			        style.height = height + 'px';
		        }
				this.scrollTop = this.scrollHeight;
			}
		},
		//数组去重
		uniq(array){
		    var temp = []; //一个新的临时数组
		    for(var i = 0; i < array.length; i++){
		        if(temp.indexOf(array[i]) == -1){
		            temp.push(array[i]);
		        }
		    }
		    return temp;
		},
		// 复制到剪切板
		copy(str){
			var save = function (e){
				e.clipboardData.setData('text/plain',str);//clipboardData对象
				e.preventDefault();//阻止默认行为
			};
			document.addEventListener('copy',save);
			return document.execCommand("copy");//使文档处于可编辑状态，否则无效
		},		
		/* 初始化导航栏底部选中底线位置
			@param {string} nav 导航栏设置overflow-x: scroll的元素id或class
			@param {string} navItem 导航栏菜单li的元素id或class
			@param {string} navBorder 导航栏选中元素底部border样式的元素id或class
			@param {number} index 导航栏选中元素的索引 0- ...
			@example: app.resetNavBorder("#nav", '.top-navtab-item', '.nav_border', i); //初始化导航栏底部选中底线位置
		*/
		resetNavBorder: function(nav, navItem, navBorder, index){
			var _navItem = document.querySelector(navItem + ":nth-child("+ (Number(index) + 1) +")");
			var _navBorder = document.querySelector(navBorder);
			$(nav).animate({
				scrollLeft: _navItem.offsetLeft - (window.screen.width - _navItem.offsetWidth - 0) / 2
			},300);
			$(navBorder).css({
				left: _navItem.offsetLeft + (_navItem.offsetWidth / 2) - (_navBorder.offsetWidth / 2) + "px"
			});
		}		
	}
	// 将插件对象暴露给全局对象
	if(typeof module !== 'undefined' && typeof exports === 'object' && define.cmd) { module.exports = aui;}
    else if (typeof define === "function" && define.amd){define(function(){return aui;});}
    else {window.aui = aui;}
})(document, window);

/* ===============================
 	数据请求
   ===============================
 */
!(function($, document, window, undefined){
	/*** ajax数据请求接口
	  	@param {string} type 请求方式 {"get(默认)" | "GET" | "post" | "POST"}
	 	@param {string} url 请求接口地址
	  	@param {Object} data 请求时后台所需参数
	  	@param {bool} async 是否异步(true)或同步(false)请求{true(默认) | false}	  	
	  	@example: aui.ajax({type: "post", url: "", data: {}}).then(function(ret){}).then(function(err){});
	*/
	$.ajax = function({type, url, data, async}){
		var _this = this;
		// 异步对象
		var ajax;		
		window.XMLHttpRequest ? ajax =new XMLHttpRequest() : ajax=new ActiveXObject("Microsoft.XMLHTTP");
		!$.isDefine(type) ? type = "get" : type = type;
		!$.isDefine(data) ? data = {} : data = data;
		async != false ? !$.isDefine(async) ? async = true : async = async : '';
		return new Promise(function(resolve,reject){
			// get 跟post  需要分别写不同的代码
			if (type.toUpperCase()=== "GET") 
			{// get请求
				if (data) {// 如果有值
					url += '?';										
					if( typeof data === 'object' )
					{ // 如果有值 从send发送
						var convertResult = "" ;
						for(var c in data){
							convertResult += c + "=" + data[c] + "&";
						}						
						url += convertResult.substring(0,convertResult.length-1);
					}
					else
					{
						url += data;
					}
				}
				ajax.open(type, url, async); // 设置 方法 以及 url
				ajax.send(null);// send即可
			}
			else if(type.toUpperCase()=== "POST")
			{// post请求
				ajax.open(type, url); // post请求 url 是不需要改变
				ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded"); // 需要设置请求报文
				if(data)
				{ // 判断data send发送数据
					if( typeof data === 'object' ){// 如果有值 从send发送
						var convertResult = "" ;
						for(var c in data){
						  convertResult += c + "=" + data[c] + "&";
						}
						convertResult = convertResult.substring(0,convertResult.length-1);
						ajax.send(convertResult);
					}else{
						ajax.send(data);
					}
				} else
				{
					ajax.send(); // 木有值 直接发送即可
				}
			}
			// 注册事件
			ajax.onreadystatechange = function () {
				// 在事件中 获取数据 并修改界面显示
				if (ajax.readyState == 4)
				{
					if(ajax.status===200)
					{ // 返回值： ajax.responseText;
						if(ajax.response && typeof ajax.response != 'object'){
							resolve(JSON.parse(ajax.response));							
						}
						else{
							resolve(ajax.response);
						}
					}
					else
					{
						reject(ajax.status);
					}
				}
			}
		});		
	}
})(aui, document, window);

/* =============================================================
 	数据校验 （账号 + 手机号码  + 电话号码 + 密码 + 邮箱 + 银行卡号码）
   =============================================================
 */
!(function($, document, window, undefined){
	/***中文姓名检测
	 	@param {number} name 姓名
	 	@example: aui.checkName(name); //return true | false;
	*/
	$.checkName = function(name) {
        if(!name) return false;
		var re = /^[\u4E00-\u9FA5]{2,4}$/;
		if(re.test(name)) return true;
		else return false;
   }
	/***汉字验证
	 	@param {number} str 汉字内容
	 	@example: aui.checkChinese(str); //return true | false;
	*/
	$.checkChinese = function(str) {
        if(!str) return false;
		var re = /^[\u4E00-\u9FA5]+$/;
		if(re.test(str)) return true;
		else return false;
    }
	/***验证帐号是否合法。验证规则：字母、数字、下划线组成，字母开头，4-16位。
	    @param {string} account 账号
		@example: aui.checkkUser("账号");  //return true | false;
	*/
	$.checkAccount = function(account){
		var re = /^[a-zA-z]\w{3,15}$/;
	    if(re.test(account)) return true;
	    else return false;
	}
	/***手机号码检测
	 	@param {number} phone 手机号码
	 	@example: aui.checkMobile(phone); //return true | false;
	*/
	$.checkMobile = function(phone) {
        if(!phone) return false;
		var re = /^1(3[0-9]|4[57]|5[123567890]|7[3678]|8[0-9]|9[0-9])\d{8}$/;
		if(re.test(phone)) return true;
		else return false;
    }
	/***验证电话号码,验证规则：区号+号码，区号以0开头，3位或4位号码由7位或8位数字组成区号与号码之间可以无连接符，也可以“-”连接如01088888888,010-88888888,0955-7777777
	    @param {String} tel 电话号码
	 	@example: aui.checkTel(tel);  //return true | false;
	*/
	$.checkTel = function(tel){
		var re = /^0\d{2,3}-?\d{7,8}$/;
	    if(re.test(tel)) return true;
	    else return false;
	}
	/***校验  email 邮箱账号
	    @param {String} email 邮箱账号
	 	@example: aui.checkEmail(email);  //return true | false;
	*/
	$.checkEmail = function(email){
		var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
		if(re.test(email)) return true;
		else return false;
	}
	/***校验  password 密码
	    @param {string} pass 密码 --只能输入6-20个字母、数字、下划线
	 	@example: aui.checkPass(pass);  //return true | false;
	*/
	$.checkPass = function(pass){
		var re = /^(\w){6,20}$/;
		if(re.test(pass)) return true;
		else return false;
	}
	/***校验  password 密码 强弱
	    @param {string} pass 密码 --只能输入6-20个字母、数字、下划线
	 	@example: aui.checkPassStrength(pass);  //return 'r'-弱 | 'z'-中 | 'q'-强 | false-格式有误;
	*/
	$.checkPassStrength = function(pass){
		var r = /^(\w){6,20}$/;
		var z = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/;
		var q = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/;
		if(r.test(pass)) {
			return 'r';
		}
		else{
			if(z.test(pass)) {
				return 'z';
			}
			else{
				if(q.test(pass)){
					return 'q';
				}
				else{
					return false;
				}
			}
		}
	}
	/***校验 搜索关键字
	    @param {String} keywords 搜索内容
	 	@example: aui.checkSearch(pass);  //return true | false;
	*/
	$.checkSearch = function(keywords){
		var re = /^[^`~!@#$%^&*()+=|\\\][\]\{\}:;'\,.<>/?]{1}[^`~!@$%^&()+=|\\\][\]\{\}:;'\,.<>?]{0,19}$/;
		if(re.test(keywords)) return true;
		else return false;
	}
	/***校验 IP地址
	    @param {String} ip IP地址
	 	@example: aui.checkIP(pass);  //return true | false;
	*/
	$.checkIP = function(ip){
		var re =/^[0-9.]{1,20}$/;
		if(re.test(ip)) return true;
		else return false;
	}
	/***银行卡加密显示： XXXX **** XXXX;
	    @param {string} cardnum 银行卡号
	*/
	$.encodeCard = function(cardnum){
	    var reg = /^(\d{4})(\d*)(\d{4})$/;
	    cardnum = cardnum.replace(reg, function(a, b, c, d) {
	        return b + c.replace(/\d/g, "*") + d;
	    });
	    // console.log(cardnum);
	    return cardnum;
	}
})(aui, document, window);


/***本地定时缓存（一段时间内有效）
 	@example: aui.setLocal('items', items, 1*24*60*60); 缓存一天内有效
*/
!(function($, document, window, undefined){
	$.setLocal = function(key,value,time){
		try{
			if(!localStorage){return false;}
			if(!time || isNaN(time)){time=60;}
			var cacheExpireDate = (new Date()-1)+time*1000;
			var cacheVal = {data: value, exp: cacheExpireDate};
			localStorage.setItem(key,JSON.stringify(cacheVal));//存入缓存值
			//console.log(key+":存入缓存，"+new Date(cacheExpireDate)+"到期");
		}catch(e){}
	}
	/**获取缓存*/
	$.getLocal = function (key){
		try{
			if(!localStorage){return false;}
			var cacheVal = localStorage.getItem(key);
			var result = JSON.parse(cacheVal);
			var now = new Date()-1;
			if(!result){return null;}//缓存不存在
			if(now>result.exp){//缓存过期
				$.remove(key);
				return "";
			}
			//console.log("get cache:"+key);
			return result.data;
		}catch(e){
			$.removeLocal(key);
			return null;
		}
	}
	/**移除缓存，一般情况不手动调用，缓存过期自动调用*/
	$.removeLocal = function(key){
		if(!localStorage){return false;}
		localStorage.removeItem(key);
	}
	/**清空所有缓存*/
	$.clearLocal = function(){
		if(!localStorage){return false;}
		localStorage.clear();
	}
})(aui, document, window);


/* ===============================
 	设备相关操作
   ===============================
 */
!(function($, document, window, undefined){
	/***判断是否为微信浏览器
	 	@example: aui.isWx(); //return true | false;
	*/
	$.isWx = function(){
		const ua = window.navigator.userAgent.toLowerCase();
	  	//通过正则表达式匹配ua中是否含有MicroMessenger字符串
	  	if(ua.match(/MicroMessenger/i) == 'micromessenger') return true;
	  	else return false;
	}
	/***判断是否为IOS系统
	 	@example: aui.isIos(); //return true | false;
	*/
	$.isIos = function(){
		var u = navigator.userAgent, app = navigator.appVersion;
	    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
	    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	    if(isIOS) return true;
	    else return false;
	}
	/***判断是否为android系统
	 	@example: aui.isAndroid(); //return true | false;
	*/
	$.isAndroid = function(){
		var u = navigator.userAgent, app = navigator.appVersion;
	    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
	    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	    if(isAndroid) return true;
	    else return false;
	}
	/***判断是否为IE浏览器
	 	@example: aui.isIe();
	*/
	$.isIe = function(){
		if (window.navigator.userAgent.toLowerCase().indexOf("msie") >= 1) return true;
	    else return false;
	}
	/***判断是否为PC
	 	@example: aui.isPC(); //return true | false;
	*/
	$.isPC = function(){
		var userAgentInfo = navigator.userAgent;
	    var Agents = ["Android", "iPhone",
	        "SymbianOS", "Windows Phone",
	        "iPad", "iPod"];
	    var flag = true;
	    for (var v = 0; v < Agents.length; v++)
	    {
	        if (userAgentInfo.indexOf(Agents[v]) > 0)
	        {
	            flag = false;
	            break;
	        }
	    }
	    return flag;
	}
	/***获取设备是否连接网络
	 	@example: aui.getLine(); //return true | false;
	*/
	$.getLine = function(){
		if(navigator.onLine) return true;
		else return false;
	}
	/***获取设备网络类型
	 	@example: aui.getNetworkType();
	*/
	$.getNetworkType = function(){
		var ua = navigator.userAgent;
        var networkStr = ua.match(/NetType\/\w+/) ? ua.match(/NetType\/\w+/)[0] : 'NetType/other';
        networkStr = networkStr.toLowerCase().replace('nettype/', '');
        var networkType;
        switch (networkStr) {
            case 'wifi': networkType = 'wifi'; break;
            case '4g': networkType = '4g'; break;
            case '3g': networkType = '3g'; break;
            case '3gnet': networkType = '3g'; break;
            case '2g': networkType = '2g'; break;
            default: networkType = 'other';
        }
        return networkType;
	}
})(aui, document, window);

/* ===============================
 	元素长按事件
	 	@param {string} warp 长按元素 ->document.querySelector(".list") 或document.querySelectorAll(".list")
	 	@param {number} time 长按时间限制 默认500ms
	 	@example: aui.longPress({warp: '', time: 500}, function(){});
   ===============================
 */
!(function($, document, window, undefined){
	var longPress = {
        opts: function(opt){
			var opts = {
				warp: '',
				time: 500
			}
			return $.extend(opts, opt, true);
		},
		on: function(opt, callback){
			var _this = this;
			var _opts = _this.opts(opt);
			if(!$.isDefine(_opts.warp)){
				$.toast({msg: "Long press element not set"}); return false;
			}
			var timer = null;
			if(_opts.warp.length > 1){
				for(var i = 0; i < _opts.warp.length; i++){
					_opts.warp[i].addEventListener("touchstart", function(event){
						var _self = this;
						event.preventDefault(); //仅对当前元素进行阻止触发默认事件
						timer = setTimeout(function(){
							typeof callback == "function" ?  callback(_self) : '';
						}, _opts.time);
					}, false);
					_opts.warp[i].addEventListener("touchmove", function(event){
						var _self = this;
						clearTimeout(timer); //手指移动则不执行传入的方法
					}, false);
					_opts.warp[i].addEventListener("touchend", function(event){
						clearTimeout(timer); //长按时间少于 _opts.time,则不执行传入的方法
					}, false);
				}
			}
			else{
				_opts.warp.addEventListener("touchstart", function(event){
					var _self = this;
					event.preventDefault(); //仅对当前元素进行阻止触发默认事件
					timer = setTimeout(function(){
						typeof callback == "function" ?  callback(_self) : '';
					}, _opts.time);
				}, false);
				_opts.warp.addEventListener("touchmove", function(event){
					var _self = this;
					clearTimeout(timer); //手指移动则不执行传入的方法
				}, false);
				_opts.warp.addEventListener("touchend", function(event){
					clearTimeout(timer); //长按时间少于 _opts.time,则不执行传入的方法
				}, false);
			}

		}
    }
	$.longPress = function(opt, callback){
		longPress.on(opt, callback);
	};
})(aui, document, window);

/* ===============================
 	元素拖动事件
	 	@param {string} warp 拖动元素 ->document.querySelector(".list") 或document.querySelectorAll(".list")
	 	@example: aui.drag({warp: ''}, function(){});
   ===============================
 */
!(function($, document, window, undefined){
	var drag = new Object();
	drag = {
		opts(opt){
			var opts = {
				warp: '', //--可选参数，父容器
			}
			return $.extend(opts, opt, true);
		},
		on(opt, callback){ //创建
			var _this = this;
			var _opts = _this.opts(opt);
			if(!$.isDefine(_opts.warp)){
				$.toast({msg: "drag element not set"}); return false;
			}
			var oL,oT,oLeft,oTop;
			var ui = {
				warp: document.querySelector('body'),
				main: _opts.warp,
				currentHeight: _opts.warp.offsetHeight,
				maxW: window.screen.width - _opts.warp.offsetWidth,
				maxH: window.screen.height - _opts.warp.offsetHeight
			}
			ui.main.addEventListener('touchstart', function(e) {
				var ev = e || window.event;
				var touch = ev.targetTouches[0];
				oL = touch.clientX - ui.main.offsetLeft;
				oT = touch.clientY - ui.main.offsetTop;
				window.addEventListener("touchmove", preventDefault, { passive: false });
			})
			ui.main.addEventListener('touchmove', function(e) {
				var _self = this;
				var ev = e || window.event;
				var touch = ev.targetTouches[0];
				oLeft = touch.clientX - oL;
				oTop = touch.clientY - oT;
				oLeft < 0 ? oLeft = 0 : oLeft >= ui.maxW ? oLeft = ui.maxW : '';
				oTop < 0 ? oTop = 0 : oTop >= ui.maxH ? oTop = ui.maxH : '';
				ui.main.style.left = oLeft + 'px';
				ui.main.style.top = oTop + 'px';
				typeof callback == "function" ?  callback({el: _self, type: 'touchmove'}) : '';
			})
			ui.main.addEventListener('touchend', function() {
				var _self = this;
				oLeft > 0 && oLeft < ui.maxW / 2 ? oLeft = 0 : oLeft > ui.maxW / 2 && oLeft < ui.maxW ? oLeft = ui.maxW : '';
				ui.main.style.left = oLeft + 'px';
				ui.main.style.transition = 'all .3s';
				var timer = setTimeout(function(){
					ui.main.style.transition = 'auto';
					clearInterval(timer);
				},300);
				ui.main.style.height = ui.currentHeight + "px";
				ui.main.style.top = oTop + 'px';
				if(ui.main.offsetTop >= window.screen.height - ui.main.offsetHeight - 100){
					ui.main.style.top = window.screen.height - ui.main.offsetHeight - 100 + "px";
				}
                window.removeEventListener("touchmove", preventDefault);
				typeof callback == "function" ?  callback({el: _self, type: 'touchend'}) : '';
			})
            function preventDefault(e){
                e.preventDefault();
            }
		}
	}
	$.drag = function(opt, callback){
		drag.on(opt, callback);
	};
})(aui, document, window);

/* ===============================
 	UI组件
   ===============================
 */
/***  loading 加载动画  */
!(function($, document, window, undefined){
	var loading = new Object();
	loading = {
		opts(opt){
			var opts = {
				warp: 'body', // --可选参数，父容器元素
				type: 1, //--可选参数，默认圆环风格(<1>、1:toast圆环风格，<2>、2:点击按钮后在按钮内显示加载动画) <3>、3:四方块水平方向旋转，
				msg: '', //--可选参数，描述内容
				mask: false, //--可选参数，是否显示遮罩，默认false
				direction: "col", //--可选参数，横向("row")或纵向("col")控制，默认纵向
				theme: 1, //--可选参数，控制风格
				style: {
					bg: '', // --可选参数，.aui-loading-main背景色(rgba(0,0,0,.6))
					color: '', //--可选参数，文字颜色
					maskBg: '', //--可选参数，遮罩层背景色(rgba(0,0,0,.3))
					zIndex: '', //--可选参数，加载弹窗.aui-loading层级
				}
			}
			return $.extend(opts, opt, true);
		},
		creat(opt){ //创建
			var _this = this;
			var _opts = _this.opts(opt);
			var _html = '';
			switch (Number(_opts.type)){
				case 1: //常用风格
					_html = '<div class="aui-loading aui-loading-ring">'
						+'<div class="aui-mask"></div>'
						+'<div class="aui-loading-main">'
							+'<div class="aui-loading-animate">';
								for(var i = 0; i < 12; i++){
									_html += '<span class="span"></span>';
								}
							_html +=
							'</div>'
							+'<div class="aui-loading-msg">'+ _opts.msg +'<span class="dotting"></span></div>'
						+'</div>'
					+'</div>';
					break;
				case 2: //点击按钮后在按钮内显示加载动画
					_html += '<div class="aui-loading aui-loading-button">'
						+'<div class="aui-loading-main">'
							+'<div class="aui-loading-animate">';
								for(var i = 0; i < 12; i++){
									_html += '<span class="span"></span>';
								}
							_html +=
							'</div>'
							+'<div class="aui-loading-msg">'+ _opts.msg +'</div>'
						+'</div>'
					+'</div>';
					break;
				case 3: //四个方块旋转
					_html = '<div class="aui-loading aui-loading-squarefour">'
						+'<div class="aui-mask"></div>'
						+'<div class="aui-loading-main">'
							+'<div class="aui-loading-animate"><span class="span1"></span><span class="span2"></span><span class="span3"></span><span class="span4"></span></div>'
							+'<div class="aui-loading-msg">'+ _opts.msg +'<span class="dotting"></span></div>'
						+'</div>'
					+'</div>';
					break;
				case 4: //圆点放大缩小动画(全屏首次加载过度动画)
					_html = '<div class="aui-loading aui-loading-dots">'
					+'<div class="aui-mask"></div>'
						+'<div class="aui-loading-main">'
							+'<div class="aui-loading-dot-items">'
								+'<div class="aui-loading-dot-item" id="dot_one"></div>'
								+'<div class="aui-loading-dot-item" id="dot_two"></div>'
								+'<div class="aui-loading-dot-item" id="dot_three"></div>'
							+'</div>'
						+'</div>'
					+'</div>';
					break;
				case 5: //圆点背景过度动画-微信小程序效果(全屏首次加载过度动画)
					_html = '<div class="aui-loading aui-loading-dots-opacity">'
					+'<div class="aui-mask"></div>'
						+'<div class="aui-loading-main">'
							+'<div class="aui-loading-dot-items">'
								+'<div class="aui-loading-dot-item" id="dot_one"></div>'
								+'<div class="aui-loading-dot-item" id="dot_two"></div>'
								+'<div class="aui-loading-dot-item" id="dot_three"></div>'
							+'</div>'
						+'</div>'
					+'</div>';
					break;
				default:
					break;
			}
			//if(document.querySelector(".aui-loading")) return;
			document.querySelector(_opts.warp).insertAdjacentHTML('beforeend', _html);
			var ui = {
				msg: document.querySelector(".aui-loading-msg"),
				mask: document.querySelector(".aui-loading .aui-mask"),
			}
			!$.isDefine(_opts.mask) && ui.mask ? ui.mask.parentNode.removeChild(ui.mask) : '';
			!$.isDefine(_opts.msg) && ui.msg ? ui.msg.parentNode.removeChild(ui.msg) : '';
			document.querySelector(".aui-mask,.aui-loading").addEventListener("touchmove", function(e){
	            e.preventDefault();
	       	});
			_this.css(opt);
		},
		css(opt){ //样式设置
			var _this = this;
			var _opts = _this.opts(opt);
			var ui = {
				warp: document.querySelector(_opts.warp),
				loading: document.querySelector(".aui-loading"),
				main: document.querySelector(".aui-loading-main"),
				button: document.querySelector(".aui-loading.aui-loading-button"),
				buttonMain: document.querySelector(".aui-loading.aui-loading-button .aui-loading-main"),
				ring: document.querySelector(".aui-loading.aui-loadig-ring"),
				ringMain: document.querySelector(".aui-loading.aui-loading-ring .aui-loading-main"),
				ringSpans: document.querySelector(".aui-loading.aui-loading-ring .span"),
				squarefour: document.querySelector(".aui-loading.aui-loading-squarefour"),
				squarefourMain: document.querySelector(".aui-loading.aui-loading-squarefour .aui-loading-main"),
				animate: document.querySelector(".aui-loading-animate"),
				msg: document.querySelector(".aui-loading-msg"),
				mask: document.querySelector(".aui-loading .aui-mask"),
				spans: document.querySelector(".aui-loading.aui-loading-button .span")
			}
			$.isDefine(_opts.style.bg) ? ui.main.style.background = _opts.style.bg : '';
			$.isDefine(_opts.style.color) && ui.msg ? ui.msg.style.color = _opts.style.color : '';
			$.isDefine(_opts.style.zIndex) ? ui.main.style.zIndex = _opts.style.zIndex : '';
			$.isDefine(_opts.style.maskBg) && ui.mask ? ui.mask.style.background = _opts.style.maskBg : '';
			switch (Number(_opts.type)){
				case 1: //ring全屏布局加载动画
					$.isDefine(_opts.msg) ? ui.main.style.minWidth = ui.main.offsetHeight + 10 + "px" : '';
					if(_opts.direction == "row")
					{ //水平布局样式设置
						ui.main.style.cssText = "width: auto; min-height: auto; padding: 10px 15px 9px 15px";
						ui.ringMain.style.whiteSpace = "nowrap";
						if(ui.msg){
							ui.msg.style.cssText = "width: auto; max-width: auto; display: inline-block; height: 24px; line-height: 24px; margin: 0 0 0 10px; font-size: 15px;;";
							ui.animate.style.cssText = "display: inline-block; width: 25px; height: 25px;"
						}
					}
					for(var i = 0; i < 12; i++){
						$.isDefine(_opts.style.color) ? ui.ringSpans.parentElement.children[i].style.borderColor = _opts.style.color : '';
					}
					break;
				case 2: //button按钮加载动画
					ui.warp.style.position = $.getStyle(ui.warp).position == "static" ? "relative" : '';
					ui.button.style.cssText = "width: "+ ui.warp.offsetWidth +"px; height: "+ui.warp.offsetHeight+"px";
					ui.animate.style.marginTop = (ui.warp.offsetHeight - ui.animate.offsetHeight) / 2 - parseInt($.getStyle(ui.warp).borderWidth) + "px";
					ui.msg ? ui.msg.style.marginTop = (ui.warp.offsetHeight - ui.animate.offsetHeight) / 2 - parseInt($.getStyle(ui.warp).borderWidth) - 1 + "px" : '';
					ui.button.style.marginLeft = $.getStyle(ui.warp).border != "0px none rgb(0, 0, 0)" ? - parseInt($.getStyle(ui.warp).borderWidth) + "px" : '';
					ui.button.style.marginTop = $.getStyle(ui.warp).border != "0px none rgb(0, 0, 0)" ? - parseInt($.getStyle(ui.warp).borderWidth) + "px" : '';
					ui.buttonMain.style.borderRadius = parseInt($.getStyle(ui.warp).borderRadius) > 0 ? parseInt($.getStyle(ui.warp).borderRadius) + "px" : '';
					ui.buttonMain.style.background = $.getStyle(ui.warp).backgroundColor;
					ui.msg ? ui.msg.style.color = $.getStyle(ui.warp).color : '';
					for(var i = 0; i < 12; i++){
						ui.spans.parentElement.children[i].style.borderColor = $.getStyle(ui.warp).color;
					}
					ui.msg ? ui.msg.style.fontSize = $.getStyle(ui.warp).fontSize : '';
					ui.button.addEventListener("touchstart", function(e){
			            e.preventDefault();
			       	});
					break;
				case 3: //squarefour四方块旋转加载动画
					if(_opts.theme == 1)
					{ //小窗（可设置mask）
						ui.squarefour.classList.add('aui-loading-squarefour-style-1')
						$.isDefine(_opts.msg) ? ui.squarefourMain.style.width = ui.squarefourMain.offsetHeight + 10 + "px" : '';
					}
					else if(_opts.theme == 2)
					{ //全屏覆盖
						ui.squarefour.classList.add('aui-loading-squarefour-style-2')
					}
					break;
				default:
					break;
			}
		},
		show(opt, callback){ //显示
			var _this = this;
			var _opts = _this.opts(opt);
			_this.creat(opt);
			var _timer = setTimeout(function(){
				typeof callback == "function" ?  callback() : '';
				clearTimeout(_timer);
			},200);
		},
		hide(opt, callback){ //隐藏
			var _this = this;
			var _opts = _this.opts(opt);
			var _timer = setTimeout(function(){
				document.querySelector(".aui-loading") ? document.querySelector(".aui-loading").parentNode.removeChild(document.querySelector(".aui-loading")) : '';				
				typeof callback == "function" ?  callback() : '';
				clearTimeout(_timer);
			},300);
		}
	}
	$.showload = function(opt, callback){
		loading.show(opt, callback);
	};
	$.hideload = function(opt, callback){
		loading.hide(opt, callback);
	};
})(aui, document, window);

/***  toast消息提示弹窗  */
!(function($, document, window, undefined){
	var toast = new Object();
	toast = {
		opts(opt){
			var opts = {
				warp: 'body', //--可选参数，父容器
				msg: '', //--必选参数，描述内容
				icon: '', //--可选参数，图标
				direction: "col", //--可选参数，（icon参数配置后有效）横向("row")或纵向("col")控制，默认纵向
				location: 'bottom', //--可选参数，（icon参数未配置时可配置）位置	<1、bottom:位于底部，从底部弹出显示>、<2、middle:位于页面中心位置>
				duration: 2000, //--可选参数，显示时间
			}
			return $.extend(opts, opt, true);
		},
		creat(opt){ //创建
			var _this = this;
			var _opts = _this.opts(opt);
			var _html = '';
			switch ($.isDefine(_opts.icon)){
				case false: //无图标
					_html = '<div class="aui-toast">'
						+'<div class="aui-toast-main">'
							+'<div class="aui-toast-msg">'+ _opts.msg +'</div>'
						+'</div>'
					+'</div>';
					break;
				case true: //有图标
					_html = '<div class="aui-toast">'
						+'<div class="aui-toast-main">'
							+'<div class="aui-toast-icon"><img src="'+ _opts.icon +'" /></div>'
							+'<div class="aui-toast-msg">'+ _opts.msg +'</div>'
						+'</div>'
					+'</div>';
					break;
				default:
					break;
			}
			// if(document.querySelector(".aui-toast")) return;
			document.querySelector(_opts.warp).insertAdjacentHTML('beforeend', _html);
			_this.css(opt);
		},
		css(opt){ //样式设置
			var _this = this;
			var _opts = _this.opts(opt);
			var ui = {
				warp: document.querySelector(_opts.warp),
				toast: document.querySelector(".aui-toast:last-child"),
				main: document.querySelector(".aui-toast-main"),
				icon: document.querySelector(".aui-toast-icon"),
				msg: document.querySelector(".aui-toast-msg")
			}
			switch ($.isDefine(_opts.icon)){
				case false: //无图标
					if(_opts.location == "bottom")
					{ //位于底部，从底部弹出显示
						ui.toast.classList.add('aui-toast-bottom');
					}
					else if(_opts.location == "middle")
					{ //位于页面中心位置
						ui.toast.classList.add('aui-toast-middle');
					}
					break;
				case true: //有图标
					ui.toast.classList.add('aui-toast-middle');
					if(_opts.direction == "row")
					{ //水平布局
						ui.main.style.cssText = "width: 100%; white-space: nowrap;";
						ui.msg.style.cssText = "margin-left: 10px; display: inline-block;";
						ui.icon.style.cssText = "display: inline-block;";
					}
					break;
				default:
					break;
			}
			ui.toast.style.left = (ui.warp.offsetWidth - ui.toast.offsetWidth) / 2 + "px";
		},
		show(opt, callback){ //显示
			var _this = this;
			var _opts = _this.opts(opt);
			_this.creat(opt);
			var timer = setTimeout(function() {
				_this.hide();
				clearTimeout(timer);
				typeof callback == "function" ?  callback() : '';
			},_opts.duration);
		},
		hide(opt, callback){ //隐藏
			var _this = this;
			var _opts = _this.opts(opt);
			var ui = {
				toast: document.querySelector(".aui-toast")
			}
			document.querySelector(".aui-toast") ? document.querySelector(".aui-toast").parentNode.removeChild(document.querySelector(".aui-toast")) : '';
			typeof callback == "function" ?  callback() : '';
		}
	}
	$.toast = function(opt, callback){
		toast.show(opt, callback);
	};
})(aui, document, window);

/***  dialog 模态弹窗  */
!(function($, document, window, undefined){
	var dialog = new Object();
	dialog = {
		opts(opt){
			var opts = {
				warp: 'body', //--可选参数，父容器
				title: '', //--可选参数，标题
				msg: '', //--可选参数，描述内容
				btns: ["确定"], //--可选参数，按钮，默认按钮为“确定” 分别可设置btns值为<1：['按钮1', '按钮2']>、<2：[{name: '按钮1', color: ''},{name: '按钮2', color: ''}]>
				mask: true, //--可选参数，是否显示遮罩，默认true-显示，false-隐藏
				touchClose: true, //--可选参数，触摸遮罩是否关闭模态弹窗，默认true-关闭，false-不可关闭
				theme: 1, //--可选参数，主题样式，控制模态弹窗按钮显示风格
				items: [], //prompt--input框列表配置[{label: '姓名：', type: 'text', value: '(可选)', placeholder: '请输入姓名'}]
				style: {
					w: '', //--可选参数，模态窗宽度，默认80%
					h: '', //--可选参数，模态窗高度，默认"auto"自适应
					bg: '',//--可选参数，模态窗背景色，默认白色
					zIndex: '', //--可选参数，模态窗层级
					title: {
						bg: "",
						color: "",
						lineHeight: "",
						textAlign: "",
						fontSize: "",
						padding: ""
					}
				}
			}
			return $.extend(opts, opt, true);
		},
		creat(opt, callback){ //创建
			var _this = this;
			var _opts = _this.opts(opt);
			var _html = '<div class="aui-dialog">'
				+'<div class="aui-mask"></div>'
				+'<div class="aui-dialog-main">'
					+'<div class="aui-dialog-title">'+ _opts.title +'</div>'
					+'<div class="aui-dialog-content">'+ _opts.msg +'</div>'
					+'<div class="aui-dialog-down"></div>'
				+'</div>'
			+'</div>';
			if(document.querySelector(".aui-dialog")) return;
			document.querySelector(_opts.warp).insertAdjacentHTML('beforeend', _html);
			var ui = {
				main: document.querySelector(".aui-dialog-main"),
				title: document.querySelector(".aui-dialog-title"),
				mask: document.querySelector(".aui-dialog .aui-mask"),
				down: document.querySelector(".aui-dialog-down"),
				btn: document.querySelectorAll(".aui-dialog-down-btn")
			}
			!$.isDefine(_opts.title) && ui.title ? ui.title.parentNode.removeChild(ui.title) : '';
			!$.isDefine(_opts.mask) && ui.mask ? ui.mask.parentNode.removeChild(ui.mask) : '';
			for(var i in _opts.btns)
			{
				//不设置按钮字体样式///_opts.btns = ['按钮1', '按钮2']
				if(Object.prototype.toString.call(_opts.btns[i]) === "[object String]")
				{
					ui.down.insertAdjacentHTML('beforeend', '<span class="aui-dialog-down-btn" index="'+ i +'">'+ _opts.btns[i] +'</span>');
				}
				//设置按钮字体样式///_opts.btns = [{name: '按钮1', color: ''},{name: '按钮2', color: ''}]
				else if(Object.prototype.toString.call(_opts.btns[i]) === "[object Object]")
				{
					ui.down.insertAdjacentHTML('beforeend', '<span class="aui-dialog-down-btn" index="'+ i +'">'+ _opts.btns[i].name +'</span>');
					$.isDefine(_opts.btns[i].color) ? ui.down.children[i].style.color = _opts.btns[i].color : '';
				}
				ui["btn"] = document.querySelectorAll(".aui-dialog-down-btn");
				!(function(j){
					ui.btn[j].addEventListener("click", function(e){
						_this.hide(opt);
						if(!$.isDefine(_opts.input))
						{
							var timer = setTimeout(function() { //延时执行回调函数，等待当前已打开模态窗关闭后再打开新的或执行默写逻辑操作
								clearTimeout(timer);
								typeof callback == "function" ?  callback({index: j}) : '';
							},200);
						}
						else
						{ //promt输入框模态弹窗回调
							var result = [];
							if($.isDefine(_opts.items) && _opts.items.length > 0)
							{
								var list = document.querySelectorAll(".aui-dialog-input-list");
								for(var i = 0; i < _opts.items.length; i++)
								{
									result.push(list[i].children[1].children[0].value);
								}
							}
							var timer = setTimeout(function(){
								clearTimeout(timer);
								typeof callback == "function" ?  callback({index: j, data: result}) : '';
							},200);
						}
					});
				})(i);
			}
			var _timer = setTimeout(function(){
				ui.main.addEventListener("touchmove", function(e){
				    e.preventDefault();
				},{ passive: false });
				ui.mask.addEventListener("click", function(e){
				    !_opts.touchClose ? e.preventDefault() : _this.hide(opt);
				});
				ui.mask.addEventListener("touchmove", function(e){
				    e.preventDefault();
				},{ passive: false });
				clearTimeout(_timer);
			},200);
			_this.css(opt);
		},
		css(opt){ //样式设置
			var _this = this;
			var _opts = _this.opts(opt);
			var ui = {
				warp: document.querySelector(_opts.warp),
				dialog: document.querySelector(".aui-dialog"),
				mask: document.querySelector(".aui-dialog .aui-mask"),
				main: document.querySelector(".aui-dialog-main"),
				title: document.querySelector(".aui-dialog-title"),
				msg: document.querySelector(".aui-dialog-content"),
				down: document.querySelector(".aui-dialog-down"),
				btn: document.querySelectorAll(".aui-dialog-down-btn")
			}
			switch (Number(_opts.theme)){
				case 1: //大按钮
					ui.main.classList.add('aui-dialog-main-style-1');
					for (var i = 0; i < _opts.btns.length; i++)
					{
						ui.btn[i].style.width = "calc(100% / "+ _opts.btns.length +")";
					}
					$.isDefine(_opts.title) ? ui.msg.style.padding = "16px 20px 20px 20px" : ui.msg.style.padding = "30px 20px 26px 20px";
					break;
				case 2: //小按钮（居右分布）
					ui.main.classList.add('aui-dialog-main-style-2');
					!$.isDefine(_opts.input) && !$.isDefine(_opts.title) ? ui.msg.style.paddingTop = "40px" : '';
					$.isDefine(_opts.title) ? ui.msg.style.padding = "16px 20px 20px 20px" : ui.msg.style.padding = "40px 20px 26px 20px";
					break;
				case 3: //按钮宽度等于父级宽度100%，适用于按钮文字过多情况
					ui.main.classList.add('aui-dialog-main-style-1', 'aui-dialog-main-style-3');
					for (var i = 0; i < _opts.btns.length; i++)
					{
						ui.btn[i].style.width = "100%";
					}
					$.isDefine(_opts.title) ? ui.msg.style.padding = "16px 20px 20px 20px" : ui.msg.style.padding = "30px 20px 26px 20px";
					break;
				case 4: //带背景色按钮
					ui.main.classList.add('aui-dialog-main-style-4');
					_opts.btns.length == 1 ? ui.down.style.padding = "0 40px" : ui.down.style.padding = "0 20px";
					break;
				default:
					break;
			}
			$.isDefine(_opts.style.w) ? ui.main.style.width = _opts.style.w : '';
			$.isDefine(_opts.style.h) ? ui.msg.style.height = parseInt(_opts.style.h) - 50 + "px" : '';
			$.isDefine(_opts.style.bg) ? ui.main.style.background = _opts.style.bg : '';
			$.isDefine(_opts.style.zIndex) ? ui.main.style.zIndex = _opts.style.zIndex : '';
			if($.isDefine(_opts.title) && ui.title)
			{ //设置标题title样式（调用时title已配置情况生效）
				ui.title.style.cssText = "background: "+ _opts.style.title.bg +"; color: "+ _opts.style.title.color +"; line-height: "+ _opts.style.title.lineHeight +"; text-align: "+ _opts.style.title.textAlign +"; font-size: "+ _opts.style.title.fontSize +"; padding: "+ _opts.style.title.padding;
			}
			for (var i = 0; i < _opts.btns.length; i++)
			{
				_opts.btns[i].name == "取消" || _opts.btns[i] == "取消" ? ui.btn[i].className = "aui-dialog-down-btn aui-dialog-down-cancel-btn" : '';
				_opts.btns[i].name == "删除" || _opts.btns[i] == "删除" ? ui.btn[i].className = "aui-dialog-down-btn aui-dialog-down-delete-btn" : '';
				!function(j){
					$.touchDom(ui.btn[j], Number(_opts.theme) == 4 ? "#CDCDCD" : "#EFEFEF");
				}(i);
			}
			$.isDefine(_opts.msg) && _opts.msg.length > 15 ? ui.msg.style.textAlign = "left" : ui.msg.style.textAlign = "center";
		},
		show(opt, callback){ //显示
			var _this = this;
			var _opts = _this.opts(opt);
			_this.creat(opt, callback);
			var ui = {
				dialog: document.querySelector(".aui-dialog"),
				main: document.querySelector(".aui-dialog-main")
			}
			ui.dialog.classList.add('aui-dialog-in');
			ui.dialog.classList.remove('aui-dialog-out');
		},
		hide(opt, callback){ //隐藏
			var _this = this;
			var _opts = _this.opts(opt);
			var ui = {
				dialog: document.querySelector(".aui-dialog"),
				main: document.querySelector(".aui-dialog-main")
			}
			ui.dialog.classList.remove('aui-dialog-in');
			ui.dialog.classList.add('aui-dialog-out');
			var timer = setTimeout(function() {
				ui.dialog ? ui.dialog.parentNode.removeChild(ui.dialog) : '';
				clearTimeout(timer);
				typeof callback == "function" ?  callback() : '';
			},200);
		},
		alert(opt, callback){ //alert单按钮模态弹窗
			var _this = this;
			_this.show(opt, callback);
		},
		confirm(opt, callback){ //confirm双按钮模态弹窗
			var _this = this;
			_this.show(opt, callback);
		},
		delete(opt, callback){ //delete删除模态弹窗
			var _this = this;
			_this.show(opt, callback);
		},
		prompt(opt, callback){ //input输入框模态弹窗
			var _this = this;
			var _opts = _this.opts(opt);
			opt["input"] = true;
			_this.show(opt, callback);
			var ui = {
				dialog: document.querySelector(".aui-dialog"),
				main: document.querySelector(".aui-dialog-main"),
				msg: document.querySelector(".aui-dialog-content"),
				btn: document.querySelectorAll(".aui-dialog-down-btn")
			}
			ui.dialog.classList.add('aui-popinput');
			var lists = '';
			if($.isDefine(_opts.items) && _opts.items.length > 0)
			{
				for(var i = 0; i < _opts.items.length; i++)
				{
					!$.isDefine(_opts.items[i].label) ? _opts.items[i].label = "" : "";
					!$.isDefine(_opts.items[i].type) ? _opts.items[i].type = "text" : "";
					!$.isDefine(_opts.items[i].value) ? _opts.items[i].value = "" : "";
					!$.isDefine(_opts.items[i].placeholder) ? _opts.items[i].placeholder = "" : "";
					lists += '<div class="aui-dialog-input-list">'
						+'<label>'+ _opts.items[i].label +'</label>'
						+'<div class="aui-dialog-input-list-input"><input type="'+ _opts.items[i].type +'" value="'+ _opts.items[i].value +'" placeholder="'+ _opts.items[i].placeholder +'" /></div>'
						+'<span class="aui-input-clear"><i></i></span>'
					+'</div>'
				}
				ui.msg.insertAdjacentHTML('beforeend', lists);
			}
			_this.css(opt);
			ui.msg.style.textAlign = "left";
			$.isDefine(_opts.title) ? ui.msg.style.padding = "10px 20px 20px 20px" : ui.msg.style.padding = "15px 20px 30px 20px";
			if($.isDefine(_opts.items) && _opts.items.length > 0)
			{
				var list = document.querySelectorAll(".aui-dialog-input-list");
				for(var i = 0; i < _opts.items.length; i++)
				{
					!(function(j){
						//输入检测
						list[j].children[1].children[0].oninput = function(e){
							var length = this.value.length;
			    			if(length > 0)
			    			{
			    				this.parentNode.parentNode.children[2].children[0].style.opacity = 1;
			    			}
			    			else
			    			{
			    				this.parentNode.parentNode.children[2].children[0].style.opacity = 0;
			    			}
						}
						//清空输入内容
						list[j].children[2].children[0].onclick = function(){
							list[j].children[1].children[0].value = "";
							this.style.opacity = 0;
						}
					})(i);
				}
			}
		}
	}
	$.hideDialog = function(opt){
		dialog.hide(opt);
	};
	$.alert = function(opt, callback){
		dialog.alert(opt, callback);
	};
	$.confirm = function(opt, callback){
		dialog.confirm(opt, callback);
	};
	$.delete = function(opt, callback){
		dialog.delete(opt, callback);
	};
	$.prompt = function(opt, callback){
		dialog.prompt(opt, callback);
	};
})(aui, document, window);

/***  actionSheet操作表弹窗  */
!(function($, document, window, undefined){
	var actionSheet = new Object();
	actionSheet = {
		opts(opt){
			var opts = {
				warp: 'body', //--可选参数，父容器
				mask: true, //--可选参数，是否显示遮罩，默认true-显示，false-隐藏
				touchClose: true, //--可选参数，触摸遮罩是否关闭模态弹窗，默认true-关闭，false-不可关闭
				items: [], //--必选参数，菜单列表[{name: "", color: "", fontSize: "", textAlign: ""}]
				cancle: "", //--可选参数，取消按钮
				location: 'bottom', //--可选参数，位置 <1、bottom:位于底部，从底部弹出显示>、<2、middle:位于页面中心位置>
				theme: 1, //--可选参数，主题样式
			}
			return $.extend(opts, opt, true);
		},
		creat(opt, callback){ //创建
			var _this = this;
			var _opts = _this.opts(opt);
			var _html = '<div class="aui-actionsheet">'
				+'<div class="aui-mask"></div>'
				+'<div class="aui-actionsheet-main">'
					+'<div class="aui-actionsheet-title">'+ _opts.title +'</div>'
					+'<ul class="aui-actionsheet-items"></ul>'
					+'<div class="aui-actionsheet-cancle" index="0">'+ _opts.cancle +'</div>'
				+'</div>'
			+'</div>';
			if(document.querySelector(".aui-actionsheet")) return;
			document.querySelector(_opts.warp).insertAdjacentHTML('beforeend', _html);
			var ui = {
				main: document.querySelector(".aui-actionsheet-main"),
				title: document.querySelector(".aui-actionsheet-title"),
				mask: document.querySelector(".aui-actionsheet .aui-mask"),
				items: document.querySelector(".aui-actionsheet-items"),
				item: document.querySelectorAll(".aui-actionsheet-item"),
				cancle: document.querySelector(".aui-actionsheet-cancle")
			}
			!$.isDefine(_opts.title) && ui.title ? ui.title.parentNode.removeChild(ui.title) : '';
			!$.isDefine(_opts.mask) && ui.mask ? ui.mask.parentNode.removeChild(ui.mask) : '';
			!$.isDefine(_opts.cancle) && ui.cancle ? ui.cancle.parentNode.removeChild(ui.cancle) : '';
			if($.isDefine(_opts.items))
			{
				for(var i = 0; i < _opts.items.length; i++)
				{
					ui.items.insertAdjacentHTML('beforeend', '<li class="aui-actionsheet-item" index="'+ (Number(i) + 1) +'">'+ _opts.items[i].name +'</li>');
					ui["item"] = document.querySelectorAll(".aui-actionsheet-item");
					!(function(j){
						ui.item[j].addEventListener("click", function(e){
							_this.hide(opt);
							var index = Number(this.getAttribute("index"));
							var timer = setTimeout(function() {
								clearTimeout(timer);
								typeof callback == "function" ?  callback({index: index}) : '';
							},200);
						});
					})(i);
				}
			}
			ui.cancle.addEventListener("click", function(e){
				_this.hide(opt);
				var index = Number(this.getAttribute("index"));
				var timer = setTimeout(function() {
					clearTimeout(timer);
					typeof callback == "function" ?  callback({index: index}) : '';
				},200);
			});
			ui.main.addEventListener("touchmove", function(e){
	            e.preventDefault();
	       },{ passive: false });
	       	ui.mask.addEventListener("click", function(e){
	            !_opts.touchClose ? e.preventDefault() : _this.hide(opt);
	       	});
			ui.mask.addEventListener("touchmove", function(e){
	            e.preventDefault()
	       	},{ passive: false });
			_this.css(opt);
		},
		css(opt){ //设置特定样式
			var _this = this;
			var _opts = _this.opts(opt);
			var ui = {
				warp: document.querySelector(_opts.warp),
				actionsheet: document.querySelector(".aui-actionsheet"),
				main: document.querySelector(".aui-actionsheet-main"),
				title: document.querySelector(".aui-actionsheet-title"),
				item: document.querySelectorAll(".aui-actionsheet-item"),
				cancle: document.querySelector(".aui-actionsheet-cancle")
			}
			switch (Number(_opts.theme)){
				case 1:
					ui.actionsheet.classList.add('aui-actionsheet-style-1');
					if(_opts.location == "bottom")
					{ //位于底部，从底部弹出显示
						ui.actionsheet.classList.add('aui-actionsheet-bottom');
					}
					else if(_opts.location == "middle")
					{ //位于页面中心位置
						ui.actionsheet.classList.add('aui-actionsheet-middle');
						ui.main.style.top = (ui.warp.offsetHeight - ui.main.offsetHeight) / 2 + "px";
						if($.isDefine(_opts.cancle))
						{
							ui.item[ui.item.length-1].style.borderBottomLeftRadius = ui.item[ui.item.length-1].style.borderBottomRightRadius = "0px";
						}
					}
					if($.isDefine(_opts.title))
					{
						ui.item[0].style.borderTopLeftRadius = ui.item[0].style.borderTopRightRadius = "0px";
						_opts.title.length >= 15 ? ui.title.style.textAlign = "left" : ui.title.style.textAlign = "center";
					}
					break;
				case 2:
					ui.actionsheet.classList.add('aui-actionsheet-style-2');
					if(_opts.location == "bottom")
					{ //位于底部，从底部弹出显示
						ui.actionsheet.classList.add('aui-actionsheet-bottom');
					}
					else if(_opts.location == "middle")
					{ //位于页面中心位置
						ui.actionsheet.classList.add('aui-actionsheet-middle');
						ui.main.style.top = (ui.warp.offsetHeight - ui.main.offsetHeight) / 2 + "px";
					}
					break;
				default:
					break;
			}
			ui.main.style.left = (ui.warp.offsetWidth - ui.main.offsetWidth) / 2 + "px";
			if($.isDefine(_opts.items))
			{
				for(var i = 0; i < _opts.items.length; i++)
				{
					$.isDefine(_opts.items[i].color) ? ui.item[i].style.color = _opts.items[i].color : "";
					$.isDefine(_opts.items[i].fontSize) ? ui.item[i].style.fontSize = _opts.items[i].fontSize : "";
					$.isDefine(_opts.items[i].textAlign) ? ui.item[i].style.textAlign = _opts.items[i].textAlign : "";
					!(function(j){
						$.touchDom(ui.item[j], "#EFEFEF");
					})(i);
				}
			}
			$.isDefine(_opts.cancle) ? $.touchDom(ui.cancle, "#EFEFEF") : '';
		},
		show(opt, callback){ //显示
			var _this = this;
			var _opts = _this.opts(opt);
			_this.creat(opt, callback);
		},
		hide(opt, callback){ //隐藏
			var _this = this;
			var _opts = _this.opts(opt);
			var ui = {
				actionsheet: document.querySelector(".aui-actionsheet"),
				main: document.querySelector(".aui-actionsheet-main"),
				mask: document.querySelector(".aui-actionsheet .aui-mask"),
			}
			if(_opts.theme == "style-1" && _opts.location == "bottom")
			{
				ui.main.style.animation = "aui-slide-down .2s ease-out forwards";
			}
			else if(_opts.theme == "style-2" && _opts.location == "bottom")
			{
				ui.main.style.animation = "aui-slide-down-screen .2s ease-out forwards";
			}
			else
			{
				ui.main.style.animation = "aui-fade-out .2s ease-out forwards";
			}
			ui.mask.style.animation = "aui-fade-out .2s ease-out forwards";
			var timer = setTimeout(function() {
				ui.actionsheet ? ui.actionsheet.parentNode.removeChild(ui.actionsheet) : '';
				typeof callback == "function" ?  callback() : '';
				clearTimeout(timer);
			},200);
		}
	}
	$.actionSheet = function(opt, callback){
		actionSheet.show(opt, callback);
	};
})(aui, document, window);