import fs from "fs";
import shell from "shelljs";
import { join, parse, dirname } from "path";
import { IoError, InvalidArgumentError } from "error";
import util from "util";
import { remote } from "electron";
import log from "electron-log";
import TestGenerator from "service/TestGenerator";
import { schema } from "component/Schema/schema";
import { RUNTIME_TEST_DIRECTORY } from "constant";
import findLogPath from "electron-log/lib/transports/file/find-log-path";

const PROJECT_FILE_NAME = ".puppertyrc",
      readFile = util.promisify( fs.readFile ),
      writeFile = util.promisify( fs.writeFile ),
      unlink = util.promisify( fs.unlink ),
      readdir = util.promisify( fs.readdir ),
      cache = {};


function noop() {
}


export function normalizeFilename( str ) {
  const re = /[^a-zA-Z0-9_-]/g;
  return str.replace( re, "--" );
}

// Evaluate constant only by demand, thus it doesn break in unit-tests
function getRuntimeTemp() {
  const APP_PATH = remote.app.getAppPath();
  return join( APP_PATH, "runtime-temp" );
}

// Evaluate constant only by demand, thus it doesn break in unit-tests
function getJestPkgDirectory() {
  const APP_PATH = remote.app.getAppPath();
  return join( APP_PATH, "jest-pkg" );
}

export function normalizeName( str ) {
  const re = /[^a-zA-Z0-9_-]/g;
  return str.replace( re, "--" );
}

export function createRuntimeTemp() {
  const RUNTIME_TEMP = getRuntimeTemp();
  shell.mkdir( "-p" , RUNTIME_TEMP );
  return RUNTIME_TEMP;
}
export function removeRuntimeTemp() {
  const RUNTIME_TEMP = getRuntimeTemp();
  shell.rm( "-rf" , RUNTIME_TEMP );
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
 * @param {Object[]} targets
 * @returns {String} - spec.js content
 */
export async function exportSuite( projectDirectory, filename, targets ) {
  const suite = await readSuite( projectDirectory, filename ),
        gen = new TestGenerator( suite, schema, targets );
  return gen.generate();
}

/**
 * Export specified suite files to given directory
 *
 * @param {String} projectDirectory
 * @param {String} outputDirectory
 * @param {String[]} suiteFiles ["foo.json",..]
 * @param {Object[]} targets
 * @returns {String[]} - ["foo.spec.js",..]
 */
export async function exportProject( projectDirectory, outputDirectory, suiteFiles, targets ) {
  const testDir = join( outputDirectory, "specs" ),
        specFiles = [],
        JEST_PKG = getJestPkgDirectory();

  try {
    removeExport( outputDirectory );
    shell.mkdir( "-p" , testDir );
    shell.cp( "-Rf" , JEST_PKG + "/*", outputDirectory );

    for ( const filename of suiteFiles ) {
      const specContent = await exportSuite( projectDirectory, filename, targets ),
            specFilename = parse( filename ).name + ".spec.js",
            specPath = join( testDir, specFilename );
      await writeFile( specPath, specContent, "utf8" );
      specFiles.push( specFilename );
    }

    return specFiles;
  } catch ( e ) {
    log.warn( `Renderer process: io.exportProject: ${ e }` );
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
    log.warn( `Renderer process: io.getBasename: ${ e }` );
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
  const filePath = join( directory, PROJECT_FILE_NAME );
  try {
    await writeFile( filePath, JSON.stringify( data, null, "  " ), "utf8" );
  } catch ( e ) {
    log.warn( `Renderer process: io.writeProject: ${ e }` );
    throw new IoError( `Project file ${filePath} cannot be written.
          Please make sure that you have write permission for it` );
  }
}

export function getAppInstallPath() {
  if ( "appInstallPath" in cache ) {
    return cache[ "appInstallPath" ];
  }
  const appInstallPath = dirname( findLogPath( remote.app.getName() ) );
  cache[ "appInstallPath" ] = appInstallPath;
  return appInstallPath;
}

export function getRuntimeTestPath() {
  return join( getAppInstallPath(), RUNTIME_TEST_DIRECTORY );
}

export function isRuntimeTestPathReady() {
  const nodeDir = join( getRuntimeTestPath(), "node_modules" );
  try {
    return fs.lstatSync( nodeDir ).isDirectory();
  } catch ( e ) {
    noop( e );
    return false;
  }
}

export function removeRuntimeTestPath() {
  const nodeDir = join( getRuntimeTestPath() );
  shell.rm( "-rf" , nodeDir );
}

export function initRuntimeTestPath() {
  const dir = getRuntimeTestPath(),
        JEST_PKG = getJestPkgDirectory();
  if ( fs.existsSync( JEST_PKG + "/package.json" ) ) {
    return;
  }
  shell.mkdir( "-p" , dir );
  shell.cp( "-f" , JEST_PKG + "/package.json", dir );
}