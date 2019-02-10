#!/bin/bash

# Conver the .plist
plutil -p /Users/aarongu/.MacOSX/environment.plist > /tmp/$EUID.vars

# parse it and replace with variable exports
ruby -p -i -e "gsub('{', '')" /tmp/$EUID.vars
ruby -p -i -e "gsub('}', '')" /tmp/$EUID.vars
ruby -p -i -e "gsub('  \"', 'export ')" /tmp/$EUID.vars
ruby -p -i -e "gsub('\" => \"', '=')" /tmp/$EUID.vars
ruby -p -i -e "gsub('\"', '')" /tmp/$EUID.vars

# load in the ENV vars
source /tmp/$EUID.vars

# remove the file
rm /tmp/$EUID.vars

# Did we get the vars?
printenv

# go into this folder
cd /Users/aarongu/Dropbox/Sites/aaron-gustafson.com

# Make sure the ENV persists
rake go