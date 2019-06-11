process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const Imap = require( "imap" ),
      express = require( "express" ),
      http = require( "http" ),
      dbg = require( "debug" ),
      bodyParser = require( "body-parser" ),
      app = express(),
      API_VER = "/api/v1",
      server = http.createServer( app ),

      imap = new Imap({
        user: process.env.EID_EMAIL,
        password: process.env.EID_PASSWORD,
        host: "imap.gmail.com",
        port: 993,
        tls: true
      });

/**
 * Parse activation link from message body
 * @param {string} text
 * @returns {string|null}
 */
function parseActivationLink( text ) {
  const re = /(http[^\"]+\.com\?p=[^\"]+)/g,
        res = text.match( re );
  return res ? res[ 0 ] : null;
}

/**
 * Get raw messages, sent < 5 minutes ago to given address
 * @param {string} emailTo
 * @returns {Promise}
 */
function findLastUnseenMessagesFor( emailTo ) {
  return new Promise(( resolve, reject ) => {
    // lookinig into INBOX
    imap.openBox("INBOX", true, ( err ) => {

      if ( err ) {
        return reject( err );
      }

      const since = new Date();
      // Sent 5 minutes ago or later
      since.setTime( Date.now() - 1000 * 60 * 5 );

      imap.search([
        "UNSEEN",
        [ "SENTSINCE", since.toISOString() ],
        // [ "FROM", "no-reply@domain.com" ],
        [ "TO", emailTo ]
      ], ( err, results ) => {

        if ( err ) {
          return reject( err );
        }
        if ( !results || !results.length ) {
          return reject( new Error( "No unread mails" ) );
        }

        const buffer = [];

        const f = imap.fetch( results, { bodies: "" } );

        f.on( "message", ( msg, seqno ) => {

          msg.on( "body", ( stream, info ) => {
            buffer[ seqno ] = "";
            stream.on( "data", ( chunk ) => {
              buffer[ seqno ] += chunk.toString( "utf8" );
            });
          });

        });

        f.once( "error", ( err ) => {
          return reject( err );
        });
        f.once("end", () => {
          resolve( buffer.filter( buf => buf !== undefined ) );
        });
      });
    });

  });

}

imap.once("ready", async () => {
  imap.isReady = true;
});

imap.once("error", function(err) {
  dbg( "INFO" )( err );
});

imap.once("end", function() {
  dbg( "INFO" )( "IMAP connection ended" );
});

imap.connect();

app.disable( "x-powered-by" );


// Applying middleware
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Reporting to the console what is going on
app.use(( req, res, next ) => {
  const { method, url } = req;
  dbg( "HTTP" )( `${method} ${url}` );
  next();
});

// Serve e.g. http://127.0.0.1:3500/api/v1/activation-link/joe@gmail.com
app.get( API_VER + "/activation-link/:to", async ( req, res, next ) => {

  if ( !imap.isReady ) {
    return next( new Error( `IMAP is not ready yet!` ) );
  }

  try {
    const messages = await findLastUnseenMessagesFor( req.params.to ),
          links = messages.map( ( msg ) => {
            const head = Imap.parseHeader( msg ),
                  link = parseActivationLink( msg );
            dbg( "INFO" )({
              to: head.to,
              from: head.from,
              subject: head.subject,
              link
            });
            return link;
          });
    return res.send({ value: links.find( link => !!link ) });
  } catch ( err ) {
    return next( err );
  }

});

// Handling exception thrown during execution
app.use(( err, req, res, next ) => {
  dbg( "ERROR" )( `${err.message}` );
  res
    .status( 500 )
    .send({ message: err.message });
});

// Handling 404 errors
app.use(( req, res, next ) => {
  const { method, url } = req,
        message = `Cannot find ${method} ${url}`;
  dbg( "ERROR" )( message );
  res.status( 404 ).send({ message });
});

// Starting the server
server.listen( process.env.DEMO_NODE_SERVER_PORT || 3500,
  process.env.DEMO_NODE_SERVER_HOST || "127.0.0.1", () => {
  const { address, port } = server.address();
  dbg( "INFO" )( `Node.js server listening on ${ address }:${ port }` );
});