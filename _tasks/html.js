import gulp from "gulp";
import htmlmin from "gulp-htmlmin";
import gulpIf from "gulp-if";
import newer from "gulp-newer";
import config from "./config.js";
const {dest, src} = gulp;

const isProduction = process.env.NODE_ENV === 'production';

const html = (cb) => {
  return src(`${config.destination}/**/*.html`)
    // Only minify in production or if HTML files are newer
    .pipe(gulpIf(
      isProduction,
      newer(`${config.destination}/**/*.html`) // Check if files need processing
    ))
    
    .pipe(gulpIf(
      isProduction, // Only minify in production
      htmlmin({
        removeComments: true,
        collapseWhitespace: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeOptionalTags: true,
        minifyJS: {
          compress: {
            drop_console: true
          }
        },
        minifyCSS: true,
        ignoreCustomFragments: [
          /{%[\s\S]*?%}/, 
          /{{[\s\S]*?}}/,
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
        ]
      })
    ))
    
    .pipe(dest(config.destination))
    .on('end', cb);
};

export default html;