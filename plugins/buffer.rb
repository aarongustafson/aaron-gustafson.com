#  (c) Aaron Gustafson
#  https://github.com/aarongustafson/jekyll-buffer 
#  Licence : MIT
#  
#  This generator sends posts for Buffer. To work, this script
#  requires a BUFFER_ACCESS_TOKEN environment variable and at least
#  one of the following:
#
#    BUFFER_TWITTER_PROFILE
#    BUFFER_FACEBOOK_PROFILE
#    BUFFER_LINKEDIN_PROFILE 
#
#  By default, Twitter gets sent the post title & URL. Facebook and 
#  LinkedIn get the YAML "description" or the post excerpt (as a 
#  fallback) plus the link. You can customize each with the following
#  front-matter:
#
#   * twitter_text - This will be truncated to 117 characters to make
#     room for the URL
#   * facebook_text
#   * linkedin_text

require 'net/http'
require 'net/https'
require 'uri'
require 'date'
require 'kramdown'
require 'nokogiri'

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

            excerpt = post.data['description'] || post.excerpt
            # Convert to HTML
            excerpt = Kramdown::Document.new(excerpt).to_html
            # And back to plain text
            excerpt = Nokogiri::HTML(excerpt).text
            # Then encode ampersands
            excerpt = excerpt.gsub( '&', '&amp;' )

            payload = {
              'shorten' => 'false',
              'text' => "#{excerpt} #{url}",
              'access_token' => access_token,
              'profile_ids[]' => []
            }

            # Twitter is special
            if twitter
              twitter_text = post.data['twitter_text'] || post.title
              twitter_text = twitter_text[0,twitter_text_length]

              twitter_data = payload.dup
              twitter_data['text'] = "#{twitter_text} #{url}"
              twitter_data['profile_ids[]'] << twitter

              post_to_buffer( twitter_data )
            end

            # Facebook & LinkedIn
            profile_ids = []
            if facebook
              if post.data.has_key?('facebook_text')
                facebook_data = payload.dup
                facebook_data['text'] = post.data['facebook_text']
                facebook_data['text'] << " #{url}"
                facebook_data['profile_ids[]'] << facebook

                post_to_buffer( facebook_data )
              else
                profile_ids << facebook
              end
            end

            if linkedin
              if post.data.has_key?('linkedin_text')
                linkedin_data = payload.dup
                linkedin_data['text'] = post.data['linkedin_text']
                linkedin_data['text'] << " #{url}"
                linkedin_data['profile_ids[]'] << linkedin

                post_to_buffer( linkedin_data )
              else
                profile_ids << linkedin
              end
            end

            # Both Facebook & LinkedIn
            if profile_ids.length > 0
              payload['profile_ids[]'] = profile_ids
              post_to_buffer( payload )
            end

            buffered << url

          end

        end
        
        # Save it back
        File.open(buffered_file, 'w') { |f| YAML.dump(buffered, f) }

      end
    end

    def post_to_buffer( payload )

      # Idea
      # puts "curl --data-urlencode 'text=#{twitter_text}' --data 'media[link]=#{url}' --data 'profile_ids[]=#{twitter}' #{buffer_url}"
      buffer_url = URI.parse('https://api.bufferapp.com/1/updates/create.json')
      https = Net::HTTP.new(buffer_url.host, buffer_url.port)
      https.use_ssl = true
      request = Net::HTTP::Post.new(buffer_url.path)
      set_form_data(request, payload)
      response = https.request(request)

    end

    # Using custom set_form_data and urlencode
    # See http://cloudlines.tumblr.com/post/653645115/post-put-arrays-with-ruby-net-http-set-form-data
    # Ruby NET/HTTP does not support duplicate parameter names
    # File net/http.rb, line 1426
    def set_form_data(request, params, sep = '&')
      request.body = params.map {|k,v| 
        if v.instance_of?(Array)
          v.map {|e| "#{urlencode(k.to_s)}=#{urlencode(e.to_s)}"}.join(sep)
        else
          "#{urlencode(k.to_s)}=#{urlencode(v.to_s)}"
        end
      }.join(sep)
      request.content_type = 'application/x-www-form-urlencoded'
    end
    
    def urlencode(str)
      URI::encode(str)
    end

  end
  
end