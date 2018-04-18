var gulp = require('gulp');
var cleanCompiledTypeScript = require('gulp-clean-compiled-typescript');

gulp.task('clear', function () {
	return gulp.src('./src/**/*.ts').pipe(cleanCompiledTypeScript());
});

gulp.task('default', function() {
  console.log('No default task exists');
});