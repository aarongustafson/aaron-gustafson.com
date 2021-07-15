require 'html-proofer'

desc 'Testing HTML for broken links & more'
task :test do
  puts "## Testing HTML\n"
  options = {
    :assume_extension => true,
    :empty_alt_ignore => true,
    :check_opengraph => true,
    :http_status_ignore => [999]
  }
  HTMLProofer.check_directory('./_site', options).run
end
