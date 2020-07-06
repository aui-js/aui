/* ===============================
	 * apicloud应用公共js
	 * versions 1.0.0
	 * cl15095344637@163.com
	 * @example:
	    
 * ===============================
 */
!(function($, document, window, undefined){
	$.apicloud = {
		data: {
			appID: '', //应用id
			appName: '', //应用名称
			appVersion: '1.0.0', //应用版本号
			server: {
				url: '', //正式域名
				csurl: '', //测试域名
			},
			apicloud: true, //是否为apicloud环境
		},
		opts: function(opt){
			return $.extend(this.data, opt, true);
		},
		init: function(opt){
			var _this = this;
			_this.data = _this.opts(opt);
		},
		//获得设备编号
		getDeviceId: function() {
		    var deviceId = api.deviceId;
		    deviceId = deviceId.replace(/\-/g, "");
		    return deviceId;
		},
		/***设置状态栏样式
		    @param {string} color APP状态栏背景颜色
		    @param {string} style APP状态栏文字颜色
		    @param {bool} contentTop 是否设置content顶部内边距
		*/
		setStatusBar: function(color, style, contentTop) {
		    api.setStatusBarStyle({ color: color, style: style });
		    $api.fixStatusBar($api.dom('header'));
		    $api.fixIos7Bar($api.dom('header'));
		    $api.fixTabBar($api.dom('footer'));
		    $('header').height(44);
		    contentTop == false ? contentTop = contentTop : contentTop = true;
		    if(document.querySelector("header") && contentTop == true)
		    {
		        $(".content, .mui-content, aui-content").css({'padding-top': document.querySelector("header").offsetHeight});
		    }
		},
		/***ajax封装
		    @param {string} opts.url 接口地址
		    @param {string} opts.type 请求类型, 默认“post”（get, post）
		    @param {Object} opts.data 请求参数 （若上传文件则data: {path: "", ...}）
		    @example:  aui.apicloud.ajax({ url: 'index/goods', tyle: 'post', data: {} }).then(function(ret){},function(err){})
		*/
		ajax: function(opts){
			var _this = this;
			if (_this.isDefine(opts.data.path)){ //上传文件
				var data = { values: opts.data, files: { file: opts.data.path } }
			}
			else{ //普通数据请求
				var data = { values: opts.data }
			}
			return new Promise(function(resolve, reject){
				api.ajax({
					url: _this.data.server.url + opts.url || '',
					headers: {
						// 'Content-Type':'application/x-www-form-urlencoded' 
					},
					method: opts.type || 'get',
					cache: opts.cache || 'false',
					timeout:  opts.timeout || 30,
					dataTpye: opts.dataTpye || 'json',
					data: data || {},
				},
				function(ret, err) {
					if(ret)
					{
						resolve(ret)
					}
					else
					{ //请求失败
						reject(err)
					}					
				});				
			});
		},
		/***获取上一页参数*/
		getPageparam: function() {
		    if (this.data.apicloud) {
		        return api.pageParam;
		    } else {
		        var res = getUrlParam('param');
		        if (res == 'undefined') { return {}; }
		        return _parse(res);
		    }
		},
		/***判断是否为空
		    @param {string} value 需要判断的变量字符串
		*/
		isDefine: function(value) {
		    if (value == null || value == "" || value == "undefined" || value == undefined || value == "null" || value == "(null)" || value == 'NULL' || typeof(value) == 'undefined') {
		        return false;
		    } else {
		        value = value + "";
		        value = value.replace(/\s/g, "");
		        if (value == "") {
		            return false;
		        }
		        return true;
		    }
		},
		/***打开新窗口
		    @param {string} name window窗口名称
		    @param {string} url window窗口路径
		    @param {Object} pageParam 打开新窗口传入的参数
		    @param {string} type 动画类型
		    @param {string} subType 动画子类型
		    @param {string} duration 动画过渡时间，默认300毫秒
		*/
		openWin: function(name, url, pageParam, type, subType, duration, isCheckLogin) {
			var _this = this;
		    if (_this.data.apicloud) {
		        _this.isDefine(pageParam) ? pageParam = pageParam : pageParam = new Object();
		        _this.isDefine(type) ? type = type : type = 'push';
		        _this.isDefine(subType) ? subType = subType : subType = 'from_right';
		        _this.isDefine(duration) ? duration = duration : duration = 300;
		        api.openWin({
		            name: name,
		            url: url,
		            pageParam: pageParam,
		            animation: {
		                type: type, ////新视图将旧视图推开
		                subType: subType, //从右边开始动画
		            }
		        });
		    }
		},
		/***关闭当前页面 */
		closeWin: function() {
			var _this = this;
		    if (_this.data.apicloud) {
		        api.closeWin();
		    }
		},
		/***关闭指定页面
		    @param {string} name 指定页面名称
		*/
		winCloseName: function(name){
			if (api.systemType == 'ios')
			{
				var _timer = setTimeout(function(){
					clearTimeout(_timer);
					api.execScript(
					{
						name: "root",
						script: "api.closeWin({name:'"+name+"'});"
					});
				},500)
			}
			else
			{
				api.closeWin({name:name});
			}
		},
		/***打开新页面并在页面消失时关闭当前页*/
		closeCurrentWin: function(){
			var _this = this;
		    // 监听页面消失的时候，关闭当前页
		    api.addEventListener({
		        name:'viewdisappear'
		    },function(){
		        _this.closeWin();
		    });
		},
		/***退出APP
		    @param {string} appID 当前app对应的ID（已全局设置）
		    @param {bool} flag true:进入后台运行； false：直接退出（可选）
		*/
		exitApp: function(flag){
		    if (api.systemType == 'ios')
		    { //IOS退出
		        api.setWinAttr({ slidBackEnabled: false });
		    }
		    else
		    { //安卓双击退出
		        api.addEventListener({
		            name: 'keyback'
		        }, function(ret, err) {
		            if (window.__start == 'undefined' || !window.__start) {
		                window.__start = new Date().getTime();
		                api.toast({ msg: '再按一次返回键退出', duration: 1500, location: 'bottom' });
		            } else {
		                if (new Date().getTime() - window.__start < 1500) {
		                    flag ? flag = flag : flag = true;
		                    switch (flag) {
		                        case true:
		                            //APP进入后台运行
		                            api.toLauncher();
		                            break;
		                        case false:
		                            //直接退出APP（会杀死进程）
		                            api.closeWidget({
		                                id: _this.appID, //应用id
		                                retData: {  name: 'closeWidget' },
		                                animation: { type: 'flip', subType: 'from_bottom',  duration: 500},
		                                silent: true
		                            });
		                            break;
		                        default:
		
		                    }
		                } else {
		                    window.__start = new Date().getTime();
		                    api.toast({ msg: '再按一次返回键退出', duration: 1500, location: 'bottom' });
		                }
		            }
		        });
		    }
		},
		
	};
})(aui, document, window);
