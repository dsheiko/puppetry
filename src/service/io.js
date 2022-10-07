import fs from "fs";
import shell from "shelljs";
import { join, parse, dirname } from "path";
import { IoError, InvalidArgumentError, CaughtException } from "error";
import util from "util";
import { remote } from "electron";
import log from "electron-log";
import TestGenerator from "service/TestGenerator";
import { schema } from "component/Schema/schema";
import writeFileAtomic from "write-file-atomic";
import { confirmCreateProject } from "service/smalltalk";
import { convertSuite, convertProject } from "./Converter/v4";

// fs.promises.readFile is 40% slower than fs.readFile 
// https://github.com/nodejs/node/issues/37583

import {
  PUPPETRY_LOCK_FILE,
  JEST_PKG_DIRECTORY,
  RUNTIME_TEST_DIRECTORY,
  DEMO_PROJECT_DIRECTORY,
  COMMAND_ID_COMMENT,
  RUNNER_PUPPETRY,
  RUNNER_JEST,
  SNIPPETS_FILENAME,
  DIR_SCREENSHOTS,
  DIR_SNAPSHOTS
} from "constant";

const PROJECT_FILE_NAME = ".puppetryrc",
      cache = {},
      EXPORT_ASSETS = [
        "specs",
        "lib",
        "package.json",
        "README.md"
      ];

//writeFile = util.promisify( fs.writeFile ),
export const writeFile = ( filename, data ) => new Promise( ( resolve, reject ) => {
  writeFileAtomic( filename, data, ( err ) => {
    if ( err ) {
      return reject( err );
    }
    resolve();
  });
});
export const unlink = util.promisify( fs.unlink );
export const readdir = util.promisify( fs.readdir );
export const lstat = util.promisify( fs.lstat );

shell.config.fatal = true;

export function mkdir( dir ) {
  shell.mkdir( "-p" , dir );
}

function findCommandIdInCode( lines, pos ) {
  while ( pos >= 0 && !lines[ pos ].startsWith( COMMAND_ID_COMMENT ) ) {
    pos--;
  }
  return lines[ pos ];
}


export async function parseReportedFailures( reportedErrorPositions ) {
  const commands = [];
  try {
    for ( const [ file, errors ] of Object.entries( reportedErrorPositions ) ) {
      let fileContents = perf.processSync(`read ${ lockFile }`, () => fs.readFileSync( file, "utf8" ) );
      
      // when timeout qs file we get extrnal sources e.g. node_modules/jest-jasmine2/build/jasmine/Spec.js
      if ( fileContents.indexOf( COMMAND_ID_COMMENT ) === -1 ) {
        break;
      }
      const lines = fileContents.split( "\n" ).map( line => line.trim() );
      // release memory
      fileContents = null;
      for ( const error of errors ) {
        const match = findCommandIdInCode( lines, error.line - 1 ); // line 1 equals index 0
        if ( !match || !match.startsWith( COMMAND_ID_COMMENT ) ) {
          break;
        }
        const idComment = match.substr( COMMAND_ID_COMMENT.length ),
              [ groupId, testId, id ] = idComment.split( ":" );
        commands.push({ groupId, testId, id, failure: error.message });
      }
    }
  } catch ( err ) {
    console.error( err );
  }
  return commands;
}


export function normalizeFilename( str ) {
  const re = /[^a-zA-Z0-9_-]/g;
  return ( str + "" ).replace( re, "--" );
}


export function normalizeName( str ) {
  const re = /[^a-zA-Z0-9_-]/g;
  return str.replace( re, "--" );
}

export function createRuntimeTemp() {
  const RUNTIME_TEMP = getRuntimeTestPath();
  shell.mkdir( "-p" , RUNTIME_TEMP );
  shell.chmod( "-R", 777 , RUNTIME_TEMP );
  return RUNTIME_TEMP;
}

export function removeRuntimeTemp() {
}


export function isExportDirEmpty( exportDirectory ) {
  return !fs.readdirSync( exportDirectory )
    .filter( name => !EXPORT_ASSETS.includes( name ) )
    .length;
}

export function removeExport( exportDirectory ) {
  fs.readdirSync( exportDirectory )
    .filter( name => EXPORT_ASSETS.includes( name ) )
    .forEach( name => shell.rm( "-rf", join( exportDirectory, name ) ) );
}

export function copyProject( srcDirectory, targetDirectory ) {
  shell.rm( "-rf" , targetDirectory );
  return shell.cp( "-r", srcDirectory, targetDirectory );
}

