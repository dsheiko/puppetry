import { buildAssertionTpl } from "service/assert";
import { AssertDialog } from "../../Assert/AssertDialog";
import { truncate } from "service/utils";
import { CHECKBOX, INPUT, SELECT } from "../../constants";

function getOptionsString( params ) {
  const options = [];
  options.push( params.action );
  options.push( `\`${ params.type }\`` );
  options.push( `with \`${ truncate( params.substring, 60 ) }\`` );
  return options.join( " " );
}


export const closeDialog = {

  template: ({ params }) => `
      // Handle dialog
      bs.page.on( "dialog", async( dialog ) => {
        let result = dialog.message();
        if ( "${ params.type }" !== "any" && dialog.type() !== "${ params.type }" ) {
          return;
        }
        if ( !result.includes( ${ JSON.stringify( params.substring ) } ) ) {
          return;
        }
        ${ params.action === "dismiss" ? `await dialog.dismiss();` : `` }
        ${ params.action === "accept" ? `await dialog.accept(${ JSON.stringify( params.promptText || "" ) });` : `` }
      });
  `,

  description: `Dismiss or accept dialog (alert, beforeunload, confirm or prompt) when it invokes

**NOTE**: the step must be defined before the expected dialog event`,
  commonly: "dismiss/accept dialog",

  toLabel: ({ params }) => `(${ getOptionsString( params ) })`,
  toText: ({ params }) => `(${ getOptionsString( params ) })`,


  params: [
    {
      inline: true,
      legend: "",
      tooltip: "",
      fields: [

        {
          name: "params.substring",
          control: INPUT,
          label: "Message contains",
          placeholder: "",
          rules: [{
            required: true,
            message: `Field is required.`
          }]
        },

        {
          name: "params.type",
          inputStyle: { maxWidth: 200 },
          control: SELECT,
          label: "Dialog type",
          placeholder: "",
          initialValue: "any",
          options: [
            "any",
            "alert",
            "beforeunload",
            "confirm",
            "prompt"
          ],
          rules: [{
            required: true,
            message: `Field is required.`
          }]
        },

        {
          name: "params.action",
          inputStyle: { maxWidth: 200 },
          control: SELECT,
          label: "Action",
          placeholder: "",
          initialValue: "accept",
          options: [
            { value: "dismiss", description: "dismiss/close" },
            { value: "accept", description: "accept" }
          ],
          rules: [{
            required: true,
            message: `Field is required.`
          }]
        },

        {
          name: "params.promptText",
          control: INPUT,
          label: "Prompt text",
          tooltip: "Does not cause any effects if the dialog's type is not prompt.",
          placeholder: "(optional)"
        }
      ]
    }
  ]
};


