import { msgDataSaved } from "component/Global/Message";
const buttons = {
  ok: "Yes",
  cancel: "No"
};

function noop() {
}

export async function confirmRemove( count ) {
  try {
    await smalltalk
      .confirm( "Confirm removing",
        `Do you want to remove ${ count } records?` , {
          buttons
        });
    return true;
  } catch ( e ) {
    noop( e );
    return false;
  }
}

export async function confirmClone( count ) {
  try {
    await smalltalk
      .confirm( "Confirm cloning",
        `Do you want to clone ${ count } records?` , {
          buttons
        });
    return true;
  } catch ( e ) {
    noop( e );
    return false;
  }
}

export async function confirmRecording() {
  try {
    await smalltalk
      .confirm( "Confirm Suite Cleanup",
        "By recording the current content of your suite will be removed. Are you sure you want to proceed?" , {
          buttons
        });
    return true;
  } catch ( e ) {
    noop( e );
    return false;
  }
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
        buttons
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
        buttons
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
          buttons
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
          buttons
        });
    return true;
  } catch ( e ) {
    noop( e );
    return false;
  }
}
