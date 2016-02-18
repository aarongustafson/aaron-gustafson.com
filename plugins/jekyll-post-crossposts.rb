#
# Author: Aaron Gustafson
# Adds a crossposted_to variable to Jekyll posts based on supplied configuration variables
#
# ## Global Configuration
# 
# To keep things simple and consistant, you can set up the standard sizes of your adaptive images in variables in `_config.yml`:
# 
#   crosspost_caches:
#     Medium: ./cache/medium_crossposted
# 
module Jekyll

  class Post
    
    alias orig_to_liquid to_liquid
    def to_liquid
        puts "crossposts to liquid"
        crosspost_caches = Jekyll.configuration({})['crosspost_caches'] || {}

        crossposted_to = {}
        crosspost_caches.each do |source, file|
          if File.exists?(file)
            posts = open(file) { |f| YAML.load(f) }
            posts.each do |original_url, crosspost_url|
              if original_url == self.url
                crossposted_to[source] = crosspost_url
              end
            end
          end
        end

        h = orig_to_liquid
        h['crossposted'] = crossposted_to
        h
    end

  end

end