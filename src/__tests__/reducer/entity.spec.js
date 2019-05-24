import { reducer } from "../../reducer/reducers";
import actions from "../../action/actions";
import DEFAULT_STATE from "../../reducer/defaultState";

const FIX_TARGET = "TARGET",
      FIX_SELECTOR = "SELECTOR",
      FIX_TARGET2 = "TARGET2",
      FIX_SELECTOR2 = "SELECTOR2",
      FIX_GROUP1 = "GROUP1",
      FIX_GROUP2 = "GROUP2",
      FIX_GROUP3 = "GROUP3",
      FIX_GROUP4 = "GROUP4",
      FIX_TEST1 = "TEST1",
      FIX_TEST2 = "TEST2",
      FIX_TEST3 = "TEST3",
      FIX_TEST4 = "TEST4",
      FIX_COMMAND1 = "COMMAND1",
      FIX_COMMAND2 = "COMMAND2",
      FIX_COMMAND3 = "COMMAND3",
      FIX_COMMAND4 = "COMMAND4",
      FIX_DIR1 = "DIR1",
      FIX_NAME1 = "NAME1",
      FIX_DIR2 = "DIR2",
      FIX_NAME2 = "NAME2",
      FIX_DIR3 = "DIR3",
      FIX_NAME3 = "NAME3";

