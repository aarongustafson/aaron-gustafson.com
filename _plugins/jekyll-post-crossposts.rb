#
# Author: Aaron Gustafson
# Adds a crossposted_to variable to Jekyll posts based on supplied
# configuration variables
#
# ## Global Configuration
#
#   crosspost_caches:
#     Medium: ./cache/medium_crossposted
#
class Jekyll::Document
  alias orig_to_liquid to_liquid
  def to_liquid(*args)
    crosspost_caches = site.config['crosspost_caches'] || {}

    crossposted_to = {}
    crosspost_caches.each do |source, file|
      if File.exist?(file)
        posts = open(file) { |f| YAML.load(f) }
        crossposted_to[source] = posts[url] if posts.key? url
      end
    end

    crossposted_to = nil if crossposted_to == {}

    h = orig_to_liquid(*args)
    h['crossposted'] = crossposted_to
    h
  end
end
