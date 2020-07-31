const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist')
  },
  // 开启source-map 
  // devtool: 'source-map',
  devServer: {
    port: 8081,
    // 告诉服务器从哪个目录中提供内容
    contentBase: path.resolve(__dirname, './dist'),
    // dev-server启动后自动打开浏览器
    open: true,
    // 显示进度条
    progress: true
  },
  plugins: [
    // 告诉webpack已哪个html文件为入口
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html')
    }),
  ],
}