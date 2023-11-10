const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
const TimeStamp = new Date().getTime();
// const CompressionPlugin =    require("compression-webpack-plugin")

module.exports = {
  publicPath: "./",
  lintOnSave: process.env.NODE_ENV !== "production",
  devServer: {
    overlay: {
      warnings: true,
      errors: true,
    },
  },
  assetsDir: "static",
  productionSourceMap: true,
  //分包处理
  configureWebpack: {
    // 修改打包后的js文件名称
    output: {
      // 输出重构  打包编译后的 文件名称  【模块名称.版本号.js】
      filename: `static/js/[name].${TimeStamp}.js`,
      chunkFilename: `static/js/[name].${TimeStamp}.js`,
    },
    //     if (process.env.NODE_ENV === 'development') return
    //     return {
    //         plugins: [
    //             // new CompressionPlugin({
    //             //     test: /\.(js|css|otf)$/, //匹配文件名
    //             //     threshold: 10240,//对超过10k的数据压缩
    //             //     deleteOriginalAssets: true //删除源文件
    //             // })
    //         ],
    //         // 看这里：把chunk-vendors.js进行分包，提升资源加载速度，很有必要
    //         optimization: {
    //             /**
    //              * runtimeChunk可选值有：true或'multiple'或'single'
    //              * true或'multiple'会有每个入口对应的chunk。不过一般情况下
    //              * 考虑到要模块初始化，设置为single就够多数情况下使用啦。
    //              * 详情见官网：https://webpack.docschina.org/configuration/optimization/#optimizationruntimechunk
    //              * */
    //             runtimeChunk: 'single',
    //             /**
    //              * 以前是CommonsChunkPlugin，现在换成optimization.splitChunks。普通项目下方的配置就足够用啦
    //              * 详情见官网：https://webpack.docschina.org/configuration/optimization/#optimizationsplitchunks
    //              * */
    //             splitChunks: {
    //                 chunks: 'all', // 可选值：all，async 和 initial。all功能最强大，所以咱们就使用all
    //                 maxInitialRequests: Infinity, // 最大并行请求数，为了以防万一，设置无穷大即可
    //                 minSize: 20000, // 引入的模块大于20kb才做代码分割，官方默认20000，这里不用修改了
    //                 maxSize: 60000, // 若引入的模块大于60kb，则告诉webpack尝试再进行拆分
    //                 cacheGroups: {
    //                     vendors: {
    //                         test: /[\\/]node_modules[\\/]/, // 使用正则匹配node_modules中引入的模块
    //                         priority: -10, // 优先级值越大优先级越高，默认-10，不用修改
    //                         name(module) { // 设定分包以后的文件模块名字，按照包名字替换拼接一下
    //                             const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
    //                             return `npm.${packageName.replace('@', '')}`
    //                         },
    //                     },
    //                 },
    //             }
    //         },
    //     }
  },
  chainWebpack(config) {
    config.plugin("html").tap((args) => {
      args[0].title = "Alchemy Pay Ramp";
      return args;
    });
    // 它可以提高第一个屏幕的速度，建议打开预加载
    config.plugin("preload").tap(() => [
      {
        rel: "preload",
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: "initial",
      },
    ]);

    // 当页面太多时，会导致太多无意义的请求
    config.plugins.delete("prefetch");

    // 设置svg精灵加载程序
    config.module.rule("svg").exclude.add(resolve("src/icons")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
        title: "Alchemy Pay Ramp",
      })
      .end();
  },
  css: {
    loaderOptions: {
      sass: {},
      postcss: {
        plugins: [require("autoprefixer")],
      },
    },
  },
  transpileDependencies: ["vue-clamp", "resize-detector", "/@noble/"],
};
