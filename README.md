# aui

## 简介

> aui是一套基于原生javascript开发的移动端UI库，包含常用js方法、字符校验、dialog提示弹窗、侧滑菜单、时间选择器、多级联动、聊天UI、项目常用模板......

## 特点

> 1、标准化，产品化</br>
> 2、更多复用，更快效率</br>
> 3、多人协作，更加统一</br>
> 4、维护方便</br>
> 5、易于使用</br>
> 6、减少UI设计时间

## 引用

````html
<link rel="stylesheet" type="text/css" href="https://aui-js.github.io/aui/css/aui.min.css"/>
<script type="text/javascript" src="https://aui-js.github.io/aui/js/aui.min.js"></script>
````
## ui组件

#### `loading加载动画`

参数  |  类型  |  描述  | 默认值 | 必选
---- | ----- | ------ | ----- | ----
warp  | string | 父容器元素 | 'body' | 否
type  | number | 1: 常用风格;</br> 2: 点击按钮后在按钮内显示加载动画;</br> 3: 四个方块旋转;</br> 4: 圆点放大缩小动画(全屏首次加载过度动画); </br>5: 圆点背景过度动画-微信小程序效果(全屏首次加载过度动画) | 1 | 否
msg  | string | 提示内容 | '' | 否
mask  | boolean | 是否显示遮罩蒙版 | true | 否
direction  | string | 横向("row")或纵向("col")控制 | 'col' | 否
theme  | number | type=3时，控制全屏或小窗展示（1：小窗 | 2：全屏） | 1 | 否
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
style  | object | {</br>    w: '', //--可选参数，模态窗宽度，默认80%</br>    h: '', //--可选参数，模态窗高度，默认"auto"自适应</br>  bg: '',//--可选参数，模态窗背景色，默认白色</br>    zIndex: '', //--可选参数，模态窗层级</br> animate: '', //--可选参数，显示动画</br> title: {</br>   bg: "",</br>    color: "",</br> lineHeight: "",</br>    textAlign: "",</br> fontSize: "",</br>  padding: ""</br>}} | '' | 否

> [预览](https://aui-js.github.io/aui/html/plugs/dialog.html)
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

参数  |  类型  |  描述  | 默认值 | 必选
---- | ----- | ------ | ----- | ----
warp  | string | 父容器元素 | 'body' | 否
items  | arr | 菜单列表[{name: "", color: "", fontSize: "", textAlign: ""}] | [] | 否
mask  | boolean | 是否显示遮罩蒙版 | true | 否
touchClose  | boolean | 触摸遮罩是否关闭模态弹窗 | true | 否
cancle | string | 取消按钮 | '' | 否
location | string | （icon参数未配置时可配置）位置	</br>bottom:位于底部，从底部弹出显示</br>middle:位于页面中心位置 | 'bottom' | 否
theme | number | 主题样式(1: 非全屏宽度； 2: 全屏宽度) | 1 | 否

> 示例：   [预览](https://aui-js.github.io/aui/html/plugs/actionsheet.html)
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

参数  |  类型  |  描述  | 默认值 | 必选
---- | ----- | ------ | ----- | ----
warp  | string | 父容器元素 | 'body' | 否
items  | arr | 菜单列表[{name: "", icon: "", iconColor: "", img: ""}] | [] | 否
mask  | boolean | 是否显示遮罩蒙版 | true | 否
touchClose  | boolean | 触摸遮罩是否关闭模态弹窗 | true | 否
cancle | string | 取消按钮 | '' | 否
location | string | （icon参数未配置时可配置）位置	</br>bottom:位于底部，从底部弹出显示</br>middle:位于页面中心位置 | 'bottom' | 否
theme | number | 主题样式(1: 非全屏宽度； 2: 全屏宽度) | 1 | 否

````html
<link rel="stylesheet" type="text/css" href="https://aui-js.github.io/aui/css/aui.min.css"/>
<link rel="stylesheet" type="text/css" href="https://aui-js.github.io/aui/css/aui.actionmenu.css"/>
<script type="text/javascript" src="https://aui-js.github.io/aui/js/aui.min.js"></script>
<script type="text/javascript" src="https://aui-js.github.io/aui/js/aui.actionmenu.js"></script>
````
> 示例：   [预览](https://aui-js.github.io/aui/html/plugs/actionmenu.html)
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

参数  |  类型  |  描述  | 默认值 | 必选
---- | ----- | ------ | ----- | ----
warp  | string | 父容器元素 | 'body' | 否
items  | arr | 菜单列表[{name: "", color: "", icon: "iconfont icongfont-right", iconColor: '', img: "", fontSize: "", textAlign: ""}] | [] | 否
mask  | boolean | 是否显示遮罩蒙版 | false | 否
touchClose  | boolean | 触摸遮罩是否关闭模态弹窗 | true | 否
location | string | 位置	</br>top: 设置弹窗显示到触发元素“上”方;</br> bottom: 设置弹窗显示到触发元素“下”方; | 'top' | 否

````html
<link rel="stylesheet" type="text/css" href="https://aui-js.github.io/aui/css/aui.min.css"/>
<link rel="stylesheet" type="text/css" href="https://aui-js.github.io/aui/css/aui.popover.css"/>
<script type="text/javascript" src="https://aui-js.github.io/aui/js/aui.min.js"></script>
<script type="text/javascript" src="https://aui-js.github.io/aui/js/aui.popover.js"></script>
````
> 示例：   [预览](https://aui-js.github.io/aui/html/plugs/popover.html) 
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

参数  |  类型  |  描述  | 默认值 | 必选
---- | ----- | ------ | ----- | ----
warp  | string | 父容器元素 | 'body' | 否
title | string | 标题 | '' | 否
layer | number | 控制几级联动 | 1 | 否
data | arr | 数据 如：[{text: '', adcode: '', children: [{text: '', adcode: ''}]}] | [] | 否

````html
<link rel="stylesheet" type="text/css" href="https://aui-js.github.io/aui/css/aui.min.css"/>
<link rel="stylesheet" type="text/css" href="https://aui-js.github.io/aui/css/aui.picker.css"/>
<script type="text/javascript" src="https://aui-js.github.io/aui/js/aui.min.js"></script>
<script type="text/javascript" src="https://aui-js.github.io/aui/js/aui.picker.js"></script>
````
> 示例：   [预览](https://aui-js.github.io/aui/html/plugs/picker.html) 
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
