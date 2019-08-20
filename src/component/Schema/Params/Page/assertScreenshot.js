import { buildAssertionTpl } from "service/assert";
import { AssertScreenshot } from "../../Assert/AssertScreenshot";
import { truncate } from "service/utils";
import { hexToRgb, rgbToHex } from "service/color";
import { INPUT_NUMBER, INPUT } from "../../constants";

export const assertScreenshot = {
  template: ( command ) => {
    const options = {
      compare: {
        output: {
          errorColor: hexToRgb( command.params.errorColor ),
          transparency: command.params.transparency
        }
      }
    };
    return buildAssertionTpl(
      `await bs.assertScreenshot( "${ command.testId }", ${ JSON.stringify( options, null, 2 ) } );`,
      command,
      `// Asserts that screenshot of the page matches earlier made one`
    );
  },

  toLabel: () => `()`,
  toText: () => `()`,
  commonly: "assert page screenshot",

  validate: ( values ) => {
    const { errorColor } = values.params;
    if ( errorColor.trim().length === 7 && errorColor.startsWith( "#" ) ) {
      return null;
    }
    return "Invalid error color";
  },

  description: `Asserts that screenshot of the page matches the original.
  
  This method is meant for CSS regression testing where we compare visual differences on given targets.
  `,
  assert: {
    node: AssertScreenshot
  },
  params: [

    {
      collapsed: true,
      span: { label: 4, input: 18 },
      description: "",
      tooltip: "",

      fields: [
        {
          name: "params.errorColor",
          control: INPUT,
          label: "Error color (HEX)",
          initialValue: "#FF00FF",
          tooltip: `The color to highlight differed areas`,
          placeholder: "",
          rules: [{
            required: true,
            message: `Field is required.`,
            transform: ( val ) => val.trim()
          }]
        },
        {
          name: "params.transparency",
          control: INPUT_NUMBER,
          label: "Opacity value",
          initialValue: 0.3,
          tooltip: `Opacity (0-1) for the image on diff`,
          placeholder: "",
          rules: [{
            required: true,
            message: `Field is required.`
          }]
        }
      ]
    }

  ]
};
