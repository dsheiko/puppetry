import uniqid from "uniqid";
import { handleActions } from "redux-actions";
import actions from "../action/actions";
import update from "immutability-helper";
import DEFAULT_STATE from "./defaultState";
import { getTestsFlat, getCommandsFlat, transferTest, transferCommand } from "./helpers";


export const reducer = handleActions(
  {

    [ actions.setSettings ]: ( state, { payload }) => {
      return update( state, {
        settings: {
          $set: payload
        }});
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

    [ actions.addTarget ]: ( state, { payload }) => update( state, {
      suite: {
        targets: {
          $apply: ( ref ) => {
            const targets = { ...ref },
                  id = uniqid(),
                  defaultState = {
                    editing: false,
                    id,
                    key: id,
                    target: "",
                    selector: ""
                  };
            targets[ id ] = { ...defaultState, ...payload };
            return targets;
          }
        }
      }}),

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
      return update( state, {
        suite: {
          targets: {
            $apply: ( ref ) => {
              const targets = { ...ref },
                    id = payload.id;
              targets[ id ] = { ...targets[ id ], ...payload };
              return targets;
            }
          }
        }});
    },

    [ actions.removeTarget ]: ( state, { payload }) => update( state, {
      suite: {
        targets: {
          $unset:[ payload.id ]
        }
      }}),

    [ actions.addGroup ]: ( state, { payload }) => update( state, {
      suite: {
        groups: {
          $apply: ( ref ) => {
            const groups = { ...ref },
                  id = uniqid(),
                  defaultState = {
                    editing: false,
                    id,
                    key: id,
                    title: "",
                    tests: {}
                  };
            groups[ id ] = { ...defaultState, ...payload };
            return groups;
          }
        }
      }}),

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

              groups[ id ] = { ...groups[ id ], ...payload, id };
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

    [ actions.addTest ]: ( state, { payload }) => update( state, {
      suite: {
        groups: {
          [ payload.groupId ]: {
            tests: {
              $apply: ( ref ) => {
                const tests = { ...ref },
                      id = uniqid(),
                      defaultState = {
                        editing: false,
                        id,
                        key: id,
                        title: "",
                        commands: {}
                      };
                tests[ id ] = { ...defaultState, ...payload };
                return tests;
              }
            }
          }
        }
      }}),

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
                tests[ id ] = { ...tests[ id ], ...payload, id };
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
                          defaultState = {
                            editing: false,
                            id,
                            key: id,
                            target: "",
                            method: "",
                            assert: "",
                            params: {}
                          };

                    commands[ id ] = {
                      ...defaultState,
                      ...payload,
                      id,
                      key: id
                    };
                    return commands;
                  }
                }
              }
            }
          }
        }
      }}),

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
                    commands[ id ] = { ...commands[ id ], ...payload };
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