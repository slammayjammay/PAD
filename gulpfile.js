var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('build', function() {
  gulp.src('./dist/built.js')
    .pipe(concat('built.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['build']);
