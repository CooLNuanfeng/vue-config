var config = require('./path-config');
var webpack = require('webpack');
const path = require('path');
const root = __dirname || path.resolve(__dirname, '..'); // 项目的根目录绝对路径
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var configObj = (() => {
    var vendors = [];
    var alias = {};
    var entry = {};
    for(var key in config.vuePlugins){
        vendors.push(key);
        alias[key] = path.join(root, config.vuePlugins[key]);
    }
    entry[config.entry.name] = path.join(root, config.entry.source);
    return {
        entry : entry,
        vendors : vendors,
        alias : alias
    }
})();

module.exports = {
    // 入口文件路径
    entry : configObj.entry,
    output: {
        // 打包输出的目录，这里是绝对路径，必选设置项
        path: path.join(root, config.output.js), // 出口目录
        // 资源基础路径
        publicPath: '/',
        filename: '[name].bundle.js' //'[name].[chunkhash:8].js' 出口文件名
    },
    plugins: [

    ],
    module: {
        rules : [
            {
                test: /\.(js|jsx)$/,
                use : {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env','stage-2']
                    }
                }
            }
        ]
    },
    resolve: {
        // 自动补全的扩展名
        extensions: ['.js', '.vue'],
        alias: configObj.alias
    }
}