function addTarget( state, target, selector ) {
  return reducer( state, {
    type: actions.addTarget,
    payload: { options: { target, selector }}
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

function addGroup( state, title ) {
  return reducer( state, {
    type: actions.addGroup,
    payload: { options: { title }}
  });
}

function insertAdjacentGroup( state, title, position ) {
  return reducer( state, {
    type: actions.insertAdjacentGroup,
    payload: {
      options: { title },
      position
    }
  });
}

function addTest( state, title, groupId ) {
  return reducer( state, {
    type: actions.addTest,
    payload: { options: { title, groupId }}
  });
}

function insertAdjacentTest( state, title, groupId, position ) {
  return reducer( state, {
    type: actions.insertAdjacentTest,
    payload: {
      options: { title, groupId },
      position
    }
  });
}

function addCommand( state, method, groupId, testId ) {
  return reducer( state, {
    type: actions.addCommand,
    payload: { method, target: "page", groupId, testId }
  });
}


function insertAdjacentCommand( state, method, groupId, testId, position ) {
  return reducer( state, {
    type: actions.insertAdjacentCommand,
    payload: {
      options: { method, target: "page", groupId, testId },
      position
    }
  });
}

function shiftTests( res ) {
  const [ group ] = Object.values( res.suite.groups );
  return Object.values( group.tests );
}

function shiftCommands( res ) {
  const [ test ] = shiftTests( res );
  return Object.values( test.commands );
}


describe( "Reducer: entities", () => {

  describe( "*Target", () => {

    it( "adds a new target", () => {
      const res = addTarget( DEFAULT_STATE, FIX_TARGET, FIX_SELECTOR ),
            [ target ] = Object.values( res.suite.targets );
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

  describe( "*Group", () => {

    it( "adds a new group", () => {
      let res = addGroup( DEFAULT_STATE, FIX_GROUP1 );
      res = addGroup( res, FIX_GROUP2 );
      res = addGroup( res, FIX_GROUP3 );
      expect( Object.values( res.suite.groups ).length ).toBe( 3 );
    });

    it( "insert adjacent group after", () => {
      let res = addGroup( DEFAULT_STATE, FIX_GROUP1 );
      res = addGroup( res, FIX_GROUP2 );
      res = addGroup( res, FIX_GROUP3 );
      const [ firstGroup ] = Object.values( res.suite.groups );
      res = insertAdjacentGroup( res, FIX_GROUP4, { after: firstGroup.id });
      expect( Object.values( res.suite.groups ).length ).toBe( 4 );
      const [ first, second ] = Object.values( res.suite.groups );
      expect( first.title ).toBe( FIX_GROUP1 );
      expect( second.title ).toBe( FIX_GROUP4 );
    });

    it( "insert adjacent group before", () => {
      let res = addGroup( DEFAULT_STATE, FIX_GROUP1 );
      res = addGroup( res, FIX_GROUP2 );
      res = addGroup( res, FIX_GROUP3 );
      const [ firstGroup, secondGroup, thirdGroup ] = Object.values( res.suite.groups );
      res = insertAdjacentGroup( res, FIX_GROUP4, { before: thirdGroup.id });
      expect( Object.values( res.suite.groups ).length ).toBe( 4 );
      const [ first, second, third, forth ] = Object.values( res.suite.groups );
      expect( forth.title ).toBe( FIX_GROUP3 );
      expect( third.title ).toBe( FIX_GROUP4 );
    });

  });

  describe( "*Test", () => {

    it( "adds a new test", () => {
      let res = addGroup( DEFAULT_STATE, FIX_GROUP1 );
      const [ group ] = Object.values( res.suite.groups );
      res = addTest( res, FIX_TEST1, group.id );
      res = addTest( res, FIX_TEST2, group.id );
      res = addTest( res, FIX_TEST3, group.id );
      const tests = res.suite.groups[ group.id ].tests;
      expect( Object.values( tests ).length ).toBe( 3 );
    });

    it( "insert adjacent test after", () => {
      let res = addGroup( DEFAULT_STATE, FIX_GROUP1 );
      const [ group ] = Object.values( res.suite.groups );
      res = addTest( res, FIX_TEST1, group.id );
      res = addTest( res, FIX_TEST2, group.id );
      res = addTest( res, FIX_TEST3, group.id );
      const [ first ] = Object.values( res.suite.groups[ group.id ].tests );
      res = insertAdjacentTest( res, FIX_TEST4, group.id, { after: first.id });
      const tests = Object.values( res.suite.groups[ group.id ].tests );
      expect( tests.length ).toBe( 4 );
      expect( tests[ 0 ].title ).toBe( FIX_TEST1 );
      expect( tests[ 1 ].title ).toBe( FIX_TEST4 );
    });

    it( "insert adjacent test before", () => {
      let res = addGroup( DEFAULT_STATE, FIX_GROUP1 );
      const [ group ] = Object.values( res.suite.groups );
      res = addTest( res, FIX_TEST1, group.id );
      res = addTest( res, FIX_TEST2, group.id );
      res = addTest( res, FIX_TEST3, group.id );
      const [ first, second, third ] = Object.values( res.suite.groups[ group.id ].tests );
      res = insertAdjacentTest( res, FIX_TEST4, group.id, { before: third.id });
      const tests = Object.values( res.suite.groups[ group.id ].tests );
      expect( tests.length ).toBe( 4 );
      expect( tests[ 3 ].title ).toBe( FIX_TEST3 );
      expect( tests[ 2 ].title ).toBe( FIX_TEST4 );
    });

  });

  describe( "*Command", () => {

    it( "adds a new command", () => {
      let res = addGroup( DEFAULT_STATE, FIX_GROUP1 ),
          [ group ] = Object.values( res.suite.groups );
      res = addTest( res, FIX_TEST1, group.id );
      [ group ] = Object.values( res.suite.groups );
      let [ test ] = Object.values( group.tests );

      res = addCommand( res, FIX_COMMAND1, group.id, test.id );
      res = addCommand( res, FIX_COMMAND2, group.id, test.id );
      res = addCommand( res, FIX_COMMAND3, group.id, test.id );

      let commands = shiftCommands( res );
      expect( commands.length ).toBe( 3 );
    });

    it( "insert adjacent test after", () => {
      let res = addGroup( DEFAULT_STATE, FIX_GROUP1 ),
          [ group ] = Object.values( res.suite.groups );
      res = addTest( res, FIX_TEST1, group.id );
      [ group ] = Object.values( res.suite.groups );
      let [ test ] = Object.values( group.tests );

      res = addCommand( res, FIX_COMMAND1, group.id, test.id );
      res = addCommand( res, FIX_COMMAND2, group.id, test.id );
      res = addCommand( res, FIX_COMMAND3, group.id, test.id );

      let commands = shiftCommands( res );

      res = insertAdjacentCommand( res, FIX_COMMAND4, group.id, test.id, { after: commands[ 0 ].id });

      commands = shiftCommands( res );

      expect( commands.length ).toBe( 4 );
      expect( commands[ 0 ].method ).toBe( FIX_COMMAND1 );
      expect( commands[ 1 ].method ).toBe( FIX_COMMAND4 );
    });

    it( "insert adjacent test before", () => {
      let res = addGroup( DEFAULT_STATE, FIX_GROUP1 ),
          [ group ] = Object.values( res.suite.groups );
      res = addTest( res, FIX_TEST1, group.id );
      [ group ] = Object.values( res.suite.groups );
      let [ test ] = Object.values( group.tests );

      res = addCommand( res, FIX_COMMAND1, group.id, test.id );
      res = addCommand( res, FIX_COMMAND2, group.id, test.id );
      res = addCommand( res, FIX_COMMAND3, group.id, test.id );

      let commands = shiftCommands( res );

      res = insertAdjacentCommand( res, FIX_COMMAND4, group.id, test.id, { before: commands[ 2 ].id });

      commands = shiftCommands( res );

      expect( commands.length ).toBe( 4 );
      expect( commands[ 3 ].method ).toBe( FIX_COMMAND3 );
      expect( commands[ 2 ].method ).toBe( FIX_COMMAND4 );
    });

  });
});

