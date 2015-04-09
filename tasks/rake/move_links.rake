source_dir = File.expand_path('../../../public/notebook', __FILE__)
link_cache = File.expand_path('../../../.cache', __FILE__)
FileUtils.mkdir_p( link_cache )
link_file = "#{link_cache}/notebook-links.yml"

# usage rake move_links
desc "Move all Notebook links to the links subdirectory"
task :move_links do |t, args|
  if File.exists?(link_file)
    links = open(link_file) { |f| YAML.load(f) }
    links.each {|link|
      puts "#{source_dir}/#{link}"
      if File.directory?("#{source_dir}/#{link}")
        # puts "#{source_dir}/#{link} to #{source_dir}/links/#{link}"
        FileUtils.mv "#{source_dir}/#{link}", "#{source_dir}/links/#{link}"
      end
    }
    count = links.length
    puts "#{count} links moved"
  end
end