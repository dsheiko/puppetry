import { createActions } from "redux-actions";
import { validate } from "bycontract";
import * as I from "types";
import { handleException } from "./helpers";
import uniqid from "uniqid";
import commandActions from "./command";
import { message } from "antd";

const actions = createActions({
  ADD_TEST: ( options, id = null ) =>  ({
    options: validate( options, { ...I.ENTITY, ...I.TEST }),
    id: validate( id, I.ID_REF )
  }),
  INSERT_ADJACENT_TEST: ( options, position, id = null ) => ({
    position,
    options,
    id
  }),
  UPDATE_TEST: ( options ) => validate( options, { ...I.ENTITY, ...I.TEST, ...I.UPDATE }),
  REMOVE_TEST: ( ref ) => validate( ref, { ...I.UPDATE, ...I.TEST_REF })
});


actions.swapTest = ( payload ) => async ( dispatch, getState ) => {
  const hideLoading = message.loading( "Moving record in progress..", 0 );
  try {
    const { sourceInx, targetInx, sourceId, targetId } = payload,
          { tests } = getState().suite,
          sourceTest = tests[ sourceId ],
          pos = sourceInx >= targetInx ? "before" : "after",
          id = uniqid();

    dispatch( actions.removeTest( sourceTest ) );
    dispatch( actions.insertAdjacentTest( sourceTest, { [ pos ]: targetId }, id ) );

    Object.values( sourceTest.commands ).forEach( command => {
      dispatch( commandActions.addCommand({ ...command, testId: id }) );
    });

  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot swap test" );
  }
  hideLoading();

};

actions.pasteTest = ( payload, dest, uid ) => async ( dispatch ) => {
  try {
    const id = uid || uniqid(),
          position = { after: dest.id };

    dispatch(
      dest.hasOwnProperty( "id" )
        ? actions.insertAdjacentTest( payload, position, id )
        : actions.addTest( payload, id )
    );
    Object.values( payload.commands ).forEach( command => {
      dispatch( commandActions.addCommand({ ...command, testId: id }) );
    });
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot paste test" );
  }

};


actions.cloneTest = ( test, options = {}) => async ( dispatch, getState ) => {
  try {
    const source = getState().suite.tests[ test.id ],
          id = uniqid(),
          merged = { ...source, ...options },
          position = { after: test.id };
    dispatch( actions.insertAdjacentTest( merged, position, id ) );
    Object.values( source.commands ).forEach( command => {
      dispatch( commandActions.addCommand({ ...command, testId: id }) );
    });
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot clone test" );
  }

};


export default actions;
