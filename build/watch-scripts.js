var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserify = require('browserify'),
    rename = require('gulp-rename'),
    watchify = require('watchify'),
    glob = require('glob'),
    source = require('vinyl-source-stream'),
    eventStream = require('event-stream'),
    config = require('../config.js');

var nameRegex = /([\w]+)(?=\.main\.\w+$)/g;

function updateBundle(entry){
  return this.bundle()
    .on('error', gutil.log)
    .pipe(source(entry.match(nameRegex)[0]))
    .pipe(rename({extname: '.bundle.js'}))
    .pipe(gulp.dest(config.distOptions.scriptsDistFolder));
}

function getBundles(done){
  glob('./src/scripts/**/*.main.*', function(err, files){
    var streams = files.map(function(entry){
      var bundler = watchify(browserify({ entries: [entry], debug: true}));

      config.browserifyOptions(bundler, 'dev', entry);

      bundler.on('log', gutil.log);
      bundler.on('update', updateBundle.bind(bundler,entry));

      return updateBundle.call(bundler,entry);
    });
    return eventStream.merge(streams).on('end', done);
  });
}

module.exports = getBundles;
