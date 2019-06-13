import { justify } from "service/assert";
import { CHECKBOX } from "../../constants";

export const checkBox = {
  template: ({ params, targetSeletor }) => justify(
    `// Changing checkbox/radio state\n`
    + `await bs.page.$eval( '${ targetSeletor }',
  ( el, value ) => {
    if ( value === "false" ) {
      return el.removeAttribute( "checked" );
    }
    el.setAttribute( "checked", value );
    }, `
    + `"${ params.checked }" );`),
  description: `Toggle checkbox/radio state`,
  params: [
    {

      legend: "",
      tooltip: "",
      fields: [
        {
          name: "params.checked",
          control: CHECKBOX,
          label: "Checked?",
          help: "",
          initialValue: "false"
        }
      ]
    }
  ]
};
