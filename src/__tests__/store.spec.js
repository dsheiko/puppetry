//import configureStore from "redux-mock-store";
import actions from "../action/actions";
import DEFAULT_STATE from "../reducer/defaultState";
import { reducer } from "../reducer/reducers";
import { ValidationError } from "error";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";
import promiseMiddleware from "redux-promise";

let store;

function createConstants( list ) {
  return list.reduce( ( carry, item ) => {
    carry[ item ] = item;
    return carry;
  }, {});
}

const FIX = createConstants([
  "GROUP1",
  "GROUP2",
  "TEST1",
  "TEST2",
  "TEST3",
  "TEST4",
  "TARGET1",
  "TARGET2",
  "TARGET3",
  "METHOD1",
  "METHOD2",
  "METHOD3",
]);

const storeEnhancer = compose(
        applyMiddleware(
          thunkMiddleware,
          promiseMiddleware
        )
      ),

      createGroup = ( title ) => {
        store.dispatch( actions.addGroup({ title }) );
        const groups = Object.values( store.getState().suite.groups );
        return groups.pop();
      },

      createTest = ( title, groupId ) => {
        store.dispatch( actions.addTest({ title, groupId }) );
        const group = store.getState().suite.groups[ groupId ];
        const tests = Object.values( group.tests );
        return tests.pop();
      },

      createCommand = ( target, method, groupId, testId ) => {
        store.dispatch( actions.addCommand({ target, method, groupId, testId }) );
        const group = store.getState().suite.groups[ groupId ];
        const test = group.tests[ testId ];
        const commands = Object.values( test.commands );
        return commands.pop();
      };


describe( "Store", () => {

  beforeEach(() => {
    store = createStore( reducer, storeEnhancer );
  });

  describe( "Suite", () => {

    it( "creates a group", () => {
        const group = createGroup( FIX.GROUP1 );
        expect( group.title ).toBe( FIX.GROUP1 );
        expect( group.id ).toBe( group.key );
        expect( group.id in store.getState().suite.groups ).toBe( true );
    });

    it( "creates a test", () => {
        let group = createGroup( FIX.GROUP1 ),
            test = createTest( FIX.TEST1, group.id );
        expect( test.title ).toBe( FIX.TEST1 );
        expect( test.id ).toBe( test.key );
        group = store.getState().suite.groups[ group.id ];
        expect( test.id in group.tests ).toBe( true );
    });

    it( "creates a command", () => {
       let group = createGroup( FIX.GROUP1 ),
           test = createTest( FIX.TEST1, group.id ),
           command = createCommand( FIX.TARGET1, FIX.METHOD1, group.id , test.id );


       expect( command.target ).toBe( FIX.TARGET1 );
       expect( command.method ).toBe( FIX.METHOD1 );
       expect( command.id ).toBe( command.key );

       test = store.getState().suite.groups[ group.id ].tests[ test.id ];

       expect( command.id in test.commands ).toBe( true );
   });

   it( "clones a command", () => {
       let group = createGroup( FIX.GROUP1 ),
           test = createTest( FIX.TEST1, group.id ),
           command1 = createCommand( FIX.TARGET1, FIX.METHOD1, group.id , test.id ),
           command2 = createCommand( FIX.TARGET2, FIX.METHOD2, group.id , test.id );

       store.dispatch( actions.cloneCommand( command1, { groupId: group.id, testId: test.id }) );

       test = store.getState().suite.groups[ group.id ].tests[ test.id ];
       let [ c1, c2, c3 ] = Object.values( test.commands );
       expect( c1.target ).toBe( FIX.TARGET1 );
       expect( c2.target ).toBe( FIX.TARGET1 );
       expect( c3.target ).toBe( FIX.TARGET2 );
       expect( c1.method ).toBe( FIX.METHOD1 );
       expect( c2.method ).toBe( FIX.METHOD1 );
       expect( c3.method ).toBe( FIX.METHOD2 );
       expect( c1.id ).not.toBe( c2.id );
       expect( c1.key ).not.toBe( c2.key );
       expect( c2.id in test.commands ).toBe( true );
   });

   it( "clones a test", () => {
       let group = createGroup( FIX.GROUP1 ),
           test1 = createTest( FIX.TEST1, group.id ),
           command11 = createCommand( FIX.TARGET1, FIX.METHOD1, group.id , test1.id ),
           command12 = createCommand( FIX.TARGET2, FIX.METHOD2, group.id , test1.id ),
           test2 = createTest( FIX.TEST2, group.id ),
           command21 = createCommand( FIX.TARGET3, FIX.METHOD3, group.id , test1.id );


       store.dispatch( actions.cloneTest( test1, { groupId: group.id }) );

       group = store.getState().suite.groups[ group.id ];

       let [ t1, t2, t3 ] = Object.values( group.tests );
       expect( t1.title ).toBe( FIX.TEST1 );
       expect( t2.title ).toBe( FIX.TEST1 );
       expect( t3.title ).toBe( FIX.TEST2 );
       expect( t1.id ).not.toBe( t2.id );
       expect( t1.key ).not.toBe( t2.key );
       expect( t2.id in group.tests ).toBe( true );

       let [ c1 ] = Object.values( t1.commands );
       let [ c2 ] = Object.values( t2.commands );

       expect( c1.target ).toBe( c2.target );
       expect( c1.method ).toBe( c1.method );
       expect( c1.id ).not.toBe( c2.id );
       expect( c1.key ).not.toBe( c2.key );

   });
   

  });

});
