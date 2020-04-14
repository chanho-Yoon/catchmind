import gulp from 'gulp';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import minifyCSS from 'gulp-csso'; //코드 일자정렬
import del from 'del';
import browserify from 'gulp-browserify';
import babelify from 'babelify';
sass.compiler = require('node-sass');

const paths = {
  styles: {
    src: 'src/assets/scss/styles.scss',
    dest: 'src/static/',
    watch: 'src/assets/scss/**/*.scss'
  },
  js: {
    src: 'src/assets/js/main.js',
    dest: 'src/static/',
    watch: 'src/assets/js/**/*.js'
  }
};
const clean = () => del(['src/static']);

const styles = () =>
  gulp
    .src(paths.styles.src, { allowEmpty: true })
    .pipe(sass())
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      })
    )
    .pipe(minifyCSS())
    .pipe(gulp.dest(paths.styles.dest));

const js = () =>
  gulp
    .src(paths.js.src, { allowEmpty: true })
    .pipe(
      browserify({
        transform: [
          babelify.configure({
            presets: ['@babel/preset-env']
          })
        ]
      })
    )
    .pipe(gulp.dest(paths.js.dest));

const watchFiles = () => {
  gulp.watch(paths.styles.watch, styles);
  gulp.watch(paths.js.watch, js);
};

// const dev = gulp.series(clean, styles, js, watchFiles);
const dev = gulp.series(clean, styles, js);

export const build = gulp.series(clean, styles, js);

export default dev;
