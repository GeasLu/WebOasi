var gulp = require('gulp');
var concat = require('gulp-concat');
const minify = require('gulp-minify');
var browserSync = require('browser-sync').create();

//script paths
var jsFiles = 'page/js/myJs/*.js',
    jsDest = 'page/js/myJs/dist';

var htmlFiles = 'page/view/*.php'
	
gulp.task('scriptsJs', function() {
    return gulp.src(jsFiles)
        .pipe(concat('main.js'))
        .pipe(gulp.dest(jsDest))
        //.pipe(rename('main.min.js'))
        .pipe(minify())
        .pipe(gulp.dest(jsDest));
});

gulp.task('scriptsHtml', function() {
    return gulp.src(htmlFiles);
});


gulp.task('serve', function () {
    console.log('Inizio Build task')

    browserSync.init();

	gulp.watch(htmlFiles, gulp.series('scriptsHtml')).on('change', browserSync.reload)
    gulp.watch(jsFiles, gulp.series('scriptsJs')).on('change', browserSync.reload)

    console.log('Fine Build task')
});


//Default task
gulp.task('default', gulp.series('serve'));

