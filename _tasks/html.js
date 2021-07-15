const {dest, src} = require('gulp');
const config = require("./config.js");
const htmlmin = require("gulp-htmlmin");

const html = cb => {

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

module.exports = html;