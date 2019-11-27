import { handleActions } from "redux-actions";
import actions from "../action";
import DEFAULT_STATE from "./defaultState";
import update from "immutability-helper";

export default handleActions(
  {

    [ actions.setApp ]: ( state, { payload }) => {
      if ( !payload ) {
        return state;
      }
      return update( state, {
        $merge: payload
      });
    },

    [ actions.setError ]: ( state, { payload }) => {
      const inject = { title: "Error", type: "error", ...payload };
      return update( state, {
        alert: {
          $set: inject
        }
      });
    },

    [ actions.setLightboxIndex ]: ( state, { payload }) => {
      return update( state, {
        lightbox: {
          index: {
            $set: payload
          }
        }
      });
    },

    [ actions.setLightboxImages ]: ( state, { payload }) => {
      if ( !payload ) {
        return state;
      }
      return update( state, {
        lightbox: {
          images: {
            $set: payload
          }
        }
      });
    },

    [ actions.cleanLightbox ]: ( state ) => {
      return update( state, {
        lightbox: {
          images: {
            $set: []
          }
        }
      });
    },

    [ actions.addAppTab ]: ( state, { payload }) => {
      if ( !payload ) {
        return state;
      }
      return update( state, {

        tabs: {
          available: {
            $merge: {
              [ payload ]: true
            }
          },
          active: {
            $set: payload
          }
        }
      });
    },

    [ actions.setAppTab ]: ( state, { payload }) => {
      if ( !payload ) {
        return state;
      }
      return update( state, {

        tabs: {
          active: {
            $set: payload
          }
        }
      });
    },

    [ actions.removeAppTab ]: ( state, { payload }) => {
      if ( !payload ) {
        return state;
      }
      const tmp = update( state, {
              tabs: {
                available: {
                  $merge: {
                    [ payload ]: false
                  }
                }
              }
            }),
            { available } = tmp.tabs,
            active = Object.keys( available )
              .filter( key => available[ key ])
              .pop();

      return update( tmp, {

        tabs: {
          active: {
            $set: active
          }
        }
      });
    }

  },
  DEFAULT_STATE.app
);