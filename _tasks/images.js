/* jshint node: true */
import crypto from "crypto";
import fs from "fs";
import gulp from "gulp";
import filter from "gulp-filter";
import gulpif from "gulp-if";
import svgo from "gulp-svgo";
import path from "path";
import sharp from "sharp";
import stream from "stream";
import through2 from "through2";
import config from "./config.js";
const {dest, src} = gulp;
const { Transform } = stream;

const destination = `${config.static}/i`;
const dist = `${config.destination}/i`;

// Enhanced cache with file hashes and timestamps
const cache_file = `${config.cache}/optimized-images.json`;
let imageCache = {};

// Load existing cache
try {
  imageCache = JSON.parse(fs.readFileSync(cache_file));
} catch (err) {
  imageCache = {};
}

// Generate file hash for change detection
function getFileHash(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(content).digest('hex');
  } catch (err) {
    return null;
  }
}

// Check if file needs processing
function needsProcessing(file) {
  const filePath = path.relative(file.cwd, file.path);
  const currentHash = getFileHash(file.path);
  
  const cached = imageCache[filePath];
  
  // Convert source path to destination path
  const relativePath = path.relative(`${config.source}/_images`, file.path);
  const destFile = path.join(destination, relativePath);
  const distFile = path.join(dist, relativePath);
  
  // Process if:
  // - File not in cache
  // - File hash changed
  // - Cached file doesn't exist in destination
  return !cached || 
         cached.hash !== currentHash || 
         !fs.existsSync(destFile) ||
         !fs.existsSync(distFile);
}

// Update cache with file info
const updateCache = () => {
  let stream = new Transform({
    objectMode: true,
    transform: (file, encoding, next) => {
      const filePath = path.relative(file.cwd, file.path);
      
      // Skip SVG files from cache (they're handled differently)
      if (path.extname(filePath) !== '.svg') {
        const stats = fs.statSync(file.path);
        imageCache[filePath] = {
          hash: getFileHash(file.path),
          mtime: stats.mtime.getTime(),
          processed: Date.now()
        };
      }
      
      return next(null, file);
    }
  });
  return stream;
};

const writeCache = () => {
  let stream = new Transform({
    objectMode: true,
    transform: (file, encoding, next) => {
      return next(null, file);
    },
    flush: (next) => {
      fs.writeFileSync(cache_file, JSON.stringify(imageCache, null, 2));
      return next();
    }
  });
  return stream;
};

const svgo_opts = {
  plugins: [
    { removeViewBox: false }
  ]
};

// Parallel Sharp processing for better performance
const processImages = () => {
  return through2.obj(async function(file, _, cb) {
    try {
      // Skip if already processed
      if (!needsProcessing(file)) {
        return cb(null, file);
      }

      const result = await sharp(file.contents)
        .jpeg({ 
          progressive: true, 
          force: false, 
          mozjpeg: true,
          quality: 85 // Add quality control
        })
        .png({ 
          progressive: true, 
          force: false,
          compressionLevel: 9,
          adaptiveFiltering: true
        })
        .toBuffer();
        
      file.contents = result;
      return cb(null, file);
    } catch (err) {
      console.error(`Error processing ${file.path}:`, err);
      return cb(null, file); // Continue with original file
    }
  });
};

// Optimized images function
const images = () => {
  // Handle media files separately (no processing needed)
  src([`${config.source}/_images/**/*.{mp4,mov,mp3,ogg}`])
    .pipe(dest(destination))
    .pipe(dest(dist));

  return src([
    `${config.source}/_images/**/*.{jpg,png,gif,svg}`, 
    `!${config.source}/**/*.sketch/**`
  ])
    // Only process files that need it
    .pipe(filter(file => needsProcessing(file)))
    
    // Update cache for processed files
    .pipe(updateCache())
    
    // Optimize based on file type
    .pipe(
      gulpif(
        "*.svg",
        svgo(svgo_opts),
        processImages()
      )
    )
    
    // Save to destinations
    .pipe(dest(destination))
    .pipe(dest(dist))
    
    // Write updated cache
    .pipe(writeCache());
};

export default images;