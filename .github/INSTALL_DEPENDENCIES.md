# Install Additional Dependencies for Syndication

To set up the syndication workflow, you'll need to install these additional npm packages:

```bash
npm install axios cheerio html-to-text dotenv
```

These dependencies provide:

- `axios` - HTTP client for API requests
- `cheerio` - Server-side jQuery for HTML parsing
- `html-to-text` - Convert HTML to plain text
- `dotenv` - Environment variable management (for local testing)

## Testing Locally

Create a `.env` file in your project root for testing (DO NOT commit this file):

```bash
# .env file for local testing
SITE_URL=https://www.aaron-gustafson.com
POSTS_FEED_URL=https://www.aaron-gustafson.com/feeds/latest-posts.json
LINKS_FEED_URL=https://www.aaron-gustafson.com/feeds/latest-links.json

# API Keys (use your actual keys for testing)
LINKEDIN_ACCESS_TOKEN=your_test_token
MASTODON_ACCESS_TOKEN=your_test_token
MASTODON_SERVER_URL=https://front-end.social
BUFFER_ACCESS_TOKEN=your_test_token
BUFFER_TWITTER_PROFILE_ID=your_profile_id
BUFFER_BLUESKY_PROFILE_ID=your_profile_id
PINTEREST_ACCESS_TOKEN=your_test_token
PINTEREST_BOARD_ID=your_board_id
SCREENSHOT_API_KEY=your_api_key
IFTTT_WEBHOOK_KEY=your_webhook_key
```

Then test locally:

```bash
# Load environment variables and test
node -r dotenv/config .github/scripts/syndicate-posts.js
node -r dotenv/config .github/scripts/syndicate-links.js
```
