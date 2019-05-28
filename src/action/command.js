import { createActions } from "redux-actions";
import { validate } from "bycontract";
import * as I from "interface";
import { handleException } from "./helpers";

const actions = createActions({
  /**
    * @param {object} options = { testId, groupId, target, method, editing }
    * @returns {object}
    */
  ADD_COMMAND: ( options ) => validate( options, { ...I.ENTITY, ...I.COMMAND }),
  /**
    * @param {object} options = { title, editing }
    * @param {object} position = { "after": ID }
    * @returns {object}
    */
  INSERT_ADJACENT_COMMAND: ( options, position ) => ({
    position,
    options
  }),
  /**
    * @param {object} options = { testId, groupId, id, target, method, editing }
    * @returns {object}
    */
  UPDATE_COMMAND: ( options ) => validate( options, { ...I.ENTITY, ...I.COMMAND, ...I.UPDATE }),
  /**
    * @param {object} ref = { testId, groupId, id }
    * @returns {object}
    */
  REMOVE_COMMAND: ( ref ) => validate( ref, { ...I.UPDATE, ...I.COMMAND_REF }),
  SWAP_COMMAND: ( options ) => validate( options, { ...I.SWAP_BASE_OPTIONS, ...I.COMMAND_REF })
});

actions.pasteCommand = ( payload, dest ) => async ( dispatch ) => {
  try {
    const merged = { ...payload, testId: dest.testId, groupId: dest.groupId },
          position = { after: dest.id };
    dispatch(
      dest.hasOwnProperty( "id" )
        ? actions.insertAdjacentCommand( merged, position )
        : actions.addCommand( merged )
    );
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot paste command" );
  }

};


/**
 * Clone command within the same test
 * @param {Object} command
 * @param {Object} [options] - e.g. { testId: "", groupId: "" }
 * @returns {Function}
 */
actions.cloneCommand = ( command, options = {}) => async ( dispatch, getState ) => {
  try {
    const groups = getState().suite.groups,
          source = groups[ command.groupId ].tests[ command.testId ].commands[ command.id ],
          merged = { ...source, ...options },
          position = { after: command.id };
    dispatch( actions.insertAdjacentCommand( merged, position ) );
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot clone command" );
  }

};

/**
 *
 * @returns {Function}
 */
actions.resetCommandFailures = () => async ( dispatch, getState ) => {
  try {
    const { groups } = getState().suite;
    Object.values( groups ).forEach( ( group ) => {
      Object.values( group.tests ).forEach( ( test ) => {
        const matches = Object.values( test.commands ).filter( command => Boolean( command.failure ) );
        matches.forEach( ({ id, testId, groupId }) => dispatch(
          actions.updateCommand({ id, testId, groupId, failure: "" })
        ) );
      });
    });
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot reset command failuries" );
  }

};

export default actions;