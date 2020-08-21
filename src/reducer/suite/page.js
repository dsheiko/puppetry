import uniqid from "uniqid";
import actions from "action";
import update from "immutability-helper";
import {
  updateTagetsInSuite,
  isTargetNotUnique,
  normalizeComplexPayload
} from "reducer/helpers";

import { pageDefaultState } from "reducer/defaultState";


/**
 * @typedef {object} Position
 * @property {string} [before] - reference id to inject before
 * @property {string} [after] - reference id to inject after
 */

/**
 * @typedef {object} EntityRef
 * @property {string} id
 */

/**
 * @typedef {object} Entity - Contents of test
 */

/**
 * Contents of test
 * @typedef {object} Payload
 * @property {Entity} options
 * @property {string} [id] - when given it's used as id, otherwise a new id is generated
 * @property {Position} [position]
 */

export default ( ns = "Page" ) => ({

  /**
  * Add record
  * @param {object} state
  * @param {Payload} payload
  * @returns {object}
  */
  [ actions[ `add${ ns }` ] ]: ( state, { payload }) => {
    const { options, id } = normalizeComplexPayload( payload ),
          merge = {},
          gid = id || uniqid();

    if ( options.page && isTargetNotUnique( state, options ) ) {
      options.page += "_" + uniqid().toUpperCase();
    }

    merge[ gid ] = { ...pageDefaultState( gid ), ...options };

    return update( state, {
      modified: {
        $set: true
      },
      pages: {
        $merge: merge
      }
    });
  },

  /**
   * Insert record before/after
   * @param {object} state
   * @param {Payload} payload
   * @returns {object}
   */
  [ actions[ `insertAdjacent${ ns }` ] ]: ( state, { payload }) => {
    const { options, position, id } = normalizeComplexPayload( payload ),
          { pages }  = state;

    if ( options.page && isTargetNotUnique( state, options ) ) {
      options.page += "_" + uniqid().toUpperCase();
    }

    const entities = Object.values( pages ).reduce( ( carry, page ) => {
      if ( position.before && position.before === page.id ) {
        const gid = id || uniqid();
        carry[ gid ] = { ...pageDefaultState( gid ), ...options };
      }
      carry[ page.id ] = page;
      if ( position.after && position.after === page.id ) {
        const gid = id || uniqid();
        carry[ gid ] = { ...pageDefaultState( gid ), ...options };
      }
      return carry;
    }, {});

    return update( state, {
      modified: {
        $set: true
      },
      pages: {
        $set: entities
      }
    });
  },

  [ actions[ `clear${ ns }` ] ]: ( state ) => update( state, {
    modified: {
      $set: true
    },
    pages: {
      $set: {}
    }
  }),


  /**
    * Update record without saving
    * @param {object} state
    * @param {Entity} payload (EntityRef required)
    * @returns {object}
    */
  [ actions[ `set${ ns }` ] ]: ( state, { payload }) => {
    return update( state, {
      modified: {
        $set: true
      },
      pages: {
        $apply: ( ref ) => {
          const pages = { ...ref },
                id = payload.id;
          pages[ id ] = { ...pages[ id ], ...payload, key: id };
          return pages;
        }
      }
    });
  },

  /**
    * Update record
    * @param {object} state
    * @param {Entity} payload (EntityRef required)
    * @returns {object}
    */
  [ actions[ `update${ ns }` ] ]: ( state, { payload }) => {
    if ( isTargetNotUnique( state, payload ) ) {
      payload.page += "_" + uniqid().toUpperCase();
    }
    if ( typeof payload.selector === "string" ) {
      payload.selector = payload.selector.trim();
    }
    const newState = update( state, {
      modified: {
        $set: true
      },
      pages: {
        $apply: ( ref ) => {
          const pages = { ...ref },
                id = payload.id;
          pages[ id ] = { ...pages[ id ], ...payload, key: id };
          return pages;
        }
      }
    });

    return updateTagetsInSuite( state, newState, payload.id );
  },

  /**
   * Remove record
   * @param {object} state
   * @param {EntityRef} payload
   * @returns {object}
   */
  [ actions[ `remove${ ns }` ] ]: ( state, { payload }) => update( state, {
    modified: {
      $set: true
    },
    pages: {
      $unset:[ payload.id ]
    }
  })


});


