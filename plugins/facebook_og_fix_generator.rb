#  (c) Aaron Gustafson
#  https://github.com/aarongustafson/jekyll-facebook-og-fix 
#  Licence : MIT
#  
#  For some reason Facebook doesn’t always scrape new URLs properly,
#  but we can force it by caching the URLs and then triggering each
#  each to be re-processed by Facebook
#   
require 'json'

FB_OG_FIX_CACHE_DIR = File.expand_path('../../.facebook-og-cache', __FILE__)
FileUtils.mkdir_p(FB_OG_FIX_CACHE_DIR)

module Jekyll
  
  class PostURLCollectionGenerator < Generator
    safe true
    priority :low
    
    def generate(site)
      urls = []
      if defined?(FB_OG_FIX_CACHE_DIR)
        cache_file = File.join(FB_OG_FIX_CACHE_DIR, "urls.yml")
        site.posts.each do |post|
          if post.data.has_key?('ref_url')
            url = post.url.sub("notebook/","notebook/links/")
          else  
            url = post.url
          end  
          urls << "#{site.config['url']}#{url}"
        end
        File.open(cache_file, 'w') { |f| YAML.dump(urls, f) }
      end
    end
  end
  
end