var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('default', function() {
  gulp.src(['./src/board.js', './src/game.js', './src/match.js', './src/orb.js', './src/painter.js'])
    .pipe(concat('built.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));
});
