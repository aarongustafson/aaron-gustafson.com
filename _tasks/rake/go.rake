# usage rake go
desc "Generate website, add, commit and deploy"
task :go do
    Rake::Task[:get_twitter_webmentions].execute
    system "git add ."
    message = "Site generated at #{Time.now.utc}"
    system "git commit -am \"#{message}\""
    system "bundle exec jekyll build --incremental"
    system "git push origin source"
    Rake::Task[:publish].execute
    Rake::Task[:webmention].execute
end