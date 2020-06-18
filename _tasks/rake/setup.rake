require 'yaml'

root_folder = '../../../'
config_file = File.expand_path("#{root_folder}_config.yml", __FILE__)
jekyll_config = open(config_file) { |f| YAML.load(f) }
destination = jekyll_config['destination'] || '_site'
deploy_dir = File.expand_path("#{root_folder}#{destination}", __FILE__)

desc 'Setting up aaron-gustafson.com'
task :setup do
  puts "## Setting up Github connection\n"
  puts "## Step 1: Creating #{deploy_dir}\n"
  FileUtils.mkdir_p(deploy_dir)
  puts "## Step 2: Setting up Github\n"
  cd deploy_dir do 
    system 'git init'
    system 'git remote add origin https://github.com/aarongustafson/aarongustafson.github.io'
    system 'git remote add live ssh://root@45.55.195.184/var/git_repositories/aaron-gustafson.com.git'
    system 'git fetch live'
    system 'git checkout master'
  end
  puts "## Git setup complete\n"
end
