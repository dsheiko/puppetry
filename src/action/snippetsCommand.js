import uniqid from "uniqid";
import { createActions } from "redux-actions";
import { validate } from "bycontract";
import * as I from "interface";
import { handleException } from "./helpers";
import { message } from "antd";

const actions = createActions({

  /**
    * @param {object} options = { target, selector, editing }
    * @param {object} [id] - injected id for new entity
    * @returns {object}
    */
  ADD_SNIPPETS_COMMAND: ( options, id = null ) => ({
    options: validate( options, { ...I.ENTITY, ...I.COMMAND }),
    id: validate( id, I.ID_REF )
  }),
  /**
    * @param {object} options = { title, editing }
    * @param {object} position = { "after": ID }
    * @param {object} [id] - injected id for new entity
    * @returns {object}
    */
  INSERT_ADJACENT_SNIPPETS_COMMAND: ( options, position, id = null ) => ({
    position,
    options,
    id
  }),
  /**
    * @param {object} options = { testId, groupId, id, target, method, editing }
    * @returns {object}
    */
  UPDATE_SNIPPETS_COMMAND: ( options ) => validate( options, { ...I.ENTITY, ...I.COMMAND, ...I.UPDATE }),
  /**
    * @param {object} ref = { testId, groupId, id }
    * @returns {object}
    */
  REMOVE_SNIPPETS_COMMAND: ( ref ) => validate( ref, { ...I.UPDATE, ...I.COMMAND_REF })
});


function getCommandsFlat( groups ) {
  return Object.values( groups ).reduce( ( carry, group ) => {
    const commands = Object.values( group.tests ).reduce( ( carry, test ) => {
      return carry.concat( Object.values( test.commands ) );
    }, []);
    return carry.concat( commands );
  }, []);
}

//actions.updateCommandByRef = ( ref, failure ) => async ( dispatch, getState ) => {
//  const commands = getCommandsFlat( getState().snippets.groups ),
//        parentCommand = commands.find( command => command.ref === ref );
//  dispatch( actions.updateCommand({ ...parentCommand, failure }) );
//};

actions.swapSnippetsCommand = ( payload ) => async ( dispatch, getState ) => {
  const hideLoading = message.loading( "Moving record in progress..", 0 );
  try {
    const { sourceInx, targetInx, sourceId, targetId } = payload,
          commands = getCommandsFlat( getState().snippets.groups ),
          sourceCommand = commands.find( command => command.id === sourceId ),
          targetCommand = commands.find( command => command.id === targetId ),
          pos = sourceInx >= targetInx ? "before" : "after",
          merge = {
            ...sourceCommand,
            testId: targetCommand.testId,
            groupId: targetCommand.groupId
          };

    dispatch( actions.removeSnippetsCommand( sourceCommand ) );
    dispatch( actions.insertAdjacentSnippetsCommand( merge, { [ pos ]: targetId }) );

  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot swap command" );
  }
  hideLoading();

};

actions.pasteSnippetsCommand = ( payload, dest, uid ) => async ( dispatch ) => {
  try {
    const id = uid || uniqid(),
          merged = { ...payload, testId: dest.testId, groupId: dest.groupId },
          position = { after: dest.id };
    dispatch(
      dest.hasOwnProperty( "id" )
        ? actions.insertAdjacentSnippetsCommand( merged, { ...position }, id )
        : actions.addSnippetsCommand( merged, id )
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
actions.cloneSnippetsCommand = ( command, options = {}) => async ( dispatch, getState ) => {
  try {
    const groups = getState().snippets.groups,
          source = groups[ command.groupId ].tests[ command.testId ].commands[ command.id ],
          merged = { ...source, ...options },
          position = { after: command.id };
    dispatch( actions.insertAdjacentSnippetsCommand( merged, position ) );
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot clone command" );
  }

};

/**
 *
 * @returns {Function}
 */
actions.resetSnippetsCommandFailures = () => async ( dispatch, getState ) => {
  try {
    const { groups } = getState().snippets;
    Object.values( groups ).forEach( ( group ) => {
      Object.values( group.tests ).forEach( ( test ) => {
        const matches = Object.values( test.commands ).filter( command => Boolean( command.failure ) );
        matches.forEach( ({ id, testId, groupId }) => dispatch(
          actions.updateSnippetsCommand({ id, testId, groupId, failure: "" })
        ) );
      });
    });
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot reset command failuries" );
  }

};

export default actions;