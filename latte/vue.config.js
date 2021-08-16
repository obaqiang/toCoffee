/*
 * @Descripttion: 
 * @Author: shenqiang
 * @Date: 2021-08-13 15:11:06
 * @LastEditors: shenqiang
 * @LastEditTime: 2021-08-13 15:12:44
 */
const { name } = require('./package');
module.exports = {
    devServer: {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        port:8081
    },
    configureWebpack: {
        output: {
            library: `${name}-[name]`,
            libraryTarget: 'umd', // 把微应用打包成 umd 库格式
            jsonpFunction: `webpackJsonp_${name}`,
        },
    },
};
