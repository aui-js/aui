/* ===============================
	 * 中文数字转阿拉伯数字
	 * versions 1.0.0
	 * cl15095344637@163.com
	 * @param {string} str 中文数字 “一百一十九”
	 * @example: aui.chineseToNumber('中文数字');
 * ===============================
 */
!(function($, document, window, undefined){
    $.chineseToNumber = function (str){
    	var chnNumChar = {零:0, 一:1, 二:2, 三:3, 四:4, 五:5, 六:6, 七:7, 八:8, 九:9};
    	var chnNameValue = {
    		十:{value:10, secUnit:false},
    		百:{value:100, secUnit:false},
    		千:{value:1000, secUnit:false},
    		万:{value:10000, secUnit:true},
    		亿:{value:100000000, secUnit:true}
    	}
    	var rtn = 0;
    	var section = 0;
    	var number = 0;
    	var secUnit = false;
    	var str = str.split('');
    	for(var i = 0; i < str.length; i++){
    		var num = chnNumChar[str[i]];
    		if(typeof num !== 'undefined'){
    			number = num;
    			if(i === str.length - 1){
    				section += number;
    			}
    		}else{
    			var unit = chnNameValue[str[i]].value;
    			secUnit = chnNameValue[str[i]].secUnit;
    			if(secUnit){
    				section = (section + number) * unit;
    				rtn += section;
    				section = 0;
    			}else{
    				section += (number * unit);
    			}
    			number = 0;
    		}
    	}
    	return rtn + section;
    }
})(aui, document, window);
