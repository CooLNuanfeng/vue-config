var pathConfig = require('./path-config');
var webpack = require('webpack');
const path = require('path');
const root = __dirname || path.resolve(__dirname, '..'); // 项目的根目录绝对路径
var ExtractTextPlugin = require('extract-text-webpack-plugin');


var vuePlugin = (() => {
    var vendors = [];
    var alias = {};
    for(var key in pathConfig.vuePlugin){
        vendors.push(key);
        alias[key] = path.join(root, pathConfig.vuePlugin[key]);
    }
    return {
        vendors : vendors,
        alias : alias
    }
})();
console.log(path.join(root, pathConfig.entry));

module.exports = {
    // 入口文件路径
    entry: {
        main: path.join(root, pathConfig.entry),
        vendors: vuePlugin.vendors
    },
    output: {
        // 打包输出的目录，这里是绝对路径，必选设置项
        path: path.join(root, pathConfig.outputjs), // 出口目录
        // 资源基础路径
        publicPath: '/',
        filename: '[name].bundle.js' //'[name].[chunkhash:8].js' 出口文件名
    },
    plugins: [
        //模块中直接使用 $/jquery
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "windows.jQuery": "jquery"
        }),
        // 分离第三方应用的插件
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',
            filename: 'vendors.js'
        }),
        //提取css 到单独的文件里
        new ExtractTextPlugin({
            filename: path.join(root,pathConfig.outputcss)+pathConfig.name+'.css',
            allChunks: true
        })
    ],
    module: {
        loaders: [{
            test: /\.scss/,
            loader: "vue-style!css!sass"
        }, {
            test: /\.css$/,
            // loader: 'style-loader!css-loader'
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader?minimize'
            })
        }, {
            test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.woff2$|\.ttf$|\.eot$/,
            loader: 'url-loader'
        }, {
            test: /\.vue$/,
            loader: 'vue-loader'
        }, {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['stage-2']
            }
        }, {
            test: /\.json$/,
            loader: 'json'
        }, {
            test: /\.html$/,
            loader: 'vue-html-loader'
        }]
    },
    resolve: {
        // 自动补全的扩展名
        extensions: ['', '.js', '.vue'],
        alias: vuePlugin.alias
    }
}
