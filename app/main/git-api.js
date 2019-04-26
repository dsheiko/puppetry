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
    log.warn( `Main process: git-api.readDir: ${ e }` );
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

function wrap( res, method = "undefined" ) {
  res && log.debug( `Main process: git-api.${ method }: ${ JSON.stringify( res ) }` );
  return res;
}

module.exports = {

  async init( projectDirectory ) {
    return wrap( await git.init({ dir: projectDirectory }), "init" );
  },


  async checkout( projectDirectory, oid ) {
    return wrap( await git.checkout({
      dir: projectDirectory,
      ref: oid
    }), "checkout" );
  },

  async currentBranch( projectDirectory ) {
    return wrap( await git.currentBranch({ dir: projectDirectory, fullname: false }), "currentBranch" );
  },

  async hasModifiedFiles( projectDirectory ) {
    const projectFiles = [ ...await readDir( projectDirectory, ".json" ), ".puppetryrc" ];
    let modified = false;
    for ( const file of projectFiles ) {
      const fileStatus = await git.status({ dir: projectDirectory, filepath: file });
      if ( fileStatus !== "unmodified" ) {
        modified = true;
      }
    }
    return modified;
  },

  async log( projectDirectory ) {
    return await git.log({
      dir: projectDirectory,
      ref: "master"
    });
  },

  async push( projectDirectory, credentials ) {
    console.log(getCredentialsPayload( credentials ));
    return wrap( await git.push({
      dir: projectDirectory,
      remote: REMOTE,
      ref: "master",
      force: true,
      ...getCredentialsPayload( credentials )
    }), "push" );
  },

  async pull( projectDirectory, credentials ) {
    let { fetchHead } = await git.fetch({
      dir: projectDirectory,
      ref: "master",
      remote: REMOTE,
      singleBranch: true,
      ...getCredentialsPayload( credentials )
    });
    // Merge the remote tracking branch into the local one.
    return wrap( await git.merge({
      dir: projectDirectory,
      fastForwardOnly: false,
      ours: "master",
      theirs: fetchHead
    }), "pull" );
  },

  async setRemote( remoteRepository, projectDirectory, credentials ) {
    try {
      await git.deleteRemote({ dir: projectDirectory, remote: REMOTE });
    } catch( err ) {
      // supress
    }
    return wrap( await git.addRemote({
      dir: projectDirectory,
      remote: REMOTE,
      url: remoteRepository,
      ...getCredentialsPayload( credentials )
    }), "setRemote" );
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

