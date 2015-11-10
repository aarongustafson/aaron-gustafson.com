require 'rubygems'
require 'twitter'
require 'kramdown'
require 'json'

root_folder = '../../../'
cache_folder = File.expand_path("#{root_folder}.cache", __FILE__)
cache_file = File.join(cache_folder, 'webmentions_received.yml')
config_file = File.expand_path("#{root_folder}_config.yml", __FILE__)

# usage rake get_twitter_webmentions
desc "Import Twitter webmentions"
task :get_twitter_webmentions do |t, args|

  # Load the config file
  jekyll_config = open(config_file) { |f| YAML.load(f) }
  
  # counting 
  count = 0

  if File.exists?(cache_file)
	  cached_webmentions = open(cache_file) { |f| YAML.load(f) }
	else
	  cached_webmentions = {}
	end

  client = Twitter::REST::Client.new do |config|
  	config.consumer_key        = ENV['TWITTER_CONSUMER_KEY']
  	config.consumer_secret     = ENV['TWITTER_CONSUMER_SECRET']
  	config.access_token        = ENV['TWITTER_ACCESS_TOKEN']
  	config.access_token_secret = ENV['TWITTER_ACCESS_SECRET']
  end

  client.search("aaron-gustafson.com -rt").collect do |tweet|
  	
  	if ! tweet
      next
    end

    target = false
  	tweet.urls.each do |url|
      url = url.url.to_s
      url = `curl -w "%{url_effective}\n" -L -s -S $URL -o /dev/null #{url}`
	  	if url.include? jekyll_config['url']
	  		target = URI::parse( url.gsub("\n",'') )
        target.fragment = target.query = nil
        target = target.to_s
	  		break
	  	end
  	end

  	if ! target
  		next
  	end
  	# puts target

  	id = tweet.id
    # puts id
  	content = tweet.text

  	permalink = tweet.url.to_s
  	# puts permalink
  	
  	pubdate = tweet.created_at
  	the_date = pubdate.strftime("%F")
  	# puts the_date

    # Make sure we have the target
    if ! cached_webmentions[target]
      # puts "Target #{target} not found, making one"
      cached_webmentions[target] = {}
    end

    # Make sure we have the date
    if ! cached_webmentions[target][the_date]
      # puts "No entries for #{target} on #{the_date}, making a collection"
      cached_webmentions[target][the_date] = {}
    end

    # Make sure we have the webmention
    if ! cached_webmentions[target][the_date][id]
      
      webmention = ""
      webmention_classes = "webmention"
			      
      author_block = ''
      # puts tweet.user
      a_name = tweet.user.name
      a_url = tweet.user.url
      a_photo = tweet.user.profile_image_url_https
      if a_photo
      	author_block << "<img class=\"webmention__author__photo u-photo\" src=\"#{a_photo}\" alt=\"\" title=\"#{a_name}\">"
      end
      name_block = "<b class=\"p-name\">#{a_name}</b>"
      author_block << name_block
      if a_url
        author_block = "<a class=\"u-url\" href=\"#{a_url}\">#{author_block}</a>"
      end

      author_block = "<div class=\"webmention__author p-author h-card\">#{author_block}</div>"

      meta_block = ""

      pubdate_iso = pubdate.strftime("%FT%T%:z")
      pubdate_formatted = pubdate.strftime("%-d %B %Y")
      published_block = "<time class=\"webmention__pubdate dt-published\" datetime=\"#{pubdate_iso}\">#{pubdate_formatted}</time>"
			
			meta_block << published_block
      meta_block << " | "
      meta_block << "<a class=\"webmention__source u-url\" href=\"#{permalink}\">Permalink</a>"

      meta_block = "<div class=\"webmention__meta\">#{meta_block}</div>"
      
      # Build the content block
      webmention_classes << " webmention--content-only"
      
      content = content.gsub(/(http[^\s]+)/, '[\1](\1)')
      content = Kramdown::Document.new(content).to_html
      if !content.start_with?('<p')
        content = content.sub(/^<[^>]+>/, '<p>').sub(/<\/[^>]+>$/, '</p>')
      end
      content_block = "<div class=\"webmention__content p-content\">#{content}</div>"

      # meta
      content_block << meta_block
        
      # put it together
      webmention << "<li id=\"webmention-#{id}\" class=\"webmentions__item\">"
      webmention << "<article class=\"h-cite #{webmention_classes}\">"
      webmention << author_block
      webmention << content_block
      webmention << "</article></li>"

      cached_webmentions[target][the_date][id] = webmention
      
      count += 1
    end

  end

  # store it all back in the cache
  # puts cached_webmentions
	File.open(cache_file, 'w') { |f| YAML.dump(cached_webmentions, f) }

  puts "Twitter Mebmentions Added: #{count}"
end