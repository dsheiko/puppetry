import uniqid from "uniqid";
import actions from "store/action";
import update from "immutability-helper";
import {
  normalizeComplexPayload
} from "store/reducer/helpers";

import  { testDefaultState } from "store/reducer/defaultState";

export default {

  [ actions.addTest ]: ( state, { payload }) => {
    const { options, id } = normalizeComplexPayload( payload ),
          merge = {},
          tid = id || uniqid();

    merge[ tid ] = { ...testDefaultState( tid ), ...options, commands: {}};

    return update( state, {
      modified: {
        $set: true
      },
      tests: {
        $merge: merge
      }
    });
  },

  [ actions.insertAdjacentTest ]: ( state, { payload }) => {
    const { options, position, id } = normalizeComplexPayload( payload ),
          { tests } = state,

          entities = Object.values( tests ).reduce( ( carry, test ) => {
            if ( position.before && position.before === test.id ) {
              const tid = id || uniqid();
              carry[ tid ] = { ...testDefaultState( tid ), ...options, commands: {}};
            }
            carry[ test.id ] = test;
            if ( position.after && position.after === test.id ) {
              const tid = id || uniqid();
              carry[ tid ] = { ...testDefaultState( tid ), ...options, commands: {}};
            }
            return carry;
          }, {});

    return update( state, {
      modified: {
        $set: true
      },
      tests: {
        $set: entities
      }
    });
  },

  [ actions.updateTest ]: ( state, { payload }) => update( state, {
    modified: {
      $set: true
    },
    tests: {
      $apply: ( ref ) => {
        const tests = { ...ref },
              id = payload.id;
        tests[ id ] = { ...tests[ id ], ...payload, id, key: id };
        if ( !tests[ id ].hasOwnProperty( "commands" ) ) {
          tests[ id ].commands = {};
        }
        return tests;
      }
    }
  }),

  [ actions.removeTest ]: ( state, { payload }) => update( state, {
    modified: {
      $set: true
    },
    tests: {
      $unset:[ payload.id ]
    }
  })

};
