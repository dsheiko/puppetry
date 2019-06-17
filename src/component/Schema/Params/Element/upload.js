import { FILE } from "../../constants";

export const upload = {
  template: ({ target, params }) => {
    const { path } = params;
    return `
      // Upload input[type=file]
      await ( await ${ target }() ).uploadFile( "${ path }" );`;
  },
  description: `Sets the value of a file input. Note that the target element must be INPUT of FILE type.
   It is also recommended to emulate click on the target (or clickable element calling the file browser)
   before going with this command.`,
  params: [

    {
      inline: true,
      fields: [
        {
          name: "params.path",
          control: FILE,
          label: "Select a file to attach",
          tooltip: "",
          placeholder: "",
          rules: [{
            required: true,
            message: "Select file path"
          }]
        }

      ]
    }

  ]
};
