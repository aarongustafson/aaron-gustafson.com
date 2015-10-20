root_folder = '../../../'
cache_folder = File.expand_path("#{root_folder}.cache", __FILE__)
cache_file = File.join(cache_folder, 'webmentions_received.yml')
revised_cache_file = File.join(cache_folder, 'webmentions_received_updated.yml')

desc "Cleanup webmentions"
task :cleanup_webmentions do |t, args|
	
	if File.exists?(cache_file)
	  cached_webmentions = open(cache_file) { |f| YAML.load(f) }
	else
	  cached_webmentions = {}
	end

	cleaned_webmentions = {}

	cached_webmentions.each do | url, webmentions |
		url = URI::parse( url )
		url.fragment = url.query = nil
		url = url.to_s
		
		if ! cleaned_webmentions[url]
    	  puts "Target #{url} not found, making one"
    	  cleaned_webmentions[url] = {}
    	end

    	webmentions.each do | the_date, items |

	    	# Make sure we have the date
	    	if ! cleaned_webmentions[url][the_date]
	    	  puts "No entries for #{url} on #{the_date}, making a collection"
	    	  cleaned_webmentions[url][the_date] = {}
	    	end

	    	items.each do | id, webmention |

	    		if id.to_s.include? 'twitter.com/'
          			# puts link['data']['url']
          			id = URI::parse( id ).path.split('/').last
          			puts "cleaned the ID to #{id}"
        		end

	    		if ! cleaned_webmentions[url][the_date][id]
	    			cleaned_webmentions[url][the_date][id] = webmention
	    		end

	    	end

    	end
	
    end

	# store it all back in the cache
  	# puts cached_webmentions
	File.open(revised_cache_file, 'w') { |f| YAML.dump(cleaned_webmentions, f) }
end