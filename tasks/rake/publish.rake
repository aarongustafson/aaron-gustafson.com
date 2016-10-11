desc "Publish task"
task :publish do
  time = Time.now.utc
  puts "\n## Minifying HTML"
  system "gulp html"
  cd "_deploy" do
    message = "Site updated at #{time}"
    system "git add ."
    system "git commit -a -m '#{message}'"
    system "git push live"
    puts "\n## Pushing Live @ #{time}"
  end
end