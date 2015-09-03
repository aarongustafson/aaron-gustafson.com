desc "Publish task"
task :publish do
  cd "_deploy" do
    system "git push live master"
    message = "Site updated at #{Time.now.utc}"
    puts "\n## Pushing Live At: #{message}"
  end
end