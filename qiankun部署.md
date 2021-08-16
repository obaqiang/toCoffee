<!--
 * @Descripttion: 
 * @Author: shenqiang
 * @Date: 2021-08-13 15:13:50
 * @LastEditors: shenqiang
 * @LastEditTime: 2021-08-13 15:14:53
-->
# what?why?
![](https://files.mdnice.com/user/2323/ab1fdf02-9e21-4dc8-87df-7b35f0918a20.png)

![](https://files.mdnice.com/user/2323/3c802d77-4218-415c-b793-a5a8ffb2e534.png)

# 核心
1. 兼容各种技术栈
2. 可独立开发、部署、运行、测试
3. 状态隔离

# 历史框架 
1. single-spa 
2. qiankun   

> 为什么不用iframe？  
- url 不同步。浏览器刷新 iframe url 状态丢失、后退前进按钮无法使用。
- UI 不同步，DOM 结构不共享。想象一下屏幕右下角 1/4 的 iframe 里来一个带遮罩层的弹框，同时我们要求这个弹框要浏览器居中显示，还要浏览器 resize 时自动居中..
- 全局上下文完全隔离，内存变量不共享。iframe 内外系统的通信、数据同步等需求，主应用的 cookie 要透传到根域名都不同的子应用中实现免登效果。
- 慢。每次子应用进入都是一次浏览器上下文重建、资源重新加载的过程。

# 沙箱隔离

![](https://files.mdnice.com/user/2323/5126d6cf-eedd-48c2-9ac6-4acaeb0602e8.png)

1. 快照沙箱
2. proxy 代理沙箱

相关链接： <a href="https://segmentfault.com/a/1190000038219823">沙箱隔离介绍</a>


# qiankun
> qiankun 是一个基于 single-spa 的微前端实现库



### 新建一个项目作为主应用（main）及两个子应用 (childone、childtwo)
1. 主应用 main
```
vue create main
```
2. 子应用childone
```
vue create childone
```
3. 子应用childtwo
```
vue create childtwo
```

### 主应用相关配置（main）
1. 首先下载qiankun 的相关依赖
```
$ yarn add qiankun # 或者 npm i qiankun -S
```
2. 将两个子应用注册到主应用中去
main项目的main.js 中配置
``` js
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'childone', // app name registered
    entry: 'http://10.101.26.6:8080/',
    container: '#childone',
    activeRule: '/childone',
  },
  {
    name: 'childtwo',
    entry: 'http://10.101.26.6:8081/',
    container: '#childtwo',
    activeRule: '/childtwo',
  },
]);

start();
```
> 参数说明：  
name:子应用的名称
entry:子应用的入口 (入口随子应用的服务路径变化，子应用启动时建议定死路径)
container:放置子应用的位置
activeRule:激活子应用的路由

3. 修改App.vue相关
``` html
<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
      <router-link to="/childone">childone</router-link>
      <router-link to="/childtwo">childtwo</router-link>
    </div>

    <router-view />
    <div id="childone"></div>
    <div id="childtwo"></div>
  </div>
</template>
```
到此，主应用配置基础内容完成

### 子应用配置（childone、childtwo）的相关配置，这里两个都是以vue作为基础框架，其他类型的可根据qiankun官网配置
1. main.js 中配置
> * 引入public-path
> * 将import router 改成 import routes 
> * 注释掉new Vue实例的相关
> * 创建router和instance实例，并进行相关配置

main.js代码如下
``` js
import './public-path';
import Vue from 'vue'
import App from './App.vue'
import routes from './router'
// import store from './store'
import VueRouter from 'vue-router'
Vue.config.productionTip = false


// new Vue({
//   router,
//   store,
//   render: h => h(App)
// }).$mount('#app')

let router = null;
let instance = null;
function render(props = {}) {
  const { container } = props;
  router = new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? '/vue/' : '/',
    mode: 'history',
    routes,
  });

  instance = new Vue({
    router,
    // store,
    render: (h) => h(App),
  }).$mount(container ? container.querySelector('#app') : '#app');
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}


export async function bootstrap() {
  console.log('[vue] vue app bootstraped');
}
export async function mount(props) {
  console.log('[vue] props from main framework', props);
  render(props);
}
export async function unmount() {
  instance.$destroy();
  instance.$el.innerHTML = '';
  instance = null;
  router = null;
}

```
public-path代码如下
``` js
if (window.__POWERED_BY_QIANKUN__) {
    __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
  }

```

2. 路由相关配置（一般为router文件夹下的index.js文件）
> * 注释掉new VueRouter相关
> * 直接抛出routes
``` js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

// const router = new VueRouter({
//   mode: 'history',
//   base: process.env.BASE_URL,
//   routes
// })

export default routes
```
3. 根目录下新建vue.config.js文件
``` js
const { name } = require('./package');
module.exports = {
    devServer: {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
    configureWebpack: {
        output: {
            library: `${name}-[name]`,
            libraryTarget: 'umd', // 把微应用打包成 umd 库格式
            jsonpFunction: `webpackJsonp_${name}`,
        },
    },
};

```
到此，vue类型的子应用基础布置全部结束

## 部分名词知识介绍
* **public-path.js文件:** 设置publicPath
* **vue.config.js:** 作用是将微应用打包做为一个包，给主应用内使用
* **bootstrap、mount、unmount:** 是子应用的3个生命周期
* **__POWERED_BY_QIANKUN__**:个人理解，在基座中运行时的环境变量

## 运行
1. 进入main项目 启动项目
2. 进入子应用 启动项目

## 关于发布
具体步骤及详细详见qiankun 官网
1. 这边用node的http-server 搭建一个临时服务器作为尝试，还需配合使用node的cross-env 模块允许跨域
2. 主子应用部署与同一服务器
3. 主应用部署于一级目录，子应用部署于二级目录
4. child文件夹存放子应用,主应用部署在根目录下
![](https://files.mdnice.com/user/2323/52d23016-5f15-4558-a8c4-2ba9369bb7c3.png)
5. 子应用的childone 的打包文件部署在vue文件夹下

![](https://files.mdnice.com/user/2323/b060c87b-842d-4144-948d-fdde41595c0c.png)

6. 主应用修改：修改主应用中的注册相关（entry:部署地址+文件相对路径）

![](https://files.mdnice.com/user/2323/215c8d8a-13c5-43cf-899f-98ab3b845f06.png)

7. 子应用修改：修改路由的base 

![](https://files.mdnice.com/user/2323/e4b77ec9-b0d3-45a3-b0cf-25e16eea1891.png)

8. 子应用修改：publicPath

![](https://files.mdnice.com/user/2323/6a6c6225-316b-4949-8f4b-031273e1eac6.png)

9. 打包部署主子应用

## 满足以下几点，你可能就不需要微前端

1. 你/你的团队 具备系统内所有架构组件的话语权
简单来说就是，系统里的所有组件都是由一个小的团队开发的。
2. 你/你的团队 有足够动力去治理、改造这个系统中的所有组件
直接改造存量系统的收益大于新老系统混杂带来的问题。
3. 系统及组织架构上，各部件之间本身就是强耦合、自洽、不可分离的
系统本身就是一个最小单元的「架构量子」，拆分的成本高于治理的成本。
4. 极高的产品体验要求，对任何产品交互上的不一致零容忍
不允许交互上不一致的情况出现，这基本上从产品上否决了渐进式升级的技术策略

## 满足以下几点，你才确实可能需要微前端
1. 系统本身是需要集成和被集成的 一般有两种情况： 
- 旧的系统不能下，新的需求还在来。
没有一家商业公司会同意工程师以单纯的技术升级的理由，直接下线一个有着一定用户的存量系统的。而你大概又不能简单通过 iframe 这种「靠谱的」手段完成新功能的接入，因为产品说需要「弹个框弹到中间」
你的系统需要有一套支持动态插拔的机制。
- 这个机制可以是一套精心设计的插件体系，但一旦出现接入应用或被接入应用年代够久远、改造成本过高的场景，可能后面还是会过渡到各种微前端的玩法。
2. 系统中的部件具备足够清晰的服务边界
通过微前端手段划分服务边界，将复杂度隔离在不同的系统单元中，从而避免因熵增速度不一致带来的代码腐化的传染，以及研发节奏差异带来的工程协同上的问题。

## 待思考问题
1. 如何优雅的处理样式隔离
2. 官方的css隔离方案
3. 如何适配vue3+vite项目
