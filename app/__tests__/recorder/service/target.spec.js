import { makeVar, registerElement, clearTargets } from "../../../recorder/service/target";

const DEFAULT_OBJ = {
        pid: "60hum5qjz3yd60n",
        query: "INPUT[name='q']"
      };

describe( "makeVar", () => {

  it( "resolves by ID", () => {
     const name = makeVar({
       ...DEFAULT_OBJ,
       tagName: "DIV",
       id: "FOO"
     });
     expect( name ).toBe( "DIV_ID_FOO" );
  });

  it( "resolves by NAME", () => {
     const name = makeVar({
       ...DEFAULT_OBJ,
       tagName: "DIV",
       name: "bar"
     });
     expect( name ).toBe( "DIV_NAME_BAR" );
  });

  it( "resolves by CLASS_NAME", () => {
     const name = makeVar({
       ...DEFAULT_OBJ,
       tagName: "DIV",
       className: "baz"
     });
     expect( name ).toBe( "DIV_CLASS_BAZ" );
  });


  it( "resolves otherwise", () => {
     const name = makeVar({
       ...DEFAULT_OBJ,
       tagName: "DIV"
     });
     expect( name ).toBe( "DIV" );
  });

});

describe( "registerElement", () => {

  beforeEach(() => {
    clearTargets();
  });

  it( "keeps names unique", () => {
     let res = registerElement({
       ...DEFAULT_OBJ,
       pid: "1",
       tagName: "DIV"
     });
     expect( res.name ).toBe( "DIV" );


     res = registerElement({
       ...DEFAULT_OBJ,
       pid: "2",
       tagName: "DIV"
     });

     expect( res.name ).toBe( "DIV_1" );
  });

});