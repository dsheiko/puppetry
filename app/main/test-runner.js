const { Writable } = require( "stream" );

function nl2br( str ) {
  return str.replace( /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, "$1<br />$2" );
}

class StdErrCapturer extends Writable {
  constructor( options ) {
    super( options );
    this.contents = [];
  }
  _write(chunk, encoding, callback) {
    this.contents.push( nl2br( chunk.toString() ) );
    callback();
  }
}

const strErrCapturer = new StdErrCapturer();

module.exports = async( cwd, targetFiles ) => {
  const { runCLI } = require( "jest-cli/build/cli" ),
        options = {
          projects: [ cwd ],
          _: targetFiles,
          silent: true,
          // Shall disable output, but instead switch to stderr
          // https://github.com/facebook/jest/issues/5064
          json: true,
          showConfig: false
        };

  strErrCapturer.contents = [];
  // Override stderr
  const save = process.stderr.write.bind( process.stderr );
  process.stderr.write = strErrCapturer.write.bind( strErrCapturer );
  // Run JEST
  const report = await runCLI( options, options.projects );
  // Restore stderr (hopefully)
  process.stderr.write = save;

  return {
    report,
    stdErr: strErrCapturer.contents.join( "\n" )
  };

};