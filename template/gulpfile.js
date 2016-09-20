var gulp = require('gulp'),
    jscs = require('gulp-jscs'),
    babel = require('gulp-babel'),
    inject = require('gulp-inject'),
    plumber = require('gulp-plumber'),
    watch = require('gulp-watch'),
    livereload = require('gulp-livereload'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    clean = require('gulp-clean'),
    del = require('del'),
    browserSync = require('browser-sync');

var onError = function (err) {
    console.log('An error occurred:', err.message);
    this.emit('end');
};

gulp.task('check-js-style', function () {
    gulp.src('src/**/*.js')
        .pipe(jscs({fix: true}))
        .pipe(jscs.reporter())
        .pipe(jscs.reporter('fail'))
        .pipe(gulp.dest('src'));
});

gulp.task('serve', function () {
    var files = [
        './../public/*.html',
        './../public/css/**/*.css',
        './../public/js/**/*.js'
    ];

    browserSync.init(files, {
        server: {
            baseDir: './../public'
        }
    });
});

gulp.task('scss', function () {
    return gulp.src('./src/application.scss')
        .pipe(plumber({errorHandler: onError}))
        .pipe(sass())
        .pipe(gulp.dest('./../public/css'));
});

gulp.task('babel', ['scss'], function () {
    return gulp.src('src/**/*.js')
        .pipe(plumber({errorHandler: onError}))
        .pipe(babel())
        .pipe(gulp.dest('./../public/js'));
});

gulp.task('watch', function () {
    gulp.watch('./src/**/*.scss', ['default']);
    gulp.watch('./src/**/*.js', ['default']);
    gulp.watch('./src/**/*.html', ['default']);
});

gulp.task('jshint', ['babel', 'scss'], function () {
    return gulp.src('src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('default', ['cleanDist', 'jshint', 'babel', 'copyJsLib', 'copyCssLib'], function () {
    gulp.src('src/images/**/*')
        .pipe(gulp.dest('../public/images'));
    gulp.src('src/**/*.html')
        .pipe(gulp.dest('../public/'))
        .pipe(inject(gulp.src([
            '../public/js/**/*.js',
            '../public/css/lib/*.css',
            '../public/css/*.css'
        ], {read: false}), {relative: true}))
        .pipe(gulp.dest('../public/'));
});

gulp.task('copyJsLib', ['cleanDist'], function () {
    return gulp.src([
        'bower_components/material-design-lite/material.js',
        'bower_components/d3/d3.js',
        'bower_components/nvd3/build/nv.d3.js',
        'bower_components/getmdl-select/getmdl-select.min.js'
    ])
        .pipe(gulp.dest('../public/js'));
});

gulp.task('copyMinJsLib', ['cleanDist'], function () {
    return gulp.src([
        'bower_components/material-design-lite/material.min.js',
        'bower_components/d3/d3.min.js',
        'bower_components/nvd3/build/nv.d3.min.js',
        'bower_components/getmdl-select/getmdl-select.min.js'
    ])
        .pipe(gulp.dest('../public/js'));
});

gulp.task('copyCssLib', ['cleanDist'], function () {
    return gulp.src([
        'bower_components/nvd3/build/nv.d3.css',
        'bower_components/getmdl-select/getmdl-select.min.css'
    ])
        .pipe(gulp.dest('../public/css/lib'));
});

gulp.task('copyMinCssLib', ['cleanDist'], function () {
    return gulp.src([
        'bower_components/nvd3/build/nv.d3.min.css',
        'bower_components/getmdl-select/getmdl-select.min.css'
    ])
        .pipe(gulp.dest('../public/css/lib'));
});

gulp.task('cleanDist', function () {
    return del('../public/**/*',{force: true});
});

gulp.task('minifyJs', ['cleanDist'], function () {
    return gulp.src('src/**/*.js')
        .pipe(rename({suffix: '.min'}))
        .pipe(plumber({errorHandler: onError}))
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest('../public/js'));
});

gulp.task('minifyCss', ['cleanDist'], function () {
    return gulp.src('src/application.scss')
        .pipe(plumber({errorHandler: onError}))
        .pipe(sass())
        .pipe(minifycss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('../public/css'));
});

gulp.task('build', ['minifyJs', 'minifyCss', 'copyMinCssLib', 'copyMinJsLib'], function () {
    gulp.src('src/*.html')
        .pipe(gulp.dest('../public/'))
        .pipe(inject(gulp.src([
            '../public/js/**/*.js',
            '../public/css/lib/*.css',
            '../public/css/*.css'
        ], {read: false}), {relative: true}))
        .pipe(gulp.dest('../public/'));
    gulp.src('src/images/**/*')
        .pipe(gulp.dest('../public/images'));
});