import uniqid from "uniqid";
import { createActions } from "redux-actions";
import { validate } from "bycontract";
import * as I from "interface";
import { handleException } from "./helpers";
import { message } from "antd";

const actions = createActions({

  ADD_COMMAND: ( options, id = null ) => ({
    options: validate( options, { ...I.ENTITY, ...I.COMMAND }),
    id: validate( id, I.ID_REF )
  }),
  INSERT_ADJACENT_COMMAND: ( options, position, id = null ) => ({
    position,
    options,
    id
  }),
  UPDATE_COMMAND: ( options ) => validate( options, { ...I.ENTITY, ...I.COMMAND, ...I.UPDATE }),
  REMOVE_COMMAND: ( ref ) => validate( ref, { ...I.UPDATE, ...I.COMMAND_REF })
});


function getCommandsFlat( tests ) {
  return Object.values( tests ).reduce( ( carry, test ) => {
    return carry.concat( Object.values( test.commands ) );
  }, []);
}

actions.updateCommandByRef = ( ref, failure ) => async ( dispatch, getState ) => {
  const commands = getCommandsFlat( getState().suite.tests ),
        parentCommand = commands.find( command => command.ref === ref );
  dispatch( actions.updateCommand({ ...parentCommand, failure }) );
};

actions.swapCommand = ( payload ) => async ( dispatch, getState ) => {
  const hideLoading = message.loading( "Moving record in progress..", 0 );
  try {
    const { sourceInx, targetInx, sourceId, targetId } = payload,
          commands = getCommandsFlat( getState().suite.tests ),
          sourceCommand = commands.find( command => command.id === sourceId ),
          targetCommand = commands.find( command => command.id === targetId ),
          pos = sourceInx >= targetInx ? "before" : "after",
          merge = { ...sourceCommand, testId: targetCommand.testId };

    dispatch( actions.removeCommand( sourceCommand ) );
    dispatch( actions.insertAdjacentCommand( merge, { [ pos ]: targetId }) );

  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot swap command" );
  }
  hideLoading();

};

actions.pasteCommand = ( payload, dest, uid ) => async ( dispatch ) => {
  try {
    const id = uid || uniqid(),
          merged = { ...payload, testId: dest.testId },
          position = { after: dest.id };
    dispatch(
      dest.hasOwnProperty( "id" )
        ? actions.insertAdjacentCommand( merged, { ...position }, id )
        : actions.addCommand( merged, id )
    );
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot paste command" );
  }
};


actions.cloneCommand = ( command, options = {}) => async ( dispatch, getState ) => {
  try {
    const source = getState().suite.tests[ command.testId ].commands[ command.id ],
          merged = { ...source, ...options },
          position = { after: command.id };
    dispatch( actions.insertAdjacentCommand( merged, position ) );
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot clone command" );
  }

};

actions.resetCommandFailures = () => async ( dispatch, getState ) => {
  try {
    const { tests } = getState().suite;
    Object.values( tests ).forEach( ( test ) => {
      const matches = Object.values( test.commands ).filter( command => Boolean( command.failure ) );
      matches.forEach( ({ id, testId }) => dispatch(
        actions.updateCommand({ id, testId, failure: "" })
      ) );
    });
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot reset command failures" );
  }

};

export default actions;
