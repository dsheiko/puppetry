// solving https://github.com/dsheiko/puppetry/issues/33
// @see https://stackoverflow.com/questions/32621988/electron-jquery-is-not-defined
window.nodeRequire = require;
delete window.require;
delete window.exports;
delete window.module;

(function(){
  const log = window.nodeRequire( "electron-log" );

  try {
    const { ipcRenderer } = window.nodeRequire( "electron" ),
    debounce = window.nodeRequire( "lodash.debounce" ),
    xpath = window.nodeRequire( "simple-xpath-position" ),
    uniqid = window.nodeRequire( "uniqid" );

    let recording = true, observer = null, screenshotCounter = 1;

    ipcRenderer.on( "recording", ( ev, toggle ) => {
      recording = toggle;
    });

    ipcRenderer.on( "goto", () => {
    });

//    function cleanupSession() {
//      document.cookie.split( ";" ).forEach( cookie => {
//        const eqPos = cookie.indexOf( "=" ),
//        name = eqPos > -1 ? cookie.substr( 0, eqPos ) : cookie;
//        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
//      });
//      localStorage.clear();
//    }

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
        if ( e.ctrlKey && e.shiftKey ) {
          return Recorder.onContextMenu( e );
        }

        if ( e.target.matches( "input" )
          && !e.target.matches( "input[type=submit]" )
          && !e.target.matches( "input[type=button]" )
          && !e.target.matches( "input[type=checkbox]" )
          && !e.target.matches( "input[type=radio]" )) {
          return false;
        }

        if ( e.target.matches( "input" )
          && ( e.target.matches( "input[type=checkbox]" )
          || e.target.matches( "input[type=radio]" ) )
          && e.target.id
          && e.target.parentNode.tagName === "LABEL"
          && e.target.parentNode.getAttribute( "for" ) === e.target.id
          ) {
          // let's propogate for label
          e.stopPropagation();
        }

        if ( [ "SELECT", "TEXTAREA" ].indexOf( e.target.tagName ) !== -1 ) {
          return false;
        }

        log( buildTargetRefObj( e.target ), "click", { button: "left" } );
      }
      static onWindowResize() {
        log( "page", "setViewport", { width: window.innerWidth, height: window.innerHeight } );
      }
      static onMouseMove( e ) {
        log( "page", "moveMouse", { x: e.screenX, y: e.screenY } );
      }
      static onKeyUp( e ) {
        if ( e.which === 13 ) {
          log( "page", "press", {
            key: "Enter",
            modifierKey1: "",
            modifierKey2: "",
            modifierKey3: ""
          });
        }
        // Ctrl-Shift-S - make a screenshot
        if ( e.which === 83 && e.ctrlKey && e.shiftKey ) {
          log( "page", "screenshot", {
            name: `Screenshot ${ ( new Date() ).toISOString() }`,
            fullPage: false,
            omitBackground: false
          });
          ipcRenderer.sendToHost( "screenshot" );
        }
      }
    }

    Recorder.onReset = ( e ) => {
      log( buildTargetRefObj( e.target ), "reset", {} );
    };

    Recorder.onChangeFile = ( e ) => {
      log( buildTargetRefObj( e.target ), "upload", { path: e.target.value } );
    };

// When clicked on LABEL it gets here and negates the state
//    Recorder.onChangeCheckbox = ( e ) => {
//      log( buildTargetRefObj( e.target ), "checkBox", { checked: e.target.checked } );
//    };

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

    function onDomModified( el ) {

      Array.from( document.body.querySelectorAll(
        "*:not(br):not(script):not(noscript):not(area):not(audio):not(track):not(map)" ) ).forEach( el => {
        on( el, "contextmenu", Recorder.onContextMenu );
      });

      Array.from( el.querySelectorAll( "input, textarea" ) ).forEach( el => {
        on( el, "input", Recorder.onInputInput );
      });
      Array.from( el.querySelectorAll( "input[type=file]" ) ).forEach( el => {
        on( el, "change", Recorder.onChangeFile );
      });
      Array.from( el.querySelectorAll( "input[type=checkbox], input[type=radio]" ) ).forEach( el => {
        on( el, "change", Recorder.onChangeCheckbox );
      });
      Array.from( el.querySelectorAll( "select" ) ).forEach( el => {
        on( el, "change", Recorder.onChangeSelect );
      });
      Array.from( el.querySelectorAll( "form" ) ).forEach( el => {
        on( el, "reset", Recorder.onReset );
      });
    }


    ipcRenderer.on( "dom-ready", ( ev, options ) => {
      log( "page", "waitForNavigation", { timeout: 3000, waitUntil: "domcontentloaded" } );
      on( document.body, "click", Recorder.onElClick );
      on( window, "keyup", Recorder.onKeyUp );
      on ( window, "resize", debounce( Recorder.onWindowResize, 200 ) );

      updateElementHighlighter( options.highlightColor );
      onDomModified( document.body, options );

      let guard = 0;

      try {
        observer && observer.disconnect();
        observer = new MutationObserver(( mutationList ) => {
          if ( mutationList.some( mutation => mutation.type === "childList" && mutation.addedNodes.length ) ) {
            guard++;
            if ( guard > 100 ) {
              observer.close();
            }
            onDomModified( document.body );
          }
        });
        observer.observe( document.body, { attributes: false, childList: true, subtree: true });
      } catch ( err ) {
        log.warn( `webview/index.js process: observer ${ err }` );
        ipcRenderer.sendToHost( "console", "MutationObserver ERROR", err.message );
      }
    });
  } catch (e) {
    log.warn( `webview/index.js process: ${ e }` );
  }



}());