const { remote, ipcRenderer } = require ( "electron" ),
      { E_RECEIVE_RECORDER_SESSION } = require( "./constant" ),
      devices = require( "../src/vendor/puppeteer/DeviceDescriptors" ),
      find = document.querySelector.bind( document ),
      webview = find( "webview" ),
      okBtn = find( "#pull" ),
      urlInput = find( "#url" ),
      emulateSelect = find( "#select" ),
      recordingBtn = find( "#recording" ),
      colorSelect = find( "#color" ),
      info = find( "#info" ),
      TOOLBAR_HEIGHT = 40,
      STORAGE_URL = "recordLastUrl",
      options = devices.map( i =>  ({
        value: i.name,
        description: `${i.name} (${i.viewport.width}x${i.viewport.height})`
      }) );

let namedTargets = {};

function toogleRecording( toggle ) {
  recordingBtn.classList.toggle( "icon--recording", toggle );
  recordingBtn.setAttribute( "title", toggle ? "Pause recording" : "Continue recording" );
  webview.send( "recording", toggle );
}

function loadUrl( url ) {
  localStorage.setItem( STORAGE_URL, url );
  webview.src = url;
  info.classList.add( "is-hidden" );
  webview.classList.remove( "is-hidden" );
  recordingBtn.classList.remove( "is-disabled" );
  okBtn.classList.remove( "is-disabled" );
  toogleRecording( true );
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

function applyPatchToGroups( clientGroups, patch ) {
  return clientGroups.map( group => {
    const match = patch.find( item => item[ 0 ] === group.target );
    if ( match ) {
      group.target = match[ 1 ];
    }
    return group;
  });
}

webview.addEventListener( "ipc-message", e => {
  if ( e.channel === "echo" ) {
    return console.log( e.args );
  }
  if ( e.channel === "target" ) {
    return registerTarget( e.args[ 0 ] );
  }
  if ( e.channel === "session" ) {
    if ( !Object.keys( namedTargets ).length ) {
      ipcRenderer.send( E_RECEIVE_RECORDER_SESSION, e.args[ 0 ], e.args[ 1 ] );
      remote.getCurrentWindow().close();
      return;
    }
    try {
      const patch = findTargetPatch( e.args[ 0 ], namedTargets );
      ipcRenderer.send( E_RECEIVE_RECORDER_SESSION,
        Object.assign( applyPatchToTargets( e.args[ 0 ], patch ), namedTargets ),
        applyPatchToGroups( e.args[ 1 ], patch )
      );
    } catch ( e ) {
      console.error( e );
      ipcRenderer.send( E_RECEIVE_RECORDER_SESSION, e.args[ 0 ], e.args[ 1 ] );
    }
    remote.getCurrentWindow().close();
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

okBtn.addEventListener( "click", ( e ) => {
  e.preventDefault();
  toogleRecording( false );
  webview.send( "pull" );
}, false );


recordingBtn.addEventListener( "click", ( e ) => {
  e.preventDefault();
  const toggle = recordingBtn.classList.contains( "icon--recording" );
  toogleRecording( !toggle );
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