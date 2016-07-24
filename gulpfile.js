var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('build', function() {
  gulp.src('./dist/built.js')
    .pipe(concat('built.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));

  gulp.src('./src/style.css')
    .pipe(rename('built.css'))
    .pipe(gulp.dest('./dist'))
});

gulp.task('default', ['build']);
