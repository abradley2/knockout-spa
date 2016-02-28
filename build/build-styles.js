var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    gutil = require('gulp-util'),
    config = require('../config.js');

var nameRegex = /\.(main)$/g;

function buildStyles (){
  return gulp.src('./src/styles/main.styl')
    .pipe(stylus().on('error', gutil.log))
    .pipe(gulp.dest(config.distOptions.stylesDistFolder));
}

module.exports = buildStyles;
