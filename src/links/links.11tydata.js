require('dotenv').config();
const OPENGRAPHR_TOKEN = process.env.OPENGRAPHR_TOKEN;
const OPENGRAPH_IO_TOKEN =  process.env.OPENGRAPH_IO_TOKEN;
const fs = require('fs');
const CACHE_FILE_PATH = '_cache/og_images.yml';
const yaml = require('js-yaml');
let og_images = yaml.load(fs.readFileSync(CACHE_FILE_PATH));
const fetch = require('node-fetch');
const current_month = new Date().getMonth() + 1;
const CACHE_API_LIMITS_PATH =  '_cache/api_limits_reached.json';
const CACHE_404_PATH =  '_cache/404s.yml';
const cached404s = yaml.load(fs.readFileSync(CACHE_404_PATH));
let api_limits = JSON.parse(fs.readFileSync(CACHE_API_LIMITS_PATH));

async function readOpenGraphr(url) {
  const API = 'https://api.opengraphr.com/v1/og?api_token={YOUR_API_TOKEN}&url={YOUR_URL}';
  
  // If we dont have a domain name or token, abort
  if (!OPENGRAPHR_TOKEN) {
    console.warn('>>> unable to check OpenGraphr: missing token');
    return false;
  }

  if ( wasAPILimitReached('OpenGraphr') )
  {
    return false;
  }
  
  let api_endpoint = API.replace('{YOUR_API_TOKEN}',OPENGRAPHR_TOKEN)
                        .replace('{YOUR_URL}',url);
  //console.log(api_endpoint);
  const response = await fetch(api_endpoint);

  // happy path
  if (response.ok) {
    const item = await response.json();
    return item.image || true;
  }

  // error
  let json = await response.json();
  if ( json.error.indexOf("limit") > -1 )
  {
    logAPILimitReached('OpenGraphr');
  }
  else if ( json.error.indexOf("404") > -1 ||
            json.error.indexOf("could not be found") > -1 ) {
    console.log(`>>> OpenGraphr got a 404 on ${url}`);
    writeToCache( url, true, CACHE_404_PATH );
    return 404;
  }
  console.log(`>>> unable to check OpenGraphr: ${json.error}`);
  return false;
}

async function readOpenGraphIo(url) {
  const API = 'https://opengraph.io/api/1.1/site/{YOUR_URL}?app_id={YOUR_API_TOKEN}';
  
  // If we dont have a domain name or token, abort
  if (!OPENGRAPH_IO_TOKEN) {
    console.warn('>>> unable to check OpenGraph.io: missing token');
    return false;
  }
  
  if ( wasAPILimitReached('OpenGraph_io') )
  {
    return false;
  }
  
  let api_endpoint = API.replace('{YOUR_API_TOKEN}',OPENGRAPH_IO_TOKEN)
                        .replace('{YOUR_URL}',encodeURIComponent(url));
  //console.log(api_endpoint);
  const response = await fetch(api_endpoint);
  
  // happy path
  if (response.ok) {
    const item = await response.json();
    return item.hybridGraph.image || true;
  }

  // error
  let json = await response.json();
  if ( "error" in json && "message" in json.error) {
    if ( json.error.message.indexOf("limit") > -1 )
    {
      logAPILimitReached('OpenGraph_io');
      console.log(`>>> OpenGraph.io limit reached`);
    }
    else if ( json.error.message.indexOf("404") > -1 ||
              json.error.message.indexOf("could not be found") > -1 ) {
      console.log(`>>> OpenGraph.io got a 404 on ${url}`);
      writeToCache( url, true, CACHE_404_PATH );
      return 404;
    }
    else{
      console.log(`>>> unable to check OpenGraph.io: ${json.error.message}`);
    }
  }
  else {
    console.log(`>>> unknown error checking OpenGraph.io: ${response}`);
  }
  return false;
}

function writeToCache( url, value, cache ) {
  cache = cache || CACHE_FILE_PATH;
  // make sure we don’t write more than once
  const data = yaml.load(fs.readFileSync(cache));
  if ( ! (url in data) )
  {
    value = ( value === true || value == 404 ) ? value : `"${value}"`;
    fs.appendFile(cache, `${url}: ${value}\n`, err => {
      if (err) throw err;
      console.log(`>>> Opengraph images for ${url} cached`);
    });
  }
}

function logAPILimitReached(which){
  let limits = JSON.parse(fs.readFileSync(CACHE_API_LIMITS_PATH));
  limits[which] = current_month;
  fs.writeFile(CACHE_API_LIMITS_PATH, JSON.stringify(limits), err => {
    if (err) throw err;
  });
}

function wasAPILimitReached(which){
  let limits;
  try {
    limits = JSON.parse(fs.readFileSync(CACHE_API_LIMITS_PATH));
  } catch(e) {
    limits = api_limits;
  }
  if ( limits[which] < current_month )
  {
    return false;
  }
  console.warn(`>>> The API limit for ${which} has been reached for this month`);
  return true;
}

function is404ing(url) {
  return ( url in cached404s );
}

function archived(data) {
  let archive_url = 'https://web.archive.org/web/{{ DATE }}/{{ URL }}';
  let month = data.date.getUTCMonth()+1;
  month = month < 10 ? "0" + month : month;
  let day = data.date.getDay();
  day = day < 10 ? "0" + day : day;
  archive_url = archive_url.replace('{{ DATE }}', `${data.date.getUTCFullYear()}${month}${day}`)
                           .replace('{{ URL }}', data.ref_url );
  return archive_url;
}

module.exports = {
  layout: "layouts/link.html",
  permalink: "/notebook/{{ page.filePathStem }}/",
  eleventyComputed: {
    is_404: (data) => {
      return is404ing(data.ref_url);
    },
    archived: (data) => {
      return is404ing(data.ref_url) ? archived(data) : false;
    },
    og_image: async (data) => {
      const url = data.ref_url;
      if ( url in og_images )
      {
        return ( og_images[url] === true || og_images[url] === "404" ) ? false : og_images[url];
      }
      else
      {
        // don’t run if the limits have already been reached
        let limits_reached = true;
        for ( key in api_limits ) {
          if ( key.toLowerCase().indexOf('opengraph') > -1 &&
               api_limits[key] < current_month )
          {
            limits_reached = false;
            break;
          }
        }
        if ( limits_reached ){
          console.warn(`>>> All APIs are exhausted right now, skipping ${url} until next time`);
          return false;
        }
        // no point checking 404s
        if ( '404' in data ) {
          return false;
        }
        let og_image = false;
        // Try OpenGraph.io
        og_image = await readOpenGraphIo(url);
        // Backup: OpenGraphr
        if ( og_image === false ) {
          og_image = await readOpenGraphr(url);
        }
        //console.log(url, og_image);
        if ( og_image === false ) {
          og_image = true;
        }
        writeToCache(url, og_image);
        return og_image;
      }
    }
  }
};