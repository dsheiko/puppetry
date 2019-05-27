import reducer from "../../reducer/app";
import actions from "../../action";
import ROOT_STATE from "../../reducer/defaultState";

const DEFAULT_STATE = ROOT_STATE.app,
      FIX_TAB = "settings";

describe( "Reducer: app", () => {

  test( "setApp", () => {
    let state =  reducer( DEFAULT_STATE, {
      type: actions.setApp,
      payload: { loading: true }
    });
    expect( state.loading ).toBe( true );
    expect( DEFAULT_STATE.loading ).toBe( false );
  });

  test( "addAppTab", () => {
    let state =  reducer( DEFAULT_STATE, {
      type: actions.addAppTab,
      payload: FIX_TAB
    });
    expect( state.tabs.active ).toBe( FIX_TAB );
    expect( state.tabs.available[ FIX_TAB ] ).toBe( true );
    expect( DEFAULT_STATE.tabs.active ).toBe( "suite" );
  });

  test( "removeAppTab", () => {
    let state =  reducer( DEFAULT_STATE, {
      type: actions.addAppTab,
      payload: FIX_TAB
    });
    state = reducer( state, {
      type: actions.removeAppTab,
      payload: FIX_TAB
    });

    expect( state.tabs.available[ FIX_TAB ] ).toBe( false );
    expect( DEFAULT_STATE.tabs.active ).toBe( "suite" );
  });

  test( "setAppTab", () => {
    let state =  reducer( DEFAULT_STATE, {
      type: actions.setAppTab,
      payload: FIX_TAB
    });
    expect( state.tabs.active ).toBe( FIX_TAB );
    expect( state.tabs.available[ FIX_TAB ] ).toBe( false );
    expect( DEFAULT_STATE.tabs.active ).toBe( "suite" );
  });




});
