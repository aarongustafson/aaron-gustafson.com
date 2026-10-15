import gulp from "gulp";
import config from "./_tasks/config.js";
const { parallel, series } = gulp;
const gulpWatch = gulp.watch;

// Pull in each task
import data from "./_tasks/data.js";
import images from "./_tasks/images.js";
import scripts from "./_tasks/scripts.js";
import sw from "./_tasks/serviceworker.js";
import styles from "./_tasks/styles.js";

// Enhanced watcher with debouncing
const watcher = () => {
	// Watch JavaScript files
	gulpWatch(
		[
			`${config.source}/_javascript/**/*.js`,
			`!${config.source}/_javascript/serviceworker/**/*.js`,
		],
		{ ignoreInitial: true, delay: 500 },
		scripts,
	);

	// Watch image files with longer debounce due to processing time
	gulpWatch(
		`${config.source}/_images/**/*`,
		{ ignoreInitial: true, delay: 1000 },
		images,
	);

	// Watch SCSS files
	gulpWatch(
		`${config.source}/_styles/**/*.{css,scss}`,
		{ ignoreInitial: true, delay: 300 },
		styles,
	);

	// Rebuild the service worker after its source or generated assets change
	gulpWatch(
		[
			`${config.source}/_javascript/serviceworker/**/*.js`,
			`${config.static}/c/**/*.css`,
			`${config.static}/j/**/*.js`,
		],
		{ ignoreInitial: true, delay: 500 },
		sw,
	);

	console.log("👀 Watching for changes...");
};

// Optimized build sequences
export default series(
	styles,
	parallel(images, scripts),
	parallel(data, sw), // Post-processing tasks
);

// Development watcher
export const watch = watcher;

// Pre-build (before Eleventy) - optimized order
export const prebuild = series(styles, parallel(scripts, images));

// Post-build (after Eleventy)
export const postbuild = parallel(data, sw);

// Fast rebuild (skip unchanged files) - useful for development
export const quick = series(styles, scripts);
