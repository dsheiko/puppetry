import { buildAssertionTpl } from "service/assert";
import { AssertVisible } from "../../Assert/AssertVisible";


function visibleObjToString( obj ) {
  if ( obj.value !== true ) {
    return `\`NOT available\``;
  }
  const chunks = [ `available` ];
  if ( obj.display !== "any" ) {
    chunks.push( `${ obj.display === "not" ? "NOT " : "" }displayed` );
  }
  if ( obj.visibility !== "any" ) {
    chunks.push( `${ obj.visibility === "not" ? "NOT " : "" }visible` );
  }
  if ( obj.opacity !== "any" ) {
    chunks.push( `${ obj.opacity === "not" ? "opaque" : "transparent" }` );
  }
  if ( obj.isIntersecting ) {
    chunks.push( `within the viewport` );
  }
  return chunks.map( val => `\`${ val }\`` ).join( ", " );
}

export const assertVisible = {
  template: ( command ) => buildAssertionTpl(
    ( `await bs.target( await bs.getTargetOrFalse(${ JSON.stringify( command.target ) }) ).isVisible()` ),
    command,
    `// Asserting that ${ command.target } element is visible`
  ),

  toLabel: ({ assert }) => `(${ visibleObjToString( assert ) })`,

  toGherkin: ({ target, assert }) => `Assert that element \`${ target }\`
    is ${ visibleObjToString( assert ) }`,

  commonly: "assert visibility",

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