/**
 * Export a single suite
 * @param {String} projectDirectory
 * @param {String} filename
 * @param {String} runner
 * @param {Object} snippets
 * @param {Object} sharedTargets
 * @returns {String} - spec.js content
 */
export async function exportSuite({
  projectDirectory,
  outputDirectory,
  filename,
  runner,
  snippets,
  sharedTargets,
  env,
  options
}) {
  const suite = await readSuite( projectDirectory, filename ),
        gen = new TestGenerator({
          suite,
          schema,
          targets: suite.targets,
          runner,
          projectDirectory,
          outputDirectory,
          snippets,
          sharedTargets,
          env,
          options,
          suiteFilename: filename
        });
  return gen.generate();
}

/**
 * Export specified suite files to given directory
 *

 * @returns {String[]} - ["foo.spec.js",..]
 */
export async function exportProject({
  projectDirectory,
  outputDirectory,
  suiteFiles,
  runner = RUNNER_PUPPETRY,
  snippets,
  sharedTargets,
  env,
  projectOptions,
  suiteOptions,
  exportOptions
}) {
  const testDir = join( outputDirectory, "specs" ),
        specFiles = [],
        JEST_PKG = getJestPkgDirectory();

  try {
    if ( exportOptions.cleanup ) {
      removeExport( outputDirectory );
    }

    shell.mkdir( "-p" , testDir );
    shell.rm( "-rf" , join( projectDirectory, DIR_SCREENSHOTS ) );

    if ( exportOptions.updateSnapshot ) {
      shell.rm( "-rf" , join( projectDirectory, DIR_SNAPSHOTS ) );
    } else {
      shell.rm( "-rf" , join( projectDirectory, DIR_SNAPSHOTS, "actual" ) );
      shell.rm( "-rf" , join( projectDirectory, DIR_SNAPSHOTS, "diff" ) );
    }

    shell.mkdir( "-p" , join( projectDirectory, DIR_SCREENSHOTS ) );
    shell.mkdir( "-p" , join( projectDirectory, DIR_SNAPSHOTS ) );

    shell.cp( "-RLf" , JEST_PKG + "/*", outputDirectory  );
    shell.chmod( "-R", 777, outputDirectory );
    shell.mkdir( "-p" , join( outputDirectory, "specs" ) );

    if ( runner === RUNNER_JEST && suiteOptions.allure  ) {
      await writeFile( join( outputDirectory, "jest.config.js" ), `module.exports = {
  setupFilesAfterEnv: [ "jest-allure/dist/setup" ]
};`, "utf8" );
    }

    await writeFile( join( outputDirectory, "puppeteer.config.json" ),
      JSON.stringify( projectOptions, null, 2 ) , "utf8"
    );

    for ( const filename of suiteFiles ) {
      let specContent = await exportSuite({
        projectDirectory,
        outputDirectory,
        filename,
        runner,
        snippets,
        sharedTargets,
        env,
        options: suiteOptions
      });

      const specFilename = parse( filename ).name + ".spec.js",
            specPath = join( testDir, specFilename );

      await writeFile( specPath, specContent, "utf8" );
      specFiles.push( specFilename );
    }


    return specFiles;
  } catch ( e ) {
    log.warn( `Renderer process: io.exportProject(${ testDir }): ${ e }` );
    if (  e instanceof CaughtException ) {
      throw e;
    }
    throw new IoError( `Cannot export into ${ outputDirectory }.
          Please make sure that you have write permission for it` );
  }
}


/**
 * Write suite file to given directory
 * @param {String} directory
 * @param {String} file
 * @param {Object} data
 */
export async function writeSuite( directory, file, data ) {

  if ( !directory || typeof directory !== "string" ) {
    throw new InvalidArgumentError( `Directory is empty or not a string` );
  }
  if ( !file || typeof file !== "string" ) {
    throw new InvalidArgumentError( `File is empty or not a string` );
  }

  const filePath = join( directory, file );
  try {
    await writeFile( filePath, data, "utf8" );
  } catch ( e ) {
    log.warn( `Renderer process: io.writeSuite: ${ e }` );
    throw new IoError( `Suite file ${filePath} cannot be written.
          Please make sure that you have write permission for it` );
  }
}

/**
 * Read suite file from given directory
 * @param {String} directory
 * @param {String} file
 * @returns {Array|Object}
 */
