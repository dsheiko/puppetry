import { INPUT_NUMBER } from "../../constants";

export const waitFor = {
  template: ({ params }) => `
      // Waiting for ${params.value} ms
      await bs.page.waitFor( ${params.value} );
  `,

  toLabel: ({ params }) => `(\`${ params.value }ms\`)`,
  toGherkin: ({ params }) => `Wait for \`${ params.value }ms\``,
  commonly: "wait for timeout",

  description: `Waits for a given time before proceeding to the next command`,
  params: [
    {
      inline: true,
      legend: "",
      tooltip: "",
      fields: [
        {
          name: "params.value",
          control: INPUT_NUMBER,
          label: "Timeout (ms)",
          tooltip: "",
          placeholder: "",
          rules: [{
            required: true,
            message: "Parameter is required"
          }]
        }
      ]
    }
  ]
};
