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


全局环境配置完毕 运行下面命令 安装 包

	npm install -g vue gulp browserify vueify babelify mkdirp gulp-sass gulp-autoprefixer gulp-clean gulp-concat-css babel-core babel-loader babel-preset-2015 babel-preset-env babel-preset-stage-2 node-sass




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

	node gulpvue.js -p

-p 表示 生产压缩，去除多余注释等




#### 贡献自己的 VUE 组件


第四步骤中 的 Hello 组件可以看做一个简单的组件，大家可以在 公共文件里编写一些常用的组件，以后就可以直接 require 或 import

hello.vue

	<template>
    	<h1>Hello {{msg}}!</h1>
	</template>
	<style lang="scss">
	    $color: #fff;
	    h1{
	        color: $color;
	    }
	    body{
	        background: blue;
	    }
	    p{
	        color: $color;
	    }
	    div{
	        color: $color;
	        display: flex;
	        justify-content: center;
	    }
	</style>
	<script>
	export default{
	    data(){
	        return{
	            msg : 'Vue'
	        }
	    }
	}
	</script>





#### 说明

gulpvue.js 和 vuecofig.js 文件还没发到生产，可以先手动在static根目录下创建使用


vuecofig.js

	const config = {
	    name : 'demo',
	    entrystyle : './mobile/source/demo.scss',
	    entryjs : './mobile/source/demo.js',
	    output : {
	        css : './mobile/css/',
	        js : './mobile/js/',
	    }
	};
	module.exports = config;


gulpvue.js

	var config = require('./config-static');
	var fs = require("fs");
	var path = require('path');
	var browserify = require('browserify');
	var vueify = require('vueify');
	var gulp = require('gulp');
	var babelify = require('babelify');
	var extractCss = require('vueify/plugins/extract-css');
	var mkdirp = require('mkdirp');
	var sass = require('gulp-sass');
	const autoprefixer = require('gulp-autoprefixer');
	var clean = require('gulp-clean');
	const concatCss = require('gulp-concat-css');

	mkdirp.sync(config.output.css);
	mkdirp.sync(config.output.js);

	if(process.argv[2] == '-p'){
	    process.env.NODE_ENV = 'production';
	}


	gulp.task('vueify', function () {
	  return browserify(config.entryjs)
	  .transform(babelify, { presets: ['es2015','stage-2']})
	  .transform(vueify)
	  .plugin(extractCss, {
	    out: path.join(config.output.css+'../temp/', 'vue.css')
	  })
	  .bundle()
	  .pipe(fs.createWriteStream(path.join(config.output.js, config.name+'.bundle.js')))
	});


	gulp.task('sass', function () {
	  return gulp.src(config.entrystyle)
	    .pipe(sass({outputStyle: 'compressed'}))
	    .pipe(gulp.dest(config.output.css+'../temp/'));
	});

	gulp.task('concatcss',['sass','vueify'], function () {
	  return gulp.src(config.output.css+'../temp/*.css')
	    .pipe(concatCss(config.name+'.css'))
	    .pipe(autoprefixer())
	    .pipe(gulp.dest(config.output.css));
	});


	gulp.task('clean', ['concatcss'], function () {
	    return gulp.src(config.output.css+'../temp/')
	        .pipe(clean({force: true}));
	});

	gulp.task('default', ['vueify','sass','concatcss','clean']);
	gulp.start();
	var watcher = gulp.watch([config.entryjs,config.entrystyle], ['vueify','sass','concatcss','clean']);
	watcher.on('change', function(event) {
	  console.log('gulp success, running tasks...');
	});
