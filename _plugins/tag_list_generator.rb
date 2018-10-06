#  (c) Aaron Gustafson
#  https://github.com/aarongustafson/jekyll-tag-list-generator 
#  Licence : MIT
#  
#  This generator creates a list of tags used on the site.

TAG_CACHE_DIR = File.expand_path('../../.cache', __FILE__)
FileUtils.mkdir_p(TAG_CACHE_DIR)

module Jekyll
  class GenerateTagList < Generator
    safe true
    priority :low

    def generate(site)
      tag_list_file = File.join(TAG_CACHE_DIR, 'site-tags.yml')
      tags = if File.exist? tag_list_file
               open(tag_list_file) { |f| YAML.load(f) }
             else
               {}
             end

      posts = []
      site.collections.each do |_name, collection|
        collection.docs.each do |post|
          posts << post
        end
      end
      posts.each do | post |
        post.data['tags'].each do |tag|
          tags[tag] = [] unless tags.has_key? tag
          file = File.basename post.path
          tags[tag] << file unless tags[tag].include? file
        end
      end

      # Save it back as a sorted array
      File.open(tag_list_file, 'w') { |f| YAML.dump(tags, f) }
    end
  end
end