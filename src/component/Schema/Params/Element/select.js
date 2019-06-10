import { justify } from "service/assert";
import { INPUT } from "../../constants";

export const select = {
  template: ({ params, targetSeletor }) => justify(
    `// Emulating select\n`
    + `await bs.page.select( "${ targetSeletor }", "${ params.value }" );` ),
  description: `Sets value on select element`,
  params: [
    {
      
      legend: "",
      tooltip: "",
      fields: [
        {
          name: "params.value",
          control: INPUT,
          label: "Text of an option value to look for",
          help: "",
          placeholder: "e.g. foo",
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
