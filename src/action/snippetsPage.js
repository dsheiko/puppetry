import { createActions } from "redux-actions";
import { validate } from "bycontract";
import * as I from "interface";
import { handleException } from "./helpers";
import uniqid from "uniqid";

const actions = createActions({
  CLEAR_SNIPPETS_PAGE: ( options ) => options,
  /**
    * @param {object} options = { target, selector, editing }
    * @param {object} [id] - injected id for new entity
    * @returns {object}
    */
  ADD_SNIPPETS_PAGE: ( options, id = null ) => ({
    options: validate( options, { ...I.ENTITY, ...I.PAGE }),
    id: validate( id, I.ID_REF )
  }),
  /**
    * @param {object} options = { title, editing }
    * @param {object} position = { "after": ID }
    * @param {object} [id] - injected id for new entity
    * @returns {object}
    */
  INSERT_ADJACENT_SNIPPETS_PAGE: ( options, position, id = null ) => ({
    position,
    options,
    id
  }),
  /**
    * @param {object} options = { id, target, selector, editing }
    * @returns {object}
    */
  SET_SNIPPETS_PAGE: ( options ) => validate( options, { ...I.ENTITY, ...I.PAGE, ...I.UPDATE }),
  /**
    * @param {object} options = { id, target, selector, editing }
    * @returns {object}
    */
  UPDATE_SNIPPETS_PAGE: ( options ) => validate( options, { ...I.ENTITY, ...I.PAGE, ...I.UPDATE }),
  /**
    * @param {object} ref = { id }
    * @returns {object}
    */
  REMOVE_SNIPPETS_PAGE: ( ref ) => validate( ref, I.UPDATE )

});


actions.swapSnippetsTarget = ( payload ) => async ( dispatch, getState ) => {
  try {
    const { sourceInx, targetInx, sourceId, targetId } = payload,
          target = getState().snippets.targets[ sourceId ],
          pos = sourceInx >= targetInx ? "before" : "after";

    dispatch( actions.removeSnippetsTarget({ id: sourceId }) );
    dispatch( actions.insertAdjacentSnippetsTarget( target, { [ pos ]: targetId }) );
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot swap target" );
  }
};


actions.pasteSnippetsTarget = ( payload, dest, uid ) => async ( dispatch ) => {
  try {
    const position = { after: dest.id };
    dispatch( actions.insertAdjacentSnippetsTarget( payload, position, uid ) );
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot paste target" );
  }

};


/**
 *
 * @param {Object} group
 * @returns {Function}
 */
actions.cloneSnippetsTarget = ( target ) => async ( dispatch, getState ) => {
  try {
    const snippets = getState().snippets,
          source = snippets.targets[ target.id ],
          id = uniqid(),
          merged = { ...source, id, key: id },
          position = { after: target.id };

    dispatch( actions.insertAdjacentSnippetsTarget( merged, position, id ) );
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot clone target" );
  }

};

export default actions;