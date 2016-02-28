var gulp = require('gulp')
    tasks = require('./build');

gulp.task(
    'build-styles',
    tasks.buildStyles
);

gulp.task(
    'watch-styles',
    ['build-styles'],
    gulp.watch.bind(gulp,['./src/styles/**/*'], tasks.watchStyles)
);

gulp.task(
    'watch-scripts',
    tasks.watchScripts
);

gulp.task(
    'build-scripts',
    tasks.buildScripts
);

gulp.task(
    'watch',
    ['watch-styles', 'watch-scripts']
);

gulp.task(
    'build',
    ['build-styles', 'build-scripts']
);

gulp.task(
    'default',
    ['build']
);
