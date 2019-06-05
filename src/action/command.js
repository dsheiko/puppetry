import { createActions } from "redux-actions";
import { validate } from "bycontract";
import * as I from "interface";
import { handleException } from "./helpers";
import appActions from "./app";
import { message } from "antd";

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
  REMOVE_COMMAND: ( ref ) => validate( ref, { ...I.UPDATE, ...I.COMMAND_REF })
});


function getCommandsFlat( groups ) {
  return Object.values( groups ).reduce( ( carry, group ) => {
    const commands = Object.values( group.tests ).reduce( ( carry, test ) => {
      return carry.concat( Object.values( test.commands ) );
    }, []);
    return carry.concat( commands );
  }, []);
}

actions.updateCommandByRef = ( ref, failure ) => async ( dispatch, getState ) => {
  const commands = getCommandsFlat( getState().suite.groups ),
        parentCommand = commands.find( command => command.ref === ref );
  dispatch( actions.updateCommand({ ...parentCommand, failure }));
};

actions.swapCommand = ( payload ) => async ( dispatch, getState ) => {
  const hideLoading = message.loading( "Moving record in progress..", 0 );
  try {
    const { sourceInx, targetInx, sourceId, targetId } = payload,
          commands = getCommandsFlat( getState().suite.groups ),
          sourceCommand = commands.find( command => command.id === sourceId ),
          targetCommand = commands.find( command => command.id === targetId ),
          pos = sourceInx >= targetInx ? "before" : "after",
          merge = {
            ...sourceCommand,
            testId: targetCommand.testId,
            groupId: targetCommand.groupId
          };

    dispatch( actions.removeCommand( sourceCommand ) );
    dispatch( actions.insertAdjacentCommand( merge, { [ pos ]: targetId } ) );

  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot swap command" );
  }
  hideLoading();

};

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