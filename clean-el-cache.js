// https://github.com/electron/get#cache-location
const shell = require( "shelljs" );

function getCacheDirs() {
  switch( process.platform ) {
    case "darwin":
      return [ "~/Library/Caches/electron/" ];
    case "win32":
      return [ `${ process.env.APPDATA }/electron/Cache`, "~/AppData/Local/electron/Cache/" ];
    default:
      return [ "~/.cache/electron/" ];
  }
}

getCacheDirs().forEach( dir => {
  shell.rm( "-rf", dir );
});

