import fs from "fs";
import shell from "shelljs";
import { join, parse, dirname } from "path";
import { IoError, InvalidArgumentError } from "error";
import util from "util";
import { remote } from "electron";
import log from "electron-log";
import TestGenerator from "service/TestGenerator";
import { schema } from "component/Schema/schema";
import { PUPPETRY_LOCK_FILE, JEST_PKG_DIRECTORY, RUNTIME_TEST_DIRECTORY, DEMO_PROJECT_DIRECTORY } from "constant";
import findLogPath from "electron-log/lib/transports/file/find-log-path";

const PROJECT_FILE_NAME = ".puppetryrc",
      readFile = util.promisify( fs.readFile ),
      writeFile = util.promisify( fs.writeFile ),
      unlink = util.promisify( fs.unlink ),
      readdir = util.promisify( fs.readdir ),
      lstat = util.promisify( fs.lstat ),
      cache = {};

shell.config.fatal = true;

export function normalizeFilename( str ) {
  const re = /[^a-zA-Z0-9_-]/g;
  return str.replace( re, "--" );
}


export function normalizeName( str ) {
  const re = /[^a-zA-Z0-9_-]/g;
  return str.replace( re, "--" );
}

export function createRuntimeTemp() {
  const RUNTIME_TEMP = getRuntimeTestPath();
  shell.mkdir( "-p" , RUNTIME_TEMP );
  return RUNTIME_TEMP;
}

export function removeRuntimeTemp() {
}

export function removeExport( exportDirectory ) {
  fs.readdirSync( exportDirectory )
    .filter( name => name !== "node_modules" )
    .forEach( name => shell.rm( "-rf" , join( exportDirectory, name ) ) );
}

/**
 * Export a single suite
 * @param {String} projectDirectory
 * @param {String} filename
 * @returns {String} - spec.js content
 */
export async function exportSuite( projectDirectory, filename ) {
  const suite = await readSuite( projectDirectory, filename ),
        gen = new TestGenerator( suite, schema, suite.targets );
  return gen.generate();
}

/**
 * Export specified suite files to given directory
 *
 * @param {String} projectDirectory
 * @param {String} outputDirectory
 * @param {String[]} suiteFiles ["foo.json",..]
 * @returns {String[]} - ["foo.spec.js",..]
 */
export async function exportProject( projectDirectory, outputDirectory, suiteFiles ) {
  const testDir = join( outputDirectory, "specs" ),
        specFiles = [],
        JEST_PKG = getJestPkgDirectory();

  try {
    removeExport( outputDirectory );
    shell.mkdir( "-p" , testDir );
    shell.mkdir( "-p" , join( outputDirectory, "screenshots" ) );
    shell.chmod( "-R", "+w", outputDirectory );
    shell.cp( "-RLf" , JEST_PKG + "/*", outputDirectory  );

    for ( const filename of suiteFiles ) {
      const specContent = await exportSuite( projectDirectory, filename ),
            specFilename = parse( filename ).name + ".spec.js",
            specPath = join( testDir, specFilename );
      await writeFile( specPath, specContent, "utf8" );
      specFiles.push( specFilename );
    }

    return specFiles;
  } catch ( e ) {
    log.warn( `Renderer process: io.exportProject(${ testDir }): ${ e }` );
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

  if ( !directory || typeof directory !== "string" ) {
    throw new InvalidArgumentError( `Directory is empty or not a string` );
  }
  if ( !file || typeof file !== "string" ) {
    throw new InvalidArgumentError( `File is empty or not a string` );
  }

  const filePath = join( directory, file );
  try {
    const text = await readFile( filePath, "utf8" );
    return parseJson( text, filePath );
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
  const filePath = join( directory, PROJECT_FILE_NAME );
  try {
    return fs.lstatSync( filePath ).isFile();
  } catch ( e ) {
    log.warn( `Renderer process: io.isProject: ${ e }` );
    return false;
  }
}

/**
 * Read project file from given directory
 * @param {String} directory
 * @returns {Array|Object}
 */
export async function readProject( directory ) {
  const filePath = join( directory, PROJECT_FILE_NAME );
  try {
    const text = await readFile( filePath, "utf8" );
    return parseJson( text, filePath );
  } catch ( e ) {
    log.warn( `Renderer process: io.readProject: ${ e }` );
    throw new IoError( `Project file ${filePath} cannot be open.
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

export function getDemoProjectDirectory() {
  const SRC_DIR = join( getAsarUnpackedAppDirectory(), DEMO_PROJECT_DIRECTORY ),
        DEST_DIR = join( getAppInstallPath(), DEMO_PROJECT_DIRECTORY );

  if ( !fs.existsSync( join( DEST_DIR, ".puppetryrc" ) ) ) {
    try {
      shell.mkdir( "-p" , DEST_DIR );
      shell.chmod( "-R", "+w", DEST_DIR );
      shell.cp( "-Rf", SRC_DIR, getAppInstallPath() );
    } catch ( e ) {
      log.warn( `Renderer process: io.getDemoProjectDirectory(${SRC_DIR}, ${DEST_DIR}):`
        + ` ${ e }` );
    }
  }
  return DEST_DIR;
}

export function getAppInstallPath() {
  if ( "appInstallPath" in cache ) {
    return cache[ "appInstallPath" ];
  }
  const appInstallPath = dirname( findLogPath( remote.app.getName() ) );
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
    if ( ! ( await lstat( lockFile ) ).isFile() ) {
      log.warn( `Renderer process: RuntimeTest not ready, reason: lock not found` );
      return false;
    }
    const lock = JSON.parse( await readFile( lockFile, "utf8" ) );
    if ( lock.version !== remote.app.getVersion() ) {
      log.warn( `Renderer process: RuntimeTest not ready, reason: version does not match` );
      return false;
    }
    return true;
  } catch ( e ) {
    log.warn( `Renderer process: RuntimeTest not ready, reason: could not lstat ${ e }` );
    return false;
  }
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
    shell.chmod( "-R", "+w", DEST_DIR );
    shell.cp( "-f" , SRC_DIR + "/package.json", DEST_DIR + "/" );
  } catch ( e ) {
    log.warn( `Renderer process: io.initRuntimeTestPath(${SRC_DIR}, ${DEST_DIR}): ${ e }` );
  }
}