import { reducer } from "../reducer/reducers";
import actions from "../action/actions";
import DEFAULT_STATE from "../reducer/defaultState";

const FIX_TARGET = "TARGET",
      FIX_SELECTOR = "SELECTOR",
      FIX_TARGET2 = "TARGET2",
      FIX_SELECTOR2 = "SELECTOR2";

function addTarget( state, target, selector ) {
  return reducer( state, {
      type: actions.addTarget,
      payload: { target, selector }
    });
}
function updateTarget( state, id, target, selector ) {
  return reducer( state, {
      type: actions.updateTarget,
      payload: { target, selector, id }
    });
}

function getTarget( state, inx = 0 ) {
  const targets = Object.values( state.suite.targets );
  return targets[ inx ];
}


describe( "Reducers", () => {

  describe( "*Target", () => {

    it( "adds a new target", () => {
      const res = addTarget( DEFAULT_STATE, FIX_TARGET, FIX_SELECTOR );
      const [ target ] = Object.values( res.suite.targets );
      expect( target.target ).toBe( FIX_TARGET );
      expect( target.selector ).toBe( FIX_SELECTOR );
    });

    it( "updates target", () => {
      let state = addTarget( DEFAULT_STATE, FIX_TARGET, FIX_SELECTOR );
      state = updateTarget( state, getTarget( state, 0 ).id, FIX_TARGET2, FIX_SELECTOR2 );
      const target = getTarget( state, 0 );
      expect( target.target ).toBe( FIX_TARGET2 );
      expect( target.selector ).toBe( FIX_SELECTOR2 );
    });

    it( "updates target selector, does not take it for a duplicate", () => {
      let state = addTarget( DEFAULT_STATE, FIX_TARGET, FIX_SELECTOR );
      state = updateTarget( state, getTarget( state, 0 ).id, FIX_TARGET2, FIX_SELECTOR2 );
      state = updateTarget( state, getTarget( state, 0 ).id, FIX_TARGET2, FIX_SELECTOR );
      const target = getTarget( state, 0 );
      expect( target.target ).toBe( FIX_TARGET2 );
      expect( target.selector ).toBe( FIX_SELECTOR );
    });

    it( "adds duplacte with updated target", () => {
      let state = addTarget( DEFAULT_STATE, FIX_TARGET, FIX_SELECTOR );
      state = addTarget( state, FIX_TARGET, FIX_SELECTOR );
      expect( getTarget( state, 0 ).target ).toBe( FIX_TARGET );
      expect( getTarget( state, 1 ).target ).not.toBe( FIX_TARGET );
    });

    it( "updates duplacte with updated target", () => {
      let state = addTarget( DEFAULT_STATE, FIX_TARGET, FIX_SELECTOR );
      state = addTarget( state, FIX_TARGET2, FIX_SELECTOR2 );
      state = updateTarget( state, getTarget( state, 1 ).id, FIX_TARGET, FIX_SELECTOR2 );
      expect( getTarget( state, 0 ).target ).toBe( FIX_TARGET );
      expect( getTarget( state, 1 ).target ).not.toBe( FIX_TARGET );
    });

  });


});