export async function readSuite( directory, file ) {

  const isSnippetsFile = ( file === SNIPPETS_FILENAME );

  if ( !directory || typeof directory !== "string" ) {
    throw new InvalidArgumentError( `Directory is empty or not a string` );
  }
  if ( !file || typeof file !== "string" ) {
    throw new InvalidArgumentError( `File is empty or not a string` );
  }

  const filePath = join( directory, file );
  // in case of snippets
  if ( isSnippetsFile && !fs.existsSync( filePath ) ) {
    log.warn( `Suite file ${filePath} not found.` );
    return null;
  }

  try {
    const text = perf.processSync(`read ${ filePath }`, () => fs.readFileSync( filePath, "utf8" )),
          data = parseJson( text, filePath );
    
    if ( parseInt( data.puppetry.substr( 0, 1 ), 10 ) < 4 ) {
      return convertSuite( data, isSnippetsFile );
    }
    return data;
  } catch ( e ) {
    log.warn( `Renderer process: io.readSuite: ${ e }` );
    throw new IoError( `Suite file ${filePath} cannot be open.
          Please make sure that the file exists and that you have read permission for it` );
  }
}

export async function removeSuite( directory, file ) {

  if ( !directory || typeof directory !== "string" ) {
    throw new InvalidArgumentError( `Directory is empty or not a string` );
  }
  if ( !file || typeof file !== "string" ) {
    throw new InvalidArgumentError( `File is empty or not a string` );
  }

  const filePath = join( directory, file );
  try {
    await unlink( filePath );
  } catch ( e ) {
    log.warn( `Renderer process: io.removeSuite: ${ e }` );
    throw new IoError( `Suite file ${filePath} cannot be removed.` );
  }
}

/**
 * Helper to parse JSON
 * @param {String} text
 * @param {String} filePath
 * @returns {Array|Object}
 */
function parseJson( text, filePath ) {
  try {
    return JSON.parse( text || "{}" );
  } catch ( e ) {
    log.warn( `Renderer process: io.parseJson: ${ e }` );
    throw new IoError( `File ${filePath} seems to be corrupted.` );
  }
}

/**
 * Get list of available project files
 * @param {String} directory
 * @returns {Array}
 */
export async function getProjectFiles( directory ) {
  return await readDir( directory, ".json" );
}

export function isDirEmpty( directory ) {
  try {
    return !fs.readdirSync( directory ).length;
  } catch ( e ) {
    process.env.JEST_WORKER_ID || log.warn( `Renderer process: io.isDirEmpty: ${ e }` );
    return true;
  }
}

export async function readDir( directory, ext ) {
  try {
    return  ( await readdir( directory ) )
      .filter( file => file.endsWith( ext ) );
  } catch ( e ) {
    log.warn( `Renderer process: io.getProjectFiles: ${ e }` );
    return [];
  }
}

export function getBasename( filename ) {
  return filename ? filename.replace( /\.json$/, "" ) : "";
}


export  function isProject( directory ) {
  return fs.existsSync( join( directory, PROJECT_FILE_NAME ) );
}


/**
 * Read project file from given directory
 * @param {String} directory
 * @returns {Array|Object}
 */
export async function readProject( directory ) {
  const filePath = join( directory, PROJECT_FILE_NAME );
  try {
    const text = perf.processSync(`read ${ filePath }`, () => fs.readFileSync( filePath, "utf8" ) ),
          data = parseJson( text, filePath );
    if ( parseInt( data.puppetry.substr( 0, 1 ), 10 ) < 4 ) {
      return convertProject( data );
    }
    return data;
  } catch ( e ) {
    log.warn( `Renderer process: io.readProject: ${ e }` );
    throw new IoError( `Project file ${ filePath } cannot be open.
          Please make sure that the file exists and that you have read permission for it` );
  }
}


/**
 * Write project file to given directory
 * @param {String} directory
 * @param {Object} data
 */
export async function writeProject( directory, data ) {
  if ( !directory ) {
    return;
  }
  const filePath = join( directory, PROJECT_FILE_NAME );
  if ( !data.name ) {
    log.warn( `Renderer process: io.writeProject: empty name in ${ JSON.stringify( data ) } in ${ directory }` );
    return;
  }
  try {
    await writeFile( filePath, JSON.stringify( data, null, "  " ), "utf8" );
  } catch ( e ) {
    log.warn( `Renderer process: io.writeProject: ${ e }` );
    throw new IoError( `Project file ${filePath} cannot be written.
          Please make sure that you have write permission for it` );
  }
}

function getAsarUnpackedAppDirectory() {
  return remote.app.getAppPath()
    .replace( /app\.asar\/?$/, "app.asar.unpacked" );
}

