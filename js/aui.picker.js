/* ===============================
	 * 选择列表插件
	 * versions 1.0.0
	 * cl15095344637@163.com
	 * @example:
	    aui.picker.open({
	        title: '选择区域',
	        layer: 2, //二级联动
	        data: _this.cityData, //城市数据
	    },function(ret){
	        //console.log(ret);
	        if(ret.status == 1){
	            aui.picker.close(function(){
	                _this.shiquData = ret.data;
	            });
	        }
	    })
 * ===============================
 */
!(function($, document, window, undefined){
    $.picker = {
        opts: function(opt){
			var opts = {
				warp: 'body', //--可选参数，父容器
                title: '', //--可选参数，标题
                layer: 1, //--可选参数，控制几级联动,默认1级
                data: [], //--必选参数，数据 如：[{text: '', adcode: '', children: [{text: '', adcode: ''}]}]
			}
			return $.extend(opts, opt, true);
		},
        // 创建弹窗UI元素
        creat: function(opt){
            var _this = this;
            var _opts = _this.opts(opt);
            var _html = '<div class="aui-picker">'
				+'<div class="aui-mask"></div>'
				+'<div class="aui-picker-main">'
                    +'<div class="aui-picker-header">'
                        +'<div class="aui-picker-title">'+ (_opts.title ? _opts.title : '') +'</div>'
                        +'<div class="aui-picker-close iconfont iconclose"></div>'
                    +'</div>'
                    +'<div class="aui-picker-nav"></div>'
                    +'<div class="aui-picker-content">'
                        +'<ul class="aui-picker-lists"></ul>'
                    +'</div>'
				+'</div>'
			+'</div>';		
			document.querySelector(_opts.warp).insertAdjacentHTML('beforeend', _html);
            _this.ui = {
                picker: document.querySelector(".aui-picker"),
                main: document.querySelector(".aui-picker-main"),
                mask: document.querySelector(".aui-picker").querySelector('.aui-mask'),
                title: document.querySelector(".aui-picker-title"),
                closeBtn: document.querySelector(".aui-picker-close"),
                nav: document.querySelector(".aui-picker-nav"),
                lists: document.querySelector(".aui-picker-lists"),
            }
            var lists = "", navitem = '';
            for(var i = 0; i < _opts.layer; i++){
                if(i==0){
                    lists += '<li class="aui-picker-list active" index="'+ i +'"><div class="aui-picker-list-warp" index="'+ i +'"></div></li>';
                    navitem +='<div class="aui-picker-navitem active">请选择</div>';
                }
                else{
                    lists += '<li class="aui-picker-list" index="'+ i +'"><div class="aui-picker-list-warp" index="'+ i +'"></div></li>';
                    navitem +='<div class="aui-picker-navitem">请选择</div>';
                }
            }
            navitem +='<span class="aui-picker-navborder"></span>';
            _this.ui.lists.insertAdjacentHTML('beforeend', lists);
            _this.ui.nav.insertAdjacentHTML('beforeend', navitem);
            _this.ui["list"] = document.querySelectorAll(".aui-picker-list");
            _this.ui["navItem"] = document.querySelectorAll(".aui-picker-navitem");
            _this.ui["navborder"] = document.querySelector(".aui-picker-navborder");
            var item = '';
            if(_opts.data && _opts.data.length > 0){
                for(var i = 0; i < _opts.data.length; i++){
                    item += '<div class="aui-picker-item" index="'+ i +'">'+ _opts.data[i].text +'</div>';
                }
                _this.ui.list[0].querySelector(".aui-picker-list-warp").insertAdjacentHTML('beforeend', item);
                _this.ui["item0"] = document.querySelectorAll(".aui-picker-list:nth-child(1) .aui-picker-list-warp .aui-picker-item");
            }
        },
        // 初始化弹窗
        open: function(opt, callback){
            var _this = this;
            var _opts = _this.opts(opt);
            if(!document.querySelector(".aui-picker")){
                _this.creat(opt);
            }
            _this.ui.picker.style.display = "inline-block";
            _this.ui.mask.style.animation = "aui-fade-in .2s ease-out forwards";
            _this.ui.main.style.animation = "aui-slide-up-screen .2s ease-out forwards";
            // 导航栏菜单点击
            for(var i = 0; i < _opts.layer; i++){
                !(function(index){
                    _this.ui.navItem[index].addEventListener("click", function(){
                        _this.navTab(index, opt);
                    },false);
                })(i);
            }
            _this.ui.mask.addEventListener("touchmove", function(e){
                e.preventDefault();
            }, { passive: false })
            // 关闭按钮关闭弹窗
            _this.ui.closeBtn.addEventListener("click", function(){
                _this.close(callback);
            }, false);
            _this.ui.mask.addEventListener("click", function(){
                _this.close(callback);
            }, false);
            _this.firstItemClick(opt, callback);
        },
        // 隐藏弹窗
        close: function(callback){
            var _this = this;
            _this.ui.mask.style.animation = "aui-fade-out .2s ease-out forwards";
            _this.ui.main.style.animation = "aui-slide-down-screen .2s ease-out forwards";
            var timer = setTimeout(function(){
                //_this.ui.picker.style.display = "none";
                document.querySelector(".aui-picker") ? document.querySelector(".aui-picker").parentNode.removeChild(document.querySelector(".aui-picker")) : '';
            	typeof callback == "function" ?  callback({status: 0, data: _this.result}) : '';
                clearTimeout(timer);
            },200);
        },
        // 处理导航栏切换
        navTab: function(index, opt){
            var _this = this;
            var _opts = _this.opts(opt);
            for(var j = 0; j < _opts.layer; j++){
                _this.ui.navItem[j].classList.remove("active");
                _this.ui.list[j].classList.remove("active");
            }
            _this.ui.navItem[index].classList.add("active");
            _this.ui.list[index].classList.add("active");
            _this.ui.navborder.style.transition = 'left .3s';
            _this.ui.navborder.style.left = _this.ui.navItem[index].offsetLeft + (_this.ui.navItem[index].offsetWidth / 2) - (_this.ui.navborder.offsetWidth / 2) + "px";
        },
        // 一级分类点击
        firstItemClick: function(opt, callback){
            var _this = this;
            var _opts = _this.opts(opt);
            if(_this.ui["item0"]){
                for(var i = 0; i < _this.ui["item0"].length; i++){
                    !(function(index){
                        _this.ui["item0"][index].addEventListener("click", function(){
                            var _self = this;
                            var pindex = Number(_self.parentNode.getAttribute("index"));
                            var index = Number(_self.getAttribute("index"));
                            // 当前点击选项设为选中且其他取消选中
                            for(var j = 0; j < _this.ui["item0"].length; j++){
                                _this.ui["item0"][j].classList.remove("active");
                            }
                            _self.classList.add("active");
                            for(var j = 0; j < _opts.layer; j++){
                            }
                            _this.ui.navItem[pindex].innerText = _opts.data[index].text;
                            _this.ui.navborder.style.left = _this.ui.navItem[pindex].offsetLeft + (_this.ui.navItem[pindex].offsetWidth / 2) - (_this.ui.navborder.offsetWidth / 2) + "px";
                            var timer = setTimeout(function(){
                                if((pindex+1) < _opts.layer){ //若多级联动超过一级
                                    _this.ui.navItem[pindex+1].innerText = "请选择";
                                    _this.navTab(pindex + 1, opt);
                                    var item = '';
                                    if(_opts.data[index].children && _opts.data[index].children.length > 0){
                                        for(var i = 0; i < _opts.data[index].children.length; i++){
                                            item += '<div class="aui-picker-item" index="'+ i +'">'+ _opts.data[index].children[i].text +'</div>';
                                        }
                                        _this.ui.list[pindex+1].querySelector(".aui-picker-list-warp").innerHTML = "";
                                        _this.ui.list[pindex+1].querySelector(".aui-picker-list-warp").scrollTop = 0;
                                        _this.ui.list[pindex+1].querySelector(".aui-picker-list-warp").insertAdjacentHTML('beforeend', item);
                                    }
                                    else{
                                        _this.ui.list[pindex+1].querySelector(".aui-picker-list-warp").innerHTML = "";
                                    }
                                    _this.ui["item1"] = document.querySelectorAll(".aui-picker-list:nth-child(2) .aui-picker-list-warp .aui-picker-item");
                                    _this.twoItemClick(opt, callback);
                                }
                                _this['result'] = {};
                                for(var i in _opts.data[index]){
                                    _this['result'][''+i] = _opts.data[index][i]
                                }
                                _this['firstPindex'] = pindex;
                                _this['firstIndex'] = index;
                                if(pindex+1 >= _opts.layer){
                                    typeof callback == "function" ?  callback({status: 1, data: _this.result}) : '';
                                }
                                clearTimeout(timer);
                            },200);
                        },false);
                    })(i);
                }

            }
        },
        // 二级分类点击
        twoItemClick: function(opt, callback){
            var _this = this;
            var _opts = _this.opts(opt);
            if(_this.ui["item1"]){
                for(var i = 0; i < _this.ui["item1"].length; i++){
                    !(function(index){
                        _this.ui["item1"][index].addEventListener("click", function(){
                            var _self = this;
                            var pindex = Number(_self.parentNode.getAttribute("index"));
                            var index = Number(_self.getAttribute("index"));
                            // 当前点击选项设为选中且其他取消选中
                            for(var j = 0; j < _this.ui["item1"].length; j++){
                                _this.ui["item1"][j].classList.remove("active");
                            }
                            _self.classList.add("active");
                            _this.ui.navItem[pindex].innerText = _opts.data[_this.firstIndex].children[index].text;
                            _this.ui.navborder.style.left = _this.ui.navItem[pindex].offsetLeft + (_this.ui.navItem[pindex].offsetWidth / 2) - (_this.ui.navborder.offsetWidth / 2) + "px";
                            var timer = setTimeout(function(){
                                if((pindex+1) < _opts.layer){ //若多级联动超过二级
                                    _this.ui.navItem[pindex+1].innerText = "请选择";
                                    _this.navTab(pindex + 1, opt);
                                    var item = '';
                                    if(_opts.data[_this.firstIndex].children[index].children && _opts.data[_this.firstIndex].children[index].children.length > 0){
                                        for(var i = 0; i < _opts.data[_this.firstIndex].children[index].children.length; i++){
                                            item += '<div class="aui-picker-item" index="'+ i +'">'+ _opts.data[_this.firstIndex].children[index].children[i].text +'</div>';
                                        }
                                        _this.ui.list[pindex+1].querySelector(".aui-picker-list-warp").innerHTML = "";
                                        _this.ui.list[pindex+1].querySelector(".aui-picker-list-warp").scrollTop = 0;
                                        _this.ui.list[pindex+1].querySelector(".aui-picker-list-warp").insertAdjacentHTML('beforeend', item);
                                    }
                                    else{
                                        _this.ui.list[pindex+1].querySelector(".aui-picker-list-warp").innerHTML = "";
                                    }
                                    _this.ui["item2"] = document.querySelectorAll(".aui-picker-list:nth-child(3) .aui-picker-list-warp .aui-picker-item");
                                    _this.threeItemClick(opt, callback);
                                }
                                _this['result']["children"] = {};
                                for(var i in _opts.data[_this.firstIndex].children[index]){
                                    _this['result']["children"][''+i] = _opts.data[_this.firstIndex].children[index][i]
                                }
                                _this['twoPindex'] = pindex;
                                _this['twoIndex'] = index;
                                if(pindex+1 >= _opts.layer){
                                    typeof callback == "function" ?  callback({status: 1, data: _this.result}) : '';
                                }
                                clearTimeout(timer);
                            },200);
                        },false);
                    })(i);
                }
            }
        },
        // 三级分类点击
        threeItemClick: function(opt, callback){
            var _this = this;
            var _opts = _this.opts(opt);
            if(_this.ui["item2"]){
                for(var i = 0; i < _this.ui["item2"].length; i++){
                    !(function(index){
                        _this.ui["item2"][index].addEventListener("click", function(){
                            var _self = this;
                            var pindex = Number(_self.parentNode.getAttribute("index"));
                            var index = Number(_self.getAttribute("index"));
                            // 当前点击选项设为选中且其他取消选中
                            for(var j = 0; j < _this.ui["item2"].length; j++){
                                _this.ui["item2"][j].classList.remove("active");
                            }
                            _self.classList.add("active");
                            _this.ui["navItem"][pindex].innerText = _opts.data[_this.firstIndex].children[_this.twoIndex].children[index].text;
                            _this.ui.navborder.style.left = _this.ui.navItem[pindex].offsetLeft + (_this.ui.navItem[pindex].offsetWidth / 2) - (_this.ui.navborder.offsetWidth / 2) + "px";
                            var timer = setTimeout(function(){
                                _this['result']["children"]["children"] = {};
                                for(var i in _opts.data[_this.firstIndex].children[_this.twoIndex].children[index]){
                                    _this['result']["children"]["children"][''+i] = _opts.data[_this.firstIndex].children[_this.twoIndex].children[index][i]
                                }
                                _this['threePindex'] = pindex;
                                _this['threeIndex'] = index;
                                typeof callback == "function" ?  callback({status: 1, data: _this.result}) : '';
                                clearTimeout(timer);
                            },200);
                        },false);
                    })(i);
                }
            }
        },
    }
})(aui, document, window);
