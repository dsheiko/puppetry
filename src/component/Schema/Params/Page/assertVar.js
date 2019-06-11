import { buildAssertionTpl } from "service/assert";
import { AssertValue } from "../../Assert/AssertValue";
import { INPUT } from "../../constants";

export const assertVar = {
  template: ( command ) => buildAssertionTpl(
    `ENV[ ${ JSON.stringify( command.params.name ) } ]`,
    command,
    `// Asserting that variable associated with a given name satisfies the given constraint`
  ),
  description: `Asserts that variable associated with a given name satisfies the given constraint`,
  assert: {
    node: AssertValue
  },
  params: [
    {
      legend: "",
      description: "",
      tooltip: "",
      fields: [
        {
          name: "params.name",
          control: INPUT,
          label: "Variable name",
          rules: [{
              required: true,
              message: "This field is required"
            },
            {
              validator: ( rule, value, callback ) => {
                const reConst = /^[A-Z_\-0-9]+$/g;
                if ( !value ) {
                  callback( `Field is required.` );
                }
                if ( !value.match( reConst ) ) {
                  callback( `Shall be in all upper case with underscore separators` );
                }
                callback();
              }
            }
          ]
        }
      ]
    }
  ]
};
