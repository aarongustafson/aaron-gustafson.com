import gulp from "gulp";
import autoprefixer from "gulp-autoprefixer";
import clean from "gulp-clean-css";
import rename from "gulp-rename";
import gulpSass from "gulp-sass";
import * as sass from "sass";
import config from "./config.js";

const { dest, src } = gulp;
const sassProcessor = gulpSass(sass);

const destination = `${config.static}/c`;
const dist = `${config.destination}/c`;

const styles = () => {
	return src([
		`${config.source}/_styles/advanced.scss`,
		`${config.source}/_styles/feed.scss`,
		`${config.source}/_styles/old-ie.scss`,
	])
		.pipe(
			sassProcessor({
				outputStyle: "expanded",
				includePaths: ["node_modules"], // Allow imports from node_modules
				quietDeps: true, // Reduce deprecation warnings
			}).on("error", sassProcessor.logError),
		)
		.pipe(
			autoprefixer({
				overrideBrowserslist: [
					"last 2 versions",
					"safari >= 5",
					"ie >= 8",
					"opera >= 12.1",
					"ios >= 6",
					"android >= 4",
				],
				cascade: false, // Faster processing
			}),
		)
		.pipe(dest(destination))
		.pipe(dest(dist))
		.pipe(rename({ suffix: ".min" }))
		.pipe(
			clean({
				level: 2,
				compatibility: "ie8",
			}),
		)
		.pipe(dest(destination))
		.pipe(dest(dist));
};

export default styles;
