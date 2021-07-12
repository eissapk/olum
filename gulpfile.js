const gulp = require("gulp");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const header = require('gulp-header');

const comment = 
`/**
* @name Olum.js
* @version 1.0.0
* @copyright 2021
* @author Eissa Saber
* @license MIT
*/
`;

gulp.task("compile", () => {
  return gulp
    .src("./src/olum.js")
    .pipe(concat("olum.min.js"))
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(uglify())
    .pipe(header(comment))
    .pipe(gulp.dest("dist"));
});
gulp.task("copy", () => gulp.src("./src/olum.js").pipe(gulp.dest("dist")));

gulp.task("default", gulp.series(["compile", "copy"]));
