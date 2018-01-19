#### 建议先按顺序安装以下工具

1、安装 oh my zsh
2、安装 brew
3、安装 nvm

#### 使用说明

Version : gulp 版本

开发:

	gulp dev

生产:

	gulp build



#### 环境配置

1、查看全局包安装路径

	npm root -g

example: C:\Users\xxxxxx\AppData\Roaming\npm\node_modules

2、配置全局环境变量


mac用户：

###### step one

切换到用户主目录

	cd ~

###### step two

如果是使用 bash 或 zsh 直接修改对应的 当前用户的 ~/.bashrc ~/.zshrc 文件 在底部追加

	export NODE_PATH="<npm root -g 输出的路径>"


example: export NODE_PATH="C:\Users\hongsong.wu\AppData\Roaming\npm\node_modules"


###### step three

退出终端，重新启动


window用户：

计算机右键属性 -> 高级系统设置 -> 环境变量 -> 用户变量栏 -> 新建  

变量名： NODE_PATH 变量值： npm root -g 的输出值

**注意**如果已经有了NODE_PATH环境变量，则选择编辑，末尾追加以;分割




#### 安装全局包依赖


全局环境配置完毕 运行下面命令 安装包可能有遗漏，如果运行时提示找不到相应包，自行安装

	npm install -g vue gulp browserify vueify babelify mkdirp gulp-sass gulp-autoprefixer gulp-clean gulp-concat gulp-clean-css gulp-uglify run-sequence vinyl-source-stream babel-core babel-loader babel-preset-2015 babel-preset-env babel-preset-stage-2 node-sass




以上开发环境搭建完毕





#### 使用步骤说明


1、拉分支代码

	fsvn story35679 static huodong

2、切换进static目录

	cd story35679 && cd static


3、配置 vue入口文件 vuecofig.js


		const config = {
		    name : 'couponlist',
		    entrystyle : './huodong/libao/css/coupon.scss',  //项目的入口 scss样式文件
		    entryjs : './huodong/libao/js/couponlist.js',    //项目的入口 js 文件
		    output : {
		        css : './huodong/libao/css/',  //最后生成的 css 样式文件
		        js : './huodong/libao/js/',    //最后生成的 js 样式文件
		    }
		};
		module.exports = config;


4、编写 项目的 js scss

html

	<div id="app">
        <div>{{msg}}</div>
    </div>

传统写法js

		(function(){
		    var app = new Vue({
		        el : '#app',
		        data : {
		            msg : 'hello world'
		        }
		    });
		})();

es6 写法


	import Hello from '../../vueCompont/hello.vue';
	//or
	// var  Hello = require('../../vueCompont/hello.vue');
	const data  = (()=>{
	    return {
	        msg : 'This is vue'
	    }
	})();

	new Vue({
	    el : '#app',
	    data : data,
	    components: {
	        'my-component': Hello
	    }
	})



5、运行命令编译

	gulp dev  //开发调试

6、开发结束，打包生产文件

	gulp build
