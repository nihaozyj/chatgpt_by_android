const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production'
    ? './'    //这里要填 './'或者''(空),默认为'/',这里设置的会被应用到index.html里css,js路径的前面
    : '/',   //这里是开发环境,通常没有项目名
  outputDir: 'dist',   //当运行 build 时生成的生产环境构建文件的目录
  assetsDir: '',  //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
})
