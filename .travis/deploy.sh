#!/bin/bash

if [[ $TRAVIS_BRANCH == 'master' ]] ; then
  eval "$(ssh-agent -s)" # Start ssh-agent cache
  chmod 600 .travis/id_rsa # Allow read access to the private key
  ssh-add .travis/id_rsa # Add the private key to SSH

  npm install -g gulp-cli
  gulp html # minify the HTML

  cd _site # move to the deploy folder
  git init
  git config user.name "Travis CI"
  git config user.email "aaron@easy-designs.net"
  git remote add live "ssh://${do_git_user}@${do_git_target}"
  git pull
  git add .
  git commit -m "Deploy"

  # We redirect any output to
  # /dev/null to hide any sensitive credential data that might otherwise be exposed.
  git push --force --quiet "ssh://${do_git_user}@${do_git_target}" master:master > /dev/null 2>&1

  cd .. # go back up
  bundle exec jekyll webmention
  git commit -am "New webmentions"
  git push --force --quiet "https://${github_user}:${github_token}@${github_target}" master:master > /dev/null 2>&1
else
  echo 'Invalid branch. You can only deploy from master.'
  exit 1
fi