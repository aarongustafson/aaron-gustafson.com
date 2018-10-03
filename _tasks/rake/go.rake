# usage rake go
desc 'Generate website, add, commit and deploy'
task :go do
  # Rake::Task[:get_twitter_webmentions].execute
  system 'git add .'
  system 'git pull origin master'
  message = "Site generated at #{Time.now.utc}"
  system "git commit -am \"#{message}\""
  system 'git push origin master'
  system 'bundle exec jekyll build --trace'
  Rake::Task[:publish].execute
  system 'bundle exec jekyll webmention --trace'
  system 'git commit -am "Updating webmentions"'
  system 'git push origin master'
end
