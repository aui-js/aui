# aui

## 简介

> aui 是一套基于原生javascript开发的移动端UI组件库，包含常用js方法、字符校验、dialog提示弹窗、数字键盘、侧滑菜单、时间选择器、多级联动、聊天UI、项目常用模板......

## 特点

> 1、标准化，产品化</br>
> 2、更多复用，更快效率</br>
> 3、多人协作，更加统一</br>
> 4、维护方便</br>
> 5、易于使用</br>
> 6、减少UI设计时间

## 引用

````html
<link rel="stylesheet" type="text/css" href="https://aui-js.github.io/aui/static/css/aui.min.css"/>
<script type="text/javascript" src="https://aui-js.github.io/aui/static/js/aui.min.js"></script>
````

## 演示
[查看演示](https://aui-js.github.io/aui/index.html) </br>

## 组件

#### `loading加载动画`

[预览](https://aui-js.github.io/aui/pages/api/plugs/loading.html) </br>

参数  |  类型  |  描述  | 默认值 | 必选
---- | ----- | ------ | ----- | ----
warp  | string | 父容器元素 | 'body' | 否
type  | number | 1: 常用风格;</br> 2: 点击按钮后在按钮内显示加载动画;</br> 3: 四个方块旋转;</br> 4: 圆点放大缩小动画(全屏首次加载过度动画); </br>5: 圆点背景过度动画-微信小程序效果(全屏首次加载过度动画) | 1 | 否
msg  | string | 提示内容 | '' | 否
mask  | boolean | 是否显示遮罩蒙版 | true | 否
direction  | string | 横向("row")或纵向("col")控制 | 'col' | 否
theme  | number | type=3时，控制全屏或小窗展示（1：小窗; 2：全屏） | 1 | 否
style  | object | {</br>    bg: '背景',</br>  color: '文字颜色', </br>    maskBg: '遮罩层颜色', </br>  zIndex: '层级'</br>} | '' | 否

> 显示loading加载：
```javascript
aui.showload({
    msg: "加载中"
});
```
> 隐藏loading加载：
```javascript
aui.hideload();
```

#### `toast消息提示弹窗`

[预览](https://aui-js.github.io/aui/pages/api/plugs/toast.html) </br>

参数  |  类型  |  描述  | 默认值 | 必选
---- | ----- | ------ | ----- | ----
warp  | string | 父容器元素 | 'body' | 否
msg  | string | 提示内容 | '' | 是
icon  | string | 图标 | '' | 否
direction  | string | 横向("row")或纵向("col")控制 | 'col' | 否
location  | string | （icon参数未配置时可配置）位置	</br>bottom:位于底部，从底部弹出显示</br>middle:位于页面中心位置 | 'bottom' | 否
duration  | number | 显示时间 | 2000 | 否

> 示例：
````javascript
aui.toast({
    icon: "../../img/success.png",
    msg: "支付成功！",
    direction: "col"
},function(ret){

});
````
#### `dialog提示窗`

[预览](https://aui-js.github.io/aui/pages/api/plugs/dialog.html) </br>

参数  |  类型  |  描述  | 默认值 | 必选
---- | ----- | ------ | ----- | ----
warp  | string | 父容器元素 | 'body' | 否
title | string | 标题 | '' | 否
msg  | string | 提示内容 | '' | 是
btns  | arr | 按钮，默认按钮为“确定” 分别可设置btns值为</br>1：['按钮1', '按钮2']</br>2：[{name: '按钮1', color: ''},{name: '按钮2', color: ''}] | ["确定"] | 否
mask  | boolean | 是否显示遮罩蒙版 | true | 否
touchClose  | boolean | 触摸遮罩是否关闭模态弹窗 | true | 否
theme  | number | 主题样式，控制模态弹窗按钮显示风格(1: 大按钮; 2: 小按钮-居右分布; 3: 按钮宽度等于父级宽度100%，适用于按钮文字过多情况) | 'col' | 否
items  | arr | prompt--input框列表配置</br>[{label: '姓名：', type: 'text', value: '(可选)', placeholder: '请输入姓名'}] | [] | 否
duration  | number | 显示时间 | 2000 | 否
style  | object | {</br>    w: '', //--可选参数，模态窗宽度，默认80%</br>    h: '', //--可选参数，模态窗高度，默认"auto"自适应</br>  bg: '',//--可选参数，模态窗背景色，默认白色</br>    zIndex: '', //--可选参数，模态窗层级</br> title: {</br>   bg: "",</br>    color: "",</br> lineHeight: "",</br>    textAlign: "",</br> fontSize: "",</br>  padding: ""</br>}} | '' | 否

> 1、alert单按钮提醒弹窗
````javascript
aui.alert({
    title: "提示", //可选
    msg: "您点击了alert单按钮模态弹窗！",
    mask: true,
    touchClose: true, //可选
    btns: ["确定"], //可选
    //或btns: [{name: '按钮1', color: '#f00'},{name: '按钮2', color: '#00f'}], //可选
    theme: 1, //可选
    style: { //可选
        w: "75%",
        h: "auto",
        bg: '#FFF',
        zIndex: 999,
        animate: "aui-scale-in-tosmall-dialog",
        title: {
            bg: "#FFF",
            color: "#333",
            lineHeight:"55px",
            fontSize: "17px",
            textAlign: "center",
            padding: "0px"
        }
    }
},function(ret){
    console.log(ret.index);
    if(ret.index == 0){
        aui.toast({msg: "您点击了确定"});
    }
});
````
> 2、confirm双按钮提醒弹窗 
````javascript
aui.confirm({
    msg: "您点击了confirm双按钮模态弹窗！",
    btns: ["取消", "确定"],
},function(ret){
    console.log(ret.index);	
    if(ret.index == 1){
        aui.toast({msg: "您点击了确定"});
    }
});
````
> 3、delete删除提醒弹窗
````javascript
aui.delete({
    msg: "您点击了delete删除模态弹窗！",
    btns: ["取消", "删除"],
},function(ret){
    console.log(ret.index);	
    if(ret.index == 1){
        aui.toast({msg: "您点击了删除"});
    }
});
````
> 4、prompt输入弹窗
````javascript
aui.prompt({
    items: [{
        label: '姓名：', 
        type: 'text', 
        value: '', 
        placeholder: '请输入姓名'
    },{
        label: '年龄：', 
        type: 'number', 
        value: '', 
        placeholder: '请输入年龄'
    }],
    btns: ["取消", "确定"],
},function(ret){
    console.log(ret.data);	
    if(ret.index == 1)
    {
        aui.alert({
            title: "输入结果：",
            msg: "<div style='text-align: left;'>姓名：" + ret.data[0] + "</br>年龄：" + ret.data[1]+"</div>",
            btns: ["确定"],
        }, function(ret){
            if(ret.index == 0){
                aui.toast({msg: "您点击了确定"});
            }
        });
    }
});
````
> 5、confirm带图标双按钮提醒弹窗
````javascript
aui.confirm({
    msg: "<div style='text-align: center;'>"
        +"<img src='../../img/success-green.png' style='width: 60px; margin: 0 auto;'>"
        +"<p style='width: 100%; line-height: 25px; color: 15px;'>带图标模态弹窗</p>"
    +"</div>",
    btns: ["取消", "确定"],
},function(ret){
    console.log(ret.index);	
    if(ret.index == 1){
        aui.toast({msg: "您点击了确定"});
    }
});
````
> 6、多按钮弹窗
````javascript
aui.confirm({
    msg: "您点击了多按钮弹窗！",
    btns: [{name: '残忍拒绝', color: ''},{name: '再逛逛', color: ''}, {name: "返回首页", color: "#909090"}], //可选
    theme: 3, //可选
},function(ret){
    console.log(ret.index);	
    if(ret.index == 0){
        aui.toast({msg: "您点击了残忍拒绝"});
    }
    else if(ret.index == 1){
        aui.toast({msg: "您点击了再逛逛"});
    }
    else if(ret.index == 2){
        aui.toast({msg: "您点击了返回首页"});
    }
});
````

#### `actionsheet操作表`

[预览](https://aui-js.github.io/aui/pages/api/plugs/actionsheet.html) </br>

参数  |  类型  |  描述  | 默认值 | 必选
---- | ----- | ------ | ----- | ----
warp  | string | 父容器元素 | 'body' | 否
items  | arr | 菜单列表[{name: "", color: "", fontSize: "", textAlign: ""}] | [] | 否
mask  | boolean | 是否显示遮罩蒙版 | true | 否
touchClose  | boolean | 触摸遮罩是否关闭模态弹窗 | true | 否
cancle | string | 取消按钮 | '' | 否
location | string | 位置	</br>bottom:位于底部，从底部弹出显示</br>middle:位于页面中心位置 | 'bottom' | 否
theme | number | 主题样式(1: 非全屏宽度； 2: 全屏宽度) | 1 | 否

> 示例:
````javascript
aui.actionSheet({
    title: '上传图片',
    mask: true,
    touchClose: true,
    items: [{
        name: "从相册选择",
    },{
        name: "拍照"
    }],
    cancle: "取消",
    theme: 1,
    location: "bottom"
},function(ret){
    console.log(ret.index);				
});
````
#### `actionmenu分享弹窗`

[预览](https://aui-js.github.io/aui/pages/api/plugs/actionmenu.html) </br>

参数  |  类型  |  描述  | 默认值 | 必选
---- | ----- | ------ | ----- | ----
warp  | string | 父容器元素 | 'body' | 否
items  | arr | 菜单列表[{name: "", icon: "", iconColor: "", img: ""}] | [] | 否
mask  | boolean | 是否显示遮罩蒙版 | true | 否
touchClose  | boolean | 触摸遮罩是否关闭模态弹窗 | true | 否
cancle | string | 取消按钮 | '' | 否
location | string | 位置	</br>bottom:位于底部，从底部弹出显示</br>middle:位于页面中心位置 | 'bottom' | 否
theme | number | 主题样式(1: 非全屏宽度； 2: 全屏宽度) | 1 | 否

````html
<link rel="stylesheet" type="text/css" href="https://aui-js.github.io/aui/static/css/aui.min.css"/>
<link rel="stylesheet" type="text/css" href="https://aui-js.github.io/aui/static/css/aui.actionmenu.css"/>
<script type="text/javascript" src="https://aui-js.github.io/aui/static/js/aui.min.js"></script>
<script type="text/javascript" src="https://aui-js.github.io/aui/static/js/aui.actionmenu.js"></script>
````
> 示例：   
````javascript
aui.actionMenu({
    title: '分享至',
    mask: true,
    touchClose: true,
    items: [
        {name: "微信", img: "../../img/weixin.png"},
        {name: "朋友圈", img: "../../img/pengyouquan.png"},
        {name: "QQ", img: "../../img/QQ.png"},
        {name: "微博", img: "../../img/weibo.png"}
    ],
    cancle: "取消",
    theme: 1,
    location: "bottom"
},function(ret){
    console.log(ret.index);				
});
````

#### `popover菜单`

[预览](https://aui-js.github.io/aui/pages/api/plugs/popover.html) </br>

参数  |  类型  |  描述  | 默认值 | 必选
---- | ----- | ------ | ----- | ----
warp  | string | 父容器元素 | 'body' | 否
items  | arr | 菜单列表[{name: "", color: "", icon: "iconfont icongfont-right", iconColor: '', img: "", fontSize: "", textAlign: ""}] | [] | 否
mask  | boolean | 是否显示遮罩蒙版 | false | 否
touchClose  | boolean | 触摸遮罩是否关闭模态弹窗 | true | 否
location | string | 位置	</br>top: 设置弹窗显示到触发元素“上”方;</br> bottom: 设置弹窗显示到触发元素“下”方; | 'top' | 否

````html
<link rel="stylesheet" type="text/css" href="https://aui-js.github.io/aui/static/css/aui.min.css"/>
<link rel="stylesheet" type="text/css" href="https://aui-js.github.io/aui/static/css/aui.popover.css"/>
<script type="text/javascript" src="https://aui-js.github.io/aui/static/js/aui.min.js"></script>
<script type="text/javascript" src="https://aui-js.github.io/aui/static/js/aui.popover.js"></script>
````
> 示例：   
````javascript
aui.popover.open({
    warp: '.aui-header-right',
    items: [
        {name: '微信', img: '../../img/weixin.png'},
        {name: '朋友圈', img: '../../img/pengyouquan.png'},
        {name: 'QQ', img: '../../img/QQ.png'},
        {name: '微博', img: '../../img/weibo.png'}
    ],
    mask: true,
    location: 'bottom'
},function(ret){
    console.log(ret);
    aui.toast({msg: ret.el.querySelector("span").innerHTML});
})	
````

#### `picker多级联动`

[预览](https://aui-js.github.io/aui/pages/api/plugs/picker.html) </br> 

参数  |  类型  |  描述  | 默认值 | 必选
---- | ----- | ------ | ----- | ----
warp  | string | 父容器元素 | 'body' | 否
title | string | 标题 | '' | 否
layer | number | 控制几级联动 | 1 | 否
data | arr | 数据 如：[{text: '', adcode: '', children: [{text: '', adcode: ''}]}] | [] | 否

````html
<link rel="stylesheet" type="text/css" href="https://aui-js.github.io/aui/static/css/aui.min.css"/>
<link rel="stylesheet" type="text/css" href="https://aui-js.github.io/aui/static/css/aui.picker.css"/>
<script type="text/javascript" src="https://aui-js.github.io/aui/static/js/aui.min.js"></script>
<script type="text/javascript" src="https://aui-js.github.io/aui/static/js/aui.picker.js"></script>
````
> 示例：   
````javascript
aui.picker.open({
    title: '选择区域',
    layer: 3,
    data: cityData, //城市数据
    select: function(ret){
        console.log(ret);
    }
},function(ret){
    console.log(ret);
    if(ret.status == 1){
        aui.picker.close(function(){
            aui.alert({msg: ret.data.text + " " + ret.data.children.text + ' ' + ret.data.children.children.text});						
        });						
    }
})
````

#### `poster广告弹窗`

[预览](https://aui-js.github.io/aui/pages/api/plugs/poster.html) </br> 

参数  |  类型  |  描述  | 默认值 | 必选
---- | ----- | ------ | ----- | ----
warp  | string | 父容器元素 | 'body' | 否
mask  | boolean | 是否显示遮罩蒙版 | true | 否
touchClose  | boolean | 触摸遮罩是否关闭模态弹窗 | true | 否
image | string | 广告图片地址 | '' | 是

````html
<link rel="stylesheet" type="text/css" href="https://aui-js.github.io/aui/static/css/aui.min.css"/>
<link rel="stylesheet" type="text/css" href="https://aui-js.github.io/aui/static/css/aui.poster.css"/>
<script type="text/javascript" src="https://aui-js.github.io/aui/static/js/aui.min.js"></script>
<script type="text/javascript" src="https://aui-js.github.io/aui/static/js/aui.poster.js"></script>
````
> 示例：   
````javascript
aui.poster({
    image: 'https://xbjz1.oss-cn-beijing.aliyuncs.com/upload/default/share.png'
});
````

#### `sidemenu侧滑菜单`

[预览](https://aui-js.github.io/aui/template/sidemenu/index.html) </br> 

参数  |  类型  |  描述  | 默认值 | 必选
---- | ----- | ------ | ----- | ----
warp  | string | 父容器元素 | 'body' | 否
content | string | 侧滑菜单元素 | '' | 是
moves | arr | 跟随拖动元素；</br>[header——页面头部, .content——页面内容部分] (moveType设置为"all-move" 或 "menu-move"时，此参数必须配置 | [] | 是
moveType | string | ['main-move': '主页面移动，侧滑菜单固定'] </br> ['menu-move': '侧滑菜单移动，主页面固定'] </br> ['all-move': '主页面+侧滑菜单都移动'] | 'main-move' | 否
position | string | 侧滑菜单初始化位置，默认位于页面左侧 [left: '左侧', right: '右侧'] | 'left' | 否
mask  | boolean | 是否显示遮罩蒙版 | true | 否
maskTapClose  | boolean | 触摸遮罩是否关闭侧滑菜单 | true | 否
speed | number | 打开、关闭页面速度[值越大，速度越快] | 10 | 否
drag | object | {</br> use: true, //--可选参数，是否开启拖动打开、关闭菜单[true: 开启 , false: 关闭] </br> start: null, //--可选参数，开始拖动回调 </br> move: null, //--可选参数，拖动中回调 </br> end: null, //--可选参数，拖动结束</br>} | {} | 否
style | object | 设置样式 | {</br>w: '80vw',</br> h: '100vh',</br> bg: '#333'</br>} | 否

````html
<link rel="stylesheet" type="text/css" href="https://aui-js.github.io/aui/static/css/aui.min.css"/>
<link rel="stylesheet" type="text/css" href="https://aui-js.github.io/aui/static/css/aui.sidemenu.css"/>
<script type="text/javascript" src="https://aui-js.github.io/aui/static/js/aui.min.js"></script>
<script type="text/javascript" src="https://aui-js.github.io/aui/static/js/aui.sidemenu.js"></script>
````
> 初始化：   
````javascript
aui.sidemenu.init({
    warp: '.aui-container',
    content: '#aui-sidemenu-wapper',
    position: 'left',
    moveType: 'main-move',
    moves: ['.aui-container'],
    mask: true,
    maskTapClose: true,
    drag: {
        use: true,
        //start: _this.dragcallback,
        //move: _this.dragcallback,
        end: function(ret){
            console.log(ret)
        }
    },
    style: {
        w: '70vw',
        h: '100vh',
        bg: '#333'
    },
}).then(function(ret){
    console.log(ret)
});
````
> 设置配置数据：   
````javascript
aui.sidemenu.setData({
    moveType: 'all-move',
}).then(function(ret){
    //console.log(ret)
});
````
> 打开侧滑菜单：   
````javascript
aui.sidemenu.open({
    moveType: 'main-move',
    speed: 10,
}).then(function(ret){
    console.log(ret)
});
````
> 关闭侧滑菜单：   
````javascript
aui.sidemenu.close({speed: 10}).then(function(ret){
    console.log(ret)
});
````

#### `selectmenu下拉列表选择菜单`

[预览](https://aui-js.github.io/aui/pages/api/plugs/selectmenu.html) </br> 

参数  |  类型  |  描述  | 默认值 | 必选
---- | ----- | ------ | ----- | ----
warp  | string | 父容器元素 | 'body' | 否
data | arr | 菜单列表[{value: '', text: ''}] | [] | 是
layer | number | 控制组件为几级 | 1 | 是
mask  | boolean | 是否显示遮罩蒙版 | true | 否
touchClose  | boolean | 触摸遮罩是否关闭侧滑菜单 | true | 否
checkedMore | boolean | 是否多选(多选限制最后一级可多选) | false | 否
before | function | 打开弹窗前执行 | null | 否
select | function | 一级以上点击选择后执行，获取下级数据并return | null | 否
style | object | 样式 | {</br>width: '',</br> height: '',</br> top: '',</br> left: '',</br> padding: '',</br> background: '',</br> borderRadius: '',</br> itemStyle:{</br>textAlign: '',</br>fontSize: '',</br>color: '',</br>isLine: false, //是否显示分割线</br>}</br>} | 否

````html
<link rel="stylesheet" type="text/css" href="https://aui-js.github.io/aui/static/css/aui.min.css"/>
<link rel="stylesheet" type="text/css" href="https://aui-js.github.io/aui/static/css/aui.selectmenu.css"/>
<script type="text/javascript" src="https://aui-js.github.io/aui/static/js/aui.min.js"></script>
<script type="text/javascript" src="https://aui-js.github.io/aui/static/js/aui.selectmenu.js"></script>
````
> 打开：   
````javascript
aui.selectMenu.open({
    warp: '.orderby-items',
    layer: layer, // 1,2,3...
    data: [
    	{value: '0', text: '昨天'},
    	{value: '1', text: '本周'},
    	{value: '2', text: '上周'},
    	{value: '3', text: '本月'},
    	{value: '4', text: '上月'},
    ],
    checkedMore: true,
    select: function(ret){ //点击时获取下级数据
        //console.log(ret); //{value: '0', text: '昨天'}
        if(ret.pindex == 0){
            //ajax  -- 参数如ret.value
            var data = [
                {value: '1', text: '1点'},
                {value: '2', text: '2点'},
                {value: '3', text: '3点'},
                {value: '4', text: '4点'},
                {value: '4', text: '5点'},
                {value: '4', text: '6点'},
                {value: '4', text: '7点'},
                {value: '4', text: '8点'},
                {value: '4', text: '9点'},
                {value: '4', text: '10点'},
                {value: '4', text: '11点'},
                {value: '4', text: '12点'},
            ];
        }
        else if(ret.pindex == 1){
            var data = [
                {value: '0', text: '10分'},
                {value: '1', text: '20分'},
                {value: '2', text: '30分'},
                {value: '3', text: '40分'},
                {value: '4', text: '50分'},
                {value: '4', text: '60分'},
            ];
        }
        return data						
    },
}, function(ret){
    isShowModal = false;
    for(var i = 0; i < is.parentNode.querySelectorAll('.orderby-item').length; i++){
        is.parentNode.querySelectorAll('.orderby-item')[i].classList.remove('active');				
    }
});
````
> 关闭
````javascript
aui.selectMenu.close(function(){
    if(ret && ret.status == 0){
        console.log(ret);
        if(ret.data.length > 0){
            is.classList.add("selected");
            is.querySelector("span").innerText = '';
            for(var i = 0; i < ret.data[ret.data.length-1].length; i++){
                if(i != ret.data[ret.data.length-1].length - 1){
                    is.querySelector("span").innerText += ret.data[ret.data.length - 1][i].text + ',';																								
                }
                else{
                    is.querySelector("span").innerText += ret.data[ret.data.length - 1][i].text
                }
            }
        }
        else{
            is.classList.remove("selected");
            is.querySelector("span").innerText = '三级列表';
        }
    }
});
````

#### `keypad数字键盘`

[预览](https://aui-js.github.io/aui/pages/api/plugs/keypad.html) </br>  

参数  |  类型  |  描述  | 默认值 | 必选
---- | ----- | ------ | ----- | ----
warp  | string | 父容器元素 | 'body' | 否
type | string | 类型:</br> "number"—纯数字键盘 </br> "point"—带小数点键盘 </br> "idcard"—输入身份证号键盘 | 'number' | 否
value | string | 键盘输入值 | '' | 否
num | number | 控制小数点后保留两位 | 2 | 否
mask  | boolean | 是否显示遮罩蒙版 | true | 否
touchClose  | boolean | 触摸遮罩是否关闭侧滑菜单 | true | 否

````html
<link rel="stylesheet" type="text/css" href="https://aui-js.github.io/aui/static/css/aui.min.css"/>
<link rel="stylesheet" type="text/css" href="https://aui-js.github.io/aui/static/css/aui.keypad.css"/>
<script type="text/javascript" src="https://aui-js.github.io/aui/static/js/aui.min.js"></script>
<script type="text/javascript" src="https://aui-js.github.io/aui/static/js/aui.keypad.js"></script>
````
> 示例：   
````javascript
aui.keypad.open({
    type: 'number', //1、number | 2、point | 3、idcard
    mask: false,
    value: document.querySelector('#text1').value
}, function(ret){
    console.log(ret);
    document.querySelector('#text1').value = ret.result;
});
````
#### `chatbox js聊天输入框`

[预览](https://aui-js.github.io/aui/pages/api/plugs/chatbox.html) </br>  

参数  |  类型  |  描述  | 默认值 | 必选
---- | ----- | ------ | ----- | ----
warp  | string | 父容器元素 | 'body' | 否
mask  | boolean | 是否显示遮罩蒙版 | true | 否
touchClose  | boolean | 触摸遮罩是否关闭侧滑菜单 | true | 否
autoFocus  |  boolean  | 是否自动获取焦点  | false |  否
events  | arr | 配置监听事件(录音，选择附加功能...等事件监听) | [] | 否
record | object | 录音功能配置 | record:  </br>{ </br>use:  true, //是否开启录音功能  </br>MIN_SOUND_TIME: 800  //录音最短时间限制 </br>} | 否
emotion | object | 表情功能配置 | emotion:  </br>{ </br>use:  true, //是否开启表情功能  </br>path: ''  //.json文件路径 </br>pageHasNum: 27, //一页显示按钮数量(7 * 4 - 1) </br>} | 否
extras  | object  | 附加功能配置  | extras: </br>{</br> use: true, //是否开启附加功能 </br> pageHasNum: 8, //一页显示按钮数量(4 * 2) </br> btns: [  /* {title: '', icon: '', img: ''} */],</br> }

````html
<link rel="stylesheet" type="text/css" href="https://aui-js.github.io/aui/static/css/aui.min.css"/>
<link rel="stylesheet" type="text/css" href="https://aui-js.github.io/aui/static/css/aui.chatbox.css"/>
<script type="text/javascript" src="https://aui-js.github.io/aui/static/js/aui.min.js"></script>
<script type="text/javascript" src="https://aui-js.github.io/aui/static/js/aui.chatbox.js"></script>
````
> 示例：   
````javascript
aui.chatbox.init({
    warp: 'body',
    autoFocus: true,
    record: {
        use: true,
    },
    emotion: {
        use: true,
        path: '../../img/chat/emotion/',
        file: 'emotion.json'
    },
    extras: {
        use: true,
        btns: [
            {title: '相册', icon: 'iconimage'},
            {title: '拍摄', icon: 'iconcamera_fill'},
            {title: '语音通话', icon: 'iconvideo_fill'},
            {title: '位置', icon: 'iconaddress1'},
            {title: '红包', icon: 'iconredpacket_fill'},
            {title: '语音输入', icon: 'icontranslation_fill'},
            {title: '我的收藏', icon: 'iconcollection_fill'},
            {title: '名片', icon: 'iconcreatetask_fill'},
            {title: '文件', icon: 'iconmail_fill'}						
        ],
    },				
    events: ['recordStart', 'recordCancel', 'recordEnd', 'chooseExtrasItem', 'submit'],
}, function(){

})
//开始录音
aui.chatbox.addEventListener({name: 'recordStart'}, function(ret){
    console.log(ret);
    //aui.toast({msg: ret.msg})
});
//取消录音
aui.chatbox.addEventListener({name: 'recordCancel'}, function(ret){
    console.log(ret);
    //aui.toast({msg: ret.msg})
});
//结束录音
aui.chatbox.addEventListener({name: 'recordEnd'}, function(ret){
    console.log(ret);
    aui.toast({msg: ret.msg})
});
//选择附加功能
aui.chatbox.addEventListener({name: 'chooseExtrasItem'}, function(ret){
    console.log(ret);
    aui.toast({msg: ret.data.title});
});			
//发送
aui.chatbox.addEventListener({name: 'submit'}, function(ret){
    console.log(ret);
    aui.toast({msg: ret.data.value})
});
````
