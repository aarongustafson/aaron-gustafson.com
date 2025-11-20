import fs from "fs";
import yaml from "js-yaml";
import dotenv from "dotenv";
dotenv.config();

// Read the YAML file with component definitions
const YAML_FILE_PATH = "src/_data/web_components.yml";
const CACHE_FILE_PATH = "_cache/web_components.json";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Fetch package version from npm registry
 */
async function fetchNpmVersion(packageName) {
  try {
    const response = await fetch(`https://registry.npmjs.org/${packageName}/latest`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.version;
  } catch (error) {
    console.log(`Failed to fetch npm version for ${packageName}:`, error.message);
    return null;
  }
}

/**
 * Fetch repository info from GitHub API
 */
async function fetchGitHubInfo(repo) {
  try {
    const headers = {};
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }
    
    const response = await fetch(`https://api.github.com/repos/${repo}`, { headers });
    if (!response.ok) return null;
    
    const data = await response.json();
    return {
      stars: data.stargazers_count,
      description: data.description,
      updated_at: data.updated_at,
      html_url: data.html_url
    };
  } catch (error) {
    console.log(`Failed to fetch GitHub info for ${repo}:`, error.message);
    return null;
  }
}

/**
 * Check if cache is valid and get cached API data
 */
function getCachedApiData() {
  try {
    if (!fs.existsSync(CACHE_FILE_PATH)) {
      return null;
    }
    
    const cacheContent = fs.readFileSync(CACHE_FILE_PATH, "utf8");
    const cache = JSON.parse(cacheContent);
    
    const cacheAge = Date.now() - new Date(cache.timestamp).getTime();
    if (cacheAge < CACHE_DURATION) {
      console.log("Using cached API data for web components");
      return cache.apiData;
    }
    
    return null;
  } catch (error) {
    console.log("Cache read failed:", error.message);
    return null;
  }
}

/**
 * Save API data to cache
 */
function saveCache(apiData) {
  try {
    const cache = {
      timestamp: new Date().toISOString(),
      apiData: apiData
    };
    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.log("Failed to save cache:", error.message);
  }
}

/**
 * Main function to build web components data
 */
async function buildWebComponentsData() {
  // Always read the YAML file (source of truth)
  const yamlContent = fs.readFileSync(YAML_FILE_PATH, "utf8");
  const components = yaml.load(yamlContent);
  
  // Check if we have cached API data
  const cachedApiData = getCachedApiData();
  
  if (cachedApiData) {
    // Merge YAML data with cached API data
    return components.map(component => {
      const cached = cachedApiData[component.name];
      if (cached) {
        return { ...component, ...cached };
      }
      return component;
    });
  }
  
  console.log("Fetching fresh API data for web components...");
  
  // Build API data cache object
  const apiDataCache = {};
  
  // Enhance each component with version and GitHub info
  const enhancedComponents = await Promise.all(
    components.map(async (component) => {
      const enhanced = { ...component };
      const apiData = {};
      
      // Fetch npm version if package name is provided
      if (component.npm_package) {
        const version = await fetchNpmVersion(component.npm_package);
        if (version) {
          enhanced.version = version;
          apiData.version = version;
        }
      }
      
      // Fetch GitHub info if repo is provided
      if (component.github) {
        const githubInfo = await fetchGitHubInfo(component.github);
        if (githubInfo) {
          enhanced.github_stars = githubInfo.stars;
          enhanced.github_url = githubInfo.html_url;
          enhanced.github_updated = githubInfo.updated_at;
          
          apiData.github_stars = githubInfo.stars;
          apiData.github_url = githubInfo.html_url;
          apiData.github_updated = githubInfo.updated_at;
          
          // Use GitHub description as fallback if not provided
          if (!enhanced.description && githubInfo.description) {
            enhanced.description = githubInfo.description;
            apiData.description = githubInfo.description;
          }
        }
      }
      
      // Store API data for this component
      apiDataCache[component.name] = apiData;
      
      return enhanced;
    })
  );
  
  // Save API data to cache
  saveCache(apiDataCache);
  
  return enhancedComponents;
}

// Export the data
export default await buildWebComponentsData();
