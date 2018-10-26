caches = File.expand_path('../../../.cache', __FILE__)
tag_file = "#{caches}/site-tags.yml"

desc 'Get tags in use on the site'
task :get_tags do
  if File.exists?(tag_file)
    tags = open(tag_file) { |f| YAML.load(f) }
    # Todo: Columnize?
    # columns = []
    # i = 0
    # for tags.keys.sort.each do |tag|
    #   if ! columns[i]
    #     columns[i] = []
    #   end
    #   columns[i] << tag
    #   i = i + 1
    # end
    # puts columns.inspect
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

desc 'Cleanup the tags collection'
task :clean_tags, :tag do |t, args|
  tags = open(tag_file) { |f| YAML.load(f) }
  tags.each do |tag, docs|
    clean_docs = []
    docs.each do | doc |
      doc = File.basename doc
      if ! clean_docs.include? doc
        # puts "first time finding #{doc}"
        clean_docs << doc
      # else
        # puts "already found #{doc}"
      end
    end
    tags[tag] = clean_docs
  end
  # Save it back as a sorted array
  File.open(tag_file, 'w') { |f| YAML.dump(tags, f) }
end