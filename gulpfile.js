const {parallel, watch} = require('gulp');
const tasks_folder = "./_tasks";
const config = require(`${tasks_folder}/config.js`);

// Pull in each task
const html = require(`${tasks_folder}/html.js`);
const scripts = require(`${tasks_folder}/scripts.js`);
const sw = require(`${tasks_folder}/serviceworker.js`);
const images = require(`${tasks_folder}/images.js`);
const styles = require(`${tasks_folder}/styles.js`);
const data = require(`${tasks_folder}/data.js`);

// Set each directory and contents that we want to watch and
// assign the relevant task. `ignoreInitial` set to true will
// prevent the task being run when we run `gulp watch`, but it
// will run when a file changes.
const watcher = () => {
  //watch(`${config.destination}/**/*.html`, {ignoreInitial: true}, html);
  watch(`${config.source}/_javascripts/**/*.js`, {ignoreInitial: true}, scripts);
  //watch(`${config.source}/_data/sw.json`, {ignoreInitial: true}, sw);
  watch(`${config.source}/_images/**/*`, {ignoreInitial: true}, images);
  watch(`${config.source}/_styles/**/*.scss`, {ignoreInitial: true}, styles);
  //watch(`${config.source}/**.{json,xml}`, {ignoreInitial: true}, data)
};

// The default (if someone just runs `gulp`) is to run each task in parallel
exports.default = parallel( html, scripts, images, styles, data, sw );

// This is our watcher task that instructs gulp to watch directories and
// act accordingly
exports.watch = watcher;

// pre-build
exports.prebuild = parallel( scripts, images, styles );

// post-build
exports.postbuild = parallel( html, data, sw );
