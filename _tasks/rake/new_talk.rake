talks_dir   = File.join(Dir.pwd, '_talks')
file_ext = "markdown"

# usage rake new_post[my-new-post] or rake new_post['my new post'] or rake new_post (defaults to "new-post")
desc "Create a new talk (#{talks_dir})"
task :new_talk, :title do |t, args|
  if args.title
    title = args.title
  else
    title = get_stdin("Enter a title for your talk: ")
  end
  slug = title.downcase.strip.gsub(' ', '-').gsub(/[^\w-]/, '')
  filename = "#{talks_dir}/#{slug}.#{file_ext}"
  if File.exist?(filename)
    abort("rake aborted!") if ask("#{title} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
  end
  puts "Creating new talk: #{title}"
  open(filename, 'w') do |talk|
    talk.puts "---"
    talk.puts "layout: talk"
    talk.puts "title: \"#{title.gsub(/&/,'&amp;')}\""
    talk.puts "description: \"\""
    talk.puts "category: talks"
    talk.puts "tags: []"
    talk.puts "conferences: []"
    talk.puts "---"
  end
  `open #{filename}`
end
