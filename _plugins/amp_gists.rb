# A Liquid tag for AMP-friendly Gists.
# by: Brandon Tilly
# Source URL: https://gist.github.com/1027674
# Post http://brandontilley.com/2011/01/31/gist-tag-for-jekyll.html
#
# Example usage: {% gist 1027674 gist_tag.rb embed %} //embeds a gist for this plugin
#
# Target markup:
#
# <amp-gist data-gistid="b9bb35bc68df68259af94430f012425f"
#           layout="responsive"
#           width="480" height="270">
# </amp-gist>

module Jekyll
  module AMPGists
    # Filter for Gists
    # Converts gists to a format that AMP is ok with.
    @@amp_gist_tpl = "<amp-gist %ATTRS%></amp-gist>"
    @@defaults = {
      "layout" => "responsive",
      "width"  => "480",
      "height" => "270"
    }

    def amp_gists(input)
      config = Jekyll.configuration({ 'quiet' => true })['amp_gists']
      replacements = {}

      input.scan(/({% gist ([^%]+)%})/) {|match, text|
        # Get the component parts
        if text.match(/^[a-zA-Z\d]*\s.*?$/)
          string = text.gsub(/\s+/, ' ').strip
          gist, file = string.split(' ')
        else
          gist, file = text.strip, ""
        end
        # Default or configured?
        layout = config['layout'] || @defaults['layout']
        width = config['width'] || @defaults['width']
        height = config['height'] || @defaults['height']
        # Build the attributes
        attrs = []
        attrs << "data-gistid=\"#{gist}\""
        attrs << "data-gistfile=\"#{file}\""
        @@defaults.each do |key, value|
          value = value || @defaults[key]
          attrs << "#{key}=\"#{value}\""
        end
        tag = @@amp_gist_tpl.gsub '%ATTRS%', attrs.join(" ")
        # Replace
        #puts tag
        replacements[match] = tag
      }
      # replace
      input = replacements.inject(input) { |str, (k,v)| str.gsub(k,v) }
      input
    end
  end
end

Liquid::Template.register_filter(Jekyll::AMPGists)