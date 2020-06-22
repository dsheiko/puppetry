import { msgDataSaved } from "component/Global/Message";
import { STORAGE_KEY_SETTINGS } from "constant";

const buttons = {
  ok: "Yes",
  cancel: "No"
};

function getSettings() {
  return JSON.parse( localStorage.getItem( STORAGE_KEY_SETTINGS ) || "{}" );
}

export async function confirmRemove( count ) {
  document.addEventListener( "keydown", closeOnEnter, false );
  try {
    await smalltalk
      .confirm( "Confirm removing",
        `Do you want to remove ${ count } records?` , {
          buttons
        });
    document.removeEventListener( "keydown", closeOnEnter );
    return true;
  } catch ( e ) {
    document.removeEventListener( "keydown", closeOnEnter );
    return false;
  }
}

export async function confirmClone( count ) {
  document.addEventListener( "keydown", closeOnEnter, false );
  try {
    await smalltalk
      .confirm( "Confirm cloning",
        `Do you want to clone ${ count } records?` , {
          buttons
        });
    document.removeEventListener( "keydown", closeOnEnter );
    return true;
  } catch ( e ) {
    document.removeEventListener( "keydown", closeOnEnter );
    return false;
  }
}

export async function confirmRecording() {
  document.addEventListener( "keydown", closeOnEnter, false );
  try {
    await smalltalk
      .confirm( "Confirm Suite Cleanup",
        "By recording the current content of your suite will be removed. Are you sure you want to proceed?" , {
          buttons
        });
    document.removeEventListener( "keydown", closeOnEnter );
    return true;
  } catch ( e ) {
    document.removeEventListener( "keydown", closeOnEnter );
    return false;
  }
}

export async function confirmUnsavedChanges({ saveSuite, setSuite }) {
  try {

    const settings = getSettings();

    if ( settings.autosave ) {
      saveSuite();
      return true;
    }
    document.addEventListener( "keydown", closeOnEnter, false );
    await smalltalk
      .confirm( "Unsaved Changes", "You have unsaved changes in open suite file. What do we do?" , {
        buttons: {
          ok: "Save changes",
          cancel: "Discard changes"
        }
      });
    saveSuite();
    msgDataSaved();
    document.removeEventListener( "keydown", closeOnEnter );
    return true;
  } catch ( e ) {
    setSuite({ modified: false });
    document.removeEventListener( "keydown", closeOnEnter );
    return false;
  }
}

export async function confirmDeleteSnippets() {
  document.addEventListener( "keydown", closeOnEnter, false );
  try {
    await smalltalk
      .confirm( "Confirm Delete", `Are you sure you want to delete the snippet?` , {
        buttons
      });
    document.removeEventListener( "keydown", closeOnEnter );
    return true;
  } catch ( e ) {
    document.removeEventListener( "keydown", closeOnEnter );
    return false;
  }
}

export async function confirmDeleteFile( selectedFile = "" ) {
  document.addEventListener( "keydown", closeOnEnter, false );
  try {
    await smalltalk
      .confirm( "Confirm Delete", `Are you sure you want to delete ${ selectedFile } suite file?` , {
        buttons
      });
    document.removeEventListener( "keydown", closeOnEnter );
    return true;
  } catch ( e ) {
    document.removeEventListener( "keydown", closeOnEnter );
    return false;
  }
}

export async function confirmDeleteEntity( entity = "" ) {
  document.addEventListener( "keydown", closeOnEnter, false );
  try {
    await smalltalk
      .confirm( "Confirm Delete", `Are you sure you want to delete ${ entity }?` , {
        buttons
      });
    document.removeEventListener( "keydown", closeOnEnter );
    return true;
  } catch ( e ) {
    document.removeEventListener( "keydown", closeOnEnter );
    return false;
  }
}

export async function confirmCreateProject() {
  document.addEventListener( "keydown", closeOnEnter, false );
  try {
    await smalltalk
      .confirm( "Confirm Create",
        `The target directory is not empty. Are you sure you want to `
      + `create project there?` , {
          buttons
        });
    document.removeEventListener( "keydown", closeOnEnter );
    return true;
  } catch ( e ) {
    document.removeEventListener( "keydown", closeOnEnter );
    return false;
  }
}

// Clicks the first found action button on press Enter
function closeOnEnter( e ) {
  if ( e.keyCode !== 13 ) {
    return;
  }
  const el = document.querySelector( ".smalltalk .action-area button" );
  el && el.click();
}

export async function confirmExportProject() {
  document.addEventListener( "keydown", closeOnEnter, false );
  try {
    await smalltalk
      .confirm( "Confirm Export",
        `The target directory is not empty. Are you sure you want to `
      + `export project there?` , {
          buttons
        });
    document.removeEventListener( "keydown", closeOnEnter );
    return true;
  } catch ( e ) {
    document.removeEventListener( "keydown", closeOnEnter );
    return false;
  }
}
