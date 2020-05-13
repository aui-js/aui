# aui
移动端UI框架
aui.showload({
  msg: "加载中",
  direction: "row",				
},function(ret){
  setTimeout(function(){
    aui.hideload();
  },3000);
});
