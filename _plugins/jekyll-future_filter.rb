#
# Author: Aaron Gustafson
# Enables filtering of arrays/collections based on each item hash’s `date` key
#
# ## Usage
# 
# {{ site.data.events | only_past }} - only show past events
# {{ site.data.events | only_future }} - only show future (or build time) events
# 
module Jekyll
  module FuturePastFilter

    def only_future(input)
      items = []
      build_time = Time.now
      input.each do |item|
        if item['date'] >= build_time
          items << item
        end        
      end
      items
    end

    def only_past(input)
      items = []
      build_time = Time.now
      input.each do |item|
        if item['date'] < build_time
          items << item
        end        
      end
      items
    end

  end
end

Liquid::Template.register_filter(Jekyll::FuturePastFilter)