//import configureStore from "redux-mock-store";
import actions from "../action/actions";
import DEFAULT_STATE from "../reducer/defaultState";
import { reducer } from "../reducer/reducers";
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
  "ID1",
  "ID2",
  "SELECTOR1",
  "SELECTOR2",
  "SELECTOR3",
  "GROUP1",
  "GROUP2",
  "TEST1",
  "TEST2",
  "TEST3",
  "TEST4",
  "TARGET1",
  "TARGET2",
  "TARGET3",
  "TARGET4",
  "METHOD1",
  "METHOD2",
  "METHOD3",
  "METHOD4",
]);

const storeEnhancer = compose(
        applyMiddleware(
          thunkMiddleware,
          promiseMiddleware
        )
      ),

      createTarget = ( target, selector ) => {
        store.dispatch( actions.addTarget({ target, selector }) );
        const res = Object.values( store.getState().suite.targets );
        return res.pop();
      },

      getTarget = ( id ) => {
        return store.getState().suite.targets[ id ];
      },

      hasTarget = ( id ) => {
        return id in store.getState().suite.targets &&
          Object.values( store.getState().suite.targets ).some( t => t.id === id );
      },

      getGroup = ( id ) => {
        return store.getState().suite.groups[ id ];
      },

      hasGroup = ( id ) => {
        return id in store.getState().suite.groups &&
          Object.values( store.getState().suite.groups ).some( group => group.id === id );
      },

      hasTest = ( id, groupId ) => {
        const group = getGroup( groupId );
        return id in group.tests &&
          Object.values( group.tests ).some( test => test.id === id );
      },

      hasCommand = ( id, groupId, testId ) => {
        const test = getGroup( groupId ).tests[ testId ];
        return id in test.commands &&
          Object.values( test.commands ).some( c => c.id === id );
      },

      createGroup = ( title ) => {
        store.dispatch( actions.addGroup({ title }) );
        const groups = Object.values( store.getState().suite.groups );
        return groups.pop();
      },

      createTest = ( title, groupId ) => {
        store.dispatch( actions.addTest({ title, groupId }) );
        const group = getGroup( groupId );
        const tests = Object.values( group.tests );
        return tests.pop();
      },

      createCommand = ( target, method, groupId, testId ) => {
        store.dispatch( actions.addCommand({ target, method, groupId, testId }) );
        const group = getGroup( groupId );
        const test = group.tests[ testId ];
        const commands = Object.values( test.commands );
        return commands.pop();
      };


