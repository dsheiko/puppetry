import { msgDataSaved } from "component/Global/Message";

function noop() {
}

export async function confirmUnsavedChanges({ saveSuite, setSuite }) {
  try {
    await smalltalk
      .confirm( "Unsaved Changes", "You have unsaved changes in open suite file. What do we do?" , {
        buttons: {
          ok: "Save changes",
          cancel: "Discard changes"
        }
      });
    saveSuite();
    msgDataSaved();
    return true;
  } catch ( e ) {
    noop( e );
    setSuite({ modified: false });
    return false;
  }
}

export async function confirmDeleteFile( selectedFile = "" ) {
  try {
    await smalltalk
      .confirm( "Confirm Delete", `Are you sure you want to delete ${ selectedFile } suite file?` , {
        buttons: {
          ok: "Yes",
          cancel: "No"
        }
      });
    return true;
  } catch ( e ) {
    noop( e );
    return false;
  }
}

export async function confirmDeleteEntity( entity = "" ) {
  try {
    await smalltalk
      .confirm( "Confirm Delete", `Are you sure you want to delete ${ entity }?` , {
        buttons: {
          ok: "Yes",
          cancel: "No"
        }
      });
    return true;
  } catch ( e ) {
    noop( e );
    return false;
  }
}

export async function confirmCreateProject() {
  try {
    await smalltalk
      .confirm( "Confirm Create",
        `The target directory is not empty. Are you sure you want to `
      + `create project there?` , {
          buttons: {
            ok: "Yes",
            cancel: "No"
          }
        });
    return true;
  } catch ( e ) {
    noop( e );
    return false;
  }
}


export async function confirmExportProject() {
  try {
    await smalltalk
      .confirm( "Confirm Export",
        `The target directory is not empty. Are you sure you want to `
      + `export project there?` , {
          buttons: {
            ok: "Yes",
            cancel: "No"
          }
        });
    return true;
  } catch ( e ) {
    noop( e );
    return false;
  }
}
