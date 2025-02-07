import gulp from "gulp";
const {dest, src} = gulp;
import config from "./config.js";
import htmlmin from "gulp-htmlmin";

const html = ( cb ) => {

  return src(`${config.destination}/**/*.html`)
          .pipe(htmlmin({
            removeComments: true,
            collapseWhitespace: true,
            minifyJS: true,
            ignoreCustomFragments: [ /{%[\s\S]*?%}/, /{{[\s\S]*?}}/ ]
          }))
          .pipe(dest(config.destination))
          .on('done', cb);

};

export default html;