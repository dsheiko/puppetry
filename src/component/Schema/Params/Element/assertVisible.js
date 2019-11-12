import { buildAssertionTpl } from "service/assert";
import { AssertVisible } from "../../Assert/AssertVisible";
import { migrateAssertVisible } from "service/suite";


function visibleObjToString( obj ) {

  if ( obj.availability === "unavailable" ) {
    return `\`NOT available\``;
  }
  if ( obj.availability === "visible" ) {
    return `\`available\`, \`displayed\`, \`visible\`, \`opaque\`, \`within the viewport\``;
  }
  if ( obj.availability === "invisible" ) {
    return `\`available\`, \`NOT displayed\` or \`NOT visible\` or \`transparent\` or \`out of the viewport\``;
  }
  const chunks = [ `available` ];

  if ( obj.display !== "any" ) {
    chunks.push( `${ obj.display !== "not" ? "NOT " : "" }displayed` );
  }
  if ( obj.visibility !== "any" ) {
    chunks.push( `${ obj.visibility !== "not" ? "NOT " : "" }visible` );
  }
  if ( obj.opacity !== "any" ) {
    chunks.push( `${ obj.opacity === "not" ? "opaque" : "transparent" }` );
  }
  if ( obj.isIntersecting === "true" ) {
    chunks.push( `within the viewport` );
  }
  if ( obj.isIntersecting === "false" ) {
    chunks.push( `out of the viewport` );
  }
  return chunks.map( val => `\`${ val }\`` ).join( ", " );
}

export const assertVisible = {
  template: ( command ) => buildAssertionTpl(
    ( `await bs.target( await bs.getTargetOrFalse(${ JSON.stringify( command.target ) }) ).isVisible()` ),
    command,
    `// Asserting that ${ command.target } element is visible`
  ),

  toLabel: ( command ) => {
    const { assert } = migrateAssertVisible( command );
    return `(${ visibleObjToString( assert ) })`;
  },

  toGherkin: ( command ) => {
    const { target, assert } = migrateAssertVisible( command );
    return `Assert that element \`${ target }\` is ${ visibleObjToString( assert ) }`;
  },

  commonly: "assert visibility",

  validate: ( values ) => {
    if ( values.assert.availability !== "available" ) {
      values.assert.display = "any";
      values.assert.isIntersecting = "any";
      values.assert.opacity = "any";
      values.assert.visibility = "any";
    }
    return false;
  },

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
