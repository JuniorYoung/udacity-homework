## 项目简介
这是Udacity前端进阶课程项目4源码。街区地图，可定位当前用户并根据用户位置显示附近的酒店、餐饮等地点。

## 项目结构
```
/
  |-dist # 存放生产环境文件
  |-src  # 源码目录
    |-js
     |-app.js # 入口文件引入，负责将各个模块js引入
     |-view.js # 视图js，负责UI的更新等
     |-viewModel.js # 视图模型js 负责数据的更新等
    |-css
     |-font # 字体文件目录
     |-main.scss # 应用样式文件
     |-normalize.scss # reset css文件 
    |-main.tmpl.html # 入口文件
  |-postcss.config.js # postcss配置文件
  |-webpack.dev.config.js # 用于开发环境webpack配置文件
  |-webpack.prod.config.js # 用于生产环境webpack配置文件
  |-package.json
  |-README.md

```

## 技术栈
* Webpack
* Sass
* ES6
* 高德地图API

## 快速开始
1. Clone 项目
2. `npm install`
3. `npm run dev`（开发模式，自动以默认浏览器打开页面） 或者 `npm run prod`（生产模式，将文件打包至`/dist`目录）