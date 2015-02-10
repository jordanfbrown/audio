var gulp = require('gulp')
var to5ify = require('6to5ify')
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var browserify = require('browserify');
var reactify = require('reactify');

var bundler = watchify(browserify('./js/main.js', watchify.args));
bundler.transform(reactify);
bundler.transform(to5ify);

gulp.task('js', bundle);
bundler.on('update', bundle);

function bundle() {
  return bundler.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // optional, remove if you dont want sourcemaps
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
    .pipe(sourcemaps.write('./')) // writes .map file
    //
    .pipe(gulp.dest('./dist'))

}


//gulp.task('browserify', function() {
//  var bundler = browserify({
//    entries: ['./js/main.js'],
//    transform: [reactify, to5ify],
//    debug: true,
//    cache: {},
//    packageCache: {},
//    fullPaths: true
//  })
//
//  var watcher = watchify(bundler);
//  return watcher.on('update', function() {
//    console.log('Updating');
//    watcher.bundle()
//      .pipe(source('bundle.js'))
//      .pipe(gulp.dest('./dist'))
//  })
//  .bundle()
//  .pipe(source('main.js'))
//
//
//});