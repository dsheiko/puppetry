const { remote, ipcRenderer } = require ( "electron" ),
      { E_RECEIVE_RECORDER_SESSION } = require( "./constant" ),
      devices = require( "../src/vendor/puppeteer/DeviceDescriptors" ),
      find = document.querySelector.bind( document ),
      webview = find( "webview" ),
      okBtn = find( "#pull" ),
      urlInput = find( "#url" ),
      emulateSelect = find( "#select" ),
      recordingBtn = find( "#recording" ),
      info = find( "#info" ),
      TOOLBAR_HEIGHT = 40,

      options = devices.map( i =>  ({
        value: i.name,
        description: `${i.name} (${i.viewport.width}x${i.viewport.height})`
      }) );


function toogleRecording( toggle ) {
  recordingBtn.classList.toggle( "icon--recording", toggle );
  recordingBtn.setAttribute( "title", toggle ? "Pause recording" : "Continue recording" );
  webview.send( "recording", toggle );
}

function loadUrl( url ) {
  webview.src = url;
  info.classList.add( "is-hidden" );
  webview.classList.remove( "is-hidden" );
  recordingBtn.classList.remove( "is-disabled" );
  okBtn.classList.remove( "is-disabled" );
  toogleRecording( true );
}


webview.addEventListener( "ipc-message", e => {
  if ( e.channel === "session" ) {
    ipcRenderer.send( E_RECEIVE_RECORDER_SESSION, e.args[ 0 ], e.args[ 1 ] );
  }
  remote.getCurrentWindow().close();
});

webview.addEventListener( "dom-ready", e => {
  // webview.openDevTools();
  webview.send( "dom-ready" );
});


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