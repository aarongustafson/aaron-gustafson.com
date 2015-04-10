source_dir   = File.expand_path('../../../source', __FILE__)
posts_dir    = "_posts"
new_post_ext = "markdown"

# usage rake new_link[URL]
desc "Begin a new link post in #{source_dir}/#{posts_dir}"
task :new_link, :url do |t, args|
  if args.url
    url = args.url
  else
    url = get_stdin("What URL did you want to link? ")
  end
  link_title = `curl -s --location "#{url}" | awk "/<title>/,/<\\/title>/"`
  if link_title
    link_title = link_title.gsub(/<\/?title>/i,'').strip
  else
    link_title = get_stdin("What is the title of the article? ")
  end
  source = ""
  separators = ["|", "-", "—", "–", "*"]
  if separators.any? { |sep| link_title.include? sep }
    temp = link_title.split(/[|-–—*']/);
    link_title = temp.first.strip
    source = temp.last.strip
  end
  raise "### You haven't set anything up yet. First run `rake install` to set up an Octopress theme." unless File.directory?(source_dir)
  mkdir_p "#{source_dir}/#{posts_dir}"
  if !Dir.glob("#{source_dir}/#{posts_dir}/*-#{link_title.to_url}*").empty?
      abort("rake aborted!") if ask("This link may already exist. Do you want to proceed?", ['y', 'n']) == 'n'
  end
  filename = "#{source_dir}/#{posts_dir}/#{Time.now.strftime('%Y-%m-%d')}-#{link_title.to_url}.#{new_post_ext}"
  if File.exist?(filename)
    abort("rake aborted!") if ask("#{filename} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
  end
  puts "Creating new link post: #{filename}"
  open(filename, 'w') do |post|
    post.puts "---"
    post.puts "layout: link"
    post.puts "title: \"#{link_title}\""
    post.puts "description: \"\""
    post.puts "date: #{Time.now.strftime('%Y-%m-%d %H:%M:%S %z')}"
    post.puts "comments: false"
    post.puts "ref_url: #{url}"
    post.puts "in_reply_to: #{url}"
    post.puts "ref_source: #{source}"
    post.puts "---"
  end
  `open #{filename}`
end