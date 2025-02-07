import gulp from "gulp";
const {dest, src} = gulp;
import config from "./config.js";
const { destination } = config;
import prettyData from "gulp-pretty-data";

const data = cb => {

  return src(`${destination}/**/*.{xml,json}`)
          .pipe(prettyData({
            type: 'minify',
            preserveComments: false
          }))
          .pipe(dest(destination))
          .on('done', cb);

};

export default data;