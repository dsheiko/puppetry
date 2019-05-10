(function(){

  const { ipcRenderer } = require( "electron" ),
        debounce = require( "lodash.debounce" ),
        { targets, getTargetVar } = require( "./service/target" ),
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
      log( "page", "runjs", { value: `await bs.page.mouse.move( ${ e.screenX }, ${ e.screenY } );` } );
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

  Recorder.onInputInput = debounce( ( e ) => {
    log( getTargetVar( e.target ), "type", { value: e.target.value } );
  }, 200 );

  function onDomModified() {
    Array.from( document.querySelectorAll( "input, textarea, select" ) ).forEach( el => {
      on( el, "focus", Recorder.onFocusInput );
      on( el, "input", Recorder.onInputInput );
    });
  }

  ipcRenderer.on( "dom-ready", () => {
    log( "page", "goto", { url: location.href, timeout: 30000, waitUntil: "load" } );
    on( document.body, "click", Recorder.onElClick );
    on( window, "keyup", Recorder.onKeyUp );

    on( document, "mousemove", debounce( Recorder.onMouseMove, 200 ) );
    on ( window, "resize", debounce( Recorder.onWindowResize, 200 ) );


    onDomModified();

    try {
      observer && observer.disconnect();
      observer = new MutationObserver( onDomModified );
      observer.observe( document.body, { attributes: false, childList: true, subtree: true });
    } catch ( err ) {
      ipcRenderer.sendToHost( "console", "MutationObserver ERROR", err.message );
    }
  });


}());