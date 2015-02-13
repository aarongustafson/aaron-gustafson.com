#!/bin/bash

echo “Publishing to aaron-gustafson.com”
cd /Users/Easy/Sites/aaron-gustafson.com/
/usr/bin/rake go
echo “Publishing complete, check aaron-gustafson.com”
curl http://textbelt.com/text -d number=4238381727 -d "message=Publishing complete, check aaron-gustafson.com"