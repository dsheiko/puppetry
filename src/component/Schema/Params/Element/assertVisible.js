import { buildAssertionTpl } from "service/assert";
import { AssertVisible } from "../../Assert/AssertVisible";
import { renderTarget } from "service/utils";

function visibleObjToString( obj ) {
    if ( typeof obj.value !== "undefined" ) {
      obj = {
        isDisplayed: obj.value,
        isVisible: obj.value,
        isOpaque: obj.value,
        isIntersecting: obj.value
      };
    }
    return [ `${ obj.isDisplayed ? "" : "NOT " }displayed`, `${ obj.isVisible ? "" : "NOT " }visible`,
    `${ obj.isOpaque ? "" : "NOT " } opaque`, `${ obj.isIntersecting ? "" : "NOT " }within the viewport` ]
      .map( val => `\`${ val }\`` ).join( ", " );
  }

export const assertVisible = {
  template: ( command ) => buildAssertionTpl(
    `await bs.target( ${ renderTarget( command.target ) } ).isVisible()`,
    command,
    `// Asserting that ${ command.target } element is visible`
  ),

  toLabel: ({ assert }) => `(${ visibleObjToString( assert ) })`,

  toGherkin: ({ target, params, assert }) => `Assert that element \`${ target }\`
    is ${ visibleObjToString( assert ) }`,

  commonly: "assert it is visible",

  assert: {
    node: AssertVisible,
    options: {
      textNode: "is visible"
    }
  },
  description: `Asserts that the element is currently visible`,
  params: [
  ],

  testTypes: {
    "assert": {
      "value": "CHECKBOX"
    }
  },

  test: [
    {
      valid: true,
      "assert": {
        "assertion": "boolean",
        "value": true
      }
    }
  ]
};
