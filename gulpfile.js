const gulp = require("gulp"); //Подключаем галп
const concat = require("gulp-concat"); //Объединение файлов
const autoprefixer = require("gulp-autoprefixer"); //Добавление префиксов
const cleanCSS = require("gulp-clean-css"); //Оптимизация стилей
const uglify = require("gulp-uglify"); //Оптимизация скриптов
const del = require("del"); //Удаление файлов
const browserSync = require("browser-sync").create(); //Синхронизация с браузером
const sourcemaps = require("gulp-sourcemaps"); //Для препроцессоров стилей
const sass = require("gulp-sass")(require("sass")); //Sass препроцессор
const less = require("gulp-less"); //Less препроцессор
const stylus = require("gulp-stylus"); //Stylus препроцессор
const imagemin = require("gulp-imagemin"); //Модуль для сжатия изображений
const rename = require("gulp-rename"); //Модуль переименовывания файлов

const styleFiles = ["./src/scss/variables.scss", "./src/scss/main.scss"]; //Порядок подключения файлов со стилями
const scriptFiles = ["./src/js/main.js"]; //Порядок подключения js файлов
const html = ["./index.html"];

gulp.task("html", () => {
  return gulp
    .src(html) // указываем исходный файл
    .pipe(gulp.dest("build")); // указываем папку, в которую нужно скопировать файл
});

// Таск для обработки стилей
gulp.task("styles", () => {
  //Шаблон для поиска файлов SCSS
  //Все файлы по шаблону './src/css/**/*.css'
  return (
    gulp
      .src(styleFiles)
      .pipe(sourcemaps.init())
      //Указать stylus(), sass() или less()
      .pipe(sass())
      //Объединение файлов в один
      .pipe(concat("style.css"))
      //Добавить префиксы
      .pipe(
        autoprefixer({
          cascade: false
        })
      )
      // Минификация CSS
      .pipe(
        cleanCSS({
          level: 2
        })
      )
      .pipe(sourcemaps.write("./"))
      .pipe(
        rename({
          suffix: ".min"
        })
      )
      //Выходная папка для стилей
      .pipe(gulp.dest("./build/css"))
      .pipe(browserSync.stream())
  );
});

//Таск для обработки скриптов
gulp.task("scripts", () => {
  //Шаблон для поиска файлов JS
  //Все файлы по шаблону './src/js/**/*.js'
  return (
    gulp
      .src(scriptFiles)
      //Выходная папка для скриптов
      .pipe(gulp.dest("./build/js"))
      .pipe(browserSync.stream())
  );
});

//Таск для очистки папки build
gulp.task("del", () => {
  return del(["build/*"]);
});

//Таск для сжатия изображений
gulp.task("img-compress", () => {
  return gulp
    .src("./src/img/**")
    .pipe(
      imagemin({
        progressive: true
      })
    )
    .pipe(gulp.dest("./build/img/"));
});

//Таск для отслеживания изменений в файлах
gulp.task("watch", () => {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
  //Следить за добавлением новых изображений
  gulp.watch("./src/img/**", gulp.series("img-compress"));
  //Следить за файлами со стилями с нужным расширением
  gulp.watch("./src/css/**/*.scss", gulp.series("styles"));
  //Следить за JS файлами
  gulp.watch("./src/js/**/*", gulp.series("scripts"));
  //При изменении HTML запустить синхронизацию
  gulp.watch("./*.html").on("change", browserSync.reload);
});

//Таск по умолчанию, Запускает del, styles, scripts, img-compress и watch
gulp.task("default", gulp.series("del", gulp.parallel("html", "styles", "scripts", "img-compress"), "watch"));
