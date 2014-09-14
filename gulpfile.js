// "use strict";
//
// // load plugins
// var gulp = require('gulp'),
//     $ = require('gulp-load-plugins')();
//
// gulp.task('styles', function () {
//     return gulp.src('public/styles/main.less')
//         .pipe($.less())
//         .pipe($.autoprefixer('last 1 version'))
//         .pipe(gulp.dest('.tmp/styles'))
//         .pipe($.size());
// });
//
// gulp.task('scripts', function () {
//     return gulp.src('public/scripts/**/*.js')
//         .pipe($.jshint())
//         .pipe($.jshint.reporter(require('jshint-stylish')))
//         .pipe($.size());
// });
//
// gulp.task('html', ['styles', 'scripts'], function () {
//     var jsFilter = $.filter('**/*.js');
//     var cssFilter = $.filter('**/*.css');
//     return gulp.src('public/*.html')
//         .pipe($.useref.assets({searchPath: '{.tmp,public}'}))
//         .pipe(jsFilter)
//         .pipe($.uglify())
//         .pipe(jsFilter.restore())
//         .pipe(cssFilter)
//         .pipe($.csso())
//         .pipe(cssFilter.restore())
//         .pipe($.useref.restore())
//         .pipe($.useref())
//         .pipe(gulp.dest('dist'))
//         .pipe($.size());
// });
//
// gulp.task('images', function () {
//     return gulp.src('public/images/**/*')
//         .pipe($.cache($.imagemin({
//             optimizationLevel: 3,
//             progressive: true,
//             interlaced: true
//         })))
//         .pipe(gulp.dest('dist/images'))
//         .pipe($.size());
// });
//
// gulp.task('fonts', function () {
//     return $.bowerFiles()
//         .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
//         .pipe($.flatten())
//         .pipe(gulp.dest('dist/fonts'))
//         .pipe($.size());
// });
//
// gulp.task('extras', function () {
//     return gulp.src(['public/*.*', '!public/*.html'], { dot: true })
//         .pipe(gulp.dest('dist'));
// });
//
// gulp.task('clean', function () {
//     return gulp.src(['.tmp', 'dist'], { read: false }).pipe($.clean());
// });
//
// gulp.task('build', ['html', 'images', 'fonts', 'extras']);
//
// gulp.task('default', ['clean'], function () {
//     gulp.start('build');
// });
//
// gulp.task('connect', function () {
//     var connect = require('connect');
//     var app = connect()
//         .use(require('connect-livereload')({ port: 35729 }))
//         .use(connect.static('public'))
//         .use(connect.static('.tmp'))
//         .use(connect.directory('public'));
//
//     require('http').createServer(app)
//         .listen(9000)
//         .on('listening', function () {
//             console.log('Started connect web server on http://localhost:9000');
//         });
// });
//
// gulp.task('serve', ['connect', 'styles'], function () {
//     require('opn')('http://localhost:9000');
// });
//
// // inject bower components
// gulp.task('wiredep', function () {
//     var wiredep = require('wiredep').stream;
//     gulp.src('public/styles/*.less')
//         .pipe(wiredep({directory: 'public/bower_components'}))
//         .pipe(gulp.dest('public/styles'));
//     gulp.src('public/*.html')
//         .pipe(wiredep({directory: 'public/bower_components'}))
//         .pipe(gulp.dest('public'));
// });
//
// gulp.task('watch', ['connect', 'serve'], function () {
//     var server = $.livereload();
//     // watch for changes
//     gulp.watch([
//         'public/*.html',
//         '.tmp/styles/**/*.css',
//         'public/scripts/**/*.js',
//         'public/images/**/*'
//     ]).on('change', function (file) {
//         server.changed(file.path);
//     });
//     gulp.watch('public/styles/**/*.less', ['styles']);
//     gulp.watch('public/scripts/**/*.js', ['scripts']);
//     gulp.watch('public/images/**/*', ['images']);
//     gulp.watch('bower.json', ['wiredep']);
// });
