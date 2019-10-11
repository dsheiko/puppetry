import { INPUT_NUMBER, CHECKBOX, SELECT } from "../../constants";

export const setViewport = {
  template: ({ params }) => `
      // Defining browser viewport
      await bs.page.setViewport({
        width: ${ params.width },
        height: ${ params.height },
        deviceScaleFactor: ${ params.deviceScaleFactor },
        isMobile: ${ params.isMobile ? "true" : "false" },
        hasTouch: ${ params.hasTouch ? "true" : "false" },
        isLandscape: ${ params.isLandscape ? "true" : "false" }
      });
  `,

  toLabel: ({ params }) => `(\`${ params.width }x${ params.height }\`,`
       + ` \`x${ params.deviceScaleFactor || 1 }\`${ params.isLandscape ? ", \`landscape\`" : "" })`,

  toGherkin: ({ params }) => `Set browser viewport as \`${ params.width }x${ params.height }\`,`
       + ` \`x${ params.deviceScaleFactor || 1 }\`${ params.isLandscape ? ", \`landscape\`" : "" }`,

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
          label: "Width (px)",
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
          label: "Height (px)",
          tooltip: "",
          placeholder: "",
          rules: [{
            required: true,
            message: `Field is required.`
          }]
        },
        {
          name: "params.resolution",
          control: SELECT,
          label: "Resolution",
          tooltip: "",
          placeholder: "",
          initialValue: "",
          onChange: ( value, form ) => {
            if ( !value ) {
              return;
            }
            const [ w, h ] = value.split( "x" );
            form.setFieldsValue({
              "params.width": w,
              "params.height": h
            });
          },
          options: [
            { value: "", description: "Custom" },
            { value: "640x360", description: "nHD 16:9 (640x360)" },
            { value: "800x600", description: "SVGA 4:3 (800x600)" },
            { value: "1024x768", description: "XGA 4:3 (1024x768)" },
            { value: "1280x720", description: "WXGA 16:9 (1280x720)" },
            { value: "1280x1024", description: "SXGA 5:4 (1280x1024)" },
            { value: "1360x768", description: "HD ≈16:9 (1360x768)" },
            { value: "1440x900", description: "WXGA+ 16:10 (1440x900)" },
            { value: "1600x900", description: "HD+ 16:9 (1600x900)" },
            { value: "1680x1050", description: "WSXGA+ 16:10 (1680x1050)" },
            { value: "1920x1080", description: "FHD 16:9 (1920x1080)" },
            { value: "1920x1200", description: "WUXGA 16:10 (1920x1200)" },
            { value: "2048x1152", description: "QWXGA 16:9 (2048x1152)" },
            { value: "2560x1440", description: "QHD 16:9 (2560x1440)" },
            { value: "3840x2160", description: "4K UHD 16:9 (3840x2160)" }
          ]
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
          label: "Scale factor",
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
  ],

  test: [
    {
      valid: true,
      "params": {
        "width": 1920,
        "height": 1080,
        "deviceScaleFactor": 1,
        "isMobile": false,
        "hasTouch": false,
        "isLandscape": false
      }
    }
  ]
};
