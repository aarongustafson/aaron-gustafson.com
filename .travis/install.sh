#!/bin/bash

gem cleanup
gem update --system
gem install bundler
gem install jekyll
bundle clean --force
bundle install
npm install
