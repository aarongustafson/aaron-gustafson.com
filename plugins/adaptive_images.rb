#
# Author: Aaron Gustafson
# Adaptive Images with the Google Image Resizer
# For more, see https://carlo.zottmann.org/2013/04/14/google-image-resizer/
#
# In _config.yml, include the following:
#
#  adaptive_image:
#    cache: 2592000
#    srcset: 
#      - 1920
#      - 600
#      - 320
#    sizes:
#      - 
#
#  `cache` if for the length of time you want to cache it (in seconds)
#  `srcset` is a list of sizes (in widths) you want to support
#  `sizes` is the sizes attribute you want to offer
#
#   {% adaptive_image /path/to/image.jpg [attr="value"]* %}
#
# https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url=http://news.microsoft.com/build2015/assets/photos/build720150428_web.png&resize_w=1080&container=focus&refresh=2592000

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
      site = context.registers[:site]
      settings = site.config['adaptive_image']

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

        # Add the src & srcset
        srcset = []
        settings['srcset'].each do |size|
          the_src = @url % {url: markup[:image_src], width: size, cache: settings['cache']}
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
