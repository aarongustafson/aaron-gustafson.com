#  (c) Aaron Gustafson
#  https://github.com/aarongustafson/jekyll-tag-list-generator 
#  Licence : MIT
#  
#  This generator creates a list of tags used on the site.

TAG_CACHE_DIR = File.expand_path('../../.cache', __FILE__)
FileUtils.mkdir_p(TAG_CACHE_DIR)

module Jekyll

  # Jekyll hook - the generate method is called by jekyll, and generates all of the category pages.
  class GenerateTagList < Generator
    safe true
    priority :low

    def generate(site)
      tag_list_file = File.join(TAG_CACHE_DIR, "site-tags.yml")
      if File.exists?(tag_list_file)
        tags = open(tag_list_file) { |f| YAML.load(f) }
      else
        tags = {}
      end
      
      site.posts.each do |post|
        post.categories.each do |tag|
          if !tags.has_key? tag
            tags[tag] = []
          end
          tags[tag] << post.path
        end
        post.tags.each do |tag|
          if !tags.has_key? tag
            tags[tag] = []
          end
          tags[tag] << post.path
        end
      end

      # Save it back as a sorted array
      File.open(tag_list_file, 'w') { |f| YAML.dump(tags, f) }

    end

  end

end