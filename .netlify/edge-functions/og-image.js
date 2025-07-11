// Simple Open Graph scraper implementation for Deno/Edge Functions
async function extractOgImage(url) {
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: {
        'Accept': 'text/html',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      return false;
    }
    
    const html = await response.text();
    
    // Extract og:image using regex (simple approach for edge functions)
    const ogImageMatch = html.match(/<meta\s+property=["\']og:image["\']\s+content=["\']([^"\']+)["\'][^>]*>/i);
    if (ogImageMatch && ogImageMatch[1]) {
      return ogImageMatch[1];
    }
    
    // Fallback to other image meta tags
    const twitterImageMatch = html.match(/<meta\s+name=["\']twitter:image["\']\s+content=["\']([^"\']+)["\'][^>]*>/i);
    if (twitterImageMatch && twitterImageMatch[1]) {
      return twitterImageMatch[1];
    }
    
    return false;
  } catch (error) {
    console.error('Error extracting OG image:', error);
    return false;
  }
}

export default async function ogImage( req ) {
	
	let url = new URL( req.url );

	const api_key = url.searchParams.get( 'key' );
	if ( api_key != Deno.env.get('WEBMENTION_APP_TOKEN') )
	{
		return new Response( '', { status: '511' } );
	}

	const targetUrl = url.searchParams.get( 'url' );
	
	const image = await extractOgImage(targetUrl);
	console.log( 'Extracted image:', image );
	
	return new Response( JSON.stringify( { image } ) );
}