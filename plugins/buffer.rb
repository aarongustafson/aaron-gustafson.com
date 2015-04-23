#  (c) Aaron Gustafson
#  https://github.com/aarongustafson/jekyll-buffer 
#  Licence : MIT
#  
#  This generator stores posts for Buffer. To work, this script
#  requires a BUFFER_ACCESS_TOKEN environment variable and at least
#  one of the following:
#
#    BUFFER_TWITTER_PROFILE
#    BUFFER_FACEBOOK_PROFILE
#    BUFFER_LINKEDIN_PROFILE 
#   

require 'net/http'
require 'uri'
require 'date'

BUFFER_CACHE_DIR = File.expand_path('../../.cache', __FILE__)
FileUtils.mkdir_p(BUFFER_CACHE_DIR)

module Jekyll
  
  class BufferCollectionGenerator < Generator
    safe true
    priority :low
    
    def generate(site)

      twitter = ENV['BUFFER_TWITTER_PROFILE'] or false
      facebook = ENV['BUFFER_FACEBOOK_PROFILE'] or false
      linkedin = ENV['BUFFER_LINKEDIN_PROFILE'] or false
      access_token = ENV['BUFFER_ACCESS_TOKEN'] or false

      if ! access_token
        return
      end

      # tweet length = 140 - 22 url chars & a space
      twitter_text_length = 140 - 22 - 1

      buffer_url = 'https://api.bufferapp.com/1/updates/create.json'
      today = Date.today

      if defined?(BUFFER_CACHE_DIR)
        
        buffered_file = File.join(BUFFER_CACHE_DIR, "buffer-sent.yml")
        if File.exists?(buffered_file)
          buffered = open(buffered_file) { |f| YAML.load(f) }
        else
          buffered = []
        end
        
        site.posts.each do |post|
          
          if ! post.published?
            continue
          end

          date = Date.parse(post.date.strftime("%Y-%m-%d %H:%M:%S"))
          if date < today
            next
          end

          # link posts should be handled differently
          if post.data.has_key?('ref_url')
            url = post.data['ref_url']
          else  
            url = "#{site.config['url']}#{post.url}"
          end

          if url and ! buffered.include? url

            if twitter
              twitter_text = post.data['twitter_text'] || post.title
              twitter_text = twitter_text[0,twitter_text_length]
              # puts "curl --data-urlencode 'text=#{twitter_text} #{url}' --data 'profile_ids[]=#{twitter}' #{buffer_url}"
              `curl -s --data-urlencode 'text=#{twitter_text} #{url}' --data 'profile_ids[]=#{twitter}' --data 'access_token=#{access_token}' #{buffer_url}`
            end

            data = ""
            excerpt = post.data['description'] or post.excerpt

            if facebook
              if post.data.has_key?('facebook_text')
                facebook_text = post.data['facebook_text']
                # puts "curl --data-urlencode 'text=#{facebook_text} #{url}' --data 'profile_ids[]=#{facebook}' #{buffer_url}"
                `curl -s --data-urlencode 'text=#{facebook_text} #{url}' --data 'profile_ids[]=#{facebook}' --data 'access_token=#{access_token}' #{buffer_url}`
              else
                data << " --data 'profile_ids[]=#{facebook}'"
              end
            end

            if linkedin
              if post.data.has_key?('linkedin_text')
                linkedin_text = post.data['linkedin_text']
                # puts "curl --data-urlencode 'text=#{linkedin_text} #{url}' --data 'profile_ids[]=#{linkedin}' #{buffer_url}"
                `curl -s --data-urlencode 'text=#{linkedin_text} #{url}' --data 'profile_ids[]=#{linkedin}' --data 'access_token=#{access_token}' #{buffer_url}`
              else
                data << " --data 'profile_ids[]=#{linkedin}'"
              end
            end

            if data != ""
              # puts "curl --data-urlencode 'text=#{excerpt} #{url}' #{data} #{buffer_url}"
              `curl -s --data-urlencode 'text=#{excerpt} #{url}' #{data} --data 'access_token=#{access_token}' #{buffer_url}`
            end

            buffered << url

          end

        end
        
        # Save it back
        File.open(buffered_file, 'w') { |f| YAML.dump(buffered, f) }

      end
    end
  end
  
end