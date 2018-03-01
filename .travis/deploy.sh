#!/bin/bash

if [[ $TRAVIS_BRANCH == 'master' ]] ; then
  gulp html

  cd _site
  git init

  git config user.name "Travis CI"
  git config user.email "aaron@easy-designs.net"

  git add .
  git commit -m "Deploy"

  # We redirect any output to
  # /dev/null to hide any sensitive credential data that might otherwise be exposed.
  git push --force --quiet "ssh://${do_git_user}@${do_git_target}" master:master > /dev/null 2>&1

  cd ..
  bundle exec jekyll webmention
  git commit -am "New webmentions"
  git push --force --quiet "https://${github_user}:${github_token}@${git_target}" master:master > /dev/null 2>&1
else
  echo 'Invalid branch. You can only deploy from master.'
  exit 1
fi