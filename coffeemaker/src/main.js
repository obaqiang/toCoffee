/*
 * @Descripttion: 
 * @Author: shenqiang
 * @Date: 2021-08-13 14:47:46
 * @LastEditors: shenqiang
 * @LastEditTime: 2021-08-13 15:13:21
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'latte', // app name registered
    entry: 'http://10.101.26.6:8081/',
    container: '#latte',
    activeRule: '/latte',
  },

]);

start();
