const {dest, src} = require('gulp');
const { destination } = require("./config.js");
const prettyData = require('gulp-pretty-data');

const data = cb => {

  return src(`${destination}/**/*.{xml,json}`)
          .pipe(prettyData({
            type: 'minify',
            preserveComments: false
          }))
          .pipe(dest(destination))
          .on('done', cb);

};

module.exports = data;