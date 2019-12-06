const http = require( "http" ),
      fs = require( "fs" ),
      url = require( "url" ),
      { join, extname } = require( "path" ),
      CT_MAP = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".json": "application/json"
      };

function renderJson( res, data ) {
  res.writeHead( 200, {
    "Content-Type": "application/json",
    "x-powered-by": "Puppetry"
  });
  res.end( JSON.stringify( data, null, 2 ) );
}

function collectRequestData( req, callback ) {
    const FORM_URLENCODED = "application/x-www-form-urlencoded";
    if ( req.headers[ "content-type" ] === FORM_URLENCODED ) {
        let body = "";
        req.on( "data", chunk => {
          body += chunk.toString();
        });
        req.on( "end", () => {
          callback( body );
        });
        return;
    }
    callback( null );
}

http.createServer(( req, res ) => {

  const fileName = url.parse( req.url ).pathname.replace( /^\//, "" ) || "index.html",
        ext = extname( fileName );

  if ( req.method !== "GET" ) {
    console.log( `${ req.method } ${ req.url }` );
    return collectRequestData( req, ( data ) => {
      renderJson( res, { method: req.method, data: JSON.parse( data ) } );
    });
  }
  if ( !( ext in CT_MAP ) ) {
    console.error( `${ req.method } ${ req.url } (404) Not Found` );
    res.writeHead( 404 );
    return res.end( "Cannot find " + fileName );
  }
  console.log( `${ req.method } ${ req.url }` );
  res.writeHead( 200, { "Content-Type": CT_MAP[ ext ] });
  res.end( fs.readFileSync( join( __dirname, fileName ) ) );
}).listen( 8080 );

console.log( `Serving project-test on http://127.0.0.1:8080` );