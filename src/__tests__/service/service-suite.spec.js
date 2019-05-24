import { findTargets, findTargetNodes } from "../../service/suite";

const FIX_SUITE = {
        "groups": {
          "36ijnyo161a": {
            "editing": false,
            "id": "36ijnyo161a",
            "key": "36ijnyo161a",
            "title": "Main page",
            "tests": {
              "36ijnyo1oho": {
                "editing": false,
                "id": "36ijnyo1oho",
                "key": "36ijnyo1oho",
                "title": "on PC/Notebook 1280x1024",
                "commands": {
                  "36ijnyo2pxx": {
                    "editing": false,
                    "id": "36ijnyo2pxx",
                    "key": "36ijnyo2pxx",
                    "target": "page",
                    "method": "setViewport",
                    "params": {
                      "width": 1280,
                      "height": 1024
                    },
                    "groupId": "36ijnyo161a",
                    "testId": "36ijnyo1oho"
                  },
                  "36ijnyo3ewr": {
                    "editing": false,
                    "id": "36ijnyo3ewr",
                    "key": "36ijnyo3ewr",
                    "target": "page",
                    "method": "goto",
                    "params": {
                      "url": "https://dsheiko.github.io/react-html5-form/",
                      "timeout": 30000,
                      "waitUntil": "load"
                    },
                    "groupId": "36ijnyo161a",
                    "testId": "36ijnyo1oho"
                  },
                  "36ijnyo5d8m": {
                    "editing": false,
                    "id": "36ijnyo5d8m",
                    "key": "36ijnyo5d8m",
                    "target": "SEL_JUMBOTRON_DESC",
                    "method": "assertVisible",
                    "assert": {
                      "assertion": "boolean",
                      "value": true
                    },
                    "groupId": "36ijnyo161a",
                    "testId": "36ijnyo1oho"
                  },
                  "36ijnyob255": {
                    "editing": false,
                    "id": "36ijnyob255",
                    "key": "36ijnyob255",
                    "target": "SEL_EMAIL",
                    "method": "assertPosition",
                    "assert": {
                      "assertion": "position",
                      "position": "left",
                      "target": "SEL_FNAME"
                    },
                    "groupId": "36ijnyo161a",
                    "testId": "36ijnyo1oho"
                  },
                  "36ijnyo5q0w": {
                    "editing": false,
                    "id": "36ijnyo5q0w",
                    "key": "36ijnyo5q0w",
                    "target": "page",
                    "method": "screenshot",
                    "params": {
                      "name": "on 1280x1024",
                      "fullPage": false,
                      "omitBackground": false
                    },
                    "groupId": "36ijnyo161a",
                    "testId": "36ijnyo1oho",
                    "disabled": false
                  }
                },
                "groupId": "36ijnyo161a"
              },
              "36ijnyo2e41": {
                "editing": false,
                "id": "36ijnyo2e41",
                "key": "36ijnyo2e41",
                "title": "on iPhone X",
                "commands": {
                  "36ijnyo3yw0": {
                    "editing": false,
                    "id": "36ijnyo3yw0",
                    "key": "36ijnyo3yw0",
                    "target": "page",
                    "method": "emulate",
                    "params": {
                      "device": "iPhone X"
                    },
                    "groupId": "36ijnyo161a",
                    "testId": "36ijnyo2e41"
                  },
                  "36ijnyo4p85": {
                    "editing": false,
                    "id": "36ijnyo4p85",
                    "key": "36ijnyo4p85",
                    "target": "page",
                    "method": "goto",
                    "params": {
                      "url": "https://dsheiko.github.io/react-html5-form/",
                      "timeout": 30000,
                      "waitUntil": "load"
                    },
                    "groupId": "36ijnyo161a",
                    "testId": "36ijnyo2e41"
                  },
                  "36ijnyo6nwg": {
                    "editing": false,
                    "id": "36ijnyo6nwg",
                    "key": "36ijnyo6nwg",
                    "target": "SEL_JUMBOTRON_DESC",
                    "method": "assertVisible",
                    "assert": {
                      "assertion": "boolean",
                      "value": false
                    },
                    "groupId": "36ijnyo161a",
                    "testId": "36ijnyo2e41"
                  },
                  "3fejnyofvuf": {
                    "editing": false,
                    "id": "3fejnyofvuf",
                    "key": "3fejnyofvuf",
                    "target": "SEL_EMAIL",
                    "method": "assertPosition",
                    "assert": {
                      "assertion": "position",
                      "position": "above",
                      "target": "SEL_FNAME"
                    },
                    "groupId": "36ijnyo161a",
                    "testId": "36ijnyo2e41"
                  },
                  "3fejnyoglbz": {
                    "editing": false,
                    "id": "3fejnyoglbz",
                    "key": "3fejnyoglbz",
                    "target": "page",
                    "method": "screenshot",
                    "params": {
                      "name": "on iPhone X",
                      "fullPage": false,
                      "omitBackground": false
                    },
                    "groupId": "36ijnyo161a",
                    "testId": "36ijnyo2e41"
                  }
                },
                "groupId": "36ijnyo161a"
              }
            }
          }
        }
      },

      GROUP = Object.values( FIX_SUITE.groups )[ 0 ],
      TEST = Object.values( GROUP.tests )[ 0 ],
      COMMANDS = TEST.commands;


describe( "service/suite", () => {


  describe( "findTargets", () => {

    it( "finds target on command with no page target", () => {
      const command = COMMANDS[ "36ijnyo5d8m" ],
            res = findTargets( command );

      expect( res.length ).toBe( 1 );
      expect( res.includes( "SEL_JUMBOTRON_DESC" ) ).toBe( true );
    });

    it( "finds no target on command with page target", () => {
      const command = COMMANDS[ "36ijnyo2pxx" ],
            res = findTargets( command );

      expect( res.length ).toBe( 0 );
    });

    it( "finds both target on command with assert target", () => {
      const command = COMMANDS[ "36ijnyob255" ],
            res = findTargets( command );

      expect( res.length ).toBe( 2 );
      expect( res.includes( "SEL_EMAIL" ) ).toBe( true );
      expect( res.includes( "SEL_FNAME" ) ).toBe( true );
    });

    it( "finds targets on test", () => {
      const res = findTargets( TEST );

      expect( res.length ).toBe( 3 );
      expect( res.includes( "SEL_JUMBOTRON_DESC" ) ).toBe( true );
      expect( res.includes( "SEL_EMAIL" ) ).toBe( true );
      expect( res.includes( "SEL_FNAME" ) ).toBe( true );
    });

    it( "finds targets on group", () => {
      const res = findTargets( GROUP );
      expect( res.length ).toBe( 3 );
      expect( res.includes( "SEL_JUMBOTRON_DESC" ) ).toBe( true );
      expect( res.includes( "SEL_EMAIL" ) ).toBe( true );
      expect( res.includes( "SEL_FNAME" ) ).toBe( true );
    });

  });

  describe( "findTargetNodes", () => {

    it( "finds by target", () => {
      const res = findTargetNodes( GROUP, "SEL_JUMBOTRON_DESC" );
      expect( res.length ).toBe( 2 );
      expect( res[ 0 ].id ).toBe( "36ijnyo5d8m" );
      expect( res[ 1 ].id ).toBe( "36ijnyo6nwg" );
    });

    it( "finds by target mentioned in assert", () => {
      const res = findTargetNodes( GROUP, "SEL_FNAME" );
      expect( res.length ).toBe( 2 );
      expect( res[ 0 ].id ).toBe( "36ijnyob255" );
      expect( res[ 1 ].id ).toBe( "3fejnyofvuf" );
    });

  });
});
