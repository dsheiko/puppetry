// https://isomorphic-git.org/docs/en/
const path = require( "path" ),
      git = require( "isomorphic-git" ),
      fs = require( "fs" ),
      util = require( "util" ),
      log = require( "electron-log" ),
      tmp = require( "tmp-promise" ),
      REMOTE = "origin", // origin
      MASTER = "master", // master
      shell = require( "shelljs" ),
      readdir = util.promisify( fs.readdir );

git.plugins.set( "fs", fs );
tmp.setGracefulCleanup();
shell.config.fatal = true;

async function readDir( directory, ext ) {
  try {
    return  ( await readdir( directory ) )
      .filter( file => file.endsWith( ext ) );
  } catch ( e ) {
    log.warn( `Main process: git-api.readDir: ${ e }` );
    return [];
  }
}

async function getProjectFiles( projectDirectory ) {
  return [ ...await readDir( projectDirectory, ".json" ), ".puppetryrc" ];
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

  async init( projectDirectory, username, email ) {
    wrap( await git.init({ dir: projectDirectory }), "init" );
    await this.commit( `Initial commit`, projectDirectory, username, email );
  },

  async clone( projectDirectory, url, credentials ) {
    return wrap( await git.clone({
      dir: projectDirectory,
      url,
      ...getCredentialsPayload( credentials ),
      singleBranch: true,
      depth: 1
    }), "clone" );
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
    const projectFiles = await getProjectFiles( projectDirectory );
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
      ref: MASTER
    });
  },


  async cleanupFiles( projectDirectory ) {
    const files = await getProjectFiles( projectDirectory );
    files.forEach(( file ) => {
      shell.rm( path.join( projectDirectory, file ) );
    });
  },

  async cleanupGit( projectDirectory ) {
    shell.rm( "-rf", path.join( projectDirectory, ".git" ) );
  },

  async stashFiles( projectDirectory ) {
    const files = await getProjectFiles( projectDirectory );
    this.tmpDirObj = await tmp.dir({ unsafeCleanup: true });
    files.forEach(( file ) => {
      shell.cp( "-r", path.join( projectDirectory, file ), this.tmpDirObj.path );
    });
  },

  async unstashFiles( projectDirectory ) {
    const files = await getProjectFiles( this.tmpDirObj.path );
    files.forEach(( file ) => {
      shell.cp( "-r", path.join( this.tmpDirObj.path, file ), projectDirectory );
    });
  },

  async sync( projectDirectory, credentials, username, email, remoteRepository ) {

    // just in case it isn't set uo
    await this.setRemote( remoteRepository, projectDirectory, credentials );
    await this.stashFiles( projectDirectory );
    try {
      await this.pull( projectDirectory, credentials, remoteRepository );
    } catch ( err ) {
      log.debug( `Main process: git-api.sync (1) ${ err.message }` );
      await this.syncOnConflict( projectDirectory, credentials, username, email, remoteRepository );
    }
    try {
      await this.push( projectDirectory, credentials );
    } catch ( err ) {
      // Probablly nothing to push
      log.debug( `Main process: git-api.sync (2) ${ err.message }` );
    }
    this.tmpDirObj.cleanup();

  },

  async syncOnConflict( projectDirectory, credentials, username, email, remoteRepository ) {
    try {
      await this.cleanupFiles( projectDirectory );
      await this.cleanupGit( projectDirectory );
      await this.clone( projectDirectory, remoteRepository, credentials );
      await this.unstashFiles( projectDirectory );
      await this.commit( `Solving merging conflicts: local changes`, projectDirectory, username, email );
    } catch ( err ) {
      log.error( `Main process: git-api.syncOnConflict ${ err.message }` );
      await this.unstashFiles( projectDirectory );
    }
  },

  async push( projectDirectory, credentials ) {
    wrap( await git.push({
      dir: projectDirectory,
      remote: REMOTE,
      ref: MASTER,
      force: true,
      ...getCredentialsPayload( credentials )
    }), "push" );
  },

  async pull( projectDirectory, credentials ) {
    wrap( await git.pull({
      dir: projectDirectory,
      ref: MASTER,
      singleBranch: true,
      ...getCredentialsPayload( credentials )
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
    const projectFiles = await getProjectFiles( projectDirectory ),
          staggedFiles = await git.listFiles({ dir: projectDirectory });

    for ( const file of projectFiles ) {

        await git.add({ dir: projectDirectory, filepath: file });

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

