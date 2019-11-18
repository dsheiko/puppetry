
    if ( !document.body ) {
      document.documentElement.innerHTML += "<body></body>";
    }

    document.body.insertAdjacentHTML( "beforebegin",
      '<div class="__PUPPETRY_toolbox">'
      + '<div class="__PUPPETRY_header"><div>Puppetry</div><button id="__PUPPETRY_next" class="__PUPPETRY_btn">Next</button></div>'
      + '<div class="__PUPPETRY_suite"><ul>' + suiteHtml + '</ul></div>'
      + '</div>' );

    const CONTAINER = document.querySelector( ".__PUPPETRY_toolbox" ),
          HEADER = CONTAINER.querySelector( ".__PUPPETRY_header" ),
          NEXT_BTN = document.querySelector( "#__PUPPETRY_next" ),

          COMMAND_LIST = Array.from( document.querySelectorAll( "li[data-puppetry-cid]" ) ),

          updateView = ( nextId ) => {
            COMMAND_LIST.forEach( el => el.classList.remove( "__PUPPETRY_ACTIVE" ) );
            const li = document.querySelector( "li[data-puppetry-cid='" + nextId + "']" );
            if ( !li ) {
              return;
            }
            li.classList.add( "__PUPPETRY_ACTIVE" );
            li.scrollIntoView();
          },

          querySelector = ( selector ) => {
           if ( selector.startsWith( "/" ) || selector.startsWith( "(.//" ) ) {
             return document.evaluate( selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null )
              .singleNodeValue;
           }
           return document.querySelector( selector );
          },

          highlightTarget = ( cid ) => {
            Array.from( document.querySelectorAll( ".__PUPPETRY_nJNTY4bY_target" ) )
              .forEach(( el ) => el.classList.toggle( "__PUPPETRY_nJNTY4bY_target" , false ) );
            if ( !data.targets.hasOwnProperty( cid ) ) {
              return;
            }
            const [ target ] = data.targets[ cid ],
                  el = querySelector( target.selector );
            if ( !el ) {
              return;
            }
            el.classList.toggle( "__PUPPETRY_nJNTY4bY_target" , true );
          };


    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    onContainerMouseDown = ( e ) => {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = stopDraggingContainer;
      // call a function whenever the cursor moves:
      document.onmousemove = dragContainer;
    },

    dragContainer = ( e ) => {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      CONTAINER.style.top = ( CONTAINER.offsetTop - pos2 ) + "px";
      CONTAINER.style.left = ( CONTAINER.offsetLeft - pos1 ) + "px";
    },

    stopDraggingContainer = () => {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    },

    HEADER.onmousedown = onContainerMouseDown;

    NEXT_BTN.addEventListener( "click", ( e ) => {
      e.preventDefault();
      e.stopPropagation();
      const nextId = data.sids[ stepIndex++ ];
      if ( typeof nextId === "undefined" ) {
        return;
      }
      document.body.dataset.puppetryNext = nextId;
      window.setPuppetryStepIndex( stepIndex );

      try {
        updateView( data.sids[ stepIndex ] );
        highlightTarget( data.sids[ stepIndex ] );
      } catch ( e ) {
        console.error( e );
      }
    }, false );

    function fixIndex() {
      const nextId = data.sids[ stepIndex ];
      let li = document.querySelector( "li[data-puppetry-cid='" + nextId + "']" );
      if ( li ) {
        return;
      }
      li = document.querySelector( "li[data-puppetry-cid]" );
      stepIndex = data.sids.indexOf( li.dataset.puppetryCid );
      return stepIndex >= 0 ? stepIndex : 0;
    }


    fixIndex();
    updateView( data.sids[ stepIndex ] );