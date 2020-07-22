var gulp = require('gulp');
var concat = require('gulp-concat');
const minify = require('gulp-minify');
var browserSync = require('browser-sync').create();

//script paths
var jsFiles = 'page/js/myJs/*.js',
    jsDest = 'page/js/myJs/dist';

gulp.task('scripts', function() {
    return gulp.src(jsFiles)
        .pipe(concat('main.js'))
        .pipe(gulp.dest(jsDest))
        //.pipe(rename('main.min.js'))
        .pipe(minify())
        .pipe(gulp.dest(jsDest));
});


gulp.task('serve', function () {
    console.log('Inizio Build task')

    browserSync.init();

    gulp.watch(jsFiles, gulp.series('scripts')).on('change', browserSync.reload)

    console.log('Fine Build task')
});


//Default task
gulp.task('default', gulp.series('serve'));

