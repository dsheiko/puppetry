// https://isomorphic-git.org/docs/en/
const path = require( "path" ),
      git = require( "isomorphic-git" ),
      fs = require( "fs" ),
      util = require( "util" ),
      log = require( "electron-log" ),
      REMOTE = "gitlab",
      readdir = util.promisify( fs.readdir );

git.plugins.set( "fs", fs );

async function readDir( directory, ext ) {
  try {
    return  ( await readdir( directory ) )
      .filter( file => file.endsWith( ext ) );
  } catch ( e ) {
    log.warn( `Renderer process: git-api.readDir: ${ e }` );
    return [];
  }
}

module.exports = {

  async init( projectDirectory ) {
    await git.init({ dir: projectDirectory });
  },

  async commit( message, projectDirectory, username, email ) {
    const projectFiles = [ ...await readDir( projectDirectory, ".json" ), ".puppetryrc" ],
          staggedFiles = await git.listFiles({ dir: projectDirectory });

    for ( const file of projectFiles ) {
      if ( !staggedFiles.includes( file ) ) {
        console.log({ dir: projectDirectory, filepath: file });
        await git.add({ dir: projectDirectory, filepath: file });
      }
    }
    console.log({
      dir: projectDirectory,
      author: {
        name: username,
        email
      },
      message
    });

    return await git.commit({
      dir: projectDirectory,
      author: {
        name: username,
        email
      },
      message
    });
  }
};

