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

    [ actions.setProjectFiles ]: ( state, { payload }) => {
      if ( !payload ) {
        return state;
      }
      return update( state, {
        project: {
          files: {
            $set: [ ...payload ]
          }
        }        
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

    

    [ actions.setActiveAppTab ]: ( state, { payload }) => {
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

    [ actions.addAppTab ]: ( state, { payload }) => {
    
      if ( !payload ) {
        return state;
      }
      const panels = [ ...state.tabs.panels ];
      // Suites can be multiple on Editor, but others are singletons
      if ( payload.type !== "suite" ) {
        const match = panels.find( panel => panel.type === payload.type );
        if ( match ) {
          return update( state, {
            tabs: {   
                active: {
                  $set: match.id
                }
              }          
          });  
        }
      }
      panels.push({ id: payload.id, type: payload.type, data: payload.data });
      return update( state, {
        tabs: {          
            panels: {
              $set: panels
            },
            active: {
              $set: payload.id
            }
          }          
      });
    },

    [ actions.removeAppTab ]: ( state, { payload }) => {
      if ( !payload ) {
        return state;
      }
      const panels = state.tabs.panels.filter( item => item.id !== payload ),
            [ activePanel ] = panels;
      return update( state, {
        tabs: {          
            panels: {
              $set: panels
            },
            active: {
              $set: activePanel ? activePanel : null
            }
          }          
      });
    }

  },
  DEFAULT_STATE.app
);