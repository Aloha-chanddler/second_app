const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 发布模式
  chainWebpack:config=>{
    config.when(process.env.MODE_ENV === 'production',config=>{
      config.entry('app').clear().add('./src/main-prod.js')

      // 配置外部资源加载CDN
      config.set('external',{
        vue:'Vue',
        'vue-router':'VueRouter',
        axios:'axios',
        lodash:'_',
        echarts:'echarts',
        nprogress:'NProgress',
        'vue-quill-editor':'vueQuillEditor'
      })
    })
  //   // 开发模式
  //   config.when(process.env.MODE_ENV === 'development',config=>{
  //     config.entry('app').clear().add('./src/main-dev.js')})
  },
})
