#
# Author: Aaron Gustafson
# Adaptive Images with the Google Image Resizer
# For more, see https://carlo.zottmann.org/2013/04/14/google-image-resizer/
#
# An implementation of Adaptive Images with `srcset` and `sizes` using [Google’s open image resizing service](https://carlo.zottmann.org/2013/04/14/google-image-resizer/).
# 
# The tag is simple:
# 
#   {% adaptive_image /path/to/image.jpg [attr="value"] %}
# 
# You can add as many attributes as you want.
# 
# ## Global Configuration
# 
# To keep things simple and consistant, you can set up the standard sizes of your adaptive images in variables in `_config.yml`:
# 
#   adaptive_image:
#     cache: 2592000
#     srcset: 
#       - 1920
#       - 600
#       - 320
#     sizes:
#       - "(min-width:60em) 42.5em"
#       - 100vw
#   
# * `cache` is for the length of time you want to cache it (in seconds)
# * `srcset` is a list of sizes (in unitless pixel widths) you want to offer
# * `sizes` is the size configurations for layout purposes
# 

module Jekyll

  class AdaptiveImageTag < Liquid::Tag
    
    @url = nil

    def initialize(tag_name, tag_text, tokens)
      @url = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url=%{url}&amp;resize_w=%{width}&amp;container=focus&amp;refresh=%{cache}'
      @tag_text = tag_text
      super
    end

    def render(context)
      render_markup = Liquid::Template.parse(@tag_text).render(context).gsub(/\\\{\\\{|\\\{\\%/, '\{\{' => '{{', '\{\%' => '{%')

      # Gather settings
      settings = Jekyll.configuration({})['adaptive_image']

      markup = /^(?<image_src>[^\s]+\.[a-zA-Z0-9]{3,4})\s*(?<html_attr>[\s\S]+)$/.match(render_markup)
      
      if markup

        # Assign defaults
        settings['cache'] ||= 2592000
        settings['srcset'] ||= [1920, 600, 320]
        sizes = settings['sizes'].join(',') || '100vw'
        smallest_src = nil
        src = nil

        # Process html attributes
        html_attr = if markup[:html_attr]
                      Hash[ *markup[:html_attr].scan(/(?<attr>[^\s="]+)(?:="(?<value>[^"]+)")?\s?/).flatten ]
                    else
                      {}
                    end
        html_attr_string = html_attr.inject('') { |string, attrs|
          if attrs[1]
            string << "#{attrs[0]}=\"#{attrs[1]}\" "
          else
            string << "#{attrs[0]} "
          end
        }

        # set up the url
        original_source = markup[:image_src]
        if original_source[0] == '/' and original_source[1] != '/'
          original_source = "#{site.config['url']}#{original_source}"
        end

        # Add the src & srcset
        srcset = []
        settings['srcset'].each do |size|
          the_src = @url % {url: original_source, width: size, cache: settings['cache']}
          the_src << " #{size}w"
          srcset << the_src
          if ! smallest_src or smalles_src > size
            smalles_src = size
            src = the_src
          end
        end
        srcset = srcset.join(',')
        html_attr_string << " src=\"#{src}\" srcset=\"#{srcset}\""

        # Add sizes if it doesn’t exist
        if ! html_attr_string.include? 'sizes=' 
          html_attr_string << " sizes=\"#{sizes}\"" 
        end

        # Add alt if it doesn’t exist
        if ! html_attr_string.include? 'alt=' 
          html_attr_string << ' alt=""' 
        end

        "<img #{html_attr_string}>"
      end

    end
  end
end

Liquid::Template.register_tag('adaptive_image', Jekyll::AdaptiveImageTag)
