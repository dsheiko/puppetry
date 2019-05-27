import reducer from "../../reducer/suite";
import actions from "../../action";
import ROOT_STATE from "../../reducer/defaultState";

const DEFAULT_STATE = ROOT_STATE.suite,
      FIX_TITLE = "FIX_TITLE";

describe( "Reducer: suite", () => {

  test( "setSuite", () => {
    let state =  reducer( DEFAULT_STATE, {
      type: actions.setSuite,
      payload: { title: FIX_TITLE }
    });
    expect( state.title ).toBe( FIX_TITLE );
    expect( state.modified ).toBe( true );
    expect( DEFAULT_STATE.title ).toBe( null );
  });

  test( "resetSuite", () => {
    let state =  reducer( DEFAULT_STATE, {
      type: actions.resetSuite,
      payload: { title: FIX_TITLE }
    });
    expect( state.title ).toBe( FIX_TITLE );
    expect( state.modified ).toBe( undefined );
    expect( DEFAULT_STATE.title ).toBe( null );
  });


});
