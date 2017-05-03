links_dir   = File.join(Dir.pwd, '_links')
file_ext = "markdown"

require 'uri'

# usage rake new_link[URL]
desc "Creating a new link in #{links_dir}"
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
  matches = /<title>(.*)<\/title>/m.match( html_source )
  if matches
    link_title = matches[1].strip
    link_title.delete!("\n")
    link_title.delete!("\r")
  else
    matches = /<h1>(.*)<\/h1>/m.match( html_source )
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
    temp = link_title.split(/[|-–—*:]+/);
    link_title = temp.first.strip
    source = temp.last.strip
  end
  if !URI(url).path.empty? and URI(url).path != '/'
    slug = URI(url).path.split('/').last.split('.').first
  else
    slug = URI(url).host.split('.').first
  end
  if !Dir.glob("#{links_dir}/*-#{slug}*").empty?
      puts " "
      puts Dir.glob("#{links_dir}/*-#{slug}*")
      puts " "
      abort("rake aborted!") if get_stdin("This link may be a duplicate of one of these. Do you want to proceed? (y or n) ") == 'n'
      #abort("rake aborted!") if ask("This link may already exist. Do you want to proceed?", ['y', 'n']) == 'n'
  end
  filename = "#{links_dir}/#{Time.now.strftime('%Y-%m-%d')}-#{slug}.#{file_ext}"
  if File.exist?(filename)
    abort("rake aborted!") if get_stdin("#{filename} already exists. Do you want to overwrite? (y or n) ") == 'n'
  end
  puts "Creating new link post: #{filename}"
  open(filename, 'w') do |post|
    post.puts "---"
    post.puts "title: \"#{link_title}\""
    post.puts "twitter_text: \"\""
    post.puts "date: #{Time.now.strftime('%Y-%m-%d %H:%M:%S %z')}"
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