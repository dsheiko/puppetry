import { exportProject, isDirEmpty, getRuntimeTestPath, readdir, writeFile } from "service/io";
import { A_FORM_ITEM_ERROR, A_FORM_ITEM_SUCCESS, RUNNER_JEST, RUNNER_PUPPETRY, E_RUN_TESTS, DIR_SCREENSHOTS_TRACE } from "constant";
import { ipcRenderer } from "electron";
import TextConvertor from "service/Export/TextConvertor";
import { join } from "path";
import shell from "shelljs";

export default async function exportPrintableText({
  projectDirectory,
  checkedList,
  selectedDirectory,
  project,
  snippets,
  envDto
}) {

//  const runtimeTemp = getRuntimeTestPath(),
//        specList = await exportProject(
//            projectDirectory,
//            runtimeTemp,
//            checkedList,
//            { runner: RUNNER_PUPPETRY, trace: true },
//            snippets,
//            envDto
//          ),
//          report = ipcRenderer.sendSync( E_RUN_TESTS, runtimeTemp, specList );
//
//  try {
//    shell.rm( "-rf", selectedDirectory );
//    shell.mkdir( "-p", selectedDirectory );
//    await writeFile( join( selectedDirectory, "jest-output.json" ), JSON.stringify( report, null, 2 ) );
//  } catch ( e ) {
//    console.warn( "Renderer process: exportPrintableText()", e );
//    // ignore
//  }

  const options = {
          projectDirectory,
          selectedDirectory,
          checkedList,
          project,
          snippets,
          ...envDto
        },
        screenshotSrcPath = join( projectDirectory, "screenshots", DIR_SCREENSHOTS_TRACE ),
        screenshots = ( await readdir( screenshotSrcPath ) )
          .map( filename => filename.replace( /\.png$/, "" ) ),
        convertor = new TextConvertor( options, ( command, recordLabel ) => {
          console.log("..", command);
          const match = screenshots.find( item => item === command.id );
          if ( !match ) {
            return;
          }
//          shell.cp(
//            join( screenshotSrcPath, `${ match }.png` ),
//            join( selectedDirectory, `${ recordLabel }-screenshot.png` )
//          );
        });

  convertor.convert();
}