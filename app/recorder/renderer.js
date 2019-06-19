const { remote, ipcRenderer } = require ( "electron" ),
      { E_RECEIVE_RECORDER_SESSION } = require( "./constant" ),
      devices = require( "../src/vendor/puppeteer/DeviceDescriptors" ),
      { registerElement, targets } = require( "./recorder/service/target" ),
      find = document.querySelector.bind( document ),
      webview = find( "webview" ),
      okBtn = find( "#okBtn" ),
      urlInput = find( "#url" ),
      emulateSelect = find( "#select" ),

      colorSelect = find( "#color" ),
      info = find( "#info" ),
      TOOLBAR_HEIGHT = 40,
      STORAGE_URL = "recordLastUrl",
      options = devices.map( i =>  ({
        value: i.name,
        description: `${i.name} (${i.viewport.width}x${i.viewport.height})`
      }) );

let commands = [], namedTargets = {};


function loadUrl( url ) {
  localStorage.setItem( STORAGE_URL, url );
  webview.src = url;
  webview.send( "goto" );
  info.classList.add( "is-hidden" );
  webview.classList.remove( "is-hidden" );
  okBtn.removeAttribute( "disabled" );
  commands.push({
    target: "page",
    method: "goto",
    params: { url, timeout: 30000, waitUntil: "load" }
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
  } catch ( e ) {
    // ignore
  }
}

function findTargetPatch( clientTargets, namedTargets ) {
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
}

function applyPatchToTargets( clientTargets, patch ) {
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
}

function applyPatchToCommands( clientGroups, patch ) {
  return clientGroups.map( group => {
    const match = patch.find( item => item[ 0 ] === group.target );
    if ( match ) {
      group.target = match[ 1 ];
    }
    return group;
  });
}

function registerCommand({ target, method, params }) {
  if ( target !== "page" ) {
    target = registerElement( target );
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
  commands.push({ target, method, params });
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

});

webview.addEventListener( "dom-ready", e => {
  // webview.openDevTools();
  webview.send( "dom-ready", {
    highlightColor: colorSelect.value
  } );
});

const lastUrl = localStorage.getItem( STORAGE_URL );
if ( lastUrl ) {
 urlInput.value = lastUrl;
}

// OK (Create Suite)
okBtn.addEventListener( "click", ( e ) => {
  let payload = [ targets, commands ];
  e.preventDefault();

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
}, false );