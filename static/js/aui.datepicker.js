/* 
 * 日期插件
 * 滑动选取日期（年，月，日）
 * V1.1
 */
 
function dateshow(){
	$("#datePlugin").animate({ opacity:1}, 300);
	$("#datePlugin").addClass("show");
}
function datehide(){
	$("#datePlugin").animate({ opacity:0}, 300);
	setTimeout(function(){$("#datePlugin").remove()},300);
}

(function ($) {      
    $.fn.date = function (options,Ycallback,Ncallback) {   
        //插件默认选项
        var that = $(this);
        var docType = $(this).is('input');
        var datetime = false;
        var nowdate = new Date();
        var indexY=1,indexM=1,indexD=1;
        var indexH=1,indexI=1,indexS=0;
        var initY=parseInt((nowdate.getFullYear()))-1900;
        var initM=parseInt(nowdate.getMonth()+"")+1;
        var initD=parseInt(nowdate.getDate()+"");
        var initH=parseInt(nowdate.getHours());
        var initI=parseInt(nowdate.getMinutes());
        var initS=parseInt(nowdate.getSeconds());
        var yearScroll=null,monthScroll=null,dayScroll=null;
        var HourScroll=null,MinuteScroll=null,SecondScroll=null;
        $.fn.date.defaultOptions = {
			title: '选择日期', 				//标题
            beginyear:1900,                 //日期--年--份开始
            endyear:nowdate.getFullYear()+50,                   //日期--年--份结束
            beginmonth:1,                   //日期--月--份结束
            endmonth:12,                    //日期--月--份结束
            beginday:1,                     //日期--日--份结束
            endday:31,                      //日期--日--份结束
            beginhour:0,
            endhour:23,
            beginminute:00,
            endminute:59,
            curdate:true,                   //打开日期是否定位到当前日期
            theme: 'datetime',                    //控件样式（1：日期，2：日期+时间）
			type: 0,  						//控制是否显示选择开始时间+选择结束时间按钮(0: 显示（默认） 1: 不显示)
            mode:null,                       //操作模式（滑动模式）
            event:"click",                    //打开日期插件默认方式为点击后后弹出日期 
            show:true,
            isChooseStart: true, //默认选择开始时间
            result: [], //结果
        }
        //用户选项覆盖插件默认选项   
        var opts = $.extend( true, {}, $.fn.date.defaultOptions, options );
        if(opts.theme === "datetime" || opts.theme === 2){datetime = true;}		
        if(!opts.show){
            that.unbind('click');
        }
        else{
            //绑定事件（默认事件为获取焦点）			
            document.querySelector(that.selector).onclick = function () {
                createUL();      //动态生成控件显示的日期
                init_iScrll();   //初始化iscrll
                extendOptions(); //显示控件
                that.blur();
                if(datetime){
                    showdatetime();
                    refreshTime();
                }
                refreshDate();
                bindButton();
				if(opts.type == 0){
					$("#datetype").show();
					$("#datemark").css({top: '180px'});
					$("#timemark").css({top: '330px'});
					$("#datetitle h1").css({lineHeight: '70px'});
				}
				else if(opts.type == 1){
					$("#datetype").hide();
					$("#datemark").css({top: '100px'});
					$("#timemark").css({top: '250px'});
					$("#datetitle h1").css({lineHeight: '60px'});
				}
            }
        };
        function refreshDate(){
            yearScroll.refresh();
            monthScroll.refresh();
            dayScroll.refresh();			
            resetInitDete();
            yearScroll.scrollTo(0, initY*50, 100, true);
            monthScroll.scrollTo(0, initM*50-50, 100, true);
            dayScroll.scrollTo(0, initD*50-50, 100, true);             
        }
        function refreshTime(){
            HourScroll.refresh();
            MinuteScroll.refresh();
            SecondScroll.refresh();            
			initH=initH;
            HourScroll.scrollTo(0, initH*40, 100, true);
            MinuteScroll.scrollTo(0, initI*40 - 0, 100, true);
			SecondScroll.scrollTo(0, initS*40 - 0, 100, true);
            initH=parseInt(nowdate.getHours());
        }
		function resetIndex(){			
            indexY=1;
            indexM=1;
            indexD=1;
        }
        function resetInitDete(){
            if(opts.curdate){return false;}
            else if(that.val()===""){return false;}
            initY = parseInt(that.val().substr(0,4))-opts.beginyear;
            initM = parseInt(that.val().substr(5,2));
            initD = parseInt(that.val().substr(8,2));
        }
        function bindButton(){
            resetIndex();
            $("#dateconfirm").unbind('click').click(function () {	
                var datestr = $("#yearwrapper ul li:eq("+indexY+")").html().substr(0,$("#yearwrapper ul li:eq("+indexY+")").html().length-1)+"-"+
                          $("#monthwrapper ul li:eq("+indexM+")").html().substr(0,$("#monthwrapper ul li:eq("+indexM+")").html().length-1)+"-"+
			  $("#daywrapper ul li:eq("+Math.round(indexD)+")").html().substr(0,$("#daywrapper ul li:eq("+Math.round(indexD)+")").html().length-1);
               if(datetime){                     
                    datestr+=" "+$("#Hourwrapper ul li:eq("+indexH+")").html().substr(0,$("#Minutewrapper ul li:eq("+indexH+")").html().length-1)+":"+
                             $("#Minutewrapper ul li:eq("+indexI+")").html().substr(0,$("#Minutewrapper ul li:eq("+indexI+")").html().length-1);
                         indexS=0;
                }

                if(Ycallback===undefined){
                     if(docType){that.val(datestr);}else{that.find("i").eq(0).html(datestr);}
                }else{
                	if(opts.result.length<=1){
                		opts.result[1] = $(".dateTab").eq(1).find(".start-time").text();
                	}
                    Ycallback(opts.result);
                }
				datehide();
            });
            var Y = parseInt((nowdate.getFullYear()));
            var M = (parseInt(nowdate.getMonth()+"")+1) < 10 ? '0' + (parseInt(nowdate.getMonth()+"")+1) : parseInt(nowdate.getMonth()+"")+1;
            var D= parseInt(nowdate.getDate()+"") < 10 ? '0' + parseInt(nowdate.getDate()+"") : parseInt(nowdate.getDate()+"");
			// var h= parseInt(nowdate.getHours()+"") < 10 ? '0' + parseInt(nowdate.getHours()+"") : parseInt(nowdate.getHours()+"") > 12 ? (parseInt(nowdate.getHours()+"") - 12 < 10 ? '0' + parseInt(nowdate.getHours()+"") - 12 : parseInt(nowdate.getHours()+"") - 12) : parseInt(nowdate.getHours()+"");
			if(parseInt(nowdate.getHours()+"") < 10){
				var h = '0' + parseInt(nowdate.getHours()+"");
			}
			else{
				// if(parseInt(nowdate.getHours()+"") > 12){
				// 	if(parseInt(nowdate.getHours()+"") - 12 < 10){
				// 		var h = '0' + (parseInt(nowdate.getHours()+"") - 12);
				// 	}
				// 	else{
				// 		var h = parseInt(nowdate.getHours()+"") - 12;
				// 	}
				// }
				// else{
					var h = parseInt(nowdate.getHours()+"");
				// }
			}
			var m= parseInt(nowdate.getMinutes()+"") < 10 ? '0' + parseInt(nowdate.getMinutes()+"") : parseInt(nowdate.getMinutes()+"");
			var s= parseInt(nowdate.getSeconds()+"") < 10 ? '0' + parseInt(nowdate.getSeconds()+"") : parseInt(nowdate.getSeconds()+"");
			if(datetime){
				$(".dateTab").change().find(".start-time").text(Y + '-' + M + '-' + D + '  ' + h + ':' + m + ':' + s);				
			}
			else{
				$(".dateTab").change().find(".start-time").text(Y + '-' + M + '-' + D);
			}
            $("#datecancle").click(function () {
				datehide();
				//$("#datePlugin").hide();
                typeof Ncallback == 'function' ? Ncallback() : '';
            });
            $(".dateTab").click(function () {
				if(Number($(this).attr("index")) == 0){
					opts['isChooseStart'] = true;
				}
				else{
					opts['isChooseStart'] = false;
				}
				$("#datetype .dateTab").change().removeClass("active");
				$("#datetype .dateTab").eq(Number($(this).attr("index"))).addClass("active");
            });
        }		
        function extendOptions(){
			dateshow();
            //$("#dateshadow").show();
        }
        //日期滑动
        function init_iScrll() {
			var strY=0;   
			var strM=0;    
              yearScroll = new iScroll("yearwrapper",{snap:"li",vScrollbar:false,
                  onScrollEnd:function () {
                       indexY = (this.y/50)*(-1)+1;
					   strY = $("#yearwrapper ul li:eq("+indexY+")").html().substr(0,$("#yearwrapper ul li:eq("+indexY+")").html().length-1);
            		   strM = $("#monthwrapper ul li:eq("+indexM+")").html().substr(0,$("#monthwrapper ul li:eq("+indexM+")").html().length-1)
                       opts.endday = checkdays(strY,strM);
                          $("#daywrapper ul").html(createDAY_UL());
                           dayScroll.refresh();                           
                            $("#monthwrapper").find("li").eq(crentMonthindex).addClass("crently").siblings().removeClass("crently"); 
                            $("#daywrapper").find("li").eq(crentDayindex).addClass("crently").siblings().removeClass("crently"); 
                            if(opts.isChooseStart){
								if(datetime){
									opts['result'][0] = $("#yearwrapper .crently").text().substr(0,4) + '-' + $("#monthwrapper .crently").text().substr(0,2) + '-' + $("#daywrapper .crently").text().substr(0,2) + '  ' + $("#Hourwrapper .crently").text().substr(0,2) + ':' + $("#Minutewrapper .crently").text().substr(0,2) + ':' + $("#Secondwrapper .crently").text().substr(0,2);									
								}
								else{
									opts['result'][0] = $("#yearwrapper .crently").text().substr(0,4) + '-' + $("#monthwrapper .crently").text().substr(0,2) + '-' + $("#daywrapper .crently").text().substr(0,2);									
								}
                            	$(".dateTab.active span:nth-child(2)").text(opts['result'][0]);
                            }
                            else{
                            	if(datetime){
                            		opts['result'][1] = $("#yearwrapper .crently").text().substr(0,4) + '-' + $("#monthwrapper .crently").text().substr(0,2) + '-' + $("#daywrapper .crently").text().substr(0,2) + '  ' + $("#Hourwrapper .crently").text().substr(0,2) + ':' + $("#Minutewrapper .crently").text().substr(0,2) + ':' + $("#Secondwrapper .crently").text().substr(0,2);									
                            	}
                            	else{
                            		opts['result'][1] = $("#yearwrapper .crently").text().substr(0,4) + '-' + $("#monthwrapper .crently").text().substr(0,2) + '-' + $("#daywrapper .crently").text().substr(0,2);									
                            	}
                            	$(".dateTab.active span:nth-child(2)").text(opts['result'][1]);
                            }
                  }});
              monthScroll = new iScroll("monthwrapper",{snap:"li",vScrollbar:false,
                  onScrollEnd:function (){					 
                      indexM = (this.y/50)*(-1)+1;
					  strY = $("#yearwrapper ul li:eq("+indexY+")").html().substr(0,$("#yearwrapper ul li:eq("+indexY+")").html().length-1);
            		  strM = $("#monthwrapper ul li:eq("+indexM+")").html().substr(0,$("#monthwrapper ul li:eq("+indexM+")").html().length-1);
                      opts.endday = checkdays(strY,strM);
                          $("#daywrapper ul").html(createDAY_UL());
                           dayScroll.refresh();
                           $("#daywrapper").find("li").eq(crentDayindex).addClass("crently").siblings().removeClass("crently"); 
                           if(opts.isChooseStart){
                           	if(datetime){
                           		opts['result'][0] = $("#yearwrapper .crently").text().substr(0,4) + '-' + $("#monthwrapper .crently").text().substr(0,2) + '-' + $("#daywrapper .crently").text().substr(0,2) + '  ' + $("#Hourwrapper .crently").text().substr(0,2) + ':' + $("#Minutewrapper .crently").text().substr(0,2) + ':' + $("#Secondwrapper .crently").text().substr(0,2);									
                           	}
                           	else{
                           		opts['result'][0] = $("#yearwrapper .crently").text().substr(0,4) + '-' + $("#monthwrapper .crently").text().substr(0,2) + '-' + $("#daywrapper .crently").text().substr(0,2);									
                           	}
                           	$(".dateTab.active span:nth-child(2)").text(opts['result'][0]);
                           }
                           else{
                           	if(datetime){
                           		opts['result'][1] = $("#yearwrapper .crently").text().substr(0,4) + '-' + $("#monthwrapper .crently").text().substr(0,2) + '-' + $("#daywrapper .crently").text().substr(0,2) + '  ' + $("#Hourwrapper .crently").text().substr(0,2) + ':' + $("#Minutewrapper .crently").text().substr(0,2) + ':' + $("#Secondwrapper .crently").text().substr(0,2);									
                           	}
                           	else{
                           		opts['result'][1] = $("#yearwrapper .crently").text().substr(0,4) + '-' + $("#monthwrapper .crently").text().substr(0,2) + '-' + $("#daywrapper .crently").text().substr(0,2);									
                           	}
                           	$(".dateTab.active span:nth-child(2)").text(opts['result'][1]);
                           }
                  }});
              dayScroll = new iScroll("daywrapper",{snap:"li",vScrollbar:false,
                  onScrollEnd:function () {
                      indexD = (this.y/50)*(-1)+1;
                      if(opts.isChooseStart){
                      	if(datetime){
                      		opts['result'][0] = $("#yearwrapper .crently").text().substr(0,4) + '-' + $("#monthwrapper .crently").text().substr(0,2) + '-' + $("#daywrapper .crently").text().substr(0,2) + '  ' + $("#Hourwrapper .crently").text().substr(0,2) + ':' + $("#Minutewrapper .crently").text().substr(0,2) + ':' + $("#Secondwrapper .crently").text().substr(0,2);									
                      	}
                      	else{
                      		opts['result'][0] = $("#yearwrapper .crently").text().substr(0,4) + '-' + $("#monthwrapper .crently").text().substr(0,2) + '-' + $("#daywrapper .crently").text().substr(0,2);									
                      	}
                      	$(".dateTab.active span:nth-child(2)").text(opts['result'][0]);
                      }
                      else{
                      	if(datetime){
                      		opts['result'][1] = $("#yearwrapper .crently").text().substr(0,4) + '-' + $("#monthwrapper .crently").text().substr(0,2) + '-' + $("#daywrapper .crently").text().substr(0,2) + '  ' + $("#Hourwrapper .crently").text().substr(0,2) + ':' + $("#Minutewrapper .crently").text().substr(0,2) + ':' + $("#Secondwrapper .crently").text().substr(0,2);									
                      	}
                      	else{
                      		opts['result'][1] = $("#yearwrapper .crently").text().substr(0,4) + '-' + $("#monthwrapper .crently").text().substr(0,2) + '-' + $("#daywrapper .crently").text().substr(0,2);									
                      	}
                      	$(".dateTab.active span:nth-child(2)").text(opts['result'][1]);
                      }
                  }});                           
        }
        function showdatetime(){
            init_iScroll_datetime();
            addTimeStyle();
			// console.log(opts.theme);
			// console.log(datetime);
            $("#datescroll_datetime").show(); 
			$("#timemark").show();
            $("#Hourwrapper ul").html(createHOURS_UL());
            $("#Minutewrapper ul").html(createMINUTE_UL());
            $("#Secondwrapper ul").html(createSECOND_UL());
        }

        //日期+时间滑动
        function init_iScroll_datetime(){
            HourScroll = new iScroll("Hourwrapper",{snap:"li",vScrollbar:false,
                onScrollEnd:function () {
                    indexH = Math.round((this.y/50)*(-1))+1;					
					$("#Hourwrapper").find("li").eq(crentHourindex).addClass("crently").siblings().removeClass("crently"); 
                    HourScroll.refresh();
					if(opts.isChooseStart){
						if(datetime){
							opts['result'][0] = $("#yearwrapper .crently").text().substr(0,4) + '-' + $("#monthwrapper .crently").text().substr(0,2) + '-' + $("#daywrapper .crently").text().substr(0,2) + '  ' + $("#Hourwrapper .crently").text().substr(0,2) + ':' + $("#Minutewrapper .crently").text().substr(0,2) + ':' + $("#Secondwrapper .crently").text().substr(0,2);									
						}
						else{
							opts['result'][0] = $("#yearwrapper .crently").text().substr(0,4) + '-' + $("#monthwrapper .crently").text().substr(0,2) + '-' + $("#daywrapper .crently").text().substr(0,2);									
						}
						$(".dateTab.active span:nth-child(2)").text(opts['result'][0]);
					}
					else{
						if(datetime){
							opts['result'][1] = $("#yearwrapper .crently").text().substr(0,4) + '-' + $("#monthwrapper .crently").text().substr(0,2) + '-' + $("#daywrapper .crently").text().substr(0,2) + '  ' + $("#Hourwrapper .crently").text().substr(0,2) + ':' + $("#Minutewrapper .crently").text().substr(0,2) + ':' + $("#Secondwrapper .crently").text().substr(0,2);									
						}
						else{
							opts['result'][1] = $("#yearwrapper .crently").text().substr(0,4) + '-' + $("#monthwrapper .crently").text().substr(0,2) + '-' + $("#daywrapper .crently").text().substr(0,2);									
						}
						$(".dateTab.active span:nth-child(2)").text(opts['result'][1]);
					}
            }})
            MinuteScroll = new iScroll("Minutewrapper",{snap:"li",vScrollbar:false,
                onScrollEnd:function () {
                    indexI = Math.round((this.y/50)*(-1))+1;
					$("#Minutewrapper").find("li").eq(crentMinuteindex).addClass("crently").siblings().removeClass("crently");
                    HourScroll.refresh();
					if(opts.isChooseStart){
						if(datetime){
							opts['result'][0] = $("#yearwrapper .crently").text().substr(0,4) + '-' + $("#monthwrapper .crently").text().substr(0,2) + '-' + $("#daywrapper .crently").text().substr(0,2) + '  ' + $("#Hourwrapper .crently").text().substr(0,2) + ':' + $("#Minutewrapper .crently").text().substr(0,2) + ':' + $("#Secondwrapper .crently").text().substr(0,2);									
						}
						else{
							opts['result'][0] = $("#yearwrapper .crently").text().substr(0,4) + '-' + $("#monthwrapper .crently").text().substr(0,2) + '-' + $("#daywrapper .crently").text().substr(0,2);									
						}
						$(".dateTab.active span:nth-child(2)").text(opts['result'][0]);
					}
					else{
						if(datetime){
							opts['result'][1] = $("#yearwrapper .crently").text().substr(0,4) + '-' + $("#monthwrapper .crently").text().substr(0,2) + '-' + $("#daywrapper .crently").text().substr(0,2) + '  ' + $("#Hourwrapper .crently").text().substr(0,2) + ':' + $("#Minutewrapper .crently").text().substr(0,2) + ':' + $("#Secondwrapper .crently").text().substr(0,2);									
						}
						else{
							opts['result'][1] = $("#yearwrapper .crently").text().substr(0,4) + '-' + $("#monthwrapper .crently").text().substr(0,2) + '-' + $("#daywrapper .crently").text().substr(0,2);									
						}
						$(".dateTab.active span:nth-child(2)").text(opts['result'][1]);
					}
            }})
            SecondScroll = new iScroll("Secondwrapper",{snap:"li",vScrollbar:false,
                onScrollEnd:function () {
                    indexS = Math.round((this.y/50)*(-1));
                    $("#Secondwrapper").find("li").eq(crentSecondindex).addClass("crently").siblings().removeClass("crently");
                    HourScroll.refresh();
                    if(opts.isChooseStart){
                    	if(datetime){
                    		opts['result'][0] = $("#yearwrapper .crently").text().substr(0,4) + '-' + $("#monthwrapper .crently").text().substr(0,2) + '-' + $("#daywrapper .crently").text().substr(0,2) + '  ' + $("#Hourwrapper .crently").text().substr(0,2) + ':' + $("#Minutewrapper .crently").text().substr(0,2) + ':' + $("#Secondwrapper .crently").text().substr(0,2);									
                    	}
                    	else{
                    		opts['result'][0] = $("#yearwrapper .crently").text().substr(0,4) + '-' + $("#monthwrapper .crently").text().substr(0,2) + '-' + $("#daywrapper .crently").text().substr(0,2);									
                    	}
                    	$(".dateTab.active span:nth-child(2)").text(opts['result'][0]);
                    }
                    else{
                    	if(datetime){
                    		opts['result'][1] = $("#yearwrapper .crently").text().substr(0,4) + '-' + $("#monthwrapper .crently").text().substr(0,2) + '-' + $("#daywrapper .crently").text().substr(0,2) + '  ' + $("#Hourwrapper .crently").text().substr(0,2) + ':' + $("#Minutewrapper .crently").text().substr(0,2) + ':' + $("#Secondwrapper .crently").text().substr(0,2);									
                    	}
                    	else{
                    		opts['result'][1] = $("#yearwrapper .crently").text().substr(0,4) + '-' + $("#monthwrapper .crently").text().substr(0,2) + '-' + $("#daywrapper .crently").text().substr(0,2);									
                    	}
                    	$(".dateTab.active span:nth-child(2)").text(opts['result'][1]);
                    }
            }})
        } 
        function checkdays (year,month){
            var new_year = year;    //取当前的年份        
            var new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定）        
            if(month>12)            //如果当前大于12月，则年份转到下一年        
            {        
                new_month -=12;        //月份减        
                new_year++;            //年份增        
            }        
			
            var new_date = new Date(new_year,new_month,1);                //取当年当月中的第一天  			
            return (new Date(new_date.getTime()-1000*60*60*24)).getDate();//获取当月最后一天日期    
        }
        function  createUL(){
            CreateDateUI();
            $("#yearwrapper ul").html(createYEAR_UL());
            $("#monthwrapper ul").html(createMONTH_UL());
        }
        var str = '';
        function CreateDateUI(){
            str = ''+
                '<div id="datePlugin">'+
	                '<div id="datePage" class="page">'+
	                    '<section>'+
	                        '<div id="datetitle"><h1>'+ opts.title +'</h1></div>'+
	                        '<div id="datetype">'+
	                        	'<div class="dateTab active" index="0"><span>开始时间</span><span class="start-time"></span></div>'+
	                        	'<div class="dateTab" index="1"><span>结束时间</span><span class="start-time"></span></div>'+
	                        '</div>'+
	                        '<div id="datemark"><a id="markyear"></a><a id="markmonth"></a><a id="markday"></a></div>'+
	                        '<div id="timemark"><a id="markhour"></a><a id="markminut"></a><a id="marksecond"></a></div>'+
	                        '<div id="datescroll">'+
	                            '<div id="yearwrapper" class="col-after">'+
	                                '<ul></ul>'+
	                            '</div>'+
	                            '<div id="monthwrapper" class="col-after">'+
	                                '<ul></ul>'+
	                            '</div>'+
	                            '<div id="daywrapper">'+
	                                '<ul></ul>'+
	                            '</div>'+
	                        '</div>'+
	                        '<div id="datescroll_datetime">'+
	                            '<div id="Hourwrapper" class="col-after">'+
	                                '<ul></ul>'+
	                            '</div>'+
	                            '<div id="Minutewrapper" class="col-after">'+
	                                '<ul></ul>'+
	                            '</div>'+
	                            '<div id="Secondwrapper">'+
	                                '<ul></ul>'+
	                            '</div>'+
	                        '</div>'+
	                    '</section>'+
	                    '<footer id="dateFooter">'+
	                        '<div id="setcancle">'+
	                            '<ul>'+
	                                '<li id="dateconfirm">确定</li>'+
	                                '<li id="datecancle"><img src="https://xbjz1.oss-cn-beijing.aliyuncs.com/upload/default/gz-close.png" /></li>'+
	                            '</ul>'+
	                        '</div>'+
	                    '</footer>'+
	                '</div>'+
	            '</div>';
	            if($("#datePlugin").length <=0){
	            	$("body").append(str);
	            	
	            }
             document.querySelector("#datePlugin").addEventListener("touchmove", function(e){
	            e.preventDefault();
	       	},{ passive: false });
			dateshow();
        }
        function addTimeStyle(){
            $("#datePage").css("height","380px");
            $("#datePage").css("right","0");
            $("#yearwrapper").css("position","absolute");
            $("#yearwrapper").css("bottom","200px");
            $("#monthwrapper").css("position","absolute");
            $("#monthwrapper").css("bottom","200px");
            $("#daywrapper").css("position","absolute");
            $("#daywrapper").css("bottom","200px");
        }
        //创建 --年-- 列表
        function createYEAR_UL(){
            var str="<li>&nbsp;</li>";
            for(var i=opts.beginyear; i<=opts.endyear;i++){
                str+='<li>'+i+'年</li>'
            }
            return str+"<li>&nbsp;</li>";;
        }
        //创建 --月-- 列表
        function createMONTH_UL(){
            var str="<li>&nbsp;</li>";
            for(var i=opts.beginmonth;i<=opts.endmonth;i++){
                if(i<10){
                    i="0"+i
                }
                str+='<li>'+i+'月</li>'
            }
            return str+"<li>&nbsp;</li>";;
        }
        //创建 --日-- 列表
        function createDAY_UL(){
              $("#daywrapper ul").html("");
            var str="<li>&nbsp;</li>";
                for(var i=opts.beginday;i<=opts.endday;i++){
                	if(i<10){
                    i="0"+i
                }
                str+='<li>'+i+'日</li>'
            }
            return str+"<li>&nbsp;</li>";;                     
        }
        //创建 --时-- 列表
        function createHOURS_UL(){
            var str="<li>&nbsp;</li>";
            for(var i=opts.beginhour;i<=opts.endhour;i++){
            	if(i<10){
                    i="0"+i
                }
                str+='<li>'+i+'时</li>'
            }
            return str+"<li>&nbsp;</li>";;
        }
        //创建 --分-- 列表
        function createMINUTE_UL(){
            var str="<li>&nbsp;</li>";
            for(var i=opts.beginminute;i<=opts.endminute;i++){
                if(i<10){
                    i="0"+i
                }
                str+='<li>'+i+'分</li>'
            }
            return str+"<li>&nbsp;</li>";;
        }
        //创建 --分-- 列表
        function createSECOND_UL(){
            var str="<li>&nbsp;</li>";
            for(var i=opts.beginminute;i<=opts.endminute;i++){
                if(i<10){
                    i="0"+i
                }
                str+='<li>'+i+'秒</li>'
            }
            return str+"<li>&nbsp;</li>";;
        }
    }
})(jQuery);  