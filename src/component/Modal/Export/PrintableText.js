import { exportProject, isDirEmpty, getRuntimeTestPath, readdir } from "service/io";
import { A_FORM_ITEM_ERROR, A_FORM_ITEM_SUCCESS, RUNNER_JEST, RUNNER_PUPPETRY, E_RUN_TESTS } from "constant";
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

  const runtimeTemp = getRuntimeTestPath(),
        specList = await exportProject(
            projectDirectory,
            runtimeTemp,
            checkedList,
            { runner: RUNNER_PUPPETRY, trace: true },
            snippets,
            envDto
          );

  ipcRenderer.sendSync( E_RUN_TESTS, runtimeTemp, specList );

  try {
    shell.rm( join( selectedDirectory, `*` ) );
  } catch ( e ) {
    // ignore
  }

  const options = {
          projectDirectory,
          selectedDirectory,
          checkedList,
          project,
          snippets,
          ...envDto
        },
        screenshotSrcPath = join( projectDirectory, "screenshots", "trace" ),
        screenshots = ( await readdir( screenshotSrcPath ) )
          .map( filename => filename.replace( /\.png$/, "" ) ),
        convertor = new TextConvertor( options, ( command, recordLabel ) => {
          const match = screenshots.find( item => item === command.id );
          if ( !match ) {
            return;
          }
          shell.cp(
            join( screenshotSrcPath, `${ match }.png` ),
            join( selectedDirectory, `${ recordLabel }-screenshot.png` )
          );
        });

  convertor.convert();
}