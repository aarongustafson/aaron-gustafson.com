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

  class Document
    
    alias :orig_to_liquid :to_liquid
    def to_liquid(attrs = nil)
        crosspost_caches = site.config['crosspost_caches'] || {}

        crossposted_to = {}
        crosspost_caches.each do |source, file|
          if File.exists?(file)
            posts = open(file) { |f| YAML.load(f) }
            if posts.has_key? self.url
              crossposted_to[source] = posts[self.url]
            end
          end
        end

        if crossposted_to == {}
          crossposted_to = nil
        end

        h = orig_to_liquid(attrs)
        h['crossposted'] = crossposted_to
        h
    end

  end

end