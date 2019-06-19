(function(){

  const { ipcRenderer } = require( "electron" ),
        debounce = require( "lodash.debounce" ),
        xpath = require( "simple-xpath-position" ),
        uniqid = require( "uniqid" );

  let recording = true, observer = null, screenshotCounter = 1;

  ipcRenderer.on( "recording", ( ev, toggle ) => {
    recording = toggle;
  });

  ipcRenderer.on( "goto", () => {
    // cleanupSession();
  });

  function cleanupSession() {
    document.cookie.split( ";" ).forEach( cookie => {
        const eqPos = cookie.indexOf( "=" ),
              name = eqPos > -1 ? cookie.substr( 0, eqPos ) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    });
    localStorage.clear();
  }

  function getQuery( el ) {
    if ( el.id && document.querySelectorAll( `#${ el.id }` ).length === 1 ) {
      return `#${ el.id }`;
    }
    if ( el.name && document.querySelectorAll( `${ el.tagName }[name="${ el.name }"]` ).length === 1 ) {
      return `${ el.tagName }[name="${ el.name }"]`;
    }
    return xpath.fromNode( el );
  }

  function getPid( el ) {
    const pid = el.getAttribute( "puppetry-id" );
    if ( pid ) {
      return pid;
    }
    const id = uniqid();
    el.setAttribute( "puppetry-id",  id );
    return id;
  }

  function buildTargetRefObj( el ) {
    return {
      pid: getPid( el ),
      query: getQuery( el ),
      id: el.id,
      tagName: el.tagName,
      name: el.name,
      className: el.className
    };
  }


  function on( el, ev, cb, useCapture = false ) {
    el.removeEventListener( ev, cb );
    el.addEventListener( ev, cb, useCapture );
  }

  function log( target, method, params ) {
    if ( !recording ) {
      return;
    }
    ipcRenderer.sendToHost( "log", { target, method, params } );
  }

  class Recorder {
    static onFocusInput( e ) {
      log( buildTargetRefObj( e.target ), "focus", {} );
    }

    static onElClick( e ) {
      log( buildTargetRefObj( e.target ), "click", {} );
    }
    static onWindowResize() {
      log( "page", "setViewport", { width: window.innerWidth, height: window.innerHeight } );
    }
    static onMouseMove( e ) {
      log( "page", "moveMouse", { x: e.screenX, y: e.screenY } );
    }
    static onKeyUp( e ) {
      // Ctrl-Shift-S - make a screenshot
      if ( e.which === 83 && e.ctrlKey && e.shiftKey ) {
        log( "page", "screenshot", {
          name: `screenshot${ screenshotCounter++ }`,
          fullPage: false,
          omitBackground: false
        });
      }
    }
  }

  Recorder.onReset = ( e ) => {
    log( buildTargetRefObj( e.target ), "reset", {} );
  };

  Recorder.onChangeFile = ( e ) => {
    log( buildTargetRefObj( e.target ), "upload", { path: e.target.value } );
  };


  Recorder.onChangeCheckbox = ( e ) => {
    log( buildTargetRefObj( e.target ), "checkBox", { checked: e.target.checked } );
  };

  Recorder.onInputInput = debounce( ( e ) => {
    if ( e.target.type === "file" || e.target.type === "checkbox" || e.target.type === "radio" ) {
      return;
    }
    log( buildTargetRefObj( e.target ), "type", { value: e.target.value } );
  }, 400 );

  Recorder.onChangeSelect = ( e ) => {
    log( buildTargetRefObj( e.target ), "select", { value: e.target.value } );
  };

  Recorder.onHover = ( e ) => {
    log( buildTargetRefObj( e.target ), "hover", {} );
  };

  Recorder.onContextMenu = ( e ) => {
    e.stopPropagation();
    ipcRenderer.sendToHost( "target", getQuery( e.target ) );
  };

  function updateElementHighlighter( color ) {
    document.body.insertAdjacentHTML( "beforeend", `
      <style id="puppetry-element-highlighter">
        *:hover {
          outline: 1px dotted ${ color || "blue" };
        }
      </style>
      ` );
  }

  function onDomModified( options ) {

    updateElementHighlighter( options.highlightColor );

    Array.from( document.querySelectorAll( "*" ) ).forEach( el => {
      on( el, "contextmenu", Recorder.onContextMenu );
    });

    Array.from( document.querySelectorAll( "input, textarea" ) ).forEach( el => {
      //on( el, "focus", Recorder.onFocusInput );
      on( el, "input", Recorder.onInputInput );
      on( el, "reset", Recorder.onReset );
    });
    Array.from( document.querySelectorAll( "input[type=file]" ) ).forEach( el => {
      on( el, "change", Recorder.onChangeFile );
    });
    Array.from( document.querySelectorAll( "input[type=checkbox], input[type=radio]" ) ).forEach( el => {
      on( el, "change", Recorder.onChangeCheckbox );
    });
    Array.from( document.querySelectorAll( "select" ) ).forEach( el => {
      //on( el, "focus", Recorder.onFocusInput );
      on( el, "change", Recorder.onChangeSelect );
    });
    Array.from( document.querySelectorAll( "form" ) ).forEach( el => {
      on( el, "reset", Recorder.onReset );
    });
//    Array.from( document.querySelectorAll( "a, button, *[role=button]" ) ).forEach( el => {
//      on( el, "mouseover", Recorder.onHover );
//    });
  }


  ipcRenderer.on( "dom-ready", ( ev, options ) => {
    log( "page", "waitForNavigation", { timeout: 3000, waitUntil: "domcontentloaded" } );
    on( document.body, "click", Recorder.onElClick );
    on( window, "keyup", Recorder.onKeyUp );
    on ( window, "resize", debounce( Recorder.onWindowResize, 200 ) );

    onDomModified( options );

    try {
      observer && observer.disconnect();
      observer = new MutationObserver( onDomModified );
      observer.observe( document.body, { attributes: false, childList: true, subtree: true });
    } catch ( err ) {
      ipcRenderer.sendToHost( "console", "MutationObserver ERROR", err.message );
    }
  });


}());