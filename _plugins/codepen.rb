# Title: CodePen plugin for Jekyll/Octopress
# Author: Volker Rose (@riddla | http://volker-rose.de/ | volker.rose@gmail.com)
# Updates: Aaron Gustafson (@aarongustafson | https://www.aaron-gustafson.com)
# Info: http://volker-rose.de/blog/2012/11/03/octopress-codepen-plugin/
# Credits: "Heavily inspired" (e.g. shamelessly copied) from the jsFiddle tag/plugin for Jekyll by Brian Arnold (@brianarn)
# Description: Given a CodePen shortcode, outputs the CodePen embed code e.g. the iframe.
#
# Syntax: {% codepen href user [type] [height] [preview] %}
#
# Examples:
#
# Input: {% codepen vhfon riddla %}
# Output: <pre class="codepen" data-height="300" data-type="result" data-href="vhfon" data-user="riddla"><code></code></pre>
#         <script async src="http://codepen.io:/assets/embed/ei.js"></script>
#
# Input: {% codepen vhfon riddla css 600 preview %}
# Output: <pre class="codepen" data-height="600" data-type="css" data-href="vhfon" data-user="riddla"><code></code></pre>
#         <script async src="http://codepen.io:/assets/embed/ei.js"></script>

if ( ! defined? CODEPEN_CACHE_DIRECTORY )
  CODEPEN_CACHE_DIRECTORY = File.expand_path('../../.cache', __FILE__)
  FileUtils.mkdir_p(CODEPEN_CACHE_DIRECTORY)
end

module Jekyll
  class CodePen < Liquid::Tag
    # load from the cache
    Cache_file = File.join(CODEPEN_CACHE_DIRECTORY, "codepen.yml")
    if File.exists?(Cache_file)
      Cache = open(Cache_file) { |f| YAML.load(f) }
    else
      Cache = Hash.new
    end

    def initialize(tag_name, markup, tokens)
      if /(?<pen>\w+)(?:\s(?<user>\w+))(?:\s(?<type>\w+))?(?:\s(?<height>\d+))?(?:\s(?<preview>\w+))?/ =~ markup
        @pen     = pen
        @user    = user
        @type    = type || 'result'
        @height  = height || '300'
        @preview = preview == 'preview' 
      end
    end

    def render(context)
      if @pen && @user
        cache_key = "#{@user}-#{@pen}"

        # use the cached one if we have it
        if Cache.has_key? cache_key
          puts "CodePen Embed: Using Cached Pen #{@id}"
          return Cache[cache_key]
        end

        # build it fresh
        pen_url = "http://codepen.io/#{@user}/pen/#{@pen}"

        # extract video information using a REST command 
        response = Net::HTTP.get_response("codepen.io","/api/oembed?url=#{pen_url}")
        data = response.body
        result = JSON.parse(data)
        if ! result['success']
          puts "CodePen Embed: Pen #{@id} not found"
        end

        attrs = {
          'class'       => 'codepen',
          'data-user'   => @user,
          'data-href'   => @pen,
          'data-height' => @height,
          'data-type'   => @type,
        }
        if @preview
          attrs['data-preview'] = true
        end
        # build the text
        text = "See the Pen <a href=\"#{pen_url}\">#{result['title']}</a> "
        text << "by #{result['author_name']} (<a href=\"https://codepen.io/#{@user}\">#{@user}</a>) "
        text << 'on <a href="https://codepen.io">CodePen</a>.'
        code = '<p'
        attrs.each do |key,value|
          code << " #{key}=\"#{value}\""
        end
        code << ">#{text}</p>"
        code << '<script async src="https://codepen.io/assets/embed/ei.js"></script>'
        
        # store it back in the cache
        Cache[cache_key] = code
        File.open(Cache_file, 'w') { |f| YAML.dump(Cache, f) }
    
        return code
      else
        puts "CodePen Embed: Error processing input, expected syntax {% codepen href user [type] [height] [preview] %}"
      end
    end
  end
end

Liquid::Template.register_tag('codepen', Jekyll::CodePen)
