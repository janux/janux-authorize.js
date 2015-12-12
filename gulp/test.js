'use strict';
//
// compile and run TypeScript test files
//

var	ts = require('gulp-typescript'),
    mocha = require('gulp-mocha');

module.exports = function(gulp) {

    var cfg = gulp.cfg;

    //
    // Compile TypeScript and include references to library and app .d.ts files.
    //
    gulp.task('ts-test', function () {
        console.log('compiling test ts files...');
        var tsResult =  gulp.src(cfg.fileset.tsTest)
            .pipe(ts({
                sortOutput: true,
                module: "commonjs",
                removeComments: true,
                target: "ES5"
            }));

        return tsResult.js
            .pipe(gulp.dest(cfg.dir.test));
    });

    gulp.task('test', ['ts-test'], function() {
        return gulp.src(cfg.dir.test+'/*.spec.js', {read: false})
            .pipe(mocha({reporter: 'nyan'}));
    });
};
