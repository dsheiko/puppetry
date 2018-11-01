import { INPUT_NUMBER } from "../../constants";

export const waitFor = {
  template: ({ params }) => `
      // Waiting for ${params.value} ms
      await bs.page.waitFor( ${params.value} );
  `,
  description: `Waits for a given time before proceeding to the next command`,
  params: [
    {
      inline: true,
      legend: "",
      tooltip: "",
      items: [
        {
          name: "params.value",
          control: INPUT_NUMBER,
          label: "Timeout to wait for (ms)",
          tooltip: "",
          placeholder: "",
          rules: [{
            required: true,
            message: "Enter URL"
          }]
        }
      ]
    }
  ]
};
