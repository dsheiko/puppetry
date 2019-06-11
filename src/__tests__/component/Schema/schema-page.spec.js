import { schema } from "../../../component/Schema/schema";

const FIX_NAME = "FixName";

describe( "Schema.page (templates generate valid JavaScript)", () => {

  describe( "screenshot.template", () => {

    it( "with only name", () => {
      const code = schema.page.screenshot.template({ target: "page", params: {
        name: "FIX_NAME"
      }});
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });

    it( "with booleans", () => {
      const code = schema.page.screenshot.template({ target: "page", params: {
        name: "FIX_NAME",
        fullPage: true,
        omitBackground: true
      }});
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });

    it( "with clip", () => {
      const code = schema.page.screenshot.template({ target: "page", params: {
        name: "FIX_NAME",
        fullPage: true,
        omitBackground: true,
        x: 0,
        y: 0,
        width: 10,
        height: 10
      }});
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });

  });

  describe( "setViewport.template", () => {

    it( "with all options", () => {
      const code = schema.page.setViewport.template({ target: "page", params: {
        width: 100,
        height: 100,
        deviceScaleFactor: true,
        hasTouch: true,
        isLandscape: true
      }});
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });

  });

  describe( "emulate.template", () => {

    it( "with device", () => {
      const code = schema.page.emulate.template({ target: "page", params: {
        device: "iPhone X"
      }});

      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });

  });


  describe( "assertTitle.template", () => {

    it( "with equals assertion", () => {
      const code = schema.page.assertTitle.template({
        target: "page",
        assert: {
          assertion: "equals",
          value: "VALUE"
        },
        params: {}
      });

      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });
  });


  describe( "assertContent.template", () => {

    it( "with equals assertion", () => {
      const code = schema.page.assertContent.template({
        target: "page",
        assert: {
          assertion: "equals",
          value: "VALUE"
        },
        params: {}
      });

      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });


    it( "with contains assertion", () => {
      const code = schema.page.assertContent.template({
        target: "page",
        assert: {
          assertion: "contains",
          value: "VALUE"
        },
        params: {}
      });
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });

  });

  describe( "click.template", () => {

    it( "with coordinates", () => {
      const code = schema.page.click.template({ target: "page", params: {
        x: 1,
        y: 2
      }});
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });

    it( "with all options", () => {
      const code = schema.page.click.template({ target: "page", params: {
        x: 1,
        y: 2,
        button: "left",
        clickCount: 1,
        delay: 0
      }});
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });

  });

  describe( "tap.template", () => {

    it( "with coordinates", () => {
      const code = schema.page.tap.template({ target: "page", params: {
        x: 1,
        y: 2
      }});
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });
  });

  describe( "scroll.template", () => {

    it( "with coordinates", () => {
      const code = schema.page.scroll.template({ target: "page", params: {
        x: 1,
        y: 2
      }});
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });
  });


  describe( "goto.template", () => {

    it( "with URL", () => {
      const code = schema.page.goto.template({ target: "page", params: {
        url: "https://github.com"
      }});
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });

    it( "with all options", () => {
      const code = schema.page.goto.template({ target: "page", params: {
        url: "https://github.com",
        waitUntil: "load",
        timeout: 1000
      }});
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });

  });

  describe( "waitFor.template", () => {

    it( "with value", () => {
      const code = schema.page.waitFor.template({ target: "page", params: {
        value: 1000
      }});
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });

  });

  describe( "waitForSelector.template", () => {

    it( "without options", () => {
      const code = schema.page.waitForSelector.template({ target: "page", params: {
        value: "div"
      }});
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });

    it( "with all options", () => {
      const code = schema.page.waitForSelector.template({ target: "page", params: {
        value: "div",
        visible: "true",
        timeout: 1000
      }});
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });

  });

  describe( "waitForNavigation.template", () => {

    it( "without options", () => {
      const code = schema.page.waitForNavigation.template({ target: "page", params: {}});
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });

    it( "with all options", () => {
      const code = schema.page.waitForNavigation.template({ target: "page", params: {
        waitUntil: "load",
        timeout: 1000
      }});
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });

  });

  describe( "press.template", () => {

    it( "with only main key", () => {
      const code = schema.page.press.template({ target: "page", params: {
        key: "Enter",
        modifierKey1: "",
        modifierKey2: "",
        modifierKey3: ""
      }});
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });

    it( "with one modifier", () => {
      const code = schema.page.press.template({ target: "page", params: {
        key: "Enter",
        modifierKey1: "Shift",
        modifierKey2: "",
        modifierKey3: ""
      }});
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });

    it( "with two modifiers", () => {
      const code = schema.page.press.template({ target: "page", params: {
        key: "Enter",
        modifierKey1: "Shift",
        modifierKey2: "Control",
        modifierKey3: ""
      }});
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });

    it( "with three modifiers", () => {
      const code = schema.page.press.template({ target: "page", params: {
        key: "Enter",
        modifierKey1: "Shift",
        modifierKey2: "Control",
        modifierKey3: "Alt"
      }});
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });
  });

  describe( "reload.template", () => {

    it( "without options", () => {
      const code = schema.page.reload.template({ target: "page", params: {}});
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });

    it( "with all options", () => {
      const code = schema.page.reload.template({ target: "page", params: {
        waitUntil: "load",
        timeout: 1000
      }});
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });

  });

  describe( "assertNodeCount.template", () => {

    it( "with assertion", () => {
      const code = schema.page.assertNodeCount.template({
        target: "page",
        assert: {
          assertion: "number",
          operator: "gt",
          value: 10
        },
        params: {
          selector: ".foo"
        }
      });
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });
  });

  describe( "assertScroll.template", () => {

    it( "with assertion", () => {
      const code = schema.page.assertScroll.template({
        target: "page",
        assert: {
          assertion: "number",
          operator: "gt",
          value: 10
        },
        params: {
          direction: "horizontally"
        }
      });

      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });
  });

  describe( "evaluate.template", () => {

    it( "with code", () => {
      const code = schema.page.evaluate.template({
        target: "page",
        params: {
          value: `const foo = "FOO";
          const bar = "BAR";
`
        }
      });
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });
  });

  describe( "runjs.template", () => {

    it( "with code", () => {
      const code = schema.page.runjs.template({
        target: "page",
        params: {
          value: `const foo = "FOO";
          const bar = "BAR";
`
        }
      });
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });
  });

  describe( "debug.template", () => {

    it( "with code", () => {
      const code = schema.page.debug.template({
        target: "page"
      });
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });
  });


  describe( "assertUrl.template", () => {

    it( "with code", () => {
      const code = schema.page.assertUrl.template({
        target: "page",
        assert: {
          assertion: "equals",
          value: "VALUE"
        }
      });
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });
  });

  describe( "assertVar.template", () => {
    it( "with code", () => {
      const code = schema.page.assertVar.template({
        target: "page",
        params: {
          name: "FOO"
        },
        assert: {
          assertion: "equals",
          value: "VALUE"
        }
      });
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });
  });

  describe( "assertVar.template", () => {
    it( "with code", () => {
      const code = schema.page.assertVar.template({
        target: "page",
        params: {
          name: "FOO"
        },
        assert: {
          assertion: "equals",
          value: "VALUE"
        }
      });
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });
  });

  describe( "assignVarRemotely.template", () => {
    it( "with code", () => {
      const code = schema.page.assignVarRemotely.template({
        target: "page",
        params: {
          name: "FOO",
          url: "http://..",
          interval: 1000,
          timeout: 1000,
          parserFn: `() => {}`,
          requestFn: `() => {}`
        }
      });
      expect( () => validateAsyncFuncBody( code ) ).not.toThrow();
    });
  });


});