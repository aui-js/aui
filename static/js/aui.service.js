/* ===============================
	 * 客服
	 * versions 1.0.0
	 * cl15095344637@163.com
 * ===============================
 */
!(function($, document, window, undefined){
    $.service = {       
        // 美洽客服
        meiqia: function(entId, serviceToken){
            var _this = this;
            aui.showload({msg: '连接中'});
			(function(m, ei, q, i, a, j, s) {
		        m[i] = m[i] || function() {
		            (m[i].a = m[i].a || []).push(arguments)
		        };
		        j = ei.createElement(q),
		            s = ei.getElementsByTagName(q)[0];
		        j.async = true;
		        j.charset = 'UTF-8';
		        j.src = 'https://static.meiqia.com/dist/meiqia.js?_=t';
		        s.parentNode.insertBefore(j, s);
		    })(window, document, 'script', '_MEIQIA');
		    _MEIQIA('entId', entId);
		    _MEIQIA('withoutBtn'); //不使用美洽客服按钮——>在这里开启无按钮模式（常规情况下，需要紧跟在美洽嵌入代码之后）
			_MEIQIA('init'); // 手动初始化
			_MEIQIA('showPanel'); //显示聊天窗口
			_MEIQIA('allSet', function(){
				aui.hideload();
			});
        },
       

    }
})(aui, document, window);
