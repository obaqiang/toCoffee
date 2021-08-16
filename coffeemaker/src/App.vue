<!--
 * @Descripttion: 
 * @Author: shenqiang
 * @Date: 2021-08-13 14:47:46
 * @LastEditors: shenqiang
 * @LastEditTime: 2021-08-13 15:06:09
-->
<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/latte">latte</router-link>
    </div>
    <router-view />
    <div id="latte"></div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
