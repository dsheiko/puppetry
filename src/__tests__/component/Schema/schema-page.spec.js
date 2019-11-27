import { schema } from "../../../component/Schema/schema";

const FIX_RECORD = {
        id: "actionID",
        disabled: false,
        groupId: "groupID",
        testId: "testID"
      },
      methods = Object.keys( schema.page )
        .filter( method =>
        ( "test" in schema.page[ method ] && Array.isArray( schema.page[ method ].test ) ) );

describe( "Schema.page", () => {
  describe( "Templates generate valid JavaScript", () => {

    methods.forEach( method => {
      const action = schema.page[ method ];
      action.test
        .filter( fixture => Boolean( fixture.valid ) )
        .forEach( ( fixture, inx ) => {

          test( `page.${ method } with valid input #${ ( inx + 1 ) }`, () => {
            const code = action.template({
              ...FIX_RECORD,
              target: "page",
              method,
              ...fixture
            });
            expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
          });
      });


    });

  });

});