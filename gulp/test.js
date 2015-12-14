'use strict';
//
// compile and run TypeScript test files
//

var	ts = require('gulp-typescript'),
    mocha = require('gulp-mocha'),
    sourcemaps = require('gulp-sourcemaps');

module.exports = function(gulp) {

    var cfg = gulp.cfg;

    var tsConfig = {
        sortOutput: true,
        module: "commonjs",
        removeComments: true,
        target: "ES5"
    };

    //
    // Compile TypeScript and include references to library and app .d.ts files.
    //
    gulp.task('ts-src', function () {
        console.log('compiling project source files for test...');

        return  gulp.src(cfg.fileset.ts)
            .pipe(sourcemaps.init())
            .pipe(ts(tsConfig))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(cfg.dir.src));
    });

    gulp.task('ts-test', function () {
        console.log('compiling typescript test files...');

        return gulp.src(cfg.fileset.tsTest)
            .pipe(sourcemaps.init())
            .pipe(ts(tsConfig))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(cfg.dir.test));
    });

    gulp.task('test', ['ts-test', 'ts-src'], function() {
        return gulp.src(cfg.dir.test+'/*.spec.js', {read: false})
            .pipe(mocha({reporter: 'nyan'}));
    });
};
