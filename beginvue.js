var config = require('./config-static');
var fs = require("fs");
var path = require('path');
var mkdirp = require('mkdirp');
var browserify = require('browserify');
var vueify = require('vueify');
var extractCss = require('vueify/plugins/extract-css');
const babelify = require('babelify');
var watchify = require('watchify');
const autoprefixer = require('autoprefixer');
var sass = require('node-sass');
var Watcher = require('node-sass-watcher');
var postcss = require('postcss');

if(process.argv[2] == '-p'){
    process.env.NODE_ENV = 'production';
}

mkdirp.sync(config.output.css);
mkdirp.sync(config.output.js);

var bowser = browserify(config.entryjs)
  .plugin(watchify)
  .transform(babelify)
  .transform(vueify,{
      postcss: [autoprefixer],
  })
  .plugin(extractCss, {
    out: path.join(config.output.css, config.name+'.css')
  });
bowser.on('update',bundle);
bundle();
function bundle() {
  bowser.bundle().pipe(fs.createWriteStream(path.join(config.output.js, config.name+'.bundle.js')));
}

function render(){
    sass.render({
        file: config.entrystyle,
        outputStyle: 'compressed',
        sourceMap: false,
    }, function(error, result) {
        if(!error){
            var processor = postcss([autoprefixer]);
            processor.process(result.css.toString()).then(function(result) {
                fs.appendFileSync(path.join(config.output.css, config.name+'.css'), result.css);
            });
        }
    });
}
var watcher = new Watcher(config.entrystyle);
watcher.on('init', render);
watcher.on('update', render);
watcher.run();
