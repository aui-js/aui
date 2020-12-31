/* ===============================
	 * popdownmenu底部弹出窗口
	 * versions 1.0.0
	 * cl15095344637@163.com
	 * @example:
	    aui.popdownMenu({
			mask: true,
			touchClose: true,
			html: '',
			theme: 1,
		},function(ret){
			console.log(ret.index);
		});
 * ===============================
 */
!(function($, document, window, undefined){
	$.picker = {
		opts: function(opt) {
			var opts = {
				warp: 'body', //--可选参数，父容器
				mask: true, //--可选参数，是否显示遮罩，默认true-显示，false-隐藏
				touchClose: true, //--可选参数，触摸遮罩是否关闭模态弹窗，默认true-关闭，false-不可关闭
				
			}
			return $.extend(opts, opt, true);
		},
		
		HTML_CONTAINER: '<div class="aui-picker">\
			<div class="aui-mask"></div>\
			<div class="aui-picker-main">\
                <div class="aui-picker-header">\
                    <div class="aui-picker-title">{title}</div>\
                    <div class="aui-picker-close iconfont iconclose"></div>\
                </div>\
                <div class="aui-picker-nav"></div>\
                <div class="aui-picker-content">\
                    <ul class="aui-picker-lists"></ul>\
                </div>\
			</div>\
		</div>',
		
		HTML_NAVITEM: '<div class="aui-picker-navitem active">请选择</div>',
		HTML_NAVBORDER: '<span class="aui-picker-navborder"></span>',
		HTML_LIST: '<li class="aui-picker-list {active}" index="{index}">\
			<div class="aui-picker-list-warp" index="{index}"></div>\
		</li>',
		HTML_LIST_ITEM: '<div class="aui-picker-item" index="{index}">{text}</div>',
		
		query: function(className) {
			return document.querySelector(className);
		},
		
		queryAll: function(className) {
			return document.querySelectorAll(className);
		},
		
		GET_DOMCLASSNAME: function() {
			var _this = this;
			_this.ui = {
                picker: _this.query('.aui-picker') || '',
                main: _this.query('.aui-picker-main') || '',
                mask: _this.query('.aui-picker').querySelector('.aui-mask') || '',
                title: _this.query('.aui-picker-title') || '',
                closeBtn: _this.query('.aui-picker-close') || '',
                nav: _this.query('.aui-picker-nav') || '',
                lists: _this.query('.aui-picker-lists') || '',
                list: _this.queryAll('.aui-picker-list') || '',
            	navItem: _this.queryAll('.aui-picker-navitem') || '',
            	navborder: _this.query('.aui-picker-navborder') || '',
           };
		},
		
		create: function(opt) {
			var _this = this;
            var _opts = _this.opts(opt);
            var _html = _this.HTML_CONTAINER.replace(/{title}/, _opts.title ? _opts.title : '');
            _this.query(_opts.warp).insertAdjacentHTML('beforeend', _html);
            _this.GET_DOMCLASEENAME();
            var lists = "", navitem = '';
            
            for(var i = 0; i < _opts.layer; i++) {
                lists += _this.HTML_LIST.replace(/{active}/, i == 0 ? 'active' : '');
					.replace(/{index}/, i)
					.replace(/{index}/, i);
                navitem += _this.HTML_NAVITEM;
            }
            
            navitem += _this.HTML_NAVBORDER;
            _this.ui.lists.insertAdjacentHTML('beforeend', lists);
            _this.ui.nav.insertAdjacentHTML('beforeend', navitem);
            _this.GET_DOMCLASEENAME();
            var item = '';
            
            if(_opts.data && _opts.data.length > 0) {
                for(var i = 0; i < _opts.data.length; i++){
                    item += _this.HTML_LIST_ITEM.replace(/{index}/, i).replace(/{text}/, _opts.data[i].text);
                }
                
                _this.ui.list[0].querySelector(".aui-picker-list-warp").insertAdjacentHTML('beforeend', item);
                _this.ui["item0"] = document.querySelectorAll(".aui-picker-list:nth-child(1) .aui-picker-list-warp .aui-picker-item");
            }
		},
	}
})(aui, document, window);