// Evaluate constant only by demand, thus it doesn break in unit-tests
function getJestPkgDirectory() {
  return join( getAsarUnpackedAppDirectory(), JEST_PKG_DIRECTORY );
}

export async function getDemoProjectDirectory() {
  const SRC_DIR = join( getAsarUnpackedAppDirectory(), DEMO_PROJECT_DIRECTORY ),
        DEST_DIR = join( getAppInstallPath(), DEMO_PROJECT_DIRECTORY );

  if ( !isDirEmpty( DEST_DIR ) && !await confirmCreateProject() ) {
    return "";
  }

  try {
    shell.rm( "-rf" , DEST_DIR );
    shell.mkdir( "-p" , DEST_DIR );
    shell.cp( "-Rf", SRC_DIR, getAppInstallPath() );
    shell.chmod( "-R", 777, DEST_DIR );
  } catch ( e ) {
    log.warn( `Renderer process: io.getDemoProjectDirectory(${SRC_DIR}, ${DEST_DIR}):`
      + ` ${ e }` );
    throw new Error( `Cannot create demo project in ${ DEST_DIR }. `
      + `Please make sure that you have write permission for it` );
  }

  return DEST_DIR;
}

export function getAppInstallPath() {
  if ( "appInstallPath" in cache ) {
    return cache[ "appInstallPath" ];
  }
  const appInstallPath = join( dirname( log.transports.file.getFile().path ), ".." );
  cache[ "appInstallPath" ] = appInstallPath;
  return appInstallPath;
}

export function getLogPath() {
  return join( getAppInstallPath(), "log.log" );
}

export function getRuntimeTestPath() {
  return join( getAppInstallPath(), RUNTIME_TEST_DIRECTORY );
}

export function getRuntimeTestPathSafe() {
  const dir = getRuntimeTestPath();
  try {
    shell.mkdir( "-p" , dir );
  } catch ( err ) {
    log.warn( `Renderer process: getRuntimeTestPathSafe ${ err }` );
  }
  return dir;
}

export async function isRuntimeTestPathReady() {
  const lockFile = getLockRuntimeTestPath();

  try {
    if ( !( await lstat( getNodeModulesRuntimeTestPath() ) ).isDirectory() ) {
      log.warn( `Renderer process: node_modules not found in RuntimeTest` );
      return false;
    }
  } catch ( e ) {
    log.warn( `Renderer process: node_modules not found ${ e }` );
    return false;
  }

  try {
    // User propably installed dependencies manually
    const lock = perf.processSync(`read ${ lockFile }`, () => JSON.parse( fs.readFileSync( lockFile, "utf8" ) ) )
    
    if ( lock.version !== remote.app.getVersion() ) {
      log.warn( `Renderer process: RuntimeTest not ready, reason: version does not match` );
      return false;
    }
    return true;
  } catch ( e ) {
    return true;
  }
}

function getNodeModulesRuntimeTestPath() {
  return join( getRuntimeTestPath(), "node_modules" );
}

function getLockRuntimeTestPath() {
  return join( getRuntimeTestPath(), "node_modules", PUPPETRY_LOCK_FILE );
}

export function lockRuntimeTestPath() {
  const lockFile = getLockRuntimeTestPath(),
        version = remote.app.getVersion(),
        now = new Date(),
        data = {
          version,
          installed: now.toString()
        };
  try {
    fs.writeFileSync( lockFile, JSON.stringify( data, null, "  " ), "utf8" );
  } catch ( e ) {
    log.warn( `Renderer process: lockRuntimeTestPath(${ lockFile }) ${ e }` );
    throw new IoError( `Could not write file ${ lockFile }.
          Please make sure that you have write permission for it` );
  }
}

export function removeRuntimeTestPath() {
  const nodeDir = join( getRuntimeTestPath() );
  log.warn( `Renderer process: removeRuntimeTestPath` );
  shell.rm( "-rf" , nodeDir );
}

export function initRuntimeTestPath() {
  const DEST_DIR = getRuntimeTestPath(),
        SRC_DIR = getJestPkgDirectory();
  if ( fs.existsSync( join( DEST_DIR, "/package.json" ) ) ) {
    return;
  }
  try {
    shell.mkdir( "-p" , DEST_DIR );
    shell.cp( "-f" , SRC_DIR + "/package.json", DEST_DIR + "/" );
    shell.chmod( "-R", 777, DEST_DIR );
  } catch ( e ) {
    log.warn( `Renderer process: io.initRuntimeTestPath(${SRC_DIR}, ${DEST_DIR}): ${ e }` );
  }
}