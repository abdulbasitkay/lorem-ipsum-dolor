var gulp = require('gulp');
var models = require('./server/models');
var exit = require('gulp-exit');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');


var paths = {
  serverTest: './test/server/**/*.js',
  serverFiles: './server/**/*.js'
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
      reporters: ['lcov']
    }));
});

gulp.task('test', ['server:test']);
