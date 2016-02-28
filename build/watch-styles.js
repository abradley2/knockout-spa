var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    sourcemaps = require('gulp-sourcemaps'),
    gutil = require('gulp-util')
    config = require('../config.js');


function watchStyles (){
  return gulp.src('./src/styles/main.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus().on('error', gutil.log))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.distOptions.stylesDistFolder));
}

module.exports = watchStyles;
