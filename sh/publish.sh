#!/bin/bash

cd /Users/Easy/Sites/aaron-gustafson.com/

echo "Updating aaron-gustafson.com"
/usr/bin/git pull
echo "Updated aaron-gustafson.com"

echo "Moving new files into the repository"
mv /Users/Easy/Dropbox/Blog/to_publish/*.markdown ./source/_posts
echo "Done moving files"

echo "Publishing to aaron-gustafson.com"
/usr/bin/rake go
echo "Publishing complete, check aaron-gustafson.com"

curl http://textbelt.com/text -d number=4238381727 -d "message=Publishing complete, check aaron-gustafson.com"