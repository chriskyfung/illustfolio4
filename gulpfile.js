var gulp = require('gulp');
var sass = require('gulp-sass');
var pleeease = require('gulp-pleeease');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var ejs = require("gulp-ejs");
var plumber = require("gulp-plumber");

// Sass

gulp.task('sass', function () {
    gulp.src('sass/**/*.scss')
        .pipe(sass().on('error', sass.logError)) // Keep running gulp even though occurred compile error
        .pipe(pleeease({
            autoprefixer: {
                browsers: ['last 2 versions', 'Android 4.3']
            }
        }))
        .pipe(gulp.dest('build/css'))
        .pipe(reload({stream:true}));
});

// Js-concat-uglify

gulp.task('js', function() {
    gulp.src(['js/*.js'])
        .pipe(concat('scripts.js'))
        .pipe(uglify({preserveComments: 'some'})) // Keep some comments
        .pipe(gulp.dest('build/js'))
        .pipe(reload({stream:true}));
});

// Imagemin

gulp.task('imagemin', function() {
    gulp.src(['images/**/*.{png,jpg,gif,svg}'])
        .pipe(imagemin({
            optimizationLevel: 7,
            use: [pngquant({
                quality: '60-80',
                speed: 1
            })]
        }))
        .pipe(gulp.dest('build/images'));
});

// ejs

var fs = require('fs');
var json = JSON.parse(fs.readFileSync("site.json")); // parse json
gulp.task("ejs", function() {
    gulp.src(['templates/*.ejs','!' + 'templates/_*.ejs']) // Don't build html which starts from underline
        .pipe(plumber())
        .pipe(ejs(json, {"ext": ".html"}))
        .pipe(gulp.dest('build'))
});

// Static server

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "build/", //　Target directory
            index  : "index.html", // index file
            https: true
        }
    });
});

// Reload all browsers

gulp.task('bs-reload', function () {
    browserSync.reload();
});

// Task for `gulp` command

gulp.task('default',['browser-sync'], function() {
    gulp.watch('sass/**/*.scss',['sass']);
    gulp.watch('js/*.js',['js']);
    gulp.watch('images/**',['imagemin']);
    gulp.watch("build/*.html", ['bs-reload']);
    gulp.watch(['templates/*.ejs', 'site.json'], ['ejs']);
});
