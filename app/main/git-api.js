// https://isomorphic-git.org/docs/en/
const path = require( "path" ),
      git = require( "isomorphic-git" ),
      fs = require( "fs" ),
      util = require( "util" ),
      log = require( "electron-log" ),
      REMOTE = "puppetry",
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

function getCredentialsPayload( credentials ) {
  if ( credentials.credentialsAuthMethod === "password" ) {
   return {
      username: credentials.credentialsUsername,
      password: credentials.credentialsPassword
    };
  }
  return {
    username: credentials.credentialsUsername,
    token: credentials.credentialsAcccessToken
  };
}

module.exports = {

  async init( projectDirectory ) {
    await git.init({ dir: projectDirectory });
  },


  async checkout( projectDirectory, oid ) {
    await git.checkout({
      dir: projectDirectory,
      ref: oid
    });
  },

  async revert( projectDirectory, oid ) {
    await this.checkout( projectDirectory, oid );
    await git.resetIndex({
      dir: projectDirectory,
      ref: oid
    });
  },

  async log( projectDirectory ) {
    return await git.log({
      dir: projectDirectory,
      ref: "master"
    });
  },

  async push( projectDirectory, credentials ) {
    await git.push({
      dir: projectDirectory,
      remote: REMOTE,
      ref: "master",
      force: true,
      ...getCredentialsPayload( credentials )
    });
  },

  async pull( projectDirectory, credentials ) {
    await git.pull({
      dir: projectDirectory,
      ref: "master",
      singleBranch: true,
      ...getCredentialsPayload( credentials )
    });
//    await git.fetch({
//      dir: projectDirectory,
//      ref: "master",
//      depth: 1,
//      singleBranch: true,
//      tags: false
//    });
//    await git.merge({
//      dir: projectDirectory,
//      ours: "master",
//      theirs: "remotes/origin/master"
//    });
  },

  async setRemote( remoteRepository, projectDirectory, credentials ) {
    try {
      await git.deleteRemote({ dir: projectDirectory, remote: REMOTE });
    } catch( err ) {
      // supress
    }
    await git.addRemote({
      dir: projectDirectory,
      remote: REMOTE,
      url: remoteRepository,
      ...getCredentialsPayload( credentials )
    });
  },

  async commit( message, projectDirectory, username, email ) {
    const projectFiles = [ ...await readDir( projectDirectory, ".json" ), ".puppetryrc" ],
          staggedFiles = await git.listFiles({ dir: projectDirectory });

    for ( const file of projectFiles ) {
      if ( !staggedFiles.includes( file ) ) {
        await git.add({ dir: projectDirectory, filepath: file });
      }
    }
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