describe( "Store", () => {

  beforeEach(() => {
    store = createStore( reducer, storeEnhancer );
  });

  describe( "Project", () => {

     it( "changes panes", () => {
        store.dispatch( actions.updateProjectPanes( "suite", [ FIX.ID1 ] ) );
        const [ pane ] = store.getState().project.appPanels.suite.panes;
        expect( pane ).toBe( FIX.ID1 );
     });

  });

  describe( "Suite", () => {

     it( "creates a target", () => {
        const target = createTarget( FIX.TARGET1, FIX.SELECTOR1 );
        expect( target.target ).toBe( FIX.TARGET1 );
        expect( target.selector ).toBe( FIX.SELECTOR1 );
        expect( target.id ).toBe( target.key );
        expect( target.id in store.getState().suite.targets ).toBe( true );
     });

     it( "creates a target with forced ID", () => {
        store.dispatch( actions.addTarget({ target: FIX.TARGET1, selector: FIX.SELECTOR1 }, FIX.ID1 ) );
        expect( hasTarget( FIX.ID1 ) ).toBe( true );
        const target = getTarget( FIX.ID1 );
        expect( target.id ).toBe( FIX.ID1 );
        expect( target.id ).toBe( target.key );
     });

     it( "updates a target", () => {
        let target = createTarget( FIX.TARGET1, FIX.SELECTOR1 );
        store.dispatch( actions.updateTarget({
          id: target.id, target: FIX.TARGET2, selector: FIX.SELECTOR2, editing: true, disabled: true
        }));
        target = getTarget( target.id );
        expect( target.target ).toBe( FIX.TARGET2 );
        expect( target.selector ).toBe( FIX.SELECTOR2 );
        expect( target.editing ).toBe( true );
        expect( target.disabled ).toBe( true );
     });

     it( "keeps unique targets when updating", () => {
        createTarget( FIX.TARGET1, FIX.SELECTOR1 );
        let target = createTarget( FIX.TARGET2, FIX.SELECTOR2 );
        store.dispatch( actions.updateTarget({ id: target.id, target: FIX.TARGET1 }));
        target = getTarget( target.id );
        expect( target.target ).not.toBe( FIX.TARGET1 );
     });

     it( "...but only when target property updates", () => {
        createTarget( FIX.TARGET1, FIX.SELECTOR1 );
        let target = createTarget( FIX.TARGET2, FIX.SELECTOR2 );
        store.dispatch( actions.updateTarget({ id: target.id, target: FIX.TARGET2, selector: FIX.SELECTOR1 }));
        target = getTarget( target.id );
        expect( target.target ).toBe( FIX.TARGET2 );
     });

     it( "removes a target", () => {
          let t1 = createTarget( FIX.TARGET1, FIX.SELECTOR1 ),
              t2 = createTarget( FIX.TARGET2, FIX.SELECTOR2 );
          store.dispatch( actions.removeTarget({ id: t2.id }));
          expect( hasTarget( t1.id ) ).toBe( true );
          expect( hasTarget( t2.id ) ).toBe( false );
     });

      it( "clones a target", () => {
          let target = createTarget( FIX.TARGET1, FIX.SELECTOR1 );
          store.dispatch( actions.cloneTarget( target ) );
          const [ t1, t2 ] = Object.values( store.getState().suite.targets );
          // Targets still have to be unique
          expect( t1.target ).not.toBe( t2.target );
          expect( t1.selector ).toBe( t2.selector );
          expect( t1.id ).not.toBe( t2.id );
          expect( t2.id ).toBe( t2.key );
      });

      it( "swaps targets", () => {
          let t1 = createTarget( FIX.TARGET1, FIX.SELECTOR1 ),
              t2 = createTarget( FIX.TARGET2, FIX.SELECTOR2 ),
              t3 = createTarget( FIX.TARGET3, FIX.SELECTOR3 );

          store.dispatch( actions.swapTarget({
            sourceInx: 0,
            sourceId: t1,
            targetInx: 2,
            targetId: t3
          }));

          [ t1, t2, t3 ] = Object.values( store.getState().suite.targets );
          expect( t1.target ).toBe( FIX.TARGET2 );
          expect( t2.target ).toBe( FIX.TARGET3 );
          expect( t3.target ).toBe( FIX.TARGET1 );
     });

     it( "creates a group", () => {
          const group = createGroup( FIX.GROUP1 );
          expect( group.title ).toBe( FIX.GROUP1 );
          expect( group.id ).toBe( group.key );
          expect( group.id in store.getState().suite.groups ).toBe( true );
     });

     it( "creates a group with forced ID", () => {
        store.dispatch( actions.addGroup({ title: FIX.GROUP1 }, FIX.ID1 ) );
        expect( hasGroup( FIX.ID1 ) ).toBe( true );
        const group = getGroup( FIX.ID1 );
        expect( group.id ).toBe( FIX.ID1 );
     });

     it( "updates a group", () => {
        let group = createGroup( FIX.GROUP1 );
        store.dispatch( actions.updateGroup({
          id: group.id, title: FIX.GROUP2, editing: true, disabled: true
        }));
        group = getGroup( group.id );
        expect( group.title ).toBe( FIX.GROUP2 );
        expect( group.editing ).toBe( true );
        expect( group.disabled ).toBe( true );
    });

     it( "removes a group", () => {
          let g1 = createGroup( FIX.GROUP1 ),
              g2 = createGroup( FIX.GROUP2 );
          store.dispatch( actions.removeGroup({ id: g2.id }));
          expect( hasGroup( g1.id ) ).toBe( true );
          expect( hasGroup( g2.id ) ).toBe( false );
     });


    it( "creates a test", () => {
        let group = createGroup( FIX.GROUP1 ),
            test = createTest( FIX.TEST1, group.id );
        expect( test.title ).toBe( FIX.TEST1 );
        expect( test.id ).toBe( test.key );
        group = getGroup( group.id );
        expect( test.id in group.tests ).toBe( true );
    });

    it( "updates a test", () => {
        let group = createGroup( FIX.GROUP1 ),
            test = createTest( FIX.TEST1, group.id );

        store.dispatch( actions.updateTest({
          id: test.id,
          groupId: group.id,
          title: FIX.TEST2,
          editing: true,
          disabled: true
        }));

        [ test ] = Object.values( getGroup( group.id ).tests );

        expect( test.title ).toBe( FIX.TEST2 );
        expect( test.editing ).toBe( true );
        expect( test.disabled ).toBe( true );
    });

    it( "removes a test", () => {
          let group = createGroup( FIX.GROUP1 ),
              t1 = createTest( FIX.TEST1, group.id ),
              t2 = createTest( FIX.TEST2, group.id );
          store.dispatch( actions.removeTest({ id: t2.id, groupId:  group.id }));
          expect( hasTest( t1.id, group.id ) ).toBe( true );
          expect( hasTest( t2.id, group.id ) ).toBe( false );
     });

    it( "creates a command", () => {
       let group = createGroup( FIX.GROUP1 ),
           test = createTest( FIX.TEST1, group.id ),
           command = createCommand( FIX.TARGET1, FIX.METHOD1, group.id , test.id );


       expect( command.target ).toBe( FIX.TARGET1 );
       expect( command.method ).toBe( FIX.METHOD1 );
       expect( command.id ).toBe( command.key );

       test = getGroup( group.id ).tests[ test.id ];

       expect( command.id in test.commands ).toBe( true );
   });

   it( "updates a command", () => {
       let group = createGroup( FIX.GROUP1 ),
           test = createTest( FIX.TEST1, group.id ),
           command = createCommand( FIX.TARGET1, FIX.METHOD1, group.id , test.id );


        store.dispatch( actions.updateCommand({
          id: command.id,
          testId: test.id,
          groupId: group.id,
          target: FIX.TARGET2,
          method: FIX.METHOD2,
          params: "params",
          editing: true,
          disabled: true
        }));

       [ command ] = Object.values( getGroup( group.id ).tests[ test.id ].commands );

       expect( command.target ).toBe( FIX.TARGET2 );
       expect( command.method ).toBe( FIX.METHOD2 );
       expect( command.params ).toBe( "params" );
       expect( command.editing ).toBe( true );
       expect( command.disabled ).toBe( true );
   });

   it( "removes a command", () => {
       let group = createGroup( FIX.GROUP1 ),
           test = createTest( FIX.TEST1, group.id ),
           c1 = createCommand( FIX.TARGET1, FIX.METHOD1, group.id , test.id ),
           c2 = createCommand( FIX.TARGET2, FIX.METHOD2, group.id , test.id );

      store.dispatch( actions.removeCommand({ id: c2.id, groupId:  group.id, testId: test.id }));
      expect( hasCommand( c1.id, group.id, test.id ) ).toBe( true );
      expect( hasCommand( c2.id, group.id, test.id ) ).toBe( false );
   });

   it( "clones a command", () => {
       let group = createGroup( FIX.GROUP1 ),
           test = createTest( FIX.TEST1, group.id ),
           command1 = createCommand( FIX.TARGET1, FIX.METHOD1, group.id , test.id ),
           command2 = createCommand( FIX.TARGET2, FIX.METHOD2, group.id , test.id );

       store.dispatch( actions.cloneCommand( command1, { groupId: group.id, testId: test.id }) );

       test = getGroup( group.id ).tests[ test.id ];
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

       group = getGroup( group.id );

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

   it( "clones a group", () => {
       let group1 = createGroup( FIX.GROUP1 ),
           test1 = createTest( FIX.TEST1, group1.id ),
           command11 = createCommand( FIX.TARGET1, FIX.METHOD1, group1.id , test1.id ),
           command12 = createCommand( FIX.TARGET2, FIX.METHOD2, group1.id , test1.id ),
           test2 = createTest( FIX.TEST2, group1.id ),
           command21 = createCommand( FIX.TARGET3, FIX.METHOD3, group1.id , test1.id ),
           group2 = createGroup( FIX.GROUP2 ),
           test3 = createTest( FIX.TEST3, group2.id ),
           command31 = createCommand( FIX.TARGET4, FIX.METHOD4, group2.id , test3.id );

       store.dispatch( actions.cloneGroup( group1 ) );
       let [ g1, g2, g3 ] = Object.values (store.getState().suite.groups );

       expect( g1.title ).toBe( FIX.GROUP1 );
       expect( g2.title ).toBe( FIX.GROUP1 );
       expect( g3.title ).toBe( FIX.GROUP2 );


       let [ t11 ] = Object.values( g1.tests );
       let [ t21 ] = Object.values( g2.tests );


       expect( t11.title ).toBe( t21.title );
       expect( t11.id ).not.toBe( t21.id );
       expect( t11.key ).not.toBe( t21.key );

//       // All the inline commands cloned
//       expect( Object.values( t11.commands ).length ).toBe( Object.values( t21.commands ).length );
//
//       let [ c111 ] = Object.values( t11.commands );
//       let [ c211 ] = Object.values( t21.commands );
//
//       expect( c111.title ).toBe( c211.title );
//       expect( c111.id ).not.toBe( c211.id );
//       expect( c111.key ).not.toBe( c211.key );


   });


  });

});
