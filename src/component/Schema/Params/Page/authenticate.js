import { INPUT } from "../../constants";

export const authenticate = {
  template: ({ params }) => {
    const { username, password } = params,
          options = {
            username,
            password
          };
    return `
      // Provide credentials for HTTP authentication
      await bs.page.authenticate(${ JSON.stringify( options ) });`;
  },

  toLabel: ({ params }) => `(username: \`${ params.username }\`, password: \`****\`)`,
  toGherkin: ({ params }) => `Authenticate
    username: \`${ params.username }\` and password: \`****\``,
  commonly: "authenticate",

  description: `Provide credentials for
    [HTTP authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication).`,

  params: [
    {


      fields: [
        {

          name: "params.username",
          control: INPUT,
          label: "username",
          tooltip: "",
          placeholder: "",
          rules: [{
            required: true,
            message: "Enter username"
          }]
        },
        {

          name: "params.password",
          control: INPUT,
          label: "password",
          tooltip: "",
          placeholder: "",
          rules: [{
            required: true,
            message: "Enter password"
          }]
        }
      ]


    }
  ],

  testTypes: {
    "params": {
      "username": "INPUT",
      "password": "INPUT"
    }
  },

  test: [
    {
      valid: true,
      "params": {
        "username": "username",
        "password": "password"
      }
    }
  ]
};
