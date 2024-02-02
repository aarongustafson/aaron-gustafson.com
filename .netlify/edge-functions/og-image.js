import ogs from "https://esm.sh/open-graph-scraper@6.3.3/";

export default async function ogImage( req ) {
	
	let url = new URL( req.url );

	const api_key = url.searchParams.get( 'key' );
	if ( api_key != Deno.env.get('WEBMENTION_APP_TOKEN') )
	{
		return new Response( '', { status: '511' } );
	}

	url = url.searchParams.get( 'url' );
  const fetchOptions = {
    redirect: 'follow',
    headers: {
      'Accept': 'text/html',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'
    }
  };
	
  let image = false;
	ogs( { url, fetchOptions } )
    .then( data => {
      const { error, result, response } = data;
      if ( !error && result.success ) {
        image = result.ogImage[0].url;
      }
      else
      {
        console.log( 'Failed Response:', response );
      }
    });
	console.log( image );
	
	return new Response( JSON.stringify( { image } ) );
}
