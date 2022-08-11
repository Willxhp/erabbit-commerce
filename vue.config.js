const path = require('path')
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 使用后vuecli提供的style-resources-loader可以实现less文件的自动导入，不需要在每个组件手动导入全局less文件
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      // 设置自动注入的文件路径，需使用绝对路径
      patterns: [
        path.join(__dirname, './src/assets/styles/mixins.less'),
        path.join(__dirname, './src/assets/styles/variables.less'),
      ],
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule('images')
      .test(/\.(jpg|png|gif)$/)
      .set('parser', {
        dataUrlCondition: {
          maxSize: 10000 * 1024,
        },
      })
  },
  configureWebpack: {
    // 设置打包忽略文件，模块为qc变量名为QC，导入qc将不做打包。
    externals: {
      qc: 'QC',
    },
    // 给webpack-dev-server开启IP和域名访问权限。
    devServer: {
      allowedHosts: 'www.corho.com',
    },
  },
})
