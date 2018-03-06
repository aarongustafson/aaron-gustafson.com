module Jekyll

  class PagePathGenerator < Generator
    safe true
    ## See post.dir and post.base for directory information.
    def generate(site)
      site.posts.docs.each do |post|
        post.data['path'] = "#{site.config['blog_index_dir']}#{post.data['slug']}"
      end

    end
  end

end