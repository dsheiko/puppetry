import { buildAssertionTpl } from "service/assert";
import { AssertDialog } from "../../Assert/AssertDialog";
import { truncate } from "service/utils";
import { CHECKBOX, INPUT, SELECT } from "../../constants";

function getOptionsString( params ) {
  const options = [];
  params.dismiss && options.push( "`dismiss`" );
  params.accept && options.push( "`accept`" );
  return options.join( ", " );
}


export const handleDialog = {

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
        ${ params.dismiss ? `await dialog.dismiss();` : `` }
        ${ params.accept ? `await dialog.accept(${ JSON.stringify( params.promptText || "" ) });` : `` }
      });
  `,

  description: `Dismiss or accept dialog (alert, beforeunload, confirm or prompt) when it invokes

**NOTE**: the assertion must be defined before the expected dialog event`,
  commonly: "dismiss/accept dialog",

  toLabel: ({ params }) => `(${ getOptionsString( params ) })`,
  toText: ({ params }) => `(${ getOptionsString( params ) })`,


  params: [
    {
      inline: true,
      legend: "",
      tooltip: "",
      span: { label: 4, input: 18 },
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
          name: "params.dismiss",
          control: CHECKBOX,
          label: "Shall we dismiss the dialog?",
          tooltip: "",
          placeholder: ""
        },
        {
          name: "params.accept",
          control: CHECKBOX,
          label: "Shall we accept the dialog?",
          tooltip: "Does not cause any effects if the dialog's type is not prompt.",
          placeholder: ""
        },
        {
          name: "params.promptText",
          control: INPUT,
          label: "A text to enter in prompt",
          tooltip: "Does not cause any effects if the dialog's type is not prompt.",
          placeholder: ""
        }
      ]
    }
  ]
};


