#!/bin/bash

# Conver the .plist
plutil -p /Users/aarongu/.MacOSX/environment.plist > /tmp/$EUID.vars

# parse it and replace with exports
ruby -p -i -e "gsub('{', '')" /tmp/$EUID.vars
ruby -p -i -e "gsub('}', '')" /tmp/$EUID.vars
ruby -p -i -e "gsub('  \"', 'export ')" /tmp/$EUID.vars
ruby -p -i -e "gsub('\" => \"', '=')" /tmp/$EUID.vars
ruby -p -i -e "gsub('\"', '')" /tmp/$EUID.vars

# execute!
. /tmp/$EUID.vars

# remove it
rm /tmp/$EUID.vars

cd /Users/aarongu/Dropbox/Sites/aaron-gustafson.com
# printenv
su aarongu rake go