import { justify } from "service/assert";
import { CHECKBOX } from "../../constants";

export const checkBox = {
  template: ({ target, params }) => justify(
    `// Changing checkbox/radio state\n`
    + `await ( await ${target}() ).type( "${params.value}" );` ),
  description: `Change checkbox/radio state`,
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
          initialValue: ""
        }
      ]
    }
  ]
};
