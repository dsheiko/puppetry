import uniqid from "uniqid";
import { handleActions } from "redux-actions";
import actions from "../action/actions";
import update from "immutability-helper";
import { sortStrings, pipePush } from "service/utils";
import DEFAULT_STATE, {
  groupDefaultState,
  testDefaultState,
  commandDefaultState,
  targetDefaultState
} from "./defaultState";
import {
  updateTagetsInSuite,
  getTestsFlat,
  getCommandsFlat,
  transferTest,
  transferCommand,
  isTargetNotUnique,
  normalizeComplexPayload,
  normalizePayload
} from "./helpers";


export const reducer = handleActions(
  {

    [ actions.setSettings ]: ( state, { payload }) => {
      return update( state, {
        settings: {
          $set: payload
        }});
    },

    [ actions.addSettingsProject ]: ( state, { payload }) => {
      if ( !payload ) {
        return state;
      }
      //sort
      const projects =
        Object.entries( update( state.settings.projects, {
          $merge: { [ payload.dir ]: payload.name }
        }) )
        .sort(( a, b ) => sortStrings( a[ 1 ], b[ 1 ] ))
        .reduce(( carry, [ key, value ]) => {
          carry[ key ] = value;
          return carry;
        }, {} );

      return update( state, {
        settings: {
          projects: {
            $set: projects
          }
        }});
    },

    [ actions.removeSettingsProject ]: ( state, { payload }) => {
      if ( !payload ) {
        return state;
      }
      return update( state, {
        settings: {
          projects: {
            $unset: [ payload ]
          }
        }
      });
    },

    [ actions.setGit ]: ( state, { payload }) => {
      return update( state, {
        git: {
          $merge: payload
        }
      });
    },


    [ actions.setError ]: ( state, { payload }) => {
      const inject = { title: "Error", type: "error", ...payload };
      return update( state, {
        app: {
          alert: {
            $set: inject
          }
        }});
    },


    // Update after saving
    [ actions.setProject ]: ( state, { payload }) => {
      if ( !payload ) {
        return state;
      }
      return update( state, {
        project: {
          $merge: payload
        }});
    },

    [ actions.updateProjectPanes ]: ( state, { payload }) => {
      if ( !payload ) {
        return state;
      }
      return update( state, {
        project: {
          appPanels: {
            [ payload.panel ]: {
              panes: {
                $set: payload.panes
              }
            }
          }
        }});
    },

    [ actions.updateApp ]: ( state, { payload }) => {
      if ( !payload ) {
        return state;
      }
      return update( state, {
        app: {
          $merge: payload
        }});
    },

    [ actions.addAppTab ]: ( state, { payload }) => {
      if ( !payload ) {
        return state;
      }
      return update( state, {
        app: {
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
        }});
    },

    [ actions.setAppTab ]: ( state, { payload }) => {
      if ( !payload ) {
        return state;
      }
      return update( state, {
        app: {
          tabs: {
            active: {
              $set: payload
            }
          }
        }});
    },

    [ actions.removeAppTab ]: ( state, { payload }) => {
      if ( !payload ) {
        return state;
      }

      const tmp = update( state, {
              app: {
                tabs: {
                  available: {
                    $merge: {
                      [ payload ]: false
                    }
                  }
                }
              }}),

            { available } = tmp.app.tabs,
            active = Object.keys( available )
              .filter( key => available[ key ])
              .pop();

      return update( tmp, {
        app: {
          tabs: {
            active: {
              $set: active
            }
          }
        }});
    },

    [ actions.setSuite ]: ( state, { payload }) => update( state, {
      suite: {
        $merge: payload
      }}),

    [ actions.resetSuite ]: ( state, { payload }) => update( state, {
      suite: {
        $set: payload
      }}),

    [ actions.updateSuite ]: ( state, { payload }) => update( state, {
      project: {
        modified: {
          $set: true
        }
      },
      suite: {
        modified: {
          $set: true
        },
        $merge: payload
      }}),

    [ actions.addTarget ]: ( state, { payload }) => {
      const { options, id } = normalizeComplexPayload( payload ),
            merge = {},
            gid = id || uniqid();

      if ( options.target && isTargetNotUnique( state, options ) ) {
        options.target += "_" + uniqid().toUpperCase();
      }

      merge[ gid ] = { ...targetDefaultState( gid ), ...options };

      return update( state, {
        suite: {
          targets: {
            $merge: merge
          }
        }});
    },

    // insert after/before
    // payload{ options, position }
    [ actions.insertAdjacentTarget ]: ( state, { payload }) => {
      const { options, position, id } = normalizeComplexPayload( payload ),
            { targets }  = state.suite;

      if ( options.target && isTargetNotUnique( state, options ) ) {
        options.target += "_" + uniqid().toUpperCase();
      }

      const entities = Object.values( targets ).reduce( ( carry, target ) => {
        if ( position.before && position.before === target.id ) {
          const gid = id || uniqid();
          carry[ gid ] = { ...targetDefaultState( gid ), ...options };
        }
        carry[ target.id ] = target;
        if ( position.after && position.after === target.id ) {
          const gid = id || uniqid();
          carry[ gid ] = { ...targetDefaultState( gid ), ...options };
        }
        return carry;
      }, {});

      return update( state, {
        suite: {
          targets: {
            $set: entities
          }
        }
      });
    },

    [ actions.clearTarget ]: ( state ) => update( state, {
      suite: {
        targets: {
          $set: {}
        }
      }}),

    /**
    * Payload:
    *  - sourceInx (0..N)
    *  - targetInx (0..N)
    *  - sourceId
    *  - targetId
    */
    [ actions.swapTarget ]: ( state, { payload }) => {
      const srcArr = Object.values( state.suite.targets ),
            source = { ...srcArr[ payload.sourceInx ] },
            resArr = update( srcArr, {
              $splice: [[ payload.sourceInx, 1 ], [ payload.targetInx, 0, source ]]
            });

      return update( state, {
        suite: {
          targets: {
            $set: resArr.reduce( ( carry, item ) => {
              carry[ item.id ] = item;
              return carry;
            }, {})
          }
        }
      });
    },

    [ actions.updateTarget ]: ( state, { payload }) => {
      if ( isTargetNotUnique( state, payload ) ) {
        payload.target += "_" + uniqid().toUpperCase();
      }
      const newState = update( state, {
        suite: {
          targets: {
            $apply: ( ref ) => {
              const targets = { ...ref },
                    id = payload.id;
              targets[ id ] = { ...targets[ id ], ...payload, key: id };
              return targets;
            }
          }
        }});

      return updateTagetsInSuite( state, newState, payload.id );
    },

    [ actions.removeTarget ]: ( state, { payload }) => update( state, {
      suite: {
        targets: {
          $unset:[ payload.id ]
        }
      }}),

    [ actions.addGroup ]: ( state, { payload }) => {
      const { options, id } = normalizeComplexPayload( payload ),
            merge = {},
            gid = id || uniqid();
      merge[ gid ] = { ...groupDefaultState( gid ), ...options, tests: {}};

      return update( state, {
        suite: {
          groups: {
            $merge: merge
          }
        }
      });
    },

    // insert after/before
    // payload{ options, position }
    [ actions.insertAdjacentGroup ]: ( state, { payload }) => {
      const { options, position, id } = normalizeComplexPayload( payload ),
            { groups }  = state.suite,

            entities = Object.values( groups ).reduce( ( carry, group ) => {
              if ( position.before && position.before === group.id ) {
                const gid = id || uniqid();
                carry[ gid ] = { ...groupDefaultState( gid ), ...options, tests: {}};
              }
              carry[ group.id ] = group;
              if ( position.after && position.after === group.id ) {
                const gid = id || uniqid();
                carry[ gid ] = { ...groupDefaultState( gid ), ...options, tests: {}};
              }
              return carry;
            }, {});

      return update( state, {
        suite: {
          groups: {
            $set: entities
          }
        }
      });
    },

    [ actions.swapGroup ]: ( state, { payload }) => {
      const srcArr = Object.values( state.suite.groups ),
            source = { ...srcArr[ payload.sourceInx ] },
            resArr = update( srcArr, {
              $splice: [[ payload.sourceInx, 1 ], [ payload.targetInx, 0, source ]]
            });

      return update( state, {
        suite: {
          groups: {
            $set: resArr.reduce( ( carry, item ) => {
              carry[ item.id ] = item;
              return carry;
            }, {})
          }
        }});
    },

    [ actions.updateGroup ]: ( state, { payload }) => {

      return update( state, {
        suite: {
          groups: {
            $apply: ( ref ) => {
              const groups = { ...ref },
                    id = payload.id;

              groups[ id ] = { ...groups[ id ], ...payload, id, key: id };
              return groups;
            }
          }
        }});
    },

    [ actions.removeGroup ]: ( state, { payload }) => update( state, {
      suite: {
        groups: {
          $unset:[ payload.id ]
        }
      }}),

    [ actions.addTest ]: ( state, { payload }) => {
      const { options, id } = normalizeComplexPayload( payload ),
            merge = {},
            gid = id || uniqid();

      merge[ gid ] = { ...testDefaultState( gid ), ...options, commands: {}};

      return update( state, {
        suite: {
          groups: {
            [ options.groupId ]: {
              tests: {
                $merge: merge
              }
            }
          }
        }
      });
    },

    // insert after/before
    // payload{ options, position }
    [ actions.insertAdjacentTest ]: ( state, { payload }) => {
      const { options, position, id } = normalizeComplexPayload( payload ),
            { tests }  = state.suite.groups[ options.groupId ],

            entities = Object.values( tests ).reduce( ( carry, test ) => {
              if ( position.before && position.before === test.id ) {
                const gid = id || uniqid();
                carry[ gid ] = { ...testDefaultState( gid ), ...options, commands: {}};
              }
              carry[ test.id ] = test;
              if ( position.after && position.after === test.id ) {
                const gid = id || uniqid();
                carry[ gid ] = { ...testDefaultState( gid ), ...options, commands: {}};
              }
              return carry;
            }, {});

      return update( state, {
        suite: {
          groups: {
            [ options.groupId ]: {
              tests: {
                $set: entities
              }
            }
          }
        }
      });
    },

    [ actions.swapTest ]: ( state, { payload }) => {
      const destGroupTests = Object.values( state.suite.groups[ payload.groupId ].tests ),
            sourceTest = { ...destGroupTests[ payload.sourceInx ] },
            resArr = update( destGroupTests, {
              $splice: [[ payload.sourceInx, 1 ], [ payload.targetInx, 0, sourceTest ]]
            });

      // Moving between groups
      if ( !destGroupTests.find( test => test.id === payload.sourceId ) ) {
        const tests = getTestsFlat( state.suite.groups ),
              srcTest = tests.find( test => test.id  === payload.sourceId ),
              targetTest = tests.find( test => test.id  === payload.targetId );
        return transferTest( state, srcTest, targetTest );
      }

      return update( state, {
        suite: {
          groups: {
            [ payload.groupId ]: {
              tests: {
                $set: resArr.reduce( ( carry, item ) => {
                  carry[ item.id ] = item;
                  return carry;
                }, {})
              }
            }
          }
        }});
    },

    [ actions.updateTest ]: ( state, { payload }) => update( state, {
      suite: {
        groups: {
          [ payload.groupId ]: {
            tests: {
              $apply: ( ref ) => {
                const tests = { ...ref },
                      id = payload.id;
                tests[ id ] = { ...tests[ id ], ...payload, id, key: id };
                return tests;
              }
            }
          }
        }
      }}),

    [ actions.removeTest ]: ( state, { payload }) => update( state, {
      suite: {
        groups: {
          [ payload.groupId ]: {
            tests: {
              $unset:[ payload.id ]
            }
          }
        }
      }}),

    [ actions.addCommand ]: ( state, { payload }) => update( state, {
      suite: {
        groups: {
          [ payload.groupId ]: {
            tests: {
              [ payload.testId ]: {
                commands: {
                  $apply: ( ref ) => {
                    const commands = { ...ref },
                          id = uniqid(),
                          defaultState = commandDefaultState( id );
                    commands[ id ] = {
                      ...defaultState,
                      ...normalizePayload( payload )
                    };
                    return commands;
                  }
                }
              }
            }
          }
        }
      }}),


    // insert after/before
    // payload{ options, position }
    [ actions.insertAdjacentCommand ]: ( state, { payload }) => {
      const { options, position } = normalizeComplexPayload( payload ),
            { commands }  = state.suite.groups[ options.groupId ].tests[ options.testId ],

            entities = Object.values( commands ).reduce( ( carry, command ) => {
              if ( position.before && position.before === command.id ) {
                const id = uniqid();
                carry[ id ] = { ...commandDefaultState( id ), ...options };
              }
              carry[ command.id ] = command;
              if ( position.after && position.after === command.id ) {
                const id = uniqid();
                carry[ id ] = { ...commandDefaultState( id ), ...options };
              }
              return carry;
            }, {});


      return update( state, {
        suite: {
          groups: {
            [ options.groupId ]: {
              tests: {
                [ options.testId ]: {
                  commands: {
                    $set: entities
                  }
                }
              }
            }
          }
        }
      });
    },

    [ actions.swapCommand ]: ( state, { payload }) => {
      const srcArr = Object.values( state.suite.groups[ payload.groupId ].tests[ payload.testId ].commands ),
            source = { ...srcArr[ payload.sourceInx ] },
            resArr = update( srcArr, {
              $splice: [[ payload.sourceInx, 1 ], [ payload.targetInx, 0, source ]]
            });


      // Moving between tests/groups
      if ( !srcArr.find( command => command.id === payload.sourceId ) ) {
        const commands = getCommandsFlat( state.suite.groups ),
              sourceCommand = commands.find( command => command.id  === payload.sourceId ),
              targetCommand = commands.find( command => command.id  === payload.targetId );
        return transferCommand( state, sourceCommand, targetCommand );
      }

      return update( state, {
        suite: {
          groups: {
            [ payload.groupId ]: {
              tests: {
                [ payload.testId ]: {
                  commands: {
                    $set: resArr.reduce( ( carry, item ) => {
                      carry[ item.id ] = item;
                      return carry;
                    }, {})
                  }
                }
              }
            }
          }
        }});
    },

    [ actions.updateCommand ]: ( state, { payload }) => update( state, {
      suite: {
        groups: {
          [ payload.groupId ]: {
            tests: {
              [ payload.testId ]: {
                commands: {
                  $apply: ( ref ) => {
                    const commands = { ...ref },
                          id = payload.id;
                    commands[ id ] = { ...commands[ id ], ...payload, key: id };
                    return commands;
                  }
                }
              }
            }
          }
        }
      }}),

    [ actions.removeCommand ]: ( state, { payload }) => update( state, {
      suite: {
        groups: {
          [ payload.groupId ]: {
            tests: {
              [ payload.testId ]: {
                commands: {
                  $unset:[ payload.id ]
                }
              }
            }
          }
        }
      }})


  },
  DEFAULT_STATE
);