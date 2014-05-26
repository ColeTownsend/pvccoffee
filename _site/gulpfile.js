// Load plugins

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    watch = require('gulp-watch'),
    lr    = require('tiny-lr'),
    server = lr(),
    livereload = require('gulp-livereload'),
    minifyCSS = require('gulp-minify-css'),
    sass = require('gulp-ruby-sass'),
    imagemin = require('gulp-imagemin'),
    svgmin = require('gulp-svgmin')


// Task to minify all css files in the css directory
gulp.task('minify-css', function(){
  gulp.src('./css/*.css')
    .pipe(minifyCSS({keepSpecialComments: 0}))
    .pipe(gulp.dest('./css/'));
});

// Reload html
gulp.task('reload', function(){
  gulp.src('*.html')
    .pipe(watch(function(files) {
      return files.pipe(livereload(server));
    }));
});

// Task to optmize and minify images
gulp.task('minify-img', function() {
  return gulp.src('./images/*')
    .pipe((imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('./images'));
});

// Task to optimize and minify svg
gulp.task('minify-svg', function(){
  gulp.src('./images/svg')
          .pipe(svgmin())
          .pipe(gulp.dest('./images/svg'));
});


// Task that compiles scss files down to good old css
gulp.task('pre-process', function(){
  gulp.src('./_sass/i.scss')
      .pipe(watch(function(files) {
        return files.pipe(sass({loadPath: ['./_sass/'], style: "compact"}))
          .pipe(gulp.dest('./css/'))
          .pipe(livereload(server));
      }));
});

/*
   DEFAULT TASK

 • Process sass and lints outputted css
 • Outputted css is run through autoprefixer
 • Sends updates to any files in directory to browser for
   automatic reloading

*/
gulp.task('default', function(){
  server.listen(35729, function (err) {
    gulp.watch(['*.html', '*/*.html', './_sass/*.scss'], function(event) {
      gulp.run('pre-process', 'reload');
    });
  });
});

gulp.task('production', function(){
    gulp.run('minify-css', 'minify-img', 'minify-svg');
});

