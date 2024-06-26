const {
  defineConfig
} = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false
})

module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  chainWebpack: config => {
    // GraphQL Loader
    config.module
      .rule('file')
      .test(/\.pdf$/)
      .use('file-loader')
      .loader('file-loader')
      .end()
  },
  devServer: {
    // 设置代理
    proxy: {
      "/api": {
        target: "http://10.251.252.218", // 域名
        changOrigin: true, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，
        //这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: {
          "^/api": "/api"
        }
      }
    }
   }
}