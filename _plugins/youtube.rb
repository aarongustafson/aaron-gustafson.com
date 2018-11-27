#  (c) Etienne Rossignon
#  Licence : MIT
#
#  this liquid plugin insert a embeded youtube video to your octopress or Jekill
#  blog using the following syntax:
#    {% youtube ABCDEF123  %}
#
#  this plugin has been designed to optimize loading time when many youtube
#  videos are inserted to a single page by delaying the youtube <iframe>'s until
#  the user clicks on the thumbnail image of the video.
#
#  Special care have been taken to make sure tha the video resizes properly when
#  the webbrowser page width changes, or on smartphones.
#
#  a jsfiddle to experiment the lazy loading process can be found at :
#        http://jsfiddle.net/erossignon/3DZ6f
#
# credits:
#   responsive video :
#       https://github.com/optikfluffel/octopress-responsive-video-embed
#       http://andmag.se/2012/10/responsive-images-lazy-load-and-multiserve-images/
#   lazy loading:
#       http://jsfiddle.net/mUqNj/ and http://yabtb.blogspot.com/2011/12/lazy-load-youtube-videos.html
#   jekyll plugin:
#       http://makokal.github.com/blog/2012/02/24/simple-jekyll-plugin-for-youtube-videos/
#       https://gist.github.com/1805814
#
require 'uri'
require 'net/http'
require 'json'
require 'erb'
require 'yaml'

module Jekyll
  module YouTube
    class << self 
      attr_reader :videos, :api_key
    end

    def self.bootstrap(site)
      # get the cached YouTube videos
      @cache_file = site.in_source_dir('.jekyll-cache/youtube.yml');
      @videos = SafeYAML.load_file(@cache_file) || {}
      @api_key = ENV['GOOGLE_API_KEY'] || nil
    end

    def self.cache_video(key, html)
      puts "Caching YouTube video: #{key}"
      @videos[key] = html
      File.open(@cache_file, "wb") { |f| f.puts YAML.dump(@videos) }
    end

    class Tag < Liquid::Tag
      SYNTAX = /^\s*([^\s]+)(?:\s+(\d+)\s+(\d+)\s*)?(?:\s+(\d+s\/\d+s))?\s*/

      def initialize(tagName, markup, tokens)
        super

        unless YouTube.api_key
          raise 'No YouTube API key provided'
        end

        if markup =~ SYNTAX
          @id = $1
          # puts "Got YouTube ID #{@id}"

          if $2.nil?
            @width = 560
            @height = 315 
          else
            @width = $2.to_i
            @height = $3.to_i
          end

          @snippet = ''
          unless $4.nil?
            times = $4.split('/').map { |s| s.to_i }
            @snippet << "&amp;start=#{times[0]}&amp;end=#{times[1]}"
          end
        else
          raise 'No YouTube ID provided in the "youtube" tag'
        end
      end

      def render(context)
        if YouTube.videos.has_key? @id
          puts "Using Cached YouTube video: #{@id}"
          return YouTube.videos[@id]
        end

        google = URI.parse('https://www.googleapis.com')
        browser = Net::HTTP.new(google.host, google.port)
        browser.use_ssl = true
        browser.verify_mode = OpenSSL::SSL::VERIFY_NONE

        # puts "Rendering YouTube ID #{@id}"
        # extract video information using a REST command
        request = Net::HTTP::Get.new("/youtube/v3/videos/?part=snippet&id=#{@id}&key=#{YouTube.api_key}")
        response = browser.request(request)
        result = JSON.parse(response.body)

        # if the hash has 'Error' as a key, we raise an error
        if result['items'].nil? || result['items'].length != 1
          puts 'No video found'
          return
        end

        video = result['items'][0]['snippet']

        # extract the title and description from the json string
        @title = video['localized']['title']
        @description = video['localized']['description']

        # get the size
        thumbnails = video['thumbnails']
        @size = if thumbnails.key? 'maxres'
                  Rational(thumbnails['maxres']['width'], thumbnails['maxres']['height'])
                else
                  Rational(thumbnails['default']['width'], thumbnails['default']['height'])
                end
        @size = @size.to_s.sub('/', 'x')

        puts "Embedding YouTube video: #{@title}"

        @style = "background-image:url(//i2.ytimg.com/vi/#{@id}/0.jpg);"

        @player = "https://www.youtube.com/embed/#{@id}?"
        @player << 'autoplay=1' # start playing
        @player << @snippet # start and end
        @player << '&amp;modestbranding=1' # Turn off YouTube branding
        @player << '&amp;iv_load_policy=3' # Turn off annotations

        # note: so special care is required to produce html code that will not be massage by the 
        #       markdown processor :
        #       extract from the markdown doc :
        #           'The only restrictions are that block-level HTML elements ¿ e.g. <div>, <table>, <pre>, <p>, etc. 
        #            must be separated from surrounding content by blank lines, and the start and end tags of the block
        #            should not be indented with tabs or spaces. '
        result = "<figure id=\"fig-#{@id}\" class=\"figure figure--video\">"
        result << "<div class=\"video-embed video-embed--youtube video-embed--#{@size}\">"
        result << "<a class=\"video-embed__lazy-link\" style=\"#{@style}\" href=\"https://www.youtube.com/watch?v=#{@id}#{@snippet}\" data-lazy-video-src=\"#{@player}\">"
        result << '<div class="video-embed__lazy-div"></div>'
        result << "<div class=\"video-embed__lazy-info\">#{@title}</div>"
        result << '</a></div></figure>'

        # store it back in the cache
        YouTube.cache_video(@id, result)

        result
      end
    end
  end
end

Liquid::Template.register_tag 'youtube', Jekyll::YouTube::Tag

Jekyll::Hooks.register :site, :after_init do |site|
  Jekyll::YouTube.bootstrap(site)
end