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
const concat = require('gulp-concat');
const source = require('vinyl-source-stream');
const runSequence = require('run-sequence');
const watchify = require('watchify');
const cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var pump = require('pump');


var b;

mkdirp.sync(config.output.css);
mkdirp.sync(config.output.js);
mkdirp.sync(config.output.css+'../temp');

const JSNAME = path.parse(config.entryjs).name;
const CSSNAME = path.parse(config.entrystyle).name;

function swallowError(error) {
  console.error(error.toString());
  this.emit('end');
}


function bundle(){
    // console.log('bundle');
    b.bundle()
    .on('error',swallowError)
    .pipe(source(JSNAME+'.bundle.js'))
    .pipe(gulp.dest(config.output.js))

}

b = browserify({
    entries : config.entryjs,
    packageCache: {},
    plugin : [watchify]
})
.transform(babelify, { presets: ['es2015','stage-2']})
.transform(vueify)
.plugin(extractCss, {
    out: path.join(config.output.css+'../temp/', 'tmpvue.css')
});

b.on('update',function(){
    // console.log('gulp success, running tasks...');
    bundle();
});

gulp.task('sass',function () {
  return gulp.src(config.entrystyle)
    .pipe(sass())
    .on('error',swallowError)
    .pipe(gulp.dest(config.output.css+'../temp/'));
});
gulp.task('sasswatch',function(){
    gulp.watch(config.entrystyle,function(){
        // console.log('gulp success, running tasks...');
        runSequence('sass');
    });
});

gulp.task('vueify',function (){
  bundle();
  // .pipe(fs.createWriteStream(path.join(config.output.js, JSNAME+'.bundle.js')))
});

gulp.task('concatcss',function () {
  return gulp.src(config.output.css+'../temp/*.css')
    .pipe(concat(CSSNAME+'.css'))
    .pipe(autoprefixer())
    .on('error',swallowError)
    .pipe(gulp.dest(config.output.css));
});

gulp.task('tempwatch',function(){
    gulp.watch(config.output.css+'../temp/*.css',function(){
        // console.log('tmp change');
        runSequence('concatcss');
    });
})

gulp.task('clean',function () {
    return gulp.src(config.output.css+'../temp/')
        .on('error',swallowError)
        .pipe(clean({force: true}));
});


gulp.task('minifycss', () => {
  return gulp.src(path.join(config.output.css, CSSNAME+'.css'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(config.output.css));
});
gulp.task('uglifyjs', function (cb) {
  pump([
        gulp.src(path.join(config.output.js,JSNAME+'.bundle.js')),
        uglify(),
        gulp.dest(config.output.js)
    ],cb);
});

gulp.task('dev', function(){
    runSequence('vueify','sass','sasswatch','concatcss','tempwatch');
});

gulp.task('build',function(){
    runSequence('minifycss','clean','uglifyjs');
});
