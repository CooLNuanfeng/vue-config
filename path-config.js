const config = {
    name : 'demo', //项目名称
    entry : './mobile/source/demo.js',
    outputjs : './mobile/js/',
    outputcss : './mobile/css/',
    vuePlugin : {
        'loader' : './common/libs/vue/vue-lazyload.js'
    }
};
module.exports = config;
