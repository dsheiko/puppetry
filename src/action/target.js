import { createActions } from "redux-actions";
import { validate } from "bycontract";
import * as I from "interface";
import { handleException } from "./helpers";
import uniqid from "uniqid";

const actions = createActions({
  CLEAR_TARGET: ( options ) => options,
  /**
    * @param {object} options = { target, selector, editing }
    * @param {object} [id] - injected id for new entity
    * @returns {object}
    */
  ADD_TARGET: ( options, id = null ) => ({
    options: validate( options, { ...I.ENTITY, ...I.TARGET }),
    id: validate( id, I.ID_REF )
  }),
  /**
    * @param {object} options = { title, editing }
    * @param {object} position = { "after": ID }
    * @param {object} [id] - injected id for new entity
    * @returns {object}
    */
  INSERT_ADJACENT_TARGET: ( options, position, id = null ) => ({
    position,
    options,
    id
  }),
  /**
    * @param {object} options = { id, target, selector, editing }
    * @returns {object}
    */
  SET_TARGET: ( options ) => validate( options, { ...I.ENTITY, ...I.TARGET, ...I.UPDATE }),
  /**
    * @param {object} options = { id, target, selector, editing }
    * @returns {object}
    */
  UPDATE_TARGET: ( options ) => validate( options, { ...I.ENTITY, ...I.TARGET, ...I.UPDATE }),
  /**
    * @param {object} ref = { id }
    * @returns {object}
    */
  REMOVE_TARGET: ( ref ) => validate( ref, I.UPDATE )

});


actions.swapTarget = ( payload ) => async ( dispatch, getState ) => {
  try {
    const { sourceInx, targetInx, sourceId, targetId } = payload,
          target = getState().suite.targets[ sourceId ],
          pos = sourceInx >= targetInx ? "before" : "after";

    dispatch( actions.removeTarget({ id: sourceId }) );
    dispatch( actions.insertAdjacentTarget( target, { [ pos ]: targetId }) );
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot swap target" );
  }
};


actions.pasteTarget = ( payload, dest, uid ) => async ( dispatch ) => {
  try {
    const position = { after: dest.id };
    dispatch( actions.insertAdjacentTarget( payload, position, uid ) );
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot paste target" );
  }

};


/**
 *
 * @param {Object} group
 * @returns {Function}
 */
actions.cloneTarget = ( target ) => async ( dispatch, getState ) => {
  try {
    const suite = getState().suite,
          source = suite.targets[ target.id ],
          id = uniqid(),
          merged = { ...source, id, key: id },
          position = { after: target.id };

    dispatch( actions.insertAdjacentTarget( merged, position, id ) );
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot clone target" );
  }

};

export default actions;