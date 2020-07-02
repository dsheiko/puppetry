import { createActions } from "redux-actions";
import { validate } from "bycontract";
import * as I from "interface";
import { handleException } from "./helpers";
import uniqid from "uniqid";
import commandActions from "./snippetsCommand";
import { message } from "antd";
import { SNIPPETS_GROUP_ID } from "constant";

const actions = createActions({
  /**
    * @param {object} options = { groupId, title, editing }
    * @param {object} [id] - injected id for new entity
    * @returns {object}
    */
  ADD_SNIPPETS_TEST: ( options, id = null ) =>  {
    options.groupId = SNIPPETS_GROUP_ID;
    return {
      options: validate( options, { ...I.ENTITY, ...I.TEST }),
      id: validate( id, I.ID_REF )
    };
  },
  /**
    * @param {object} options = { title, editing }
    * @param {object} position = { "after": ID }
    * @param {object} [id] - injected id for new entity
    * @returns {object}
    */
  INSERT_ADJACENT_SNIPPETS_TEST: ( options, position, id = null ) => {
    options.groupId = SNIPPETS_GROUP_ID;
    return {
      position,
      options,
      id
    };
  },
  /**
    * @param {object} options = { groupId, id, title, editing }
    * @returns {object}
    */
  UPDATE_SNIPPETS_TEST: ( options ) => {
    options.groupId = SNIPPETS_GROUP_ID;
    return validate( options, { ...I.ENTITY, ...I.TEST, ...I.UPDATE });
  },
  /**
    * @param {object} ref = { groupId, id }
    * @returns {object}
    */
  REMOVE_SNIPPETS_TEST: ( ref ) => ({ ...ref, groupId: SNIPPETS_GROUP_ID })

});


function getTestsFlat( groups ) {
  return Object.values( groups ).reduce( ( carry, group ) => {
    return carry.concat( Object.values( group.tests ) );
  }, []);
}

actions.swapSnippetsTest = ( payload ) => async ( dispatch, getState ) => {
  const hideLoading = message.loading( "Moving record in progress..", 0 );
  try {
    const { sourceInx, targetInx, sourceId, targetId } = payload,
          tests = getTestsFlat( getState().snippets.groups ),
          sourceTest = tests.find( test => test.id === sourceId ),
          targetTest = tests.find( test => test.id === targetId ),
          pos = sourceInx >= targetInx ? "before" : "after",
          id = uniqid(),
          merged = { ...sourceTest, groupId: targetTest.groupId };

    dispatch( actions.removeSnippetsTest( sourceTest ) );
    dispatch( actions.insertAdjacentSnippetsTest( merged, { [ pos ]: targetId }, id ) );

    Object.values( sourceTest.commands ).forEach( command => {
      dispatch( commandActions.addSnippetsCommand({
        ...command,
        testId: id,
        groupId: targetTest.groupId
      }) );
    });

  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot swap test" );
  }
  hideLoading();

};

/**
 * @param {Object} payload - clipboard DTO
 * @param {GroupEntity} dest
 * @param {String} [uid]
 */
actions.pasteSnippetsTest = ( payload, dest, uid ) => async ( dispatch ) => {
  try {
    const id = uid || uniqid(),
          merged = { ...payload, groupId: dest.groupId },
          position = { after: dest.id };

    dispatch(
      dest.hasOwnProperty( "id" )
        ? actions.insertAdjacentSnippetsTest( merged, position, id )
        : actions.addSnippetsTest( merged, id )
    );
    Object.values( payload.commands ).forEach( command => {
      dispatch( commandActions.addSnippetsCommand({ ...command, testId: id, groupId: merged.groupId }) );
    });
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot paste test" );
  }

};


/**
 * Clone test within the same group
 * @param {Object} test
 * @param {Object} [options] - e.g. { groupId: "" }
 * @returns {Function}
 */
actions.cloneSnippetsTest = ( test, options = {}) => async ( dispatch, getState ) => {
  try {
    test.groupId = SNIPPETS_GROUP_ID;
    const groups = getState().snippets.groups,
          source = groups[ test.groupId ].tests[ test.id ],
          id = uniqid(),
          merged = { ...source, ...options },
          position = { after: test.id };
    dispatch( actions.insertAdjacentSnippetsTest( merged, position, id ) );
    Object.values( source.commands ).forEach( command => {
      dispatch( commandActions.addSnippetsCommand({ ...command, testId: id, groupId: merged.groupId }) );
    });
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot clone test" );
  }

};


/**
 * @private meant to be used only by cloneGroup
 * @param {Object} test
 * @param {Object} [options] - e.g. { groupId: "" }
 * @returns {Function}
 */
actions.transferSnippetsTest = ( test, options = {}) => async ( dispatch, getState ) => {
  try {
    const groups = getState().snippets.groups,
          source = groups[ test.groupId ].tests[ test.id ],
          id = uniqid(),
          merged = { ...source, ...options };

    dispatch( actions.addSnippetsTest( merged, id ) );

    Object.values( source.commands ).forEach( command => {
      dispatch( commandActions.addSnippetsCommand({ ...command, testId: id, groupId: options.groupId }) );
    });
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot transfer test" );
  }

};


export default actions;