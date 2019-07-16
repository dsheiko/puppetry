import { INPUT_NUMBER, CHECKBOX } from "../../constants";

export const setViewport = {
  template: ({ params }) => `
      // Defining browser viewport
      await bs.page.setViewport( ${ JSON.stringify( params ) } );
  `,

  toLabel: ({ params }) => `(${ params.width }, ${ params.height },`
       + ` x${ params.deviceScaleFactor || 1 }${ params.isLandscape ? ", landscape" : "" })`,
  commonly: "set window size",

  description: `Defines browser viewport, where the viewport is the user's visible area of a web page`,
  params: [
    {

      legend: "",
      tooltip: "",
      fields: [
        {
          name: "params.width",
          control: INPUT_NUMBER,
          label: "width (px)",
          tooltip: "",
          placeholder: "",
          rules: [{
            required: true,
            message: `Field is required.`
          }]
        },
        {
          name: "params.height",
          control: INPUT_NUMBER,
          label: "height (px)",
          tooltip: "",
          placeholder: "",
          rules: [{
            required: true,
            message: `Field is required.`
          }]
        }
      ]
    },


    {
      collapsed: true,
      legend: "",
      tooltip: "",
      fields: [
        {
          name: "params.deviceScaleFactor",
          control: INPUT_NUMBER,
          label: "device scale factor",
          tooltip: "Device scale factor aka Device Pixel Ratio. By default is 1, maximum value 8. E.g. "
            + "for retina display the value is 2",
          placeholder: "",
          initialValue: 1,
          rules: [{
            required: true,
            message: `Field is required.`
          }]
        },

        {
          name: "params.isMobile",
          label: "mobile device",
          control: CHECKBOX ,
          tooltip: "",
          placeholder: "",
          rules: []
        },

        {
          name: "params.hasTouch",
          label: "touch events",
          control: CHECKBOX ,
          tooltip: "Specifies if viewport supports touch events",
          placeholder: "",
          rules: []
        },

        {
          name: "params.isLandscape",
          label: "landscape orientation",
          control: CHECKBOX ,
          tooltip: "Specifies if viewport is in landscape mode",
          placeholder: "",
          rules: []
        }
      ]
    }
  ]
};
