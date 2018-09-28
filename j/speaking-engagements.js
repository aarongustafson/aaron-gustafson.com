(function(document){

	if ( 'querySelectorAll' in document )
	{
		var today = new Date(),
			month = today.getUTCMonth() + 1,
			day = today.getUTCDate(),
			$past_list = document.querySelector( '#past-events + .listing--events' ),
			$future_events = document.querySelectorAll( '.event--future' ),
			i = 0,
			count = $future_events.length,
			date,
			re_slash = /-/g,
			$event;

		today = '' + today.getUTCFullYear() +
				( month < 10 ? '0' + month : month ) +
				( day < 10 ? '0' + day : day );

		while ( i < count )
		{
			$event = $future_events[i++];
			date = $event.dataset['date'].replace( re_slash, '' );
			
			// check the date
			if ( date < today )
			{
				// update the classes
				$event.classList.remove('event--future');
				$event.classList.add('event--past');
				// move it
				$past_list.insertBefore( $event, $past_list.firstChild );
			}
		}
	}

}(this.document));