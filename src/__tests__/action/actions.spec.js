import actions from "../../action";
import { Exception } from "bycontract";

const FIX_TITLE = "TITLE",
      FIX_ID = "_1";

describe( "Actions", () => {

  describe( "*Suite", () => {

    it( "performs setSuite", () => {
      const res = actions.setSuite({ title: FIX_TITLE });

      expect( res.payload.title ).toEqual( FIX_TITLE );
    });

    it( "validates setSuite", () => {
      expect( () => {
        actions.setSuite({ title: 10 });
      }).toThrow( Exception );
    });

  });

  describe( "*Target", () => {

    it( "performs addTarget", () => {
      const res = actions.addTarget({ target: FIX_TITLE, selector: FIX_TITLE });
      expect( res.payload.options.target ).toEqual( FIX_TITLE );
    });

    it( "validates addTarget", () => {
      expect( () => {
        actions.addTarget({ target: 10 });
      }).toThrow( Exception );
    });

    it( "performs updateTarget", () => {
      const res = actions.updateTarget({ id: FIX_ID, target: FIX_TITLE, selector: FIX_TITLE });
      expect( res.payload.target ).toEqual( FIX_TITLE );
    });

    it( "validates updateTarget (id missing)", () => {
      expect( () => {
        actions.updateTarget({ target: FIX_TITLE, selector: FIX_TITLE });
      }).toThrow( Exception );
    });

    it( "validates updateTarget (id not a string)", () => {
      expect( () => {
        actions.updateTarget({ id: 1, target: FIX_TITLE, selector: FIX_TITLE });
      }).toThrow( Exception );
    });

    it( "performs removeTarget", () => {
      const res = actions.removeTarget({ id: FIX_ID });
      expect( res.payload.id ).toEqual( FIX_ID );
    });

    it( "validates removeTarget", () => {
      expect( () => {
        actions.removeTarget({ target: FIX_TITLE, selector: FIX_TITLE });
      }).toThrow( Exception );
      expect( () => {
        actions.removeTarget({ id: 1 });
      }).toThrow( Exception );
    });

  });


  describe( "*Group", () => {

    it( "performs addGroup", () => {
      const res = actions.addGroup({ title: FIX_TITLE });
      expect( res.payload.options.title ).toEqual( FIX_TITLE );
    });

    it( "validates addGroup", () => {
      expect( () => {
        actions.addGroup({ title: 10 });
      }).toThrow( Exception );
    });

    it( "performs updateGroup", () => {
      const res = actions.updateGroup({ id: FIX_ID, title: FIX_TITLE });
      expect( res.payload.title ).toEqual( FIX_TITLE );
    });

    it( "validates updateGroup", () => {
      expect( () => {
        actions.updateGroup({ title: FIX_TITLE });
      }).toThrow( Exception );
      expect( () => {
        actions.updateGroup({ id: 1, title: FIX_TITLE });
      }).toThrow( Exception );
    });

    it( "performs removeGroup", () => {
      const res = actions.removeGroup({ id: FIX_ID });
      expect( res.payload.id ).toEqual( FIX_ID );
    });

    it( "validates removeGroup (id missing)", () => {
      expect( () => {
        actions.removeGroup({ title: FIX_TITLE });
      }).toThrow( Exception );
    });

    it( "validates removeGroup (id is not a string)", () => {
      expect( () => {
        actions.removeGroup({ id: 1 });
      }).toThrow( Exception );
    });

  });

  describe( "*Test", () => {

    it( "performs addTest", () => {
      const res = actions.addTest({ groupId: FIX_ID, title: FIX_TITLE });
      expect( res.payload.options.title ).toEqual( FIX_TITLE );
    });

    it( "validates addTest", () => {
      expect( () => {
        actions.addTest({ title: FIX_TITLE });
      }).toThrow( Exception );
    });

    it( "performs updateTest", () => {
      const res = actions.updateTest({ id: FIX_ID, groupId: FIX_ID, title: FIX_TITLE });
      expect( res.payload.title ).toEqual( FIX_TITLE );
    });

    it( "validates updateTest (id is missing)", () => {
      expect( () => {
        actions.updateTest({ title: FIX_TITLE });
      }).toThrow( Exception );
    });

    it( "validates updateTest (groupId is missing)", () => {
      expect( () => {
        actions.updateTest({ id: FIX_ID, title: FIX_TITLE });
      }).toThrow( Exception );
    });

    it( "performs removeTest", () => {
      const res = actions.removeTest({ id: FIX_ID, groupId: FIX_ID });
      expect( res.payload.id ).toEqual( FIX_ID );
    });

    it( "validates removeTest (id is missing)", () => {
      expect( () => {
        actions.removeTest({ title: FIX_TITLE });
      }).toThrow( Exception );
    });

    it( "validates removeTest (groupId is missing)", () => {
      expect( () => {
        actions.removeTest({ id: FIX_ID });
      }).toThrow( Exception );
    });

  });

  describe( "*Command", () => {

    it( "performs addCommand", () => {
      const res = actions.addCommand({ testId: FIX_ID, groupId: FIX_ID, title: FIX_TITLE });
      expect( res.payload.options.title ).toEqual( FIX_TITLE );
    });

    it( "validates addCommand (id is missing)", () => {
      expect( () => {
        actions.addCommand({ title: FIX_TITLE });
      }).toThrow( Exception );
    });

    it( "validates addCommand (testId is missing)", () => {
      expect( () => {
        actions.addCommand({ groupId: FIX_ID, title: FIX_TITLE });
      }).toThrow( Exception );
    });

    it( "performs updateCommand", () => {
      const res = actions.updateCommand({ id: FIX_ID, testId: FIX_ID, groupId: FIX_ID, title: FIX_TITLE });
      expect( res.payload.title ).toEqual( FIX_TITLE );
    });

    it( "validates updateCommand", () => {
      expect( () => {
        actions.updateCommand({ title: FIX_TITLE });
      }).toThrow( Exception );
      expect( () => {
        actions.updateCommand({ id: FIX_ID, title: FIX_TITLE });
      }).toThrow( Exception );
      expect( () => {
        actions.updateCommand({ id: FIX_ID, groupId: FIX_ID, title: FIX_TITLE });
      }).toThrow( Exception );
    });

    it( "performs removeCommand", () => {
      const res = actions.removeCommand({ id: FIX_ID, testId: FIX_ID, groupId: FIX_ID });
      expect( res.payload.id ).toEqual( FIX_ID );
    });

    it( "validates removeCommand", () => {
      expect( () => {
        actions.removeCommand({ title: FIX_TITLE });
      }).toThrow( Exception );
      expect( () => {
        actions.removeCommand({ id: FIX_ID });
      }).toThrow( Exception );
      expect( () => {
        actions.removeCommand({ id: FIX_ID, groupId: FIX_ID });
      }).toThrow( Exception );
    });

  });


});
