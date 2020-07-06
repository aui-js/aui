
!(function($, document, window, undefined){
	/**
	 * 获取昨天	 	
	 * 返回格式为 yyyy-mm-dd的日期的数组，如：['2014-01-25']
	 */
	$.getYesterday = function(){
		//昨天的时间 
		var day = new Date();
		day.setTime(day.getTime()-24*60*60*1000);
		var yesterday = day.getFullYear()+"-" + (day.getMonth()+1) + "-" + day.getDate();
		//console.log(yesterday);
		return yesterday;
	}
	// 获取指定月份最后一天 (年-月-日) 参数date如：2018-08
	$.getCurrentMonthLast = function(date){
		var _this = this;
	    var endDate = new Date(date); //date 是需要传递的时间如：2018-08
	    var month=endDate.getMonth();
	    var nextMonth=++month;
	    var nextMonthFirstDay=new Date(endDate.getFullYear(),nextMonth,1);
	    var oneDay=1000*60*60*24;
	    var dateString=new Date(nextMonthFirstDay-oneDay);
	    //console.log(dateString) //Wed Oct 31 2018 00:00:00 GMT+0800 (中国标准时间)
	    return dateString.toLocaleDateString().replace(new RegExp('/','g'),"-"); //toLocaleDateString() 返回 如：2018/8/31										 
    }
	/**
	 * 获取本周一到本周日		 
	 * 返回格式为 yyyy-mm-dd的日期的数组，如：['2014-01-25']
	 */
	$.getDateCurrentweek = function(){
		var date = new Date();
		function formatDate(date) {
		    var myyear = date.getFullYear();
		    var mymonth = date.getMonth() + 1;
		    var myweekday = date.getDate();		 
		    if (mymonth < 10) {
		        mymonth = "0" + mymonth;
		    }
		    if (myweekday < 10) {
		        myweekday = "0" + myweekday;
		    }
		    return (myyear + "-" + mymonth + "-" + myweekday);
		} 		
		var date = new Date();
		var nowTime = date.getTime() ;
		var day = date.getDay();
		var oneDayTime = 24*60*60*1000 ;
		var MondayTime = nowTime - (day-1)*oneDayTime ;//显示周一
		var SundayTime =  nowTime + (7-day)*oneDayTime ;//显示周日
		var data = [formatDate(new Date(MondayTime)), formatDate(new Date(SundayTime))];		
		//console.log(formatDate(new Date(MondayTime)));
		//console.log(formatDate(new Date(SundayTime))) 
		return data;
	}
	/**
	 * 获取上周一到上周日		 
	 * 返回格式为 yyyy-mm-dd的日期的数组，如：['2014-01-25']
	 */
	$.getDateLastweek = function(){
		var date = new Date();
		function formatDate(date) {
		    var myyear = date.getFullYear();
		    var mymonth = date.getMonth() + 1;
		    var myweekday = date.getDate();		 
		    if (mymonth < 10) {
		        mymonth = "0" + mymonth;
		    }
		    if (myweekday < 10) {
		        myweekday = "0" + myweekday;
		    }
		    return (myyear + "-" + mymonth + "-" + myweekday);
		} 		
		var dateTime = date.getTime(); // 获取现在的时间
		var dateDay = date.getDay();
		var oneDayTime = 24 * 60 * 60 * 1000;
		var proWeekList = [];		 
		for(var i = 0; i < 7; i++){
			var time = dateTime - (dateDay + (7 - 1 - i)) * oneDayTime;
			proWeekList[i] = formatDate(new Date(time)); //date格式转换为yyyy-mm-dd格式的字符串
		}
		var data = [proWeekList[0], proWeekList[6]];
		//console.log(data);
		return data;
	}
	// 获取本月第一天和最后一天
	$.getCurrentMonth = function(){		
		/**
		 *对Date的扩展，将 Date 转化为指定格式的String
		 *月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
		 *年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
		 *例子：
		 *(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
		 *(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
		 */
		Date.prototype.format = function (fmt) {
			var o = {
				"M+": this.getMonth() + 1, //月份
				"d+": this.getDate(), //日
				"h+": this.getHours(), //小时
				"m+": this.getMinutes(), //分
				"s+": this.getSeconds(), //秒
				"q+": Math.floor((this.getMonth() + 3) / 3), //季度
				"S": this.getMilliseconds() //毫秒
			};
			if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
			for (var k in o)
				if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			return fmt;
		}
		var day = new Date();
		day.setDate(1);//本月第一天
		var currentMonthFirstDay = day.format("yyyy-MM-dd");
		day.setMonth(day.getMonth()+1);//下个月
		day.setDate(day.getDate() - 1);//下个月第一天减1得到本月最后一天
		var currentMonthLastDay = day.format("yyyy-MM-dd");	
		var data = [currentMonthFirstDay, currentMonthLastDay];
		//console.log(data);
		return data;
	}
	// 获取上月第一天和最后一天
	$.getLastMonth = function(){
		var nowdays = new Date(); 		 
		var year = nowdays.getFullYear();
		var month = nowdays.getMonth();
		if(month==0){
			month = 12;
			year = year-1;
		}
		if(month<10){
			month = '0'+month;
		}		
		var myDate = new Date(year,month,0);
		var startDate = year+'-'+month+'-01'; //上个月第一天
		var endDate = year+'-'+month+'-'+myDate.getDate();//上个月最后一天	
		var data = [startDate, endDate];
		//console.log(data);
		return data;
	}
	/***倒计时
		@param {number} nowtime 当前时间时间戳
		@param {number} endtime 结束时间时间戳
		@example: aui.countdown('时间戳');
	*/
	$.countdown = function(nowtime, endtime, callback){
		var _this = this;
		var timer = null;
		var times = parseInt((endtime - nowtime) / 1000);
		timer=setInterval(function(){
			var day=0, hour=0, minute=0, second=0;//时间默认值
			if(times > 0){
				day = Math.floor(times / (60 * 60 * 24));
				hour = Math.floor(times / (60 * 60)) - (day * 24);
				minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
				second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
			}
			if (day <= 9) day = '0' + day;
			if (hour <= 9) hour = '0' + hour;
			if (minute <= 9) minute = '0' + minute;
			if (second <= 9) second = '0' + second;
			//console.log(minute+"分钟："+second+"秒");
			// var new_time = day + '天' + hour + '小时' + minute + '分' + second + '秒';
			typeof callback == "function" ? callback({day: day, hour: hour, minute: minute, second: second}) : '';
			times--;
		},1000);
		if(times<=0){
			clearInterval(timer);
		}
	}
	/***时间戳转换成几分钟前，几小时前，几天前，xxxx(年)-xx(月)-xx(日) xx(时): xx(分): xx(秒)
	 	@param {string} timestamp 时间戳
	 	@example: aui.formatMsgTime('时间戳');
	*/
	$.formatMsgTime = function(timestamp) {
	    var dateTime = new Date(timestamp);
		var year = dateTime.getFullYear();
		var month = dateTime.getMonth() + 1;
		var day = dateTime.getDate();
		var hour = dateTime.getHours();
		var minute = dateTime.getMinutes();
		var second = dateTime.getSeconds();
		var now = new Date();
		var now_new = Date.parse(now.toDateString());  //typescript转换写法
		var milliseconds = 0;
		var timeSpanStr;
		milliseconds = now_new - timestamp;
		if (milliseconds <= 1000 * 60 * 1)
		{
		   timeSpanStr = '刚刚';
		}
		else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60)
		{
		   timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前';
		}
		else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24)
		{
		   timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
		}
		else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15)
		{
		   timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
		}
		else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year == now.getFullYear())
		{
		   timeSpanStr = month + '-' + day + ' ' + hour + ':' + minute;
		}
		else
		{
		   timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
		}
		return timeSpanStr;
	}
})(aui, document, window);