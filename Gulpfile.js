
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");

gulp.task('compress', function() {
  return gulp.src('codice.fiscale.js')
    .pipe(uglify())
    .pipe(rename('codice.fiscale.min.js'))
    .pipe(gulp.dest('.'));
});

gulp.task('default', ['compress'], function() {
  // place code for your default task here
});
