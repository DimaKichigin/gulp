const gulp = require('gulp');

// HTML
const fileInclude = require('gulp-file-include');
const htmlclean = require('gulp-htmlclean')

// SASS
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob')
const autoprefixer = require('gulp-autoprefixer')
const csso = require('gulp-csso')
const webpCss = require('gulp-webp-css')
const postcss = require('gulp-postcss')
const sugarss = require('sugarss')
const nested = require('postcss-nested')

const server = require('gulp-server-livereload')
const sync = require('browser-sync').create()
const clean = require('gulp-clean')
const fs = require('fs')
const sourceMaps = require('gulp-sourcemaps')
const groupMedia = require('gulp-group-css-media-queries')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const webpack = require('webpack-stream')
const babel = require('gulp-babel')
const changed = require('gulp-changed')

// IMAGES
const imagemin = require('gulp-imagemin')
const webp = require('gulp-webp')
const webpHTML = require('gulp-webp-html')

// Отчистка файлов от папки docs. Но у меня удаляет только содержимое папки
// с помощью + '/**/*'

gulp.task('clean:docs', function(done) {
	if (fs.existsSync('./docs/')) {
		return gulp
		.src('docs' + '/**/*', { read: false })
		.pipe(clean({ force: true }))
	}
	done()
})



const fileIncludeSetting = {
	prefix: '@@',
	basepath: '@file'
}

const plumberNotify = (title) => {
	return {
		errorHandler: notify.onError({
			title: title,
			message: 'Error <%= error.message %>',
			sound: false
		})
	}
}

// dest html - сохранить все в папку ./docs/
// Исключить папку blocks - '!./src/html/blocks/*.html'
// Доп: './src/html/blog/*.html', './src/html/blocks/*.html', '!./src/html/blocks/*.html'

gulp.task('html:docs', function() {
	return gulp
		.src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
		.pipe(changed('./docs/'))
		.pipe(plumber(plumberNotify('HTML')))
		.pipe(fileInclude(fileIncludeSetting))
		.pipe(webpHTML())
		.pipe(htmlclean())
		.pipe(gulp.dest('./docs/')) 
})

// Добавление карты кода sourceMaps в main.css для чтения изначального пути нахождения файлов css в браузере
// 	.pipe(groupMedia())

const plugins = [nested]

gulp.task('sass:docs', function() {
	return gulp
		.src('./src/scss/**.scss')
		.pipe(changed('./docs/css/'))
		.pipe(plumber(plumberNotify('SCSS')))
		.pipe(sourceMaps.init())
		.pipe(autoprefixer())
		.pipe(sassGlob())
		.pipe(webpCss())
		.pipe(groupMedia())
		.pipe(sass())
		// .pipe(csso())
		.pipe(sourceMaps.write())
		.pipe(gulp.dest('./docs/css/'))
})

gulp.task('fonts:docs', function() {
	return gulp
		.src('./src/fonts/**/*')
		.pipe(changed('./docs/fonts/'))
		.pipe(gulp.dest('./docs/fonts/'))
	})
	
	gulp.task('images:docs', function() {
		return gulp
		.src('./src/img/**/*')
		.pipe(changed('./docs/img/'))
		.pipe(webp())
		.pipe(gulp.dest('./docs/img/'))
		.pipe(gulp.src('./src/img/**/*'))
		.pipe(changed('./docs/img/'))
		.pipe(imagemin({ verbose: true }))
		.pipe(gulp.dest('./docs/img/'))
})

gulp.task('files:docs', function() {
	return gulp
		.src('./src/files/**/*')
		.pipe(changed('./docs/files/'))
		.pipe(gulp.dest('./docs/files/'))
})

gulp.task('js:docs', function() {
	return gulp
		.src('./src/js/*.js')
		.pipe(changed('./docs/js/'))
		.pipe(plumber(plumberNotify('JS')))
		.pipe(babel())
		.pipe(webpack(require('./../webpack.config.js')))
		.pipe(gulp.dest('./docs/js/'))
})

// const serverOptions = {
// 	livereload: true,
// 	open: true,
// }

// gulp.task('server', function() {
// 	return gulp.src('./docs')
// 		.pipe(server(serverOptions))
// })

// { allowEmpty: true } или
//  + '/**/*'

// Запуск сервера
// Через livereload не вышло, поэтому скачал broswersync

gulp.task('server:docs', function serve() {
	sync.init({
		server: './docs'
	})
})




