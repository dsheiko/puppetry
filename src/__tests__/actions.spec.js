import actions from "../action/actions";
import { ValidationError } from "error";

const FIX_TITLE = "TITLE",
      FIX_ID = "_1";

describe( "Actions", () => {

  describe( "*Suite", () => {

    it( "performs updateSuite", () => {
      const res = actions.updateSuite({ title: FIX_TITLE });
      expect( res.payload.title ).toEqual( FIX_TITLE );
    });

    it( "validates updateSuite", () => {
      expect( () => {
        actions.updateSuite({ title: 10 });
      }).toThrow( ValidationError );
    });

  });

  describe( "*Target", () => {

    it( "performs addTarget", () => {
      const res = actions.addTarget({ target: FIX_TITLE, selector: FIX_TITLE });
      expect( res.payload.target ).toEqual( FIX_TITLE );
    });

    it( "validates addTarget", () => {
      expect( () => {
        actions.addTarget({ target: 10 });
      }).toThrow( ValidationError );
    });

    it( "performs updateTarget", () => {
      const res = actions.updateTarget({ id: FIX_ID, target: FIX_TITLE, selector: FIX_TITLE });
      expect( res.payload.target ).toEqual( FIX_TITLE );
    });

    it( "validates updateTarget", () => {
      expect( () => {
        actions.updateTarget({ target: FIX_TITLE, selector: FIX_TITLE });
      }).toThrow( ValidationError );
      expect( () => {
        actions.updateTarget({ id: 1, target: FIX_TITLE, selector: FIX_TITLE });
      }).toThrow( ValidationError );
    });

    it( "performs removeTarget", () => {
      const res = actions.removeTarget({ id: FIX_ID });
      expect( res.payload.id ).toEqual( FIX_ID );
    });

    it( "validates removeTarget", () => {
      expect( () => {
        actions.removeTarget({ target: FIX_TITLE, selector: FIX_TITLE });
      }).toThrow( ValidationError );
      expect( () => {
        actions.removeTarget({ id: 1 });
      }).toThrow( ValidationError );
    });

  });


  describe( "*Group", () => {

    it( "performs addGroup", () => {
      const res = actions.addGroup({ title: FIX_TITLE });
      expect( res.payload.title ).toEqual( FIX_TITLE );
    });

    it( "validates addGroup", () => {
      expect( () => {
        actions.addGroup({ title: 10 });
      }).toThrow( ValidationError );
    });

    it( "performs updateGroup", () => {
      const res = actions.updateGroup({ id: FIX_ID, title: FIX_TITLE });
      expect( res.payload.title ).toEqual( FIX_TITLE );
    });

    it( "validates updateGroup", () => {
      expect( () => {
        actions.updateGroup({ title: FIX_TITLE });
      }).toThrow( ValidationError );
      expect( () => {
        actions.updateGroup({ id: 1, title: FIX_TITLE });
      }).toThrow( ValidationError );
    });

    it( "performs removeGroup", () => {
      const res = actions.removeGroup({ id: FIX_ID });
      expect( res.payload.id ).toEqual( FIX_ID );
    });

    it( "validates removeGroup", () => {
      expect( () => {
        actions.removeGroup({ title: FIX_TITLE });
      }).toThrow( ValidationError );
      expect( () => {
        actions.removeGroup({ id: 1 });
      }).toThrow( ValidationError );
    });

  });

  describe( "*Test", () => {

    it( "performs addTest", () => {
      const res = actions.addTest({ groupId: FIX_ID, title: FIX_TITLE });
      expect( res.payload.title ).toEqual( FIX_TITLE );
    });

    it( "validates addTest", () => {
      expect( () => {
        actions.addTest({ title: FIX_TITLE });
      }).toThrow( ValidationError );
    });

    it( "performs updateTest", () => {
      const res = actions.updateTest({ id: FIX_ID, groupId: FIX_ID, title: FIX_TITLE });
      expect( res.payload.title ).toEqual( FIX_TITLE );
    });

    it( "validates updateTest", () => {
      expect( () => {
        actions.updateTest({ title: FIX_TITLE });
      }).toThrow( ValidationError );
      expect( () => {
        actions.updateTest({ id: FIX_ID, title: FIX_TITLE });
      }).toThrow( ValidationError );
    });

    it( "performs removeTest", () => {
      const res = actions.removeTest({ id: FIX_ID, groupId: FIX_ID });
      expect( res.payload.id ).toEqual( FIX_ID );
    });

    it( "validates removeTest", () => {
      expect( () => {
        actions.removeTest({ title: FIX_TITLE });
      }).toThrow( ValidationError );
      expect( () => {
        actions.removeTest({ id: FIX_ID });
      }).toThrow( ValidationError );
    });

  });

  describe( "*Command", () => {

    it( "performs addCommand", () => {
      const res = actions.addCommand({ testId: FIX_ID, groupId: FIX_ID, title: FIX_TITLE });
      expect( res.payload.title ).toEqual( FIX_TITLE );
    });

    it( "validates addCommand", () => {
      expect( () => {
        actions.addCommand({ title: FIX_TITLE });
      }).toThrow( ValidationError );
      expect( () => {
        actions.addCommand({ groupId: FIX_ID, title: FIX_TITLE });
      }).toThrow( ValidationError );
    });

    it( "performs updateCommand", () => {
      const res = actions.updateCommand({ id: FIX_ID, testId: FIX_ID, groupId: FIX_ID, title: FIX_TITLE });
      expect( res.payload.title ).toEqual( FIX_TITLE );
    });

    it( "validates updateCommand", () => {
      expect( () => {
        actions.updateCommand({ title: FIX_TITLE });
      }).toThrow( ValidationError );
      expect( () => {
        actions.updateCommand({ id: FIX_ID, title: FIX_TITLE });
      }).toThrow( ValidationError );
      expect( () => {
        actions.updateCommand({ id: FIX_ID, groupId: FIX_ID, title: FIX_TITLE });
      }).toThrow( ValidationError );
    });

    it( "performs removeCommand", () => {
      const res = actions.removeCommand({ id: FIX_ID, testId: FIX_ID, groupId: FIX_ID });
      expect( res.payload.id ).toEqual( FIX_ID );
    });

    it( "validates removeCommand", () => {
      expect( () => {
        actions.removeCommand({ title: FIX_TITLE });
      }).toThrow( ValidationError );
      expect( () => {
        actions.removeCommand({ id: FIX_ID });
      }).toThrow( ValidationError );
      expect( () => {
        actions.removeCommand({ id: FIX_ID, groupId: FIX_ID });
      }).toThrow( ValidationError );
    });

  });


});
