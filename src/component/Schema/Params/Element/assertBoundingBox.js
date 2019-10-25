import { buildAssertionTpl } from "service/assert";
import { AssertBoundingBox } from "../../Assert/AssertBoundingBox";
import { OPERATOR_MAP, renderTarget } from "service/utils";

function paramToLabel( param, operator, value ) {
  if ( !operator || operator === "any"  ) {
    return ``;
  }
  return `${ param } ${ OPERATOR_MAP[ operator ] } \`${ value }px\``;
}

function assertsToLabel( assert ) {
  const labels = [];
  labels.push( paramToLabel( "x", assert.xOperator, assert.xValue ) );
  labels.push( paramToLabel( "y", assert.yOperator, assert.yValue ) );
  labels.push( paramToLabel( "w", assert.wOperator, assert.wValue ) );
  labels.push( paramToLabel( "h", assert.hOperator, assert.hValue ) );
  return `${ labels.filter( ( val ) => val.length ).join( ", " ) }`;
}

export const assertBoundingBox = {
  template: ( command ) => buildAssertionTpl(
    `await ( ${ renderTarget( command.target ) } ).boundingBox()`,
    command,
    `// Asserting that the bounding box of the element satisfies the given constraint`
  ),

  toLabel: ({ assert }) => {
    return `(${ assertsToLabel( assert ) })`;
  },

  toGherkin: ({ target, assert }) => `Assert that size and position of \`${ target }\`
    comply ${ assertsToLabel( assert ) }`,

  commonly: "assert size/position",

  validate: ( values ) => {
    const { xOperator, yOperator, wOperator, hOperator } = values.assert;
    if ( xOperator === "any" && yOperator === "any" && wOperator === "any" && hOperator === "any" ) {
      return "You have to specify at least one assertion with < or > operator";
    }
    return null;
  },

  description: `Asserts that the
  [bounding box](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)
  (size and position) of \`{target}\` target satisfies the given constraint`,

  assert: {
    node: AssertBoundingBox
  },
  params: [

  ],

  testTypes: {
    "assert": {
      "xOperator": "SELECT",
      "xValue": "INPUT_NUMBER"
    }
  },

  test: [
    {
      valid: true,
      "assert": {
        "assertion": "boundingBox",
        "xOperator": "gt",
        "yOperator": "any",
        "wOperator": "any",
        "hOperator": "any",
        "xValue": 1
      }
    }
  ]
};
