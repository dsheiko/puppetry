import uniqid from "uniqid";
import actions from "action";
import update from "immutability-helper";
import {
  isVariableNotUnique,
  normalizeComplexPayload
} from "reducer/helpers";

import { variableDefaultState } from "reducer/defaultState";


/**
 * @typedef {object} Position
 * @property {string} [before] - reference id to inject before
 * @property {string} [after] - reference id to inject after
 */

/**
 * @typedef {object} EntityRef
 * @property {string} id
 */

/**
 * @typedef {object} Entity - Contents of test
 */

/**
 * Contents of test
 * @typedef {object} Payload
 * @property {Entity} options
 * @property {string} [id] - when given it's used as id, otherwise a new id is generated
 * @property {Position} [position]
 */

export default {

  /**
  * Add record
  * @param {object} state
  * @param {Payload} payload
  * @returns {object}
  */
  [ actions.addVariable ]: ( state, { payload }) => {
    const { options, id } = normalizeComplexPayload( payload ),
          merge = {},
          gid = id || uniqid();

    if ( options.name && isVariableNotUnique( state, options ) ) {
      options.name += "_" + uniqid().toUpperCase();
    }
    merge[ gid ] = { ...variableDefaultState( gid ), ...options };

    return update( state, {
      variables: {
        $merge: merge
      }
    });
  },

  /**
   * Insert record before/after
   * @param {object} state
   * @param {Payload} payload
   * @returns {object}
   */
  [ actions.insertAdjacentVariable ]: ( state, { payload }) => {
    const { options, position, id } = normalizeComplexPayload( payload ),
          { variables }  = state;

    if ( options.name && isVariableNotUnique( state, options ) ) {
      options.name += "_" + uniqid().toUpperCase();
    }

    const entities = Object.values( variables ).reduce( ( carry, variable ) => {
            if ( position.before && position.before === variable.id ) {
              const gid = id || uniqid();
              carry[ gid ] = { ...variableDefaultState( gid ), ...options };
            }
            carry[ variable.id ] = variable;
            if ( position.after && position.after === variable.id ) {
              const gid = id || uniqid();
              carry[ gid ] = { ...variableDefaultState( gid ), ...options };
            }
            return carry;
          }, {});

    return update( state, {
      variables: {
        $set: entities
      }
    });
  },

  [ actions.clearVariable ]: ( state ) => update( state, {
    variables: {
      $set: {}
    }
  }),


  /**
    * Update record
    * @param {object} state
    * @param {Entity} payload (EntityRef required)
    * @returns {object}
    */
  [ actions.updateVariable ]: ( state, { payload }) => {
    if ( isVariableNotUnique( state, payload ) ) {
      payload.name += "_" + uniqid().toUpperCase();
    }
    return update( state, {

      variables: {
        $apply: ( ref ) => {
          const variables = { ...ref },
                id = payload.id;
          variables[ id ] = { ...variables[ id ], ...payload, key: id };
          return variables;
        }
      }
    });
  },

  /**
   * Remove record
   * @param {object} state
   * @param {EntityRef} payload
   * @returns {object}
   */
  [ actions.removeVariable ]: ( state, { payload }) => {
    const target = state.variables[ payload.id ];
    return update( state, {
      variables: {
        $set: Object.values( state.variables )
          .filter( v => v.name !== target.name )
          .reduce( ( carry, v ) => ({
            ...carry,
            [ v.id ]: v
          }), {})
      }
    });
  }


};


