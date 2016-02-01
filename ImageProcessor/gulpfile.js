// sudo npm install --save-dev gulp-jade gulp-sass gulp-cssnano gulp-jshint gulp-concat gulp-uglify gulp-rename gulp-webserver gulp-livereload gulp-clean

var gulp = require("gulp");
var jade = require("gulp-jade");    // jade template engine

var sass = require("gulp-sass");
var cssnano = require("gulp-cssnano");     // minify css

var jshint = require("gulp-jshint");    // js hint
var concat = require("gulp-concat");    // js concat
var uglify = require("gulp-uglify");    // js minify
var rename = require("gulp-rename");    // rename

var webserver = require("gulp-webserver");  // a simple webserver
var livereload = require("gulp-livereload");    // livereload

var clean = require("gulp-clean");  // clean


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
        .pipe(jade())
        .pipe(gulp.dest(dist));
});

gulp.task("css", function() {
    var src = "./src/css/*.scss";
    var dist = "./dist/css/";
    gulp.src(src)
        .pipe(sass())
        .pipe(rename({suffix: ".min"}))
        .pipe(cssnano())
        .pipe(gulp.dest(dist));
});

gulp.task("js", function() {
    var src = "./src/js/*.js";
    var dist = "./dist/js/";
    gulp.src(src)
        .pipe(jshint())
        .pipe(jshint.reporter("default"))
        .pipe(concat("main.js"))
        .pipe(gulp.dest(dist))
        .pipe(rename({suffix: ".min"}))
        .pipe(uglify())
        .pipe(gulp.dest(dist));
});

gulp.task("clean", function() {
    gulp.src(["./dist/js/*"], {read: false})
        .pipe(clean());
});

gulp.task("watch", function() {
    gulp.watch("./src/templates/*.jade", ["templates"]);

    gulp.watch("./src/css/*.scss", ["css"]);

    gulp.watch("./src/js/*.js", ["js"]);
});

gulp.task("default", function() {
    gulp.start("clean", "webserver", "templates", "css", "js", "watch");
});