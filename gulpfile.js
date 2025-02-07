import gulp from 'gulp';
const { parallel } = gulp;
const gulpWatch = gulp.watch;
import config from "./_tasks/config.js";

// Pull in each task
import html from "./_tasks/html.js";
import scripts from "./_tasks/scripts.js";
import sw from "./_tasks/serviceworker.js";
import images from "./_tasks/images.js";
import styles from "./_tasks/styles.js";
import data from "./_tasks/data.js";

// Set each directory and contents that we want to watch and
// assign the relevant task. `ignoreInitial` set to true will
// prevent the task being run when we run `gulp watch`, but it
// will run when a file changes.
const watcher = () => {
  //watch(`${config.destination}/**/*.html`, {ignoreInitial: true}, html);
  gulpWatch(`${config.source}/_javascripts/**/*.js`, {ignoreInitial: true}, scripts);
  //watch(`${config.source}/_data/sw.json`, {ignoreInitial: true}, sw);
  gulpWatch(`${config.source}/_images/**/*`, {ignoreInitial: true}, images);
  gulpWatch(`${config.source}/_styles/**/*.scss`, {ignoreInitial: true}, styles);
  //watch(`${config.source}/**.{json,xml}`, {ignoreInitial: true}, data)
};

// The default (if someone just runs `gulp`) is to run each task in parallel
export default parallel( html, scripts, images, styles, data, sw );

// This is our watcher task that instructs gulp to watch directories and
// act accordingly
export const watch = watcher;

// pre-build
export const prebuild = parallel( scripts, images, styles );

// post-build
export const postbuild = parallel( html, data, sw );
