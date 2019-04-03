var gulp = require('gulp'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin');

    sass.compiler = require('node-sass');

var style_src = [
  './src/sass/main.scss'
]
var style_build = [
  './build/css/'
]



function styles(){
  return gulp.src(style_src)
             .pipe(sourcemaps.init())
             .pipe(sass().on('error', sass.logError))
             .pipe(gulp.dest(style_build))
             .pipe(autoprefixer({
                  browsers: ['>0.1%'],
                  cascade: false
              }))
             .pipe(cleanCSS({
               level: 2
             }))
             .pipe(sourcemaps.write('./'))
             .pipe(gulp.dest('./build/css'))
             .pipe(browserSync.stream());
}

function images () {
  return gulp.src('./src/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./build/img'))
}


function watch(){
  browserSync.init({
      server: {
          baseDir: "./"
      }
  });

  gulp.watch('./src/sass/**/*.scss', styles);
  gulp.watch('./src/blocks/**/*.scss', styles);
  gulp.watch('./src/img/**/*', images);

  browserSync.watch('./*.html', browserSync.reload);
  browserSync.watch('./src/**/*.scss', browserSync.reload);

  gulp.watch('./*.html', browserSync.reload);
  gulp.watch('./src/**/*.scss', browserSync.reload);
}

function clean(){
  return del(['build/*'])
}

//gulp.task('styles', styles);
//gulp.task('scripts', scripts);
gulp.task('watch', watch);
gulp.task('images', images);
gulp.task('build', gulp.series(clean, gulp.parallel(styles, images)));
gulp.task('dev', gulp.parallel('build', 'watch'));
