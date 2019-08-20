import { buildAssertionTpl } from "service/assert";
import { AssertScreenshot } from "../../Assert/AssertScreenshot";
import { truncate } from "service/utils";
import { hexToRgb, rgbToHex } from "service/color";
import { INPUT_NUMBER, INPUT, CHECKBOX } from "../../constants";

export const assertScreenshot = {
  template: ( command ) => {
    const options = {
        includeAA: command.params.includeAA,
        diffColor: hexToRgb( command.params.diffColor ),
        aaColor: hexToRgb( command.params.aaColor ),
        threshold: command.assert.mismatchTolerance
    };
    return buildAssertionTpl(
      `await bs.assertScreenshot( "${ command.testId }", ${ JSON.stringify( options, null, 2 ) } )`,
      command,
      `// Asserts that screenshot of the page matches earlier made one`
    );
  },

  toLabel: () => `()`,
  toText: () => `()`,
  commonly: "assert page screenshot",

  validate: ( values ) => {
    const { diffColor, aaColor } = values.params;
    if ( diffColor.trim().length !== 7 || !diffColor.startsWith( "#" ) ) {
      return "Invalid diff color";
    }
    if ( aaColor.trim().length !== 7 || !aaColor.startsWith( "#" ) ) {
      return "Invalid anti-alias color";
    }
    return null;
  },

  description: `Asserts that screenshot of the page matches the original.

  This method is meant for CSS regression testing where we compare visual differences on given targets.
  `,
  assert: {
    node: AssertScreenshot
  },
  params: [

    {
      span: { label: 4, input: 18 },
      description: "",
      tooltip: "",

      fields: [
        {
          name: "params.includeAA",
          label: "Include anti-aliased pixels",
          control: CHECKBOX ,
          tooltip: `If true, disables detecting and ignoring anti-aliased pixels`,
          initialValue: true
        },
        {
          name: "params.diffColor",
          control: INPUT,
          label: "Diff color (HEX)",
          initialValue: "#FF0000",
          tooltip: `The color of differing pixels in the diff output`,
          placeholder: "",
          rules: [{
            required: true,
            message: `Field is required.`,
            transform: ( val ) => val.trim()
          }]
        },
        {
          name: "params.aaColor",
          control: INPUT,
          label: "Anti-alias color (HEX)",
          initialValue: "#FFFF00",
          tooltip: `The color of anti-aliased pixels in the diff output`,
          placeholder: "",
          rules: [{
            required: true,
            message: `Field is required.`,
            transform: ( val ) => val.trim()
          }]
        }
      ]
    }

  ]
};
