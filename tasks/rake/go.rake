# usage rake go
desc "Generate website, add, commit and deploy"
task :go do
    system "git add ."
    message = "Site updated at #{Time.now.utc}"
    system "git commit -am \"#{message}\""
    Rake::Task[:integrate].execute
    Rake::Task[:get_twitter_webmentions].execute
    Rake::Task[:generate].execute
    Rake::Task[:move_links].execute
    system "git push origin source"
    Rake::Task[:deploy].execute
    Rake::Task[:publish].execute
    Rake::Task[:webmention].execute
    Rake::Task[:fix_opengraph].execute
end