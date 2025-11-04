#!/bin/bash

# Test script for local development
# This runs the syndication in test mode without posting to any social media

echo "🧪 Running syndication in TEST MODE"
echo "No actual posts will be made to social media platforms"
echo ""

# Set test environment
export TEST_MODE=true
export SITE_URL=https://www.aaron-gustafson.com
export POSTS_FEED_URL=https://www.aaron-gustafson.com/feeds/latest-posts.json  
export LINKS_FEED_URL=https://www.aaron-gustafson.com/feeds/latest-links.json

# Test posts syndication
echo "📝 Testing post syndication..."
node .github/scripts/syndicate-posts.js --test

echo ""
echo "🔗 Testing link syndication..."
node .github/scripts/syndicate-links.js --test

echo ""
echo "✅ Test completed! Check output above for what would have been posted."