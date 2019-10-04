'use strict';
let config = require('./gconfig');
let gulp = require('gulp');
let $ = require('gulp-load-plugins')();
let spritesmith  = require("gulp.spritesmith");
// defalut
gulp.task('default', ['clean'],  $.sequence('sprite', 'wxss', 'watch'))
// watch
gulp.task('watch', function () {
  gulp.watch(config.sprite.src, ['sprite'])// sprite
  gulp.watch('./src/**/*.scss', ['wxss'])// wxss
})
// clean
gulp.task('clean', function () {
  return gulp.src(config.clean.src).pipe($.clean());
})
// wxss
gulp.task('wxss', function () {
  return gulp.src(config.wxss.src)
    .pipe($.plumber())
    // .pipe($.cached('wxss'))
    .pipe($.sass())
    .pipe($.autoprefixer(config.wxss.autoprefixer))
    .pipe($.minifyCss(config.wxss.minifyCss))
    .pipe($.rename(config.wxss.rename))
    .pipe($.plumber.stop())
    .pipe(gulp.dest(config.wxss.dest))
})
// sprite
gulp.task('sprite', function () {
  gulp.src(config.sprite.src)
    .pipe(spritesmith(config.sprite.spritesmith))
    .pipe(gulp.dest(config.sprite.dest))
})