posts_dir   = File.join(Dir.pwd, '_posts')
file_ext = "markdown"

require 'rubygems/user_interaction'

# usage rake new_post[my-new-post] or rake new_post['my new post'] or rake new_post (defaults to "new-post")
desc "Begin a new post in #{posts_dir}"
task :new_post, :title do |t, args|
  if args.title
    title = args.title
  else
    title = get_stdin("Enter a title for your post: ")
  end
  slug = title.downcase.strip.gsub(' ', '-').gsub(/[^\w-]/, '')
  filename = "#{posts_dir}/#{Time.now.strftime('%Y-%m-%d')}-#{slug}.#{file_ext}"
  if File.exist?(filename)
    abort("rake aborted!") if get_stdin("#{filename} already exists. Do you want to overwrite? (y or n) ") == 'n'
    #abort("rake aborted!") if ask("#{filename} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
  end
  puts "Creating new post: #{filename}"
  open(filename, 'w') do |post|
    post.puts "---"
    post.puts "layout: post"
    post.puts "title: \"#{title.gsub(/&/,'&amp;')}\""
    post.puts "date: #{Time.now.strftime('%Y-%m-%d %H:%M:%S %z')}"
    post.puts "comments: true"
    post.puts "tags: []"
    post.puts "description: \"\""
    post.puts "---"
  end
  `open #{filename}`
end
