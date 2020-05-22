import devices from "vendor/puppeteer/DeviceDescriptors";
import { SELECT } from "../../constants";

const options = Object.values( devices ).map( i =>  ({
  value: i.name,
  description: `${i.name} (${i.viewport.width}x${i.viewport.height}, ${i.viewport.deviceScaleFactor}x)`
}) );

export const emulate = {
  template: ({ params }) => `
      // Emulating device "${ params.device }"
      await bs.page.emulate( devices[ "${ params.device }" ] );
  `,

  toLabel: ({ params }) => `(\`${ params.device }\`)`,
  toGherkin: ({ params }) => `Emulate device \`${ params.device }\``,
  commonly: "emulate device",

  description: `Emulates given device metrics and user agent`,
  params: [
    {
      inline: false,
      legend: "",
      tooltip: "",
      fields: [
        {
          name: "params.device",
          control: SELECT,
          label: "Device",
          tooltip: "",
          placeholder: "",
          options,
          rules: [{
            required: true,
            message: "Select device"
          }]
        }
      ]
    }
  ],

  test: [
    {
      valid: true,
      "params": {
        "device": "Blackberry PlayBook landscape"
      }
    }
  ]
};
