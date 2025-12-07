/* jshint node: true */
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
  console.log(`>>> Image cache loaded: ${Object.keys(imageCache).length} entries`);
  
  // Clean up orphaned cache entries for better performance
  const originalCount = Object.keys(imageCache).length;
  Object.keys(imageCache).forEach(filePath => {
    // The cache stores paths like "src/_images/share-card.jpg"
    if (!fs.existsSync(filePath)) {
      delete imageCache[filePath];
    }
  });
  const cleanedCount = Object.keys(imageCache).length;
  if (originalCount !== cleanedCount) {
    console.log(`>>> Cleaned ${originalCount - cleanedCount} orphaned cache entries`);
  }
} catch (err) {
  console.log(`>>> No existing image cache found, starting fresh`);
  imageCache = {};
}

// Global cache statistics
let cacheHits = 0;
let cacheMisses = 0;

// Check if file needs processing (optimized for performance)
function needsProcessing(file) {
  const filePath = path.relative(file.cwd, file.path);
  const stats = fs.statSync(file.path);
  const currentMtime = stats.mtime.getTime();
  
  const cached = imageCache[filePath];
  
  // Process if:
  // - File not in cache
  // - File modification time changed
  const needsWork = !cached || cached.mtime !== currentMtime;
  
  if (needsWork) {
    cacheMisses++;
    // Update cache immediately for files being processed
    imageCache[filePath] = {
      mtime: currentMtime,
      size: stats.size,
      processed: Date.now()
    };
  } else {
    cacheHits++;
  }
  
  return needsWork;
}

// Update cache with file info
const updateCache = () => {
  let stream = new Transform({
    objectMode: true,
    transform: (file, encoding, next) => {
      const filePath = path.relative(file.cwd, file.path);
      
      // Store only essential data for faster caching
      const stats = fs.statSync(file.path);
      imageCache[filePath] = {
        mtime: stats.mtime.getTime(),
        size: stats.size,
        processed: Date.now()
      };
      
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

// Optimized images function with performance tracking
const images = () => {
  const startTime = Date.now();
  let processedCount = 0;
  let skippedCount = 0;
  
  // Reset cache counters
  cacheHits = 0;
  cacheMisses = 0;
  
  // Handle media files separately (no processing needed)
  src([`${config.source}/_images/**/*.{mp4,mov,mp3,ogg}`])
    .pipe(dest(destination))
    .pipe(dest(dist));

  return src([
    `${config.source}/_images/**/*.{jpg,png,gif,svg}`, 
    `!${config.source}/**/*.sketch/**`
  ])
    // Use filter to skip unchanged files
    .pipe(filter(file => {
      const needs = needsProcessing(file);
      if (needs) {
        processedCount++;
        return true;
      } else {
        skippedCount++;
        return false;
      }
    }))
    
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
    
    // Write updated cache and log performance
    .pipe(writeCache())
    .on('end', () => {
      const duration = Date.now() - startTime;
      const hitRate = cacheHits + cacheMisses > 0 ? ((cacheHits/(cacheHits+cacheMisses))*100).toFixed(1) : '0.0';
      console.log(`>>> Images: ${processedCount} processed, ${skippedCount} skipped (${duration}ms, ${hitRate}% cache hit rate)`);
    });
};

export default images;