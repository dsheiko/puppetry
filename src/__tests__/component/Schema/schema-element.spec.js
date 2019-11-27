import { schema } from "../../../component/Schema/schema";

const FIX_RECORD = {
        id: "actionID",
        disabled: false,
        groupId: "groupID",
        testId: "testID",
        targetSeletor: ".selector",
        targetObj: { css: true, slector: ".selector" }
      },
      methods = Object.keys( schema.element )
        .filter( method =>
        ( "test" in schema.element[ method ] && Array.isArray( schema.element[ method ].test ) ) );

describe( "Schema.element", () => {
  describe( "Templates generate valid JavaScript", () => {

    methods.forEach( method => {
      const action = schema.element[ method ];
      action.test
        .filter( fixture => Boolean( fixture.valid ) )
        .forEach( ( fixture, inx ) => {

          test( `element.${ method } with valid input #${ ( inx + 1 ) }`, () => {
            const code = action.template({
              ...FIX_RECORD,
              target: "TARGET_FOO",
              method,
              ...fixture
            });
            expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
          });
      });


    });

  });

});

