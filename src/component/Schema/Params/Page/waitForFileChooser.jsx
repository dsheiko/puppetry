import { SELECT, INPUT_NUMBER } from "../../constants";
import { isEveryValueMissing } from "service/utils";

export const waitForFileChooser = {

  template: ({ params }) => {
    const { timeout } = params,
          options = {
            timeout
          },
          optArg = isEveryValueMissing( options ) ? `` : ` ${ JSON.stringify( options ) } `;
    return `
      // Waiting for file chooser
      await bs.page.waitForFileChooser(${optArg});
    `;
  },

  toLabel: ({ params }) => {
    return `(with timeout \`${ params.timeout }ms\`)`;
  },
  toGherkin: ({ params }) => `Wait for the file chooser with timeout \`${ params.timeout }ms\``,
  commonly: "wait for the file chooser",


  params: [
    {
      collapsed: true,
      tooltip: "",
      fields: [
        {
          name: "params.timeout",
          control: INPUT_NUMBER,
          label: "Timeout (ms)",
          initialValue: 30000,
          tooltip: `Maximum navigation time in milliseconds, defaults to 30 seconds, pass 0 to disable timeout.`,
          placeholder: "",
          rules: []
        }

      ]
    }
  ],

  test: [
    {
      valid: true,
      "params": {
        "timeout": 30000
      }
    }
  ]
};
