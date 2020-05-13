# aui

#### 简介
> aui是一套基于原生javascript开发的移动端UI库，包含常用js方法、字符校验、dialog提示弹窗、项目常用模板...
#### 特点
> 1、标准化，产品化
> 2、更多复用，更快效率
> 3、多人协作，更加统一
> 4、维护方便
> 5、易于使用
> 6、减少UI设计时间
#### 引用
````html
<link rel="stylesheet" type="text/css" href="https://aui-js.github.io/aui/css/aui.min.css"/>
<script type="text/javascript" src="https://aui-js.github.io/aui/js/aui.min.js"></script>
````
#### ui组件
1.loading加载动画
参数  |  类型  |  描述  | 值（默认）| 必选
---- | ----- | ------ | ----- | ----
warp  | string | 父容器元素 | 'body' | 否
type  | number | 1: 常用风格;</br> 2: 点击按钮后在按钮内显示加载动画;</br> 3: 四个方块旋转;</br> 4: 圆点放大缩小动画(全屏首次加载过度动画); </br>5: 圆点背景过度动画-微信小程序效果(全屏首次加载过度动画) | 1 | 否
msg  | string | 提示内容 | '' | 否
mask  | boolean | 是否显示遮罩蒙版 | true | 否
direction  | string | 横向("row")或纵向("col")控制 | 'col' | 否
theme  | number | type=3时，控制全屏或小窗展示（1：小窗 | 2：全屏） | 1 | 否
style  | object | {bg: '背景',</br>color: '文字颜色', </br>maskBg: '遮罩层颜色', </br>zIndex: '层级'} | '' | 否
> 示例：
```javascript
aui.showload({msg: "加载中"});
```

