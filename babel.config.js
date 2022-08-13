// 这是项目发布阶段要用到的babel插件
// 项目开发调试阶段 --mode 为 development  项目发布阶段的 --mode为 production
// const prodPlugins = []
// 判断项目处于哪个阶段
// if(process.env.NODE_ENV === 'production'){
//   prodPlugins.push('transform-remove-console')
// }
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  "plugins":[
    [
      "component",
      {
        "libraryName":"element-ui",
        "styleLibraryName":"theme-chalk"
      }
    ],
    // 把prodPlugins里的配置运用...运算符展开
    // ...prodPlugins
  ]
}
