#!/bin/bash

if [[ $TRAVIS_BRANCH == 'master' ]] ; then
  eval "$(ssh-agent -s)" # Start ssh-agent cache
  chmod 600 .travis/id_rsa # Allow read access to the private key
  ssh-add .travis/id_rsa # Add the private key to SSH

  npm install -g gulp-cli
  gulp html # minify the HTML

  mkdir _deploy
  cd _deploy
  git init
  git config user.name "Travis CI"
  git config user.email "aaron@easy-designs.net"
  git remote add live "ssh://${do_git_user}@${do_git_host}${do_git_repo}"
  git fetch live
  git checkout master
  rsync -a "${TRAVIS_BUILD_DIR}/_site/" .
  git add .
  git commit -m "Deploy"
  git merge live/master -m "Automatically merging"
  
  # We redirect any output to
  # /dev/null to hide any sensitive credential data that might otherwise be exposed.
  git push --quiet live master > /dev/null 2>&1

  cd "${TRAVIS_BUILD_DIR}" # go back up
  gem install jekyll
  bundle install
  bundle exec jekyll webmention
  git commit -am "New webmentions"
  git push --force --quiet "https://${github_user}:${github_token}@${github_target}" master:master > /dev/null 2>&1
else
  echo 'Invalid branch. You can only deploy from master.'
  exit 1
fi