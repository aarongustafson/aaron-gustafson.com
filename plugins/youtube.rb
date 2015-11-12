#  (c) Etienne Rossignon 
#  Licence : MIT
#  
#  this liquid plugin insert a embeded youtube video to your octopress or Jekill blog
#  using the following syntax:
#    {% youtube ABCDEF123  %}
#
#  this plugin has been designed to optimize loading time when many youtube videos
#  are inserted to a single page by delaying the youtube <iframe>'s until the user
#  click on the thumbnail image of the video.
#  
#  Special care have been taken to make sure tha the video resizes properly when 
#  the webbrowser page width changes, or on smartphones. 
#  
#   
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

if ( ! defined? VIDEO_CACHE_DIR )
  VIDEO_CACHE_DIR = File.expand_path('../../.cache', __FILE__)
  FileUtils.mkdir_p(VIDEO_CACHE_DIR)
end

class YouTube < Liquid::Tag
  Syntax = /^\s*([^\s]+)(?:\s+(\d+)\s+(\d+)\s*)?(?:\s+(\d+s\/\d+s))?\s*/

  # load from the cache
  Cache_file = File.join(VIDEO_CACHE_DIR, "youtube.yml")
  if File.exists?(Cache_file)
    Cache = open(Cache_file) { |f| YAML.load(f) }
  else
    Cache = Hash.new
  end

  API_key = ENV['GOOGLE_API_KEY'] or false

  Google = URI.parse("https://www.googleapis.com")
  Browser = Net::HTTP.new(Google.host, Google.port)
  Browser.use_ssl = true
  Browser.verify_mode = OpenSSL::SSL::VERIFY_NONE
    
  def initialize(tagName, markup, tokens)
    super

    if ! API_key
      puts "No API key provided"
      return
    end
    
    if markup =~ Syntax then
      @id = $1
      #puts "Got YouTube ID #{@id}"

      if $2.nil? then
          @width = 560
          @height = 315 
      else
          @width = $2.to_i
          @height = $3.to_i
      end

      @snippet = ''
      if ! $4.nil? then
          times = $4.split('/').map { |s| s.to_i }
          @snippet << "&amp;start=#{times[0]}&amp;end=#{times[1]}"
      end
    else
      raise "No YouTube ID provided in the \"youtube\" tag"
    end
  end

  def render(context)

    if ( Cache.has_key?(@id) ) then 
        puts "Using Cached YouTube video: #{@id}"
        return Cache[@id]
    end

    #puts "Rendering YouTube ID #{@id}"
    # extract video information using a REST command
    request = Net::HTTP::Get.new("/youtube/v3/videos/?part=snippet&id=#{@id}&key=#{API_key}")
    response = Browser.request(request)
    result = JSON.parse(response.body)

    # if the hash has 'Error' as a key, we raise an error
    if result["items"].length != 1
        puts "No video found"
        return
    end

    video = result['items'][0]['snippet']

    # extract the title and description from the json string
    @title = video['localized']['title']
    @description = video['localized']['description']

    # get the size
    thumbnails = video['thumbnails']
    if thumbnails.has_key?('maxres')
      @size = Rational( thumbnails['maxres']['width'], thumbnails['maxres']['height'] )
    else
      @size = Rational( thumbnails['default']['width'], thumbnails['default']['height'] )
    end
    @size = @size.to_s.sub( '/', 'x' )

    puts "Embedding YouTube video: #{@title}"

    @style = "background-image:url(https://i2.ytimg.com/vi/#{@id}/0.jpg);"
    
    @player = "//www.youtube.com/embed/#{@id}?"
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
    result << "<a class=\"video-embed__lazy-link\" style=\"#{@style}\" href=\"//www.youtube.com/watch?v=#{@id}#{@snippet}\" data-lazy-video-src=\"#{@player}\">"
    result << '<div class="video-embed__lazy-div"></div>'
    result << "<div class=\"video-embed__lazy-info\">#{@title}</div>"
    result << '</a></div></figure>'
    
    
    # store it back in the cache
    Cache[@id] = result
    File.open(Cache_file, 'w') { |f| YAML.dump(Cache, f) }
    
    return result
    
  end

  Liquid::Template.register_tag "youtube", self
end
