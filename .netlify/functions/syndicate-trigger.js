// Netlify function to trigger GitHub workflow after successful deploy
exports.handler = async (event, context) => {
  // Only handle POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // Verify it's from Netlify (basic security)
  const netlifySignature = event.headers['x-netlify-signature'];
  if (!netlifySignature) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }

  try {
    const { default: fetch } = await import('node-fetch');

    // Parse the webhook payload
    const payload = JSON.parse(event.body);

    // Only trigger on successful deploy
    if (payload.state !== 'ready') {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Deploy not ready yet, skipping syndication',
          state: payload.state
        })
      };
    }

    // Trigger GitHub Actions workflow
    const githubResponse = await fetch(
      'https://api.github.com/repos/aarongustafson/aaron-gustafson.com/dispatches',
      {
        method: 'POST',
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Netlify-Function/1.0'
        },
        body: JSON.stringify({
          event_type: 'netlify-deploy-succeeded',
          client_payload: {
            deploy_id: payload.id,
            site_id: payload.site_id,
            deploy_url: payload.deploy_ssl_url,
            branch: payload.branch,
            timestamp: new Date().toISOString()
          }
        })
      }
    );

    if (githubResponse.ok) {
      console.log('✅ GitHub workflow triggered successfully');
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: 'Syndication workflow triggered',
          deploy_id: payload.id
        })
      };
    } else {
      const errorText = await githubResponse.text();
      console.error('❌ Failed to trigger GitHub workflow:', errorText);
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: 'Failed to trigger workflow',
          github_status: githubResponse.status
        })
      };
    }

  } catch (error) {
    console.error('❌ Error in webhook handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};