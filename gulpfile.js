const gulp = require("gulp");
const rigger = require("gulp-rigger");
const sass = require("gulp-sass");
const bs = require("browser-sync").create();
const del = require("del");

gulp.task("html", function() {
	return gulp.src("client/**/*.html")
		.pipe(gulp.dest("public"));
});

gulp.task("style", function () {
	return gulp.src("client/style/main.sass")
		.pipe(sass())
		.pipe(gulp.dest("public/style/"));
});

gulp.task("js", function () {
	return gulp.src("client/js/*.js")
		.pipe(rigger())
		.pipe(gulp.dest("public/js/"))
});

gulp.task("clean", function () {
	return del("public");
});

gulp.task("watch", function () {
	gulp.watch("client/**/*.html", gulp.series("html"));
	gulp.watch("client/**/*.js", gulp.series("js"));
	gulp.watch("client/**/*.sass", gulp.series("style"));

	gulp.watch("client/**/*.*", function (done) {
		bs.reload();
		done();
	});
});

gulp.task("browser", function () {
	bs.init({
		server: false,
		ghostMode: false,
		proxy: {
			target: "http://localhost:7050",
			ws: true
		}
	});
});

gulp.task("default",
	gulp.series(
		"clean",
		"html", "style", "js",
		gulp.parallel("watch", "browser")
	)
);