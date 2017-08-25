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
