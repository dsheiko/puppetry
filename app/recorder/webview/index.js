(function(){

  const { ipcRenderer } = require( "electron" ),
        debounce = require( "lodash.debounce" ),
        { targets, getTargetVar, getQuery } = require( "./service/target" ),
        commands = [];

  let recording = true, observer = null, screenshotCounter = 1;

  ipcRenderer.on( "pull", () => {
    ipcRenderer.sendToHost( "session",  targets, commands );
  });

  ipcRenderer.on( "recording", ( ev, toggle ) => {
    recording = toggle;
  });


  function on( el, ev, cb, useCapture = false ) {
    el.removeEventListener( ev, cb );
    el.addEventListener( ev, cb, useCapture );
  }

  function log( target, method, params ) {
    if ( !recording ) {
      return;
    }
    const last = commands[ commands.length - 1 ];
    // click normally accompanies focusm so no need to keep in the log
    if ( method === "click" &&  last.method === "focus" && target === last.target ) {
      commands.pop();
    }
    // repeating input, take only the last commmand as it will be used with el.type()
    if ( method === "input" &&  last.method === method && target === last.target ) {
      commands.pop();
    }
    commands.push({ target, method, params });
  }

  class Recorder {
    static onFocusInput( e ) {
      log( getTargetVar( e.target ), "focus", {} );
    }

    static onElClick( e ) {
      log( getTargetVar( e.target ), "click", {} );
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
    log( getTargetVar( e.target ), "reset", {} );
  };

  Recorder.onChangeFile = ( e ) => {
    log( getTargetVar( e.target ), "upload", { path: e.target.value } );
  };


  Recorder.onChangeCheckbox = ( e ) => {
    log( getTargetVar( e.target ), "checkBox", { checked: e.target.checked } );
  };

  Recorder.onInputInput = debounce( ( e ) => {
    if ( e.target.type === "file" || e.target.type === "checkbox" || e.target.type === "radio" ) {
      return;
    }
    log( getTargetVar( e.target ), "type", { value: e.target.value } );
  }, 400 );

  Recorder.onChangeSelect = ( e ) => {
    log( getTargetVar( e.target ), "select", { value: e.target.value } );
  };

  Recorder.onHover = ( e ) => {
    log( getTargetVar( e.target ), "hover", {} );
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
      on( el, "focus", Recorder.onFocusInput );
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
      on( el, "focus", Recorder.onFocusInput );
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
    log( "page", "goto", { url: location.href, timeout: 30000, waitUntil: "load" } );
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