const gulp = require('gulp');
const runSequence = require('gulp4-run-sequence');
var shelljs = require('shelljs');

gulp.task('pre-build', function (done) {
    runSequence('copy-extensions-assets', 'update-extensions-export', 'clean', 'copy-src-assets', done);
})

gulp.task('build', function (done) {
    if (shelljs.exec('npm run build').code == 0) {
        console.log('******* Build Successfully *******');
        done();
    }
    else
        process.exit(1);
})

gulp.task('clean', function (done) {
    shelljs.rm('-rf', 'dist');
    done();
})