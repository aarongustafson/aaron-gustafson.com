# usage rake go
desc 'Generate website, add, commit and deploy'
task :go do
  # Rake::Task[:get_twitter_webmentions].execute
  system 'git add .'
  system 'git pull origin master'
  message = "Site generated at #{Time.now.utc}"
  system "git commit -am \"#{message}\""
  system 'git push origin master'
  system 'bundle exec jekyll build --incremental'
  Rake::Task[:publish].execute
  Rake::Task[:webmention].execute
end
