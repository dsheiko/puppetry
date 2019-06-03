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
  ADD_SCOMMAND: ( options ) => validate( options, { ...I.ENTITY, ...I.COMMAND }),
  /**
    * @param {object} options = { title, editing }
    * @param {object} position = { "after": ID }
    * @returns {object}
    */
  INSERT_ADJACENT_SCOMMAND: ( options, position ) => ({
    position,
    options
  }),
  /**
    * @param {object} options = { testId, groupId, id, target, method, editing }
    * @returns {object}
    */
  UPDATE_SCOMMAND: ( options ) => validate( options, { ...I.ENTITY, ...I.COMMAND, ...I.UPDATE }),
  /**
    * @param {object} ref = { testId, groupId, id }
    * @returns {object}
    */
  REMOVE_SCOMMAND: ( ref ) => validate( ref, { ...I.UPDATE, ...I.COMMAND_REF })
});


function getScommandsFlat( groups ) {
  return Object.values( groups ).reduce( ( carry, group ) => {
    const commands = Object.values( group.tests ).reduce( ( carry, test ) => {
      return carry.concat( Object.values( test.commands ) );
    }, []);
    return carry.concat( commands );
  }, []);
}

actions.swapScommand = ( payload ) => async ( dispatch, getState ) => {
  const hideLoading = message.loading( "Moving record in progress..", 0 );
  try {
    const { sourceInx, targetInx, sourceId, targetId } = payload,
          commands = getScommandsFlat( getState().suite.groups ),
          sourceScommand = commands.find( command => command.id === sourceId ),
          targetScommand = commands.find( command => command.id === targetId ),
          pos = sourceInx >= targetInx ? "before" : "after",
          merge = {
            ...sourceScommand,
            testId: targetScommand.testId,
            groupId: targetScommand.groupId
          };

    dispatch( actions.removeScommand( sourceScommand ) );
    dispatch( actions.insertAdjacentScommand( merge, { [ pos ]: targetId } ) );

  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot swap command" );
  }
  hideLoading();

};

actions.pasteScommand = ( payload, dest ) => async ( dispatch ) => {
  try {
    const merged = { ...payload, testId: dest.testId, groupId: dest.groupId },
          position = { after: dest.id };
    dispatch(
      dest.hasOwnProperty( "id" )
        ? actions.insertAdjacentScommand( merged, position )
        : actions.addScommand( merged )
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
actions.cloneScommand = ( command, options = {}) => async ( dispatch, getState ) => {
  try {
    const groups = getState().suite.groups,
          source = groups[ command.groupId ].tests[ command.testId ].commands[ command.id ],
          merged = { ...source, ...options },
          position = { after: command.id };
    dispatch( actions.insertAdjacentScommand( merged, position ) );
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot clone command" );
  }

};


export default actions;