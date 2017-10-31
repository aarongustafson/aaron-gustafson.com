# Title: CodePen plugin for Jekyll/Octopress
# Author: Volker Rose (@riddla | http://volker-rose.de/ | volker.rose@gmail.com)
# Updates: Aaron Gustafson (@aarongustafson | https://www.aaron-gustafson.com)
# Info: http://volker-rose.de/blog/2012/11/03/octopress-codepen-plugin/
# Credits: "Heavily inspired" (e.g. shamelessly copied) from the jsFiddle
#          tag/plugin for Jekyll by Brian Arnold (@brianarn)
# Description: Given a CodePen shortcode, outputs the CodePen embed code
#              e.g. the iframe.
#
# Syntax: {% codepen href user [type] [height] [preview] %}
#
# Examples:
#
# Input: {% codepen vhfon riddla %}
# Output: <pre class="codepen" data-height="300" data-type="result"
#              data-href="vhfon" data-user="riddla"><code></code></pre>
#         <script async src="http://codepen.io:/assets/embed/ei.js"></script>
#
# Input: {% codepen vhfon riddla css 600 preview %}
# Output: <pre class="codepen" data-height="600" data-type="css"
#               data-href="vhfon" data-user="riddla"><code></code></pre>
#         <script async src="http://codepen.io:/assets/embed/ei.js"></script>

unless defined? CODEPEN_CACHE_DIRECTORY
  CODEPEN_CACHE_DIRECTORY = File.expand_path('../../.cache', __FILE__)
  FileUtils.mkdir_p(CODEPEN_CACHE_DIRECTORY)
end

module Jekyll
  class CodePen < Liquid::Tag
    # load from the cache
    CACHE_FILE = File.join(CODEPEN_CACHE_DIRECTORY, 'codepen.yml')
    CACHE = if File.exist?(CACHE_FILE)
              open(CACHE_FILE) { |f| YAML.safe_load(f) }
            else
              {}
            end

    def initialize(_tag_name, markup, _tokens)
      # rubocop:disable LineLength
      syntax = /(?<pen>\w+)(?:\s(?<user>\w+))(?:\s(?<type>\w+))?(?:\s(?<height>\d+))?(?:\s(?<preview>\w+))?/
      # rubocop:enable LineLength
      return unless syntax =~ markup
      m = syntax.match(markup)
      @pen     = m['pen']
      @user    = m['user']
      @type    = m['type'] || 'result'
      @height  = m['height'] || '300'
      @preview = m['preview'] == 'preview'
    end

    def render(_context)
      if @pen && @user
        cache_key = "#{@user}-#{@pen}"

        # use the cached one if we have it
        if CACHE.key? cache_key
          puts "CodePen Embed: Using Cached Pen #{@id}"
          return CACHE[cache_key]
        end

        # build it fresh
        pen_url = "https://codepen.io/#{@user}/pen/#{@pen}"

        # extract video information using a REST command
        response = Net::HTTP.get_response(
          'codepen.io', "/api/oembed?url=#{pen_url}"
        )
        data = response.body
        result = JSON.parse(data)
        puts "CodePen Embed: Pen #{@id} not found" unless result['success']

        attrs = {
          'class'       => 'codepen',
          'data-user'   => @user,
          'data-href'   => @pen,
          'data-height' => @height,
          'data-type'   => @type
        }
        attrs['data-preview'] = true if @preview

        # build the text
        text = "See the Pen <a href=\"#{pen_url}\">#{result['title']}</a> "
        text << "by #{result['author_name']} "
        text << "(<a href=\"https://codepen.io/#{@user}\">#{@user}</a>) "
        text << 'on <a href="https://codepen.io">CodePen</a>.'
        code = '<p'
        attrs.each do |key, value|
          code << " #{key}=\"#{value}\""
        end
        code << ">#{text}</p>"
        code << '<script async src="https://codepen.io/assets/embed/ei.js">'
        code << '</script>'

        # store it back in the cache
        CACHE[cache_key] = code
        File.open(CACHE_FILE, 'w') { |f| YAML.dump(CACHE, f) }

        code
      else
        puts "CodePen Embed: Error processing input,
              expected syntax {% codepen href user [type] [height] [preview] %}"
      end
    end
  end
end

Liquid::Template.register_tag('codepen', Jekyll::CodePen)
