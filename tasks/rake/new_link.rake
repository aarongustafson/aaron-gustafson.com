source_dir   = File.expand_path('../../../source', __FILE__)
posts_dir    = "_posts"
new_post_ext = "markdown"

require 'uri';

# usage rake new_link[URL]
desc "Begin a new link post in #{source_dir}/#{posts_dir}"
task :new_link, :url do |t, args|
  if args.url
    url = args.url
  else
    url = get_stdin("What URL did you want to link? ")
  end
  # print "checking #{url}\r\n"
  html_source = `curl -s --location "#{url}"`
  if ! html_source.valid_encoding?
    html_source = html_source.encode('UTF-16be', :invalid=>:replace, :replace=>"?").encode('UTF-8')
  end
  matches = /<title>(.*)<\/title>/.match( html_source )
  if matches
    link_title = matches[1].strip
  else
    matches = /<h1>(.*)<\/h1>/.match( html_source )
    if matches
      link_title = matches[1].strip
    else
      link_title = get_stdin('What is the title of the article? ')
    end
  end
  link_title = link_title.gsub(%r{</?[^>]+?>}, '')
  source = ""
  separators = ["|", "-", "—", "–", "*"]
  if separators.any? { |sep| link_title.include? sep }
    temp = link_title.split(/[|-–—*']/);
    link_title = temp.first.strip
    source = temp.last.strip
  end
  raise "### You haven't set anything up yet. First run `rake install` to set up an Octopress theme." unless File.directory?(source_dir)
  mkdir_p "#{source_dir}/#{posts_dir}"
  slug = URI(url).path.split('/').last.split('.').first
  if !Dir.glob("#{source_dir}/#{posts_dir}/*-#{slug}*").empty?
      abort("rake aborted!") if ask("This link may already exist. Do you want to proceed?", ['y', 'n']) == 'n'
  end
  filename = "#{source_dir}/#{posts_dir}/#{Time.now.strftime('%Y-%m-%d')}-#{slug}.#{new_post_ext}"
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
    post.puts "via:"
    post.puts " name: "
    post.puts " url: "
    post.puts "---"
  end
  `open #{filename}`
end