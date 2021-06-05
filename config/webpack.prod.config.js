
const merge = require('webpack-merge');
const base = require('./webpack.base.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// 外部css文件进行样式引入
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// 压缩css
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(base, {
  mode: 'production',
  output: {
    filename: 'js/[name].[contenthash:8].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader' 
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', // 打包之后的html文件名字
      template: 'public/index.html', // html模版文件
      inject: 'body', // 在body最底部引入js文件
      minify: {
        removeComments: true, // 去除注释
        collapseWhitespace: true, // 去除空格
      }
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[id].[contenthash:8].css',
    }),
  ],
  // 抽离第三方库公共代码
  optimization: {
    minimizer: [ 
      new UglifyJsPlugin(), 
      // 用于css文件压缩
      new OptimizeCssAssetsPlugin({
        assetNameRegExp:/\.css$/g,  // 用于匹配优化或压缩的资源名
        cssProcessor:require("cssnano"), // 用于压缩和优化css的处理器 默认值为 cssnano
        cssProcessorPluginOptions:{
          // 传递给cssProcessor的插件选项，默认为{}  discardComments 去掉注释
          preset:['default', { discardComments: { removeAll:true } }]
        },
        canPrint:true  // 表示插件能够在console中打印信息
      })
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      /* 
       cacheGroups对象，定义了需要被抽离的模块。
       test: 可以是字符串/正则表达式/函数，如果是定义是字符串，会匹配入口模块名称。会把这个模块代码抽离出来
       name：是抽离后生成的名字
      */
      cacheGroups: {
        framework: {
          test: 'framework',
          name: 'framework',
          enforce: true
        },
        /* 
         vendors是缓存组，
         test: 设置为 /node_modules/ 表示只帅选从node_modules文件夹下引入的模块，因此第三方模块会被拆分出来
        */
        vendors: {
          priority: -10,
          test: /node_modules/,
          name: 'vendor',
          enforce: true,
        },
      }
    }
  },
});