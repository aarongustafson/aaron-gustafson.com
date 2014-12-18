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

class Vimeo < Liquid::Tag
  Syntax = /^\s*([^\s]+)(\s+(\d+)\s+(\d+)\s*)?/
  Cache = Hash.new

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

    if ( Cache.has_key?(@id)) then 
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

    @style = "width:100%;height:100%;background:#000 url(#{@poster}) center center no-repeat;background-size:contain;position:absolute" 
    
    @player = "//player.vimeo.com/video/#{@id}?autoplay=1"

    @videoFrame =  CGI.escapeHTML("<iframe style=\"vertical-align:top;width:100%;height:100%;position:absolute;\" src=\"#{@player}\" frameborder=\"0\" allowfullscreen></iframe>")
 
    # with jQuery 
    #@onclick    = "$('##{@id}').replaceWith('#{@videoFrame}');return false;"
 
    # without JQuery
    @onclick    = "var myAnchor = document.getElementById('#{@id}');" + 
                  "var tmpDiv = document.createElement('div');" +  
                  "tmpDiv.innerHTML = '#{@videoFrame}';" + 
                  "myAnchor.parentNode.replaceChild(tmpDiv.firstChild, myAnchor);"+
                  "return false;" 

   # note: so special care is required to produce html code that will not be massage by the 
   #       markdown processor :
   #       extract from the markdown doc :  
   #           'The only restrictions are that block-level HTML elements ¿ e.g. <div>, <table>, <pre>, <p>, etc. 
   #            must be separated from surrounding content by blank lines, and the start and end tags of the block
   #            should not be indented with tabs or spaces. '
   result = <<-EOF

<figure id="fig-#{@id}" class="media-container media-container--vimeo">
<div class="ratio-16-9 embed-video-container" onclick="#{@onclick}" title="Click here to play “@title”">
<a class="vimeo-lazy-link" style="#{@style}" href="http://www.youtube.com/watch?v=#{@id}" id="#{@id}" onclick="return false;">
<div class="vimeo-lazy-link-div"></div>
<div class="vimeo-lazy-link-info">#{@title}</div>
</a>
<div class="video-info" >#{@description}</div>
</div>
</figure>

EOF
  Cache[@id] = result
  return result

  end

  Liquid::Template.register_tag "vimeo", self
end
