import { remote } from "electron";
import errorActions from "../error";
import debounce from "lodash.debounce";
import { writeProject } from "service/io";
import { dateToTs } from "service/utils";

export const version = remote ? remote.app.getVersion() : "0.1";

export function handleException( ex, dispatch, title = null ) {
  console.error( ex );
  dispatch( errorActions.setError({
    visible: true,
    message: title || "Internal error",
    description: ex.message
  }) );
}

export const saveProject = debounce( async ( store, isTouch = false ) => {

  if ( !store.settings.projectDirectory ) {
    return;
  }
  const ts = isTouch ? {} : { savedAt: dateToTs() };
  await writeProject( store.settings.projectDirectory,  {
    ...store.project,
    puppetry: version,
    ...ts,
    modified: false
  });

}, 100 );