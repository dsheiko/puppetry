import { createActions } from "redux-actions";
import { validate } from "bycontract";
import * as I from "interface";
import { handleException } from "./helpers";
import uniqid from "uniqid";

const actions = createActions({
  CLEAR_VARIABLE: ( options ) => options,
  /**
    * @param {object} options = { variable, selector, editing }
    * @param {object} [id] - injected id for new entity
    * @returns {object}
    */
  ADD_VARIABLE: ( options, id = null ) => ({
    options: validate( options, { ...I.ENTITY, ...I.VARIABLE }),
    id: validate( id, I.ID_REF )
  }),
  /**
    * @param {object} options = { title, editing }
    * @param {object} position = { "after": ID }
    * @param {object} [id] - injected id for new entity
    * @returns {object}
    */
  INSERT_ADJACENT_VARIABLE: ( options, position, id = null ) => ({
    position,
    options,
    id
  }),
  /**
    * @param {object} options = { id, variable, selector, editing }
    * @returns {object}
    */
  UPDATE_VARIABLE: ( options ) => validate( options, { ...I.ENTITY, ...I.VARIABLE, ...I.UPDATE }),
  /**
    * @param {object} ref = { id }
    * @returns {object}
    */
  REMOVE_VARIABLE: ( ref ) => validate( ref, I.UPDATE )

});

/**
 * Reflect updated record on every env where it is missing
 * @param {object} payload
 */
actions.syncVariableStages = ( payload ) => async ( dispatch, getState ) => {
  try {
    const { variables, environments } = getState().project;
    environments
      .filter( env => env !== payload.env )
      .forEach( env => {
        const match = Object.values( variables )
          .find( v => v.env === env && v.name === payload.name );
        if ( match ) {
          return;
        }
        dispatch( actions.addVariable({ ...payload, env, id: undefined }) );
      });

  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot sync variable stages" );
  }

};


actions.swapVariable = ( payload ) => async ( dispatch, getState ) => {
  try {
    const { sourceInx, targetInx, sourceId, targetId } = payload,
          variable = getState().project.variables[ sourceId ],
          pos = sourceInx >= targetInx ? "before" : "after";

    dispatch( actions.removeVariable({ id: sourceId }) );
    dispatch( actions.insertAdjacentVariable( variable, { [ pos ]: targetId }) );
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot swap variable" );
  }
};


actions.pasteVariable = ( payload, dest ) => async ( dispatch ) => {
  try {
    const position = { after: dest.id };
    dispatch( actions.insertAdjacentVariable( payload, position ) );
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot paste variable" );
  }

};


/**
 *
 * @param {Object} group
 * @returns {Function}
 */
actions.cloneVariable = ( variable ) => async ( dispatch, getState ) => {
  try {
    const project = getState().project,
          source = project.variables[ variable.id ],
          id = uniqid(),
          merged = { ...source, id, key: id },
          position = { after: variable.id };

    dispatch( actions.insertAdjacentVariable( merged, position, id ) );
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot clone variable" );
  }

};

export default actions;