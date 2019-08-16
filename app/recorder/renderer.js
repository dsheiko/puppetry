const { remote, ipcRenderer, shell } = require ( "electron" ),
      log = require( "electron-log" ),
      { E_RECEIVE_RECORDER_SESSION } = require( "./constant" ),
      devices = require( "./recorder/puppeteer/DeviceDescriptors" ),
      { registerElement, targets } = require( "./recorder/service/target" ),
      find = document.querySelector.bind( document ),
      webview = find( "webview" ),
      okBtn = find( "#okBtn" ),
      urlInput = find( "#url" ),
      reportLink = find( "#report" ),
      emulateSelect = find( "#select" ),
      notifyEl = find( "#notify" ),
      logEl = find( "#log" ),
      toobarBtn = find( "#devtools" ),

      colorSelect = find( "#color" ),
      info = find( "#info" ),
      TOOLBAR_HEIGHT = 40,
      STORAGE_URL = "recordLastUrl",
      options = devices.map( i =>  ({
        value: i.name,
        description: `${i.name} (${i.viewport.width}x${i.viewport.height})`
      }) );

let commands = [], namedTargets = {};

function notify( txt ) {
  notifyEl.innerHTML = txt;
  notifyEl.classList.toggle( "has-go", true );
  setTimeout( () => notifyEl.classList.toggle( "has-go", false ), 1000 );
}

function onceWebviewReady() {
  webview.removeEventListener( "dom-ready", onceWebviewReady );
  webview.send( "goto" );
  info.classList.add( "is-hidden" );
  webview.classList.remove( "is-hidden" );
  okBtn.removeAttribute( "disabled" );
}

function loadUrl( url ) {
  localStorage.setItem( STORAGE_URL, url );
  webview.src = url;

  webview.addEventListener( "dom-ready", onceWebviewReady );


  commands.push({
    target: "page",
    method: "goto",
    params: { url, timeout: 30000, waitUntil: "domcontentloaded" }
  });
}

function normalizeTargetName( str ) {
  const reBody = /[^a-zA-Z0-9_]/g,
        reFirst = /^\d/g;
  return str
    .replace( reBody, "_" )
    .replace( reFirst, "_" )
    .toUpperCase();
}

async function registerTarget( selector ) {
  try {
    const name = normalizeTargetName( await smalltalk.prompt( "Registering Target", "Target name", "" ) );
    namedTargets[ name ] = selector;
    printLog( `define <b>${ name }</b> = <i>${ selector }</i>` );
  } catch ( e ) {
    // ignore
  }
}

function findTargetPatch( clientTargets, namedTargets ) {
  try {
    const namedArr = Object.entries( namedTargets );
    return Object
      .entries( clientTargets )
      .reduce(( carry, pair ) => {

        const match = namedArr.find( named => named[ 1 ] === pair[ 1 ] );
      if ( match ) {
        carry.push([ pair[ 0 ], match[ 0 ]]);
      }
      return carry;
    }, []);
  } catch ( e ) {
    log.warn( `renderer.js process: findTargetPatch(): ${ e }` );
  }

}

function applyPatchToTargets( clientTargets, patch ) {
  try {
    return Object
      .entries( clientTargets )
      .reduce(( carry, pair ) => {
        const match = patch.find( item => item[ 0 ] === pair[ 0 ] );
    	if ( match ) {
      	carry[ match[ 1 ] ] = pair[ 1 ];
    		return carry;
      }
    	carry[ pair[ 0 ] ] = pair[ 1 ];
    	return carry;
  	}, {});
  } catch ( e ) {
    log.warn( `renderer.js process: applyPatchToTargets(): ${ e }` );
  }

}

function applyPatchToCommands( clientGroups, patch ) {
  try {
    return clientGroups.map( group => {
      const match = patch.find( item => item[ 0 ] === group.target );
      if ( match ) {
        group.target = match[ 1 ];
      }
      return group;
    });
  } catch ( e ) {
    log.warn( `renderer.js process: applyPatchToCommands(): ${ e }` );
  }

}

function registerCommand({ target, method, params }) {
  try {
    if ( target !== "page" ) {
      const { name, isNew } = registerElement( target );
      target = name;
      ( name in targets && isNew ) && printLog( `define <b>${ target }</b> = <i>${ targets[ name ] }</i>` );
    }
    const last = commands[ commands.length - 1 ];
    // type normally accompanies with click
    if ( method === "type" &&  last.method === "click" && target === last.target ) {
      commands.pop();
    }
    // repeating input, take only the last commmand as it will be used with el.type()
    if ( method === "type" && last.method === method && target === last.target ) {
      commands.pop();
    }
    //
    if ( method === "waitForNavigation" && last.method === "goto" && target === last.target ) {
      return;
    }

    commands.push({ target, method, params });
    printLog( `<b>${ target }</b>.${ method }(<i>${ JSON.stringify( params ) }</i>)` );
  } catch ( e ) {
    log.warn( `renderer.js process: registerCommand(): ${ e }` );
  }

}

function printLog( line )
{
    const log = logEl.innerHTML;
    logEl.innerHTML = log + ( log.trim() ? `<br />` : `` ) + line;
    logEl.scroll( 0, logEl.scrollTop + 24 );
}

webview.addEventListener( "ipc-message", e => {
  if ( e.channel === "console" ) {
    return console.log( targets );
  }
  if ( e.channel === "log" ) {
    return registerCommand( e.args[ 0 ] );
  }
  if ( e.channel === "target" ) {
    return registerTarget( e.args[ 0 ] );
  }
   if ( e.channel === "screenshot" ) {
    return notify( "Screenshot saved" );
  }

});

webview.addEventListener( "new-window", async ( e ) => {
  // page.openWindow based on e.options, e.url
});

webview.addEventListener( "dom-ready", e => {
  // webview.openDevTools();
  toobarBtn.classList.remove( "is-disabled" );
  logEl.parentNode.classList.remove( "is-hidden" );
  webview.send( "dom-ready", {
    highlightColor: colorSelect.value
  } );
});

const lastUrl = localStorage.getItem( STORAGE_URL );
if ( lastUrl ) {
 urlInput.value = lastUrl;
}

reportLink.addEventListener( "click", ( e ) => {
  e.preventDefault();
  shell.openExternal( e.target.href );
}, false );


toobarBtn.addEventListener( "click", e => {
  e.preventDefault();
  webview.openDevTools();
}, false );

// OK (Create Suite)
okBtn.addEventListener( "click", ( e ) => {
  e.preventDefault();
  okBtn.setAttribute( "disabled", true );
  setTimeout(() => {
    try {
      let payload = [ targets, commands ];


      if ( Object.keys( namedTargets ).length ) {
        try {
          const patch = findTargetPatch( targets, namedTargets );
          payload = [
            Object.assign( applyPatchToTargets( targets, patch ), namedTargets ),
            applyPatchToCommands( commands, patch )
          ];
        } catch ( e ) {
          console.error( e );
        }
      }
      ipcRenderer.send( E_RECEIVE_RECORDER_SESSION, payload[ 0 ], payload[ 1 ] );
      remote.getCurrentWindow().close();
    } catch ( e ) {
      log.warn( `renderer.js process: OK btn listener: ${ e }` );
    }
  }, 200 );

}, false );


urlInput.addEventListener( "keyup", ( e ) => {
  if ( e.which === 13 ) {
    e.preventDefault();
    loadUrl( e.target.value );
  }
}, false );


options.forEach( data => {
  const opt = document.createElement( "option" );
  opt.value= data.value;
  opt.innerHTML = data.description;
   emulateSelect.appendChild( opt );
});

emulateSelect.classList.remove( "is-hidden" );

emulateSelect.addEventListener( "input", ( e ) => {
  try {
    const val = e.target.value;
    e.preventDefault();
    if ( val === "default" ) {
      remote.getCurrentWindow().setSize( 1366, 768 + TOOLBAR_HEIGHT );
      return;
    }
    const match = devices.find( data => data.name === val );
    if ( match ) {
      remote.getCurrentWindow().setSize(
        match.viewport.width,
      match.viewport.height + TOOLBAR_HEIGHT
        );
      return;
    }
  } catch ( e ) {
    log.warn( `renderer.js process: on viewport change: ${ e }` );
  }

}, false );