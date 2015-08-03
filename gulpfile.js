/*
 * Gulpfile - Build LESS Files to CSS
 * How to run:
 * npm install --global gulp
 * gulp less
 * This should build the css file for you.
 */

var gulp = require('gulp');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var path = require('path');

var paths = {
  less: ['./public/stylesheets/less/*.less']
};

gulp.task('less', function () {
  return gulp.src('./public/stylesheets/importer.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/stylesheets/css'));
});


gulp.task('default', ['less']);
