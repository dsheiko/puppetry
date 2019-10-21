import { createActions } from "redux-actions";
import { validate } from "bycontract";
import * as I from "interface";
import { handleException } from "./helpers";
import uniqid from "uniqid";
import testActions from "./test";
import commandActions from "./command";
import { message } from "antd";

const actions = createActions({
  /**
    * @param {object} options = { title, editing }
    * @param {object} [id] - injected id for new entity
    * @returns {object}
    */
  ADD_GROUP: ( options, id = null ) => ({
    options: validate( options, { ...I.ENTITY, ...I.GROUP }),
    id: validate( id, I.ID_REF )
  }),
  /**
    * @param {object} options = { title, editing }
    * @param {object} position = { "after": ID }
    * @param {object} [id] - injected id for new entity
    * @returns {object}
    */
  INSERT_ADJACENT_GROUP: ( options, position, id = null ) => ({
    position,
    options,
    id
  }),
  /**
    * @param {object} options = { id, title, editing }
    * @returns {object}
    */
  UPDATE_GROUP: ( options ) => validate( options, { ...I.ENTITY, ...I.GROUP, ...I.UPDATE }),

  /**
    * @param {object} ref = { groupId, id }
    * @returns {object}
    */
  REMOVE_GROUP: ( ref ) => validate( ref, { ...I.UPDATE }),


  SWAP_GROUP: ( options ) => validate( options, I.SWAP_BASE_OPTIONS )
});


actions.swapGroup = ( payload ) => async ( dispatch, getState ) => {
  const hideLoading = message.loading( "Moving record in progress..", 0 );
  try {
    const { sourceInx, targetInx, sourceId, targetId } = payload,
          groups = Object.values( getState().suite.groups ),
          sourceGroup = groups.find( group => group.id === sourceId ),
          pos = sourceInx >= targetInx ? "before" : "after",
          groupId = uniqid();

    dispatch( actions.removeGroup({ id: sourceGroup.id }) );
    dispatch( actions.insertAdjacentGroup( sourceGroup, { [ pos ]: targetId }, groupId ) );

    Object.values( sourceGroup.tests ).forEach( test => {
      const testId = uniqid();
      dispatch( testActions.addTest({ ...test, groupId }, testId ) );
      Object.values( test.commands ).forEach( command => {
        dispatch( commandActions.addCommand({ ...command, testId, groupId }) );
      });
    });

  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot swap group" );
  }
  hideLoading();

};

actions.pasteGroup = ( payload, dest, uid ) => async ( dispatch ) => {
  try {
    const groupId = uid || uniqid(),
          merged = { ...payload },
          position = { after: dest.id };

    dispatch(
      dest.hasOwnProperty( "id" )
        ? actions.insertAdjacentGroup( merged, position, groupId )
        : actions.addGroup( merged, groupId )
    );

    Object.values( payload.tests ).forEach( test => {
      const testId = uniqid();
      dispatch( testActions.addTest({ ...test, groupId: groupId }, testId ) );
      Object.values( test.commands ).forEach( command => {
        dispatch( commandActions.addCommand({ ...command, testId, groupId }) );
      });
    });
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot paste group" );
  }

};


/**
 * Clone command within the same root
 * @param {Object} group
 * @returns {Function}
 */
actions.cloneGroup = ( group ) => async ( dispatch, getState ) => {
  try {
    const suite = getState().suite,
          source = suite.groups[ group.id ],
          id = uniqid(),
          merged = { ...source, id, key: id },
          position = { after: group.id };

    dispatch( actions.insertAdjacentGroup( merged, position, id ) );
    Object.values( source.tests ).forEach( test => {
      dispatch( testActions.transferTest( test, { groupId: id }) );
    });
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot clone group" );
  }

};


export default actions;