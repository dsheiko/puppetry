import { schema } from "../../../component/Schema/schema";

const FIX_TARGET = "FOO";

describe( "Schema.target", () => {


  describe( "assertProperty.template", () => {

    it( "returns expected with equals assertion", () => {
      const code = schema.element.assertProperty.template({
        target: FIX_TARGET,
        method: "assertProperty",
        targetSeletor: ".foo",
        assert: {
          assertion: "equals",
          value: "VALUE"
        },
        params: {
          name: "innerHTML"
        }
      });
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });

  });

  describe( "assertAttribute.template", () => {

    it( "returns expected with equals assertion", () => {
      const code = schema.element.assertAttribute.template({
        target: FIX_TARGET,
        method: "assertAttribute",
        targetSeletor: ".foo",
        assert: {
          assertion: "equals",
          value: "VALUE"
        },
        params: {
          name: "href"
        }
      });

      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();

    });

    describe( "click.template", () => {

      it( "returns expected", () => {
        const code = schema.element.click.template({
          target: FIX_TARGET,
          method: "click",
          targetSeletor: ".foo",
          params: {
            button: "left",
            clickCount: 1,
            delay: 0
          }
        });
        expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
      });

    });


    describe( "focus.template", () => {

      it( "returns expected", () => {
        const code = schema.element.focus.template({
          target: FIX_TARGET,
          method: "focus",
          targetSeletor: ".foo"
        });
        expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
      });


    });

     describe( "tap.template", () => {

      it( "returns expected", () => {
        const code = schema.element.tap.template({
          target: FIX_TARGET,
          method: "tap",
          targetSeletor: ".foo"
        });
        expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
      });


    });


    describe( "hover.template", () => {

      it( "returns expected", () => {
        const code = schema.element.hover.template({
          target: FIX_TARGET,
          method: "hover",
          targetSeletor: ".foo"

        });
        expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
      });


    });

    describe( "toggleClass.template", () => {

      it( "returns expected", () => {
        const code = schema.element.toggleClass.template({
          target: FIX_TARGET,
          method: "toggleClass",
          targetSeletor: ".foo",
          params: {
            name: "foo",
            toggle: "add"
          }
        });
        expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
      });


    });

     describe( "setAttribute.template", () => {

      it( "returns expected", () => {
        const code = schema.element.setAttribute.template({
          target: FIX_TARGET,
          method: "setAttribute",
          targetSeletor: ".foo",
          params: {
            name: "checked",
            value: "true"
          }
        });
        expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
      });


    });

    describe( "type.template", () => {

      it( "returns expected", () => {
        const code = schema.element.type.template({
          target: FIX_TARGET,
          method: "type",
          targetSeletor: ".foo",
          params: {
            value: "TEXT"
          }
        });
        expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
      });


    });


    describe( "select.template", () => {

      it( "returns expected", () => {
        const code = schema.element.select.template({
          target: FIX_TARGET,
          method: "select",
          targetSeletor: ".foo",
          params: {
            value: "TEXT"
          }
        });
        expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
      });


    });


    describe( "assertVisible.template", () => {

      it( "returns expected with equals assertion", () => {
        const code = schema.element.assertVisible.template({
          target: FIX_TARGET,
          method: "assertVisible",
          targetSeletor: ".foo",
          assert: {
            assertion: "equals",
            value: true
          }
        });
        expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
      });

    });


    describe( "assertBoundingBox.template", () => {

      it( "returns valid JavaScript", () => {
        const code = schema.element.assertBoundingBox.template({
          target: FIX_TARGET,
          method: "assertBoundingBox",
          targetSeletor: ".foo",

          assert: {
            assertion: "boundingBox",
            xOperator: "gt",
            xValue: "0",
            yOperator: "gt",
            yValue: "0",
            wOperator: "gt",
            wValue: "0",
            hOperator: "gt",
            hValue: "0"
          }
        });
        expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
      });

    });

    describe( "assertContainsClass.template", () => {

      it( "returns valid JavaScript", () => {
        const code = schema.element.assertContainsClass.template({
          target: FIX_TARGET,
          method: "assertContainsClass",
          targetSeletor: ".foo",
          params: {
            name: "TEXT"
          },
          assert: {
            assertion: "boolean",
            value: true
          }
        });
        expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
      });

    });


    describe( "assertHtml.template", () => {

      it( "returns valid JavaScript", () => {
        const code = schema.element.assertHtml.template({
          target: FIX_TARGET,
          method: "assertHtml",
          targetSeletor: ".foo",

          assert: {
            assertion: "equals",
            value: "foo"
          }
        });
        expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
      });

    });

    describe( "assertMatchesSelector.template", () => {

      it( "returns valid JavaScript", () => {
        const code = schema.element.assertMatchesSelector.template({
          target: FIX_TARGET,
          method: "assertMatchesSelector",
          targetSeletor: ".foo",
          assert: {
            assertion: "selector",
            value: ".bar"
          }
        });
        expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
      });

    });

    describe( "assertPosition.template", () => {

      it( "returns valid JavaScript", () => {
        const code = schema.element.assertPosition.template({
          target: FIX_TARGET,
          method: "assertPosition",
          targetSeletor: ".foo",

          assert: {
            assertion: "position",
            position: "above",
            target: "BAR"
          }
        });
        expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
      });

    });

    describe( "assertStyle.template", () => {

      it( "returns valid JavaScript", () => {
        const code = schema.element.assertStyle.template({
          target: FIX_TARGET,
          method: "assertStyle",
          targetSeletor: ".foo",
          params: {
            name: "class",
            pseudo: ":before"
          },
          assert: {
            assertion: "equals",
            value: "above"
          }
        });
        expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
      });

    });

    describe( "assertVisible.template", () => {

      it( "returns valid JavaScript", () => {
        const code = schema.element.assertVisible.template({
          target: FIX_TARGET,
          method: "assertVisible",
          targetSeletor: ".foo",

          assert: {
            assertion: "boolean",
            value: true
          }
        });
        expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
      });

    });


  });


});