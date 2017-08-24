# Grunt工作流 #
1. 通常的工作流 编码 --> 调试 --> 上线
2. 加入Grunt后的工作流  ***启动Grunt*** --> 编码 --> 调试 --> 上线


# 安装 #
1. 所以的操作都是在node平台上，需要安装[Node.js](http://www.nodejs.org/)
2. Grunt官方说明[Grunt.js](http://gruntjs.com/)，请运行npm install -g grunt-cli
3. sass编译环境依赖[ruby](https://www.ruby-lang.org/zh_cn/downloads/)和[gem](http://rubygems.org/pages/download)，安装后运行gem install sass


# grunt tasks #
1. $ cd fmu
2. 生成js、css, $ grunt init
3. 删除生成的文件及目录 $ grunt cleanup

# sass编译 #
1. 在css目录新建scss后缀文件
2. 使用sass语法编写css


# 图片合并 #
1. 需要合并的单个小图片放入 images/slice
2. 运行task后，会生成*.sprite.css文件

# 生成目录 #
1. task运行完成后，会生成publish文件夹，包含所有的css,js, images 