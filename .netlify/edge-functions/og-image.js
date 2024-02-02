import ogs from "https://esm.sh/open-graph-scraper@6.2.2/";

export default async function ogImage( req ) {
	
	let url = new URL( req.url );

	const api_key = url.searchParams.get( 'key' );
	if ( api_key != Deno.env.get('WEBMENTION_APP_TOKEN') )
	{
		return new Response( '', { status: '511' } );
	}

	url = url.searchParams.get( 'url' );
	const response = await fetch( url, {
		redirect: 'follow',
		headers: {
			'Accept': 'text/html',
			'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'
		}
	});
	const html = await response.text();
	
	let image = false;
	const opengraph_data = await ogs({ html });
  console.log( "Response", JSON.stringify( opengraph_data ) );
	if ( ! ( "error" in opengraph_data ) &&
       "result" in opengraph_data &&
       "ogImage" in opengraph_data.result &&
       opengraph_data.result.ogImage.length > 0 ) {
    image = opengraph_data.result.ogImage[0].url;
  }
	console.log( image );
	
	return new Response( JSON.stringify( { image } ) );
}
