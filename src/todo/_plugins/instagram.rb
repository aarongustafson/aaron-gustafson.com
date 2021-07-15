#  (c) Aaron Gustafson
#  Licence : MIT
#
#  this liquid plugin insert a embeded Instagram to your octopress or Jekyll
#  blog using the following syntax:
#    {% instagram ABCDEF123 video-param video-param %}
#

require 'json'
require 'erb'
require 'yaml'
require 'open-uri'
require 'nokogiri'

module Jekyll
  module Instagram
    class << self 
      attr_reader :posts
    end

    def self.bootstrap(site)
      # get the cached YouTube videos
      @cache_file = site.in_source_dir('.jekyll-cache/instagram.yml');
      @posts = if File.exists?(@cache_file) 
                 SafeYAML.load_file(@cache_file)
               else
                 Hash.new
               end
    end

    def self.cache(key, html)
      puts "Caching Instagram post: #{key}"
      @posts[key] = html
      File.open(@cache_file, "wb") { |f| f.puts YAML.dump(@posts) }
    end

    class Tag < Liquid::Tag
      SYNTAX = /^\s*([^\s]+)(?:\s+(.+))?\s*$/

      def initialize(tagName, markup, tokens)
        super

        if markup =~ SYNTAX
          @id = $1
          @params = $2
          # puts "Got Instagram post ID #{@id}"
          # puts "params: #{@params}"
        else
          raise 'No Instagram ID provided in the "instagram" tag'
        end
      end

      def render(context)
        if Instagram.posts.has_key? @id
          puts "Using Cached Instagram post: #{@id}"
          return Instagram.posts[@id]
        end

        ig_url = "https://www.instagram.com/p/#{@id}/"

        # Check IG first
        web_page = Nokogiri::HTML.parse(open(ig_url))
        video = web_page.css('meta[property="og:video"]')

        embed_type = video.empty? ? 'image' : 'video'

        result =  "<figure id=\"fig-#{@id}\" class=\"figure"
        result << embed_type == 'video' ? ' figure--video' : ''
        result << "\">"

        # Image only
        if embed_type == 'image'
          puts "Embedding Instagram image: #{@id}"

          response = open("https://api.instagram.com/oembed?url=#{ig_url}").read
          # puts "response: #{response}"
          
          if response.empty?
            puts 'No post found'
            return
          end

          json = JSON.parse(response)

          image = json['thumbnail_url']
          @width = json['thumbnail_width'].to_i
          @height = json['thumbnail_height'].to_i
          @title = json['title']
          @size = Rational(@width, @height).to_s.sub('/', 'x')

          result << "<img loading=\"lazy\" src=\"#{image}\" alt=\"#{@title}\" width=\"#{@width}\" height=\"#{@height}\">"

        # Video
        else
          puts "Embedding Instagram video: #{@title}"

          video = web_page.css('meta[property="og:video"]').first['content']
          poster  = web_page.css('meta[property="og:image"]').first['content']
          @width  = web_page.css('meta[property="og:video:width"]').first['content']
          @height = web_page.css('meta[property="og:video:height"]').first['content']
          @size = Rational(@width.to_i, @height.to_i).to_s.sub('/', 'x')

          result << "<div class=\"video-embed video-embed--instagram video-embed--#{@size}\">"
          result << '<video controls preload="none" type="video/mp4" '
          result << 'class="video-embed__video" '
          result << "poster=\"#{poster}\" src=\"#{video}\" "
          result << @params if @params
          result << "width=\"#{@width}\" height=\"#{@height}\">"
          result << '<p>Watch this video '
          result << "<a hre=\"#{ig_url}\">on Instagram</a>."
          result << '</p></video></div>'

        end

        result << '</figure>'

        # store it back in the cache
        Instagram.cache(@id, result)

        result
      end
    end
  end
end

Liquid::Template.register_tag 'instagram', Jekyll::Instagram::Tag

Jekyll::Hooks.register :site, :after_init do |site|
  Jekyll::Instagram.bootstrap(site)
end