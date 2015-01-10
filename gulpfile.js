var 
  pkg = require('./package.json'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  jshint = require('gulp-jshint'),
  jscs = require('gulp-jscs'),
  //concatSourcemap = require('gulp-concat-sourcemap'),
  uglify = require('gulp-uglify'),
  header = require('gulp-header'),
  concat = require('gulp-concat'),
  csso = require('gulp-csso'),
  shell = require('gulp-shell'),
    
  outDirJS = 'dest',
  outFileJS = 'dom5.min.js',

  banner = [
    '/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @repository <%= pkg.homepage %>',
    ' * @author <%= pkg.author %>',
    ' * @license <%= pkg.license %>',
    ' * @build <%= new Date().toLocaleString() %>',
    ' */',
    '',
    ''
  ].join('\n')
;

gulp.task('Lint scripts', 
  function () {
    return gulp.src([
        'src/**/*.js', 
        'test/spec/*.js',
        'gulpfile.js'
      ])
      .pipe(jshint('.jshintrc'));
  }
);

gulp.task('Check code style of scripts', 
  function () {
    return gulp.src([
      'src/**/*.js', 
      'test/spec/*.js'
    ])
    .pipe(jscs());
  }
);

gulp.task('Minify script', 
  function() {
    return gulp.src('src/dom5.js')
      .pipe(uglify())
      .pipe(header(banner, { pkg : pkg }))
      .pipe(concat(outFileJS))
      .pipe(gulp.dest(outDirJS));
  }
);

gulp.task('Estimate gzip size of minified script', 
  shell.task([
    'echo "[INFO] GZIPSIZE \'' + gutil.colors.cyan(outFileJS) + '\' estimated' +
      gutil.colors.magenta('" `gzip -c ' + outDirJS + '/' + outFileJS + ' | wc -c ` "bytes"') + ' [INFO]'
  ])
);


gulp.task('default', [
  'Lint scripts',
  'Check code style of scripts',
  'Minify script',
  'Estimate gzip size of minified script'
]);