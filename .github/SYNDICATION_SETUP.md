# Social Media Syndication Setup Guide

This guide explains how to set up the GitHub Actions workflow to replace your Zapier automation for syndicating blog posts and links to social media platforms.

## GitHub Repository Secrets

Add these secrets to your GitHub repository settings (Settings → Secrets and variables → Actions):

### Required Secrets

#### Mastodon API
```
MASTODON_ACCESS_TOKEN=your_mastodon_access_token
MASTODON_SERVER_URL=https://front-end.social  # Your Mastodon instance
```

#### Buffer API (for Twitter & Bluesky)
```
BUFFER_ACCESS_TOKEN=your_buffer_access_token
BUFFER_TWITTER_PROFILE_ID=your_twitter_profile_id
BUFFER_BLUESKY_PROFILE_ID=your_bluesky_profile_id
```

#### Pinterest API
```
PINTEREST_ACCESS_TOKEN=your_pinterest_access_token
PINTEREST_BOARD_ID=your_reading_list_board_id
```

### Optional Secrets

#### Screenshot Service
```
SCREENSHOT_API_KEY=your_screenshotmachine_api_key
```

#### IFTTT Fallback (for services without direct API)
```
IFTTT_WEBHOOK_KEY=your_ifttt_webhook_key
```

**Note**: LinkedIn requires IFTTT due to API limitations. See IFTTT setup section below.

## API Setup Instructions

### 1. Mastodon API Setup

1. Go to your Mastodon instance settings (e.g., https://front-end.social/settings/applications)
2. Create new application with these scopes:
   - `read` - Read account data
   - `write:statuses` - Post statuses
   - `write:media` - Upload media
3. Copy the access token

### 2. Buffer API Setup

1. Go to [Buffer Developers](https://buffer.com/developers/api)
2. Create an application and get access token
3. Get your profile IDs:
   ```bash
   curl -X GET "https://api.bufferapp.com/1/profiles.json?access_token=YOUR_TOKEN"
   ```
4. Find the IDs for your Twitter and Bluesky profiles

### 3. Pinterest API Setup

1. Go to [Pinterest Developer Portal](https://developers.pinterest.com/)
2. Create an app and generate access token
3. Get your board ID:
   ```bash
   curl -X GET "https://api.pinterest.com/v5/boards" \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

### 4. Screenshot Service (Optional)

1. Sign up at [Screenshot Machine](https://www.screenshotmachine.com/)
2. Get your API key from the dashboard
3. Or use alternative services like:
   - [URLBox](https://urlbox.io/)
   - [Bannerbear](https://www.bannerbear.com/)
   - [Htmlcsstoimage](https://htmlcsstoimage.com/)

### 5. IFTTT Setup (Required for LinkedIn)

1. Create IFTTT account and go to [Webhooks service](https://ifttt.com/maker_webhooks)
2. Get your webhook key
3. Create applets for each social platform:
   - **`linkedin_post`** → LinkedIn post (blog articles)
   - **`linkedin_link`** → LinkedIn link post (shared links)
   - `mastodon_post` → Mastodon toot (optional fallback)
   - `mastodon_link` → Mastodon link toot (optional fallback)
   - `twitter_post` → Twitter post (optional fallback)
   - `twitter_link` → Twitter link post (optional fallback)
   - `bluesky_post` → Bluesky post (optional fallback)
   - `bluesky_link` → Bluesky link post (optional fallback)
   - `pinterest_pin` → Pinterest pin (optional fallback)

**LinkedIn IFTTT Webhook Payload Example:**
```json
{
  "value1": "Article Title",
  "value2": "https://www.aaron-gustafson.com/notebook/article-slug/",
  "value3": "Brief excerpt or tags"
}
```

In the IFTTT LinkedIn action (Share a link):
- **Link URL**: `{{Value2}}`
- **Comment**: `{{Value1}}\n\n{{Value3}}`

## Netlify Webhook Setup

Configure Netlify to trigger the GitHub workflow after successful deployments:

### Option 1: Netlify Build Hook (Recommended)

1. In your Netlify site settings, go to Build & Deploy → Build hooks
2. Create a new build hook with URL pointing to GitHub:
   ```
   https://api.github.com/repos/aarongustafson/aaron-gustafson.com/dispatches
   ```
3. Add this to your `netlify.toml`:
   ```toml
   [[plugins]]
     package = "netlify-plugin-github-dispatch"
     [plugins.inputs]
       repo = "aarongustafson/aaron-gustafson.com"
       token = "YOUR_GITHUB_TOKEN"
       event = "netlify-deploy-succeeded"
   ```

### Option 2: Custom Function

Create `.netlify/functions/github-dispatch.js`:
```javascript
exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { default: fetch } = await import('node-fetch');
  
  try {
    const response = await fetch(
      'https://api.github.com/repos/aarongustafson/aaron-gustafson.com/dispatches',
      {
        method: 'POST',
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Netlify-Function'
        },
        body: JSON.stringify({
          event_type: 'netlify-deploy-succeeded',
          client_payload: {
            site_id: event.headers['x-netlify-site-id'],
            deploy_id: event.headers['x-netlify-deploy-id']
          }
        })
      }
    );

    return {
      statusCode: response.ok ? 200 : 500,
      body: JSON.stringify({ 
        success: response.ok,
        status: response.status 
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

### Option 3: Webhook to GitHub Repository Dispatch

1. Go to your repository settings → Webhooks
2. Add webhook with:
   - Payload URL: `https://your-site.netlify.app/.netlify/functions/github-dispatch`
   - Content type: `application/json`
   - Events: `deployment_status`

## Testing

### Manual Testing
```bash
# Test from repository root
node .github/scripts/syndicate-posts.js
node .github/scripts/syndicate-links.js
```

### GitHub Actions Manual Trigger
1. Go to Actions tab in your repository
2. Select "Syndicate Content to Social Media" workflow
3. Click "Run workflow"
4. Choose content type (posts/links/both)

## Monitoring

The workflow will:
- ✅ Log detailed progress and results
- ❌ Report errors to GitHub Actions logs  
- 🔄 Use IFTTT as fallback for failed API calls
- 💾 Cache processed items to prevent duplicates
- ⏰ Run backup checks every 30 minutes

## Migration from Zapier

1. ✅ Set up all API credentials as GitHub secrets
2. ✅ Configure Netlify webhook to GitHub
3. ✅ Test the workflow manually
4. ✅ Monitor first few automated runs
5. ✅ Disable Zapier workflows once confident

## Troubleshooting

### Common Issues

1. **Rate Limiting**: APIs have rate limits. The workflow spaces out requests.
2. **Token Expiry**: Some tokens expire. Monitor and refresh as needed.
3. **Content Formatting**: Test with various post types to ensure formatting works.

### Logs and Debugging

- Check GitHub Actions logs for detailed error messages
- Each platform logs success/failure separately
- IFTTT fallbacks are logged when triggered

### Platform-Specific Notes

- **LinkedIn**: Company posts require special permissions
- **Mastodon**: Instance-specific rate limits may vary
- **Buffer**: Profile IDs change if you reconnect accounts
- **Pinterest**: Board IDs are required, not board names