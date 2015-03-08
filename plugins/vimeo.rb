#  (c) Aaron Gustafson 
#  based on Etienne Rossignon’s YouTube plugin 
#  Licence : MIT
#  
#  this liquid plugin insert a embeded Vimeo video to your Octopress or Jekill blog
#  using the following syntax:
#
#    {% vimeo ABCDEF123  %}
#
#  this plugin has been designed to optimize loading time when many Vimeo videos
#  are inserted to a single page by delaying the Vimeo <iframe>'s until the user
#  click on the thumbnail image of the video.
#   
require 'json'
require 'erb'
require 'yaml'

if ( ! defined? VIDEO_CACHE_DIR )
  VIDEO_CACHE_DIR = File.expand_path('../../.video-cache', __FILE__)
  FileUtils.mkdir_p(VIDEO_CACHE_DIR)
end

class Vimeo < Liquid::Tag
  Syntax = /^\s*([^\s]+)(\s+(\d+)\s+(\d+)\s*)?/

  # load from the cache
  Cache_file = File.join(VIDEO_CACHE_DIR, "vimeo.yml")
  if File.exists?(Cache_file)
    Cache = open(Cache_file) { |f| YAML.load(f) }
  else
    Cache = Hash.new
  end

  def initialize(tagName, markup, tokens)
    super

    if markup =~ Syntax then
      @id = $1

      if $2.nil? then
          @width = 560
          @height = 315 
      else
          @width = $2.to_i
          @height = $3.to_i
      end
    else
      raise "No Vimeo ID provided in the \"vimeo\" tag"
    end
  end

  def render(context)

    if ( Cache.has_key?(@id) ) then 
        puts "Using Cached Vimeo video: #{@id}"
        return Cache[@id]
    end

    # extract video information using a REST command 
    response = Net::HTTP.get_response("vimeo.com","/api/oembed.json?url=http%3A//vimeo.com/#{@id}")
    puts response
    data = response.body
    result = JSON.parse(data)

    # if the hash has 'Error' as a key, we raise an error
    if result.has_key? 'Error'
        puts "web service error or invalid video id"
    end

    # extract the title and description from the json string
    @title = result["title"]
    @description = result["description"]
    @poster = result["thumbnail_url"]

    puts "Embedding Vimeo video: #{@title}"

    @style = "background-image:url(#{@poster})" 
    
    @player = "//player.vimeo.com/video/#{@id}?autoplay=1"

    # note: so special care is required to produce html code that will not be massage by the 
    #       markdown processor :
    #       extract from the markdown doc :  
    #           'The only restrictions are that block-level HTML elements ¿ e.g. <div>, <table>, <pre>, <p>, etc. 
    #            must be separated from surrounding content by blank lines, and the start and end tags of the block
    #            should not be indented with tabs or spaces. '
    result = "<figure id=\"fig-#{@id}\" class=\"figure figure--video\">"
    result << '<div class="video-embed video-embed--vimeo video-embed--16x9">'
    result << "<a class=\"video-embed__lazy-link\" style=\"#{@style}\" href=\"//vimeo.com/#{@id}\" data-lazy-video-src=\"#{@player}\">"
    result << '<div class="video-embed__lazy-div"></div>'
    result << "<div class=\"video-embed__lazy-info\">#{@title}</div>"
    result << '</a></div></figure>'

    # store it back in the cache
    Cache[@id] = result
    File.open(Cache_file, 'w') { |f| YAML.dump(Cache, f) }
    
    return result

  end

  Liquid::Template.register_tag "vimeo", self
end
