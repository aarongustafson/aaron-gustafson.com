desc 'Publish task'
task :publish do
  time = Time.now.utc
  # puts "\n## Minifying HTML"
  # system 'gulp html'
  cd '_site' do
    message = "Site updated at #{time}"
    system 'git add .'
    system "git commit -a -m '#{message}'"
    system 'git merge -s recursive -X ours live/main -m "Merging with live"'
    system 'git push live'
    puts "\n## Pushing Live @ #{time}"
  end
end
