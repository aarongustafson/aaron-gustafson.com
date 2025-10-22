import gulp from 'gulp';
const { parallel, series } = gulp;
const gulpWatch = gulp.watch;
import config from "./_tasks/config.js";

// Pull in each task
import html from "./_tasks/html.js";
import scripts from "./_tasks/scripts.js";
import sw from "./_tasks/serviceworker.js";
import images from "./_tasks/images.js";
import styles from "./_tasks/styles.js";
import data from "./_tasks/data.js";

// Debounced task runner to prevent multiple rapid executions
let taskTimeouts = {};

function debounce(taskName, task, delay = 300) {
  return () => {
    clearTimeout(taskTimeouts[taskName]);
    taskTimeouts[taskName] = setTimeout(task, delay);
  };
}

// Enhanced watcher with debouncing
const watcher = () => {
  // Watch JavaScript files
  gulpWatch(
    `${config.source}/_javascript/**/*.js`, 
    { ignoreInitial: true }, 
    debounce('scripts', scripts, 500)
  );
  
  // Watch image files with longer debounce due to processing time
  gulpWatch(
    `${config.source}/_images/**/*`, 
    { ignoreInitial: true }, 
    debounce('images', images, 1000)
  );
  
  // Watch SCSS files
  gulpWatch(
    `${config.source}/_styles/**/*.scss`, 
    { ignoreInitial: true }, 
    debounce('styles', styles, 300)
  );
  
  console.log('👀 Watching for changes...');
};

// Optimized build sequences
export default series(
  parallel(images, styles, scripts), // Assets that can be built in parallel
  parallel(html, data, sw) // Post-processing tasks
);

// Development watcher
export const watch = watcher;

// Pre-build (before Eleventy) - optimized order
export const prebuild = parallel(scripts, images, styles);

// Post-build (after Eleventy)
export const postbuild = parallel(html, data, sw);

// Fast rebuild (skip unchanged files) - useful for development
export const quick = parallel(scripts, styles);
