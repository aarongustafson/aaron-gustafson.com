if ( 'speechSynthesis' in window )
{
  // Housekeeping
  window.addEventListener( 'beforeunload', function(){
    window.speechSynthesis.cancel();
  });

  function play() {
    if ( paused )
    {
      //console.log( 'resume', speech );
      window.speechSynthesis.resume();
    }
    else
    {
      //console.log( 'play', speech );
      window.speechSynthesis.speak( speech );
    }
    
    // reset the button
    //setTimeout(toggleButtons, 500);
  }

  function pause() {
    window.speechSynthesis.pause();
    paused = true;

    //setTimeout(toggleButtons, 500);
  }

  //function adjustSpeed()
  //{
  //  // cancel the original utterance
  //  //console.log('cancelling the original utterance');
  //  window.speechSynthesis.cancel();
  //
  //  // find the previous space
  //  //console.log( 'progress char', progress_index );
  //  var previous_space = speech.text.lastIndexOf( ' ', progress_index );
  //  //console.log( 'found a space at char', previous_space );
  //  
  //  // get the remains of the original string
  //  speech.text = speech.text.slice( previous_space );
  //  //console.log( 'new text', speech.text );
  //
  //  // Math to 1 decimal place
  //  speed = Math.round( $speed_value.value * 10 ) / 10;
  //
  //  // adjust the rate
  //  if ( speed > 10 )
  //  {
  //    speed = 10;
  //  }
  //  else if ( speed < 0.1 )
  //  {
  //    speed = 0.1;
  //  }
  //  speech.rate = speed;
  //
  //  // return to speaking
  //  // console.log( 'starting a new one', speech );
  //  window.speechSynthesis.speak( speech );
  //}

  //function toggleButtons() {
  //  if ( $play.disabled === false )
  //  {
  //    //$play.disabled = true;
  //    //$pause.disabled = false;
  //    //$speed_value.disabled = false;
  //  }
  //  else
  //  {
  //    //$play.disabled = false;
  //    //$pause.disabled = true;
  //    //$speed_value.disabled = true;
  //  }
  //}

  var speech = new SpeechSynthesisUtterance(),
    paused = false,
    text,
    progress_index = 0,
    $meta = document.querySelector('.entry__meta > dl'),
    $content = document.querySelector('main').cloneNode(true),
    $space = $content.querySelectorAll('pre'),
    $pause_before = $content.querySelectorAll('h2, h3, h4, h5, h6, p, li, dt, blockquote, pre, figure, footer'),
    $skip = $content.querySelectorAll('.anchorable__anchor, aside, .dont-read'),
    $fragment = document.createDocumentFragment(),
    $intro = document.createElement('dt'),
    $controls = document.createElement('dd'),
    $button = document.createElement('button'),
    $buttons = document.createElement('p'),
    $play,
    $pause,
    default_speed = 1.4,
    //$speed = $buttons.cloneNode(true),
    //$speed_label = document.createElement('label'),
    //$speed_value = document.createElement('input'),
    $caveat = document.createElement('small');
  
  // Don’t read
  Array.prototype.forEach.call( $skip, function( $el ){
    $el.innerHTML = '';
  });
  
  // spacing out content
  Array.prototype.forEach.call( $space, function( $el ){
    $el.innerHTML = ' ' + $el.innerHTML.replace(/[\r\n\t]/g, ' ') + ' ';
  });
  
  // Synthetic Pauses
  Array.prototype.forEach.call( $pause_before, function( $el ){
    $el.innerHTML = ' , ' + $el.innerHTML;
  });

  // capture character index as we move.
  speech.onboundary = function( e ) {
    if ( e.name == 'word' )
    {
      progress_index = e.charIndex;
    }
  };

  // clear the queue when done
  speech.onend = function( e ) {
    window.speechSynthesis.cancel();
  };

  text = $content.textContent;
  speech.text = text;
  
  //----------------------
  // Build the GUI
  // ---------------------
  
  $intro.innerHTML = 'Would you prefer to have this post read to you?';
  $intro.classList.add('dont-read');
  
  $controls.classList.add('dont-read', 'media-controls');
  
  // Buttons
  $buttons.classList.add('media-controls__buttons');
  $button.classList.add('media-controls__button');
  // Default active buttons
  $play = $button.cloneNode('true');
  $play.classList.add('media-controls__button--play');
  $play.setAttribute( 'aria-label', 'Play' );
  $play.addEventListener( 'click', play, false );
  //$play.addEventListener( 'touchend', play, false );
  $buttons.appendChild($play);
  // Default disabled buttons
  //$button.disabled = true;
  $pause = $button.cloneNode('true');
  $pause.classList.add('media-controls__button--pause');
  $pause.setAttribute( 'aria-label', 'Pause' );
  $pause.addEventListener( 'click', pause, false );
  //$pause.addEventListener( 'touchend', pause, false );
  $buttons.appendChild($pause);
  $controls.appendChild($buttons);

  // Speed
  speech.rate = default_speed;
  //$speed.classList.add('media-controls__speed');
  //$speed_label.innerText = 'Speed';
  //$speed_label.htmlFor = 'speed_value';
  //$speed.appendChild( $speed_label );

  //$speed_value.type = 'number';
  //$speed_value.id = 'speed_value';
  ////$speed_value.disabled = true;
  //$speed_value.min = '0.1';
  //$speed_value.max = '10';
  //$speed_value.step = '0.1';
  //$speed_value.value = default_speed;
  //$speed_value.addEventListener( 'change', adjustSpeed, false );
  ////$speed_value.addEventListener( 'blur', adjustSpeed, false );
  ////$speed_value.addEventListener( 'keyup', adjustSpeed, false );
  ////$speed_value.addEventListener( 'click', adjustSpeed, false );
  ////$speed_value.addEventListener( 'touchend', adjustSpeed, false );
  //$speed.appendChild( $speed_value );
  //$controls.appendChild($speed);

  // Caveat
  $caveat.innerHTML = 'SpeechSynthesis is still experimental. This could be buggy.';
  $controls.appendChild($caveat);

  $fragment.appendChild($intro);
  $fragment.appendChild($controls);
  $meta.appendChild($fragment);
}