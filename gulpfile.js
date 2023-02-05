const { src, dest, watch, parallel, series } = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const prefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const del = require('del');

function browsersync() {
	browserSync.init({
		server: {
			baseDir: 'app/'
		},
		browser: "chrome",
		notify: false
	})
}

function styles() {
	return src('app/scss/main.scss')
		.pipe(scss({ outputStyle: 'compressed' }))
		.pipe(concat('main.min.css'))
		.pipe(prefixer({
			overrideBrowserslist: ['last 10 versions'],
			grid: true
		}))
		.pipe(dest('app/css'))
		.pipe(browserSync.stream())
}

function scripts() {
	return src([
		'app/js/main.js'
	])
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(dest('app/js'))
		.pipe(browserSync.stream())
}

function images() {
	return src('app/images/**/*.*')
		.pipe(imagemin([
			imagemin.gifsicle({ interlaced: true }),
			imagemin.mozjpeg({ quality: 75, progressive: true }),
			imagemin.optipng({ optimizationLevel: 5 }),
			imagemin.svgo({
				plugins: [
					{ removeViewBox: true },
					{ cleanupIDs: false }
				]
			})
		]))
		.pipe(dest('dist/images'))
}

function build() {
	return src([
		'app/**/*.html',
		'app/css/main.min.css',
		'app/js/main.min.js'
	], { base: 'app' })
		.pipe(dest('dist'))
}

function cleanDist() {
	return del('dist')
}

function watching() {
	watch(['app/scss/**/*.scss'], styles);
	watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
	watch(['app/**/*.html']).on('change', browserSync.reload);
}

exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.images = images;
exports.watching = watching;
exports.cleanDist = cleanDist;

exports.build = series(cleanDist, images, build);
exports.default = parallel(styles, scripts, browsersync, watching);