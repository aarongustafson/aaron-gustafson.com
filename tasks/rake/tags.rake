caches = File.expand_path('../../../.cache', __FILE__)
tag_file = "#{caches}/site-tags.yml"

desc 'Get tags in use on the site'
task :get_tags do
  if File.exists?(tag_file)
  	tags = open(tag_file) { |f| YAML.load(f) }
  	printed_tags = tags.keys.sort.join("\n")
  	puts printed_tags
  else
  	puts "No tags found. Have you generated the site?"
  end
end

desc 'Get posts using  specific tag'
task :get_posts_tagged, :tag do |t, args|
  if File.exists?(tag_file)
  	tags = open(tag_file) { |f| YAML.load(f) }
	if args.tag
	  tag = args.tag
	else
	  tag = get_stdin("What tag do you want to search on? ")
	end
  	if tags.has_key? tag
	  posts = tags[tag].join("\n")
  	  puts posts
  	else
  	  puts "No posts found for #{tag}."
  	end
  else
  	puts "No tags found. Have you generated the site?"
  end
end