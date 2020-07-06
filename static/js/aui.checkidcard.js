/* ===============================	 
	 * 身份证号校验
	 * versions 1.0.0
	 * cl15095344637@163.com
 * ===============================
 */
!(function($, document, window, undefined){
	/***校验身份证号
	    @param {String} personnumber 身份证号码
	 	@example: aui.checkIdcard(pass);  //return true | false;
	*/
	$.checkIdcard = function(personnumber) {
	    personnumber = personnumber.toUpperCase();
	    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
	    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(personnumber))) {
	        return false;
	    }
	    //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
	    //下面分别分析出生日期和校验位
	    var len, re;
	    len = personnumber.length;
	    if (len == 15) {
	        re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
	        var arrSplit = personnumber.match(re);
	        //检查生日日期是否正确
	        var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
	        var bGoodDay;
	        bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
	        if (!bGoodDay) {
	            return false;
	        }
	        else {
	            //将15位身份证转成18位
	            //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
	            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
	            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
	            var nTemp = 0, i;
	            personnumber = personnumber.substr(0, 6) + '19' + personnumber.substr(6, personnumber.length - 6);
	            for (i = 0; i < 17; i++) {
	                nTemp += personnumber.substr(i, 1) * arrInt[i];
	            }
	            personnumber += arrCh[nTemp % 11];
	            return true;
	        }
	    }
	    if (len == 18) {
	        re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
	        var arrSplit = personnumber.match(re);
	        //检查生日日期是否正确
	        var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
	        var bGoodDay;
	        bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
	        if (!bGoodDay) {
	            return false;
	        } else {
	            //检验18位身份证的校验码是否正确。
	            //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
	            var valnum;
	            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
	            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
	            var nTemp = 0, i;
	            for (i = 0; i < 17; i++) {
	                nTemp += personnumber.substr(i, 1) * arrInt[i];
	            }
	            valnum = arrCh[nTemp % 11];
	            if (valnum != personnumber.substr(17, 1)) {
	                return false;
	            }
	            return true;
	        }
	    }
	    return false;
	}
	/***通过身份证号获取年龄
	    @param {String} identityCard 身份证号码
	 	@example: aui.getAge(identityCard);  //return '年龄';
	*/
	$.getAge = function(identityCard) {
	    var len = (identityCard + "").length;
	    if (len == 0) {
	        return 0;
	    } else {
	        if ((len != 15) && (len != 18))//身份证号码只能为15位或18位其它不合法
	        {
	            return 0;
	        }
	    }
	    var strBirthday = "";
	    if (len == 18)//处理18位的身份证号码从号码中得到生日和性别代码
	    {
	        strBirthday = identityCard.substr(6, 4) + "/" + identityCard.substr(10, 2) + "/" + identityCard.substr(12, 2);
	    }
	    if (len == 15) {
	        strBirthday = "19" + identityCard.substr(6, 2) + "/" + identityCard.substr(8, 2) + "/" + identityCard.substr(10, 2);
	    }
	    //时间字符串里，必须是“/”
	    var birthDate = new Date(strBirthday);
	    var nowDateTime = new Date();
	    var age = nowDateTime.getFullYear() - birthDate.getFullYear();
	    //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
	    if (nowDateTime.getMonth() < birthDate.getMonth() || (nowDateTime.getMonth() == birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())) {
	        age--;
	    }
	    return age;
	}	
})(aui, document, window);
