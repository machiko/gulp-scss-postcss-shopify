var gulp = require('gulp');
var sass = require('gulp-sass') ;
var notify = require('gulp-notify') ;
var bower = require('gulp-bower');
var rename = require('gulp-rename');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var postcss_partial_import = require('postcss-partial-import');
var postcss_shopify_settings_variables = require('postcss-shopify-settings-variables');
var sourcemaps = require('gulp-sourcemaps');

var config = {
     bootstrapDir: './bower_components/bootstrap-sass-official/',
     fontawesomeDir: './bower_components/fontawesome/',
     publicDir: './public' 
};

gulp.task('css', function() { 
    return gulp.src('./resources/sass/style.scss')
    .pipe(sass({
        includePaths: [config.bootstrapDir + '/assets/stylesheets'],
    }) 
    .on("error", notify.onError(function (error) {
        return "Error: " + error.message;
    })))
    .pipe(notify({ message: 'scss convert to css done.'}))
    .pipe(gulp.dest(config.publicDir + '/css')); 
});

gulp.task('postcss', ['css'], function() {
    var processors = [
        postcss_partial_import,
        autoprefixer
    ]
    return gulp.src(config.publicDir + '/css/style.css', { base: './' })
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./'))
    .pipe(notify({ message: 'postcss done.' }))
});

gulp.task('shopify', function() {
    var processors = [
        postcss_shopify_settings_variables
    ];
    return gulp.src(config.publicDir + '/css/style.css')
    .pipe(postcss(processors))
    .pipe(rename(function(path) {
        path.extname = '.css.liquid'
    }))
    .pipe(gulp.dest('./assets/'))
    .pipe(notify({ message: 'shopify!!!' }))
});

gulp.task('icons', function() {
    return gulp.src(config.fontawesomeDir + '/fonts/**.*')
    .pipe(gulp.dest('./public/fonts'));
});

// Rerun the task when a file changes
 gulp.task('watch', function() {
     gulp.watch('./resources/sass/*.scss', ['css']); 
});

  gulp.task('default', ['css', 'icons', 'postcss']);
