var gulp = require('gulp');
var models = require('./server/models');
var exit = require('gulp-exit');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');
var coveralls = require('gulp-coveralls');
var browserify = require('browserify');
var fs = require('fs');
var babelify = require('babelify');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');


var paths = {
  serverTest: './test/server/**/*.js',
  serverFiles: './server/**/*.js',
  js: ['./app/**/*.js', './server/**/*.js']
};

gulp.task('coverage-setup', function () {
  return gulp.src(paths.serverFiles)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('db:sync', function () {
  return models.sequelize.sync().then(exit());
});

gulp.task('server:test',['db:sync', 'coverage-setup'], function () {
  process.env.NODE_ENV = 'test';
  return gulp.src(paths.serverTest)
    .pipe(mocha())
    .pipe(istanbul.writeReports({
      dir: './test/coverage',
    }));
});

gulp.task('coveralls', function () {
  return gulp.src('./test/coverage/lcov.info')
    .pipe(coveralls());
});

gulp.task('build', function () {
  return browserify('./app/main.js')
    .transform(babelify)
    .transform('vueify')
    .bundle()
    .pipe(fs.createWriteStream('./dist/bundle.js'));
});

gulp.task('jshint', function () {
  return gulp.src(paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('test', ['server:test', 'coveralls']);
