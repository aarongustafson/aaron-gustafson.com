source_dir   = File.expand_path('../../../source', __FILE__)
drafts_dir    = "_drafts"
posts_dir    = "_posts"
new_post_ext = "markdown"

# usage rake new_draft[my-new-post] or rake new_draft['my new post'] or rake new_draft (defaults to "new-post")
desc "Begin a new draft in #{source_dir}/#{drafts_dir}"
task :draft_post, :title do |t, args|
  if args.title
    title = args.title
  else
    title = get_stdin("Enter a title for your post: ")
  end
  raise "### You haven't set anything up yet. First run `rake install` to set up an Octopress theme." unless File.directory?(source_dir)
  mkdir_p "#{source_dir}/#{drafts_dir}"
  filename = "#{source_dir}/#{drafts_dir}/#{Time.now.strftime('%Y-%m-%d')}-#{title.to_url}.#{new_post_ext}"
  if File.exist?(filename)
    abort("Draft creation aborted.") if ask("#{filename} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
  end
  puts "Creating new draft: #{filename}"
  open(filename, 'w') do |post|
    post.puts "---"
    post.puts "layout: post"
    post.puts "title: \"#{title.gsub(/&/,'&amp;')}\""
    post.puts "date: #{Time.now.strftime('%Y-%m-%d %H:%M:%S %z')}"
    post.puts "comments: true"
    post.puts "categories: []"
    post.puts "description: \"\""
    post.puts "---"
  end
  `open ./#{filename}`
end

desc "Publish a draft"
task :publish_draft, :filename do |t, args|
  if args.filename
    filename = args.filename
  else
    filename = get_stdin("What’s the draft filename? ")
  end
  raise "### You haven't set anything up yet. First run `rake install` to set up an Octopress theme." unless File.directory?(source_dir)
  if filename.include? "#{drafts_dir}/"
    filename = filename.split('/').last
  end
  draft_file = "#{source_dir}/#{drafts_dir}/#{filename}"
  post_file = "#{source_dir}/#{posts_dir}/#{filename}"
  if ! File.exist? draft_file
    abort("#{filename} isn’t a draft.")
  end
  if File.exist? post_file
    abort("Publishing aborted.") if ask("#{filename} is already published. Do you want to overwrite?", ['y', 'n']) == 'n'
  end
  puts "Publishing draft: #{filename}"
  FileUtils.mv draft_file, post_file
end