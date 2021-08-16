/*
 * @Descripttion: 
 * @Author: shenqiang
 * @Date: 2021-08-13 15:24:21
 * @LastEditors: shenqiang
 * @LastEditTime: 2021-08-13 16:36:59
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
var path = require('path')
const { name } = require("./package");
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 8002
  },

  build: {
    target: "esnext",
    lib: {
      name: `${name}-[name]`,
      entry: path.resolve(__dirname, "src/main.js"),
      formats: ["umd"],
    },
  },



})
