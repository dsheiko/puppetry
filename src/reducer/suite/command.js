import uniqid from "uniqid";
import actions from "action";
import update from "immutability-helper";
import {
  updateTagetsInSuite,
  getTestsFlat,
  getCommandsFlat,
  transferTest,
  transferCommand,
  isTargetNotUnique,
  normalizeComplexPayload,
  normalizePayload
} from "reducer/helpers";

import DEFAULT_STATE, {
  groupDefaultState,
  testDefaultState,
  commandDefaultState,
  targetDefaultState
} from "reducer/defaultState";

/**
 * @typedef {object} Position
 * @property {string} [before] - reference id to inject before
 * @property {string} [after] - reference id to inject after
 */

/**
 * @typedef {object} EntityRef
 * @property {string} id
 * @property {string} groupId
 * @property {string} testId
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
    [ actions.addCommand ]: ( state, { payload }) => update( state, {

        groups: {
          [ payload.groupId ]: {
            tests: {
              [ payload.testId ]: {
                commands: {
                  $apply: ( ref ) => {
                    const commands = { ...ref },
                          id = uniqid(),
                          defaultState = commandDefaultState( id );
                    commands[ id ] = {
                      ...defaultState,
                      ...normalizePayload( payload )
                    };
                    return commands;
                  }
                }
              }
            }
          }
        }
      }),


    /**
     * Insert record before/after
     * @param {object} state
     * @param {Payload} payload
     * @returns {object}
     */
    [ actions.insertAdjacentCommand ]: ( state, { payload }) => {
      const { options, position } = normalizeComplexPayload( payload ),
            { commands }  = state.groups[ options.groupId ].tests[ options.testId ],

            entities = Object.values( commands ).reduce( ( carry, command ) => {
              if ( position.before && position.before === command.id ) {
                const id = uniqid();
                carry[ id ] = { ...commandDefaultState( id ), ...options };
              }
              carry[ command.id ] = command;
              if ( position.after && position.after === command.id ) {
                const id = uniqid();
                carry[ id ] = { ...commandDefaultState( id ), ...options };
              }
              return carry;
            }, {});


      return update( state, {

          groups: {
            [ options.groupId ]: {
              tests: {
                [ options.testId ]: {
                  commands: {
                    $set: entities
                  }
                }
              }
            }
          }
      });
    },


    /**
     * Update record
     * @param {object} state
     * @param {Entity} payload (EntityRef required)
     * @returns {object}
     */
    [ actions.updateCommand ]: ( state, { payload }) => update( state, {

        groups: {
          [ payload.groupId ]: {
            tests: {
              [ payload.testId ]: {
                commands: {
                  $apply: ( ref ) => {
                    const commands = { ...ref },
                          id = payload.id;
                    commands[ id ] = { ...commands[ id ], ...payload, key: id };
                    return commands;
                  }
                }
              }
            }
          }
        }
      }),

    /**
     * Remove record
     * @param {object} state
     * @param {EntityRef} payload
     * @returns {object}
     */
    [ actions.removeCommand ]: ( state, { payload }) => update( state, {

        groups: {
          [ payload.groupId ]: {
            tests: {
              [ payload.testId ]: {
                commands: {
                  $unset:[ payload.id ]
                }
              }
            }
          }
        }
      })


}


