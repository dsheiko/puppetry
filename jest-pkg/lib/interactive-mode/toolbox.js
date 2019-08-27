
    if ( !document.body ) {
      document.documentElement.innerHTML += "<body></body>";
    }

    console.log( suiteHtml );

    document.body.insertAdjacentHTML( "beforebegin",
      '<div class="__PUPPETRY_toolbox">'
      + '<div class="__PUPPETRY_header"><button id="__PUPPETRY_next" class="__PUPPETRY_btn">Next</button></div>'
      + '<div class="__PUPPETRY_suite"><ul>' + suiteHtml + '</ul></div>'
      + '</div>' );

    const CONTAINER = document.querySelector( ".__PUPPETRY_toolbox" ),
          NEXT_BTN = document.querySelector( "#__PUPPETRY_next" ),
          COMMAND_LIST = Array.from( document.querySelectorAll( "li[data-puppetry-cid]" ) ),
          updateView = ( nextId ) => {
            COMMAND_LIST.forEach( el => el.classList.remove( "__PUPPETRY_ACTIVE" ) );
            const li = document.querySelector( "li[data-puppetry-cid='" + nextId + "']" );
            li.classList.add( "__PUPPETRY_ACTIVE" );
            li.scrollIntoView();
          };

    let counter = 0;

    NEXT_BTN.addEventListener( "click", ( e ) => {
      e.preventDefault();
      e.stopPropagation();
      const nextId = data.sids[ counter++ ];
      document.body.dataset.puppetryNext = nextId;
      updateView( data.sids[ counter ] );
    }, false );

    updateView(data.sids[ 0 ]);