// npm install --save-dev gulp gulp-pug gulp-sass gulp-clean-css gulp-autoprefixer gulp-livescript gulp-jshint gulp-concat gulp-uglify gulp-rename gulp-webserver gulp-livereload gulp-clean

var gulp = require("gulp");
var pug = require("gulp-pug");    // jade template engine

var sass = require("gulp-sass");
var cleanCss = require("gulp-clean-css");
var autoprefixer = require("gulp-autoprefixer");

var livescript = require("gulp-livescript");
var jshint = require("gulp-jshint");    // js hint
var concat = require("gulp-concat");    // js concat
var uglify = require("gulp-uglify");    // js uglify
var rename = require("gulp-rename");    // rename

var webserver = require("gulp-webserver");  // a simple webserver
var livereload = require("gulp-livereload");    // livereload

var clean = require("gulp-clean");  // clean
var errorNotifier = require('gulp-error-notifier');


gulp.task("webserver", function() {
    gulp.src("./")
        .pipe(webserver({
            livereload:true,
            open:false
        }));
});

gulp.task("templates", function() {
    var src = "./src/templates/*.jade";
    var dist = "./";

    gulp.src(src)
        .pipe(errorNotifier.handleError(
            pug()
        ))
        .pipe(gulp.dest(dist));
});

gulp.task("style", function() {
    var src = "./src/scss/*.scss";
    var dist = "./dist/css/";

    gulp.src(src)
        .pipe(errorNotifier.handleError(
            sass()
        ))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({suffix: ".min"}))
        .pipe(cleanCss())
        .pipe(gulp.dest(dist));
});

gulp.task("script", function() {
    var src = "./src/js/*.js";
    var dist = "./dist/js/";

    gulp.src(src)
        // .pipe(errorNotifier.handleError(
        //     livescript({
        //         bare: true
        //     })
        // ))
        .pipe(concat("main.js"))
        .pipe(rename({suffix: ".min"}))
        // .pipe(uglify())
        .pipe(gulp.dest(dist));
});

gulp.task("clean", function() {
    var target = "./dist/*";

    gulp.src([target], {read: false})
        .pipe(clean());
});

gulp.task("watch", function() {
    gulp.watch("./src/templates/*.jade", ["templates"]);

    gulp.watch("./src/scss/*.scss", ["style"]);

    gulp.watch("./src/js/*.js", ["script"]);
});

gulp.task("default", function() {
    gulp.start("templates", "style", "script", "watch");
});