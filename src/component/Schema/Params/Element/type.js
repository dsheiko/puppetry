import { justify } from "service/assert";
import { INPUT } from "../../constants";

export const type = {
  template: ({ target, params }) => justify(
    `// Emulating user input\n`
    + `await ( await ${target}() ).type( "${params.value}" );` ),
  description: `Focuses the element, and then sends keyboard events for each character in the text`,
  params: [
    {
      inline: false,
      legend: "",
      tooltip: "",
      fields: [
        {
          name: "params.value",
          control: INPUT,
          label: "A text to type into a focused element",
          help: "",
          placeholder: "e.g. Jon Snow",
          initialValue: "",
          rules: [{
            required: true,
            message: "Text required"
          }]
        }
      ]
    }
  ]
};
