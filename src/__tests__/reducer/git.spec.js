import reducer from "../../reducer/git";
import actions from "../../action";
import ROOT_STATE from "../../reducer/defaultState";

const DEFAULT_STATE = ROOT_STATE.git,
      FIX_DIR1 = "FIX_DIR1";

describe( "Reducer: git", () => {

  test( "setGit", () => {
    let state =  reducer( DEFAULT_STATE, {
      type: actions.setGit,
      payload: { remoteRepository: FIX_DIR1 }
    });
    expect( state.remoteRepository ).toBe( FIX_DIR1 );
    expect( DEFAULT_STATE.remoteRepository ).toBe( "" );
  });


});
