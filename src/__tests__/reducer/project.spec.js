import reducer from "../../reducer/project";
import actions from "../../action";
import ROOT_STATE from "../../reducer/defaultState";

const DEFAULT_STATE = ROOT_STATE.project,
      FIX_NAME = "FIX_NAME";

describe( "Reducer: project", () => {

  test( "setApp", () => {
    let state =  reducer( DEFAULT_STATE, {
      type: actions.setProject,
      payload: { name: FIX_NAME }
    });
    expect( state.name ).toBe( FIX_NAME );
    expect( DEFAULT_STATE.name ).toBe( "" );
  });

  test( "updateProjectPanes", () => {
    let state =  reducer( DEFAULT_STATE, {
      type: actions.updateProjectPanes,
      payload: {
        panel: "suite",
        panes: [ FIX_NAME ]
      }
    });

    expect( state.appPanels.suite.panes.length ).toBe( 1 );
    expect( DEFAULT_STATE.appPanels.suite.panes.length ).toBe( 0 );
  });

});
