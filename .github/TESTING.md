# Testing & Development Guide

## 🧪 Test Modes Available

### 1. **Local Testing** (Recommended for Development)

```bash
# Install dependencies first
npm install

# Run local test (no API calls made)
./.github/scripts/test-syndication.sh
```

### 2. **GitHub Actions Test Mode**

1. Go to your repository → Actions tab
2. Select "Syndicate Content to Social Media"
3. Click "Run workflow"
4. ✅ **Enable "Run in test mode"**
5. Choose content type and run

### 3. **Environment Variable Testing**

```bash
# Set test mode in environment
export TEST_MODE=true

# Run individual scripts
node .github/scripts/syndicate-posts.js
node .github/scripts/syndicate-links.js
```

## 🔍 What Test Mode Does

### ✅ **Safe Operations** (Always Performed):

- ✅ Fetches RSS feeds from your live site
- ✅ Processes content (HTML stripping, formatting)
- ✅ Checks cache for new items since last run
- ✅ Generates screenshot URLs
- ✅ Validates all content processing logic
- ✅ Shows exactly what **would** be posted

### ❌ **Disabled in Test Mode** (No Real Posts):

- ❌ No actual API calls to social platforms
- ❌ No posts to LinkedIn, Mastodon, Buffer, Pinterest
- ❌ No IFTTT webhook triggers
- ❌ Cache timestamps are **not** updated (so you can re-test)

## 📋 Test Output Example

```
🧪 Running in TEST MODE - no actual posts will be made
📡 Fetching posts from: https://www.aaron-gustafson.com/feeds/latest-posts.json
📝 Found 1 new post(s) to syndicate
📝 Processing post: My Latest Blog Post
📊 Posting to LinkedIn (Personal)...
🧪 TEST: LinkedIn post data: {
  "author": "urn:li:person:me",
  "specificContent": {
    "com.linkedin.ugc.ShareContent": {
      "shareCommentary": {
        "text": "My Latest Blog Post\n\nThis is the cleaned content..."
      }
    }
  }
}
✅ LinkedIn Personal post successful
🐘 Posting to Mastodon...
🧪 TEST: Mastodon post data: {
  "status": "Check out my latest post! https://aaron-gustafson.com/post/123",
  "visibility": "public"
}
```

## 🚀 Production Deployment Steps

### Phase 1: Test Everything

```bash
# 1. Test locally first
./.github/scripts/test-syndication.sh

# 2. Test in GitHub Actions (with test mode enabled)
# Go to Actions → Manual trigger → Enable test mode

# 3. Verify all content processing works correctly
```

### Phase 2: Set Up API Credentials

```bash
# Add these secrets in GitHub repo settings:
LINKEDIN_ACCESS_TOKEN
MASTODON_ACCESS_TOKEN
MASTODON_SERVER_URL
BUFFER_ACCESS_TOKEN
BUFFER_TWITTER_PROFILE_ID
BUFFER_BLUESKY_PROFILE_ID
PINTEREST_ACCESS_TOKEN
PINTEREST_BOARD_ID
SCREENSHOT_API_KEY (optional)
IFTTT_WEBHOOK_KEY (optional fallback)
```

### Phase 3: Live Testing

```bash
# 1. Run workflow WITHOUT test mode on existing content
# 2. Check that cache properly prevents re-posting
# 3. Verify one new post/link gets syndicated correctly
```

### Phase 4: Enable Webhook

```bash
# 1. Add GITHUB_ACCESS_TOKEN to Netlify environment
# 2. Configure Netlify deploy notification
# 3. Test with a new blog post
```

## 🐛 Debugging & Monitoring

### Local Debugging

```bash
# Enable detailed logging
export DEBUG=true
export TEST_MODE=true
node .github/scripts/syndicate-posts.js
```

### GitHub Actions Logs

- All API calls and responses are logged
- Test mode shows exact payload data
- Errors include full context and fallback attempts

### Cache Management

```bash
# View current cache
cat .github/cache/last-syndicated.json

# Reset cache (will re-process all content)
rm -f .github/cache/last-syndicated.json
```

## 🔧 Development Tips

### Testing New Features

1. Always start in test mode
2. Test with various post types (regular posts vs links)
3. Test content with different formatting (blockquotes, HTML, etc.)
4. Verify screenshot URL generation
5. Test error handling by removing API credentials

### Content Processing Testing

```bash
# Test specific content processing functions
node -e "
const { ContentProcessor } = require('./.github/scripts/social-media-utils.js');
const html = '<blockquote><p>Test content</p></blockquote>';
console.log(ContentProcessor.processContentForLinkedIn(html));
"
```

### Platform-Specific Testing

```bash
# Test only specific platforms by commenting out others in the scripts
# Or add platform filtering to test individual integrations
```

## ⚠️ Important Notes

1. **Test mode preserves cache state** - timestamps won't update, so you can run tests multiple times
2. **Live mode updates cache** - once you run without test mode, cache timestamps advance
3. **Screenshot API** - May still make calls in test mode if you want to verify URLs work
4. **Rate limiting** - Test mode helps avoid hitting API rate limits during development
