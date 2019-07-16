import { SELECT, INPUT, INPUT_NUMBER } from "../../constants";
import ExpressionParser from "service/ExpressionParser";
import { truncate } from "service/utils";

export const setCookie = {
  /**
   * @param {TemplatePayload} payload
   * @returns {String}
   */
  template: ({ params, id }) => {

    const { name, value, domain, path, expires, httpOnly, secure, sameSite } = params,
          parser = new ExpressionParser( id );
    return `
      // Set cookies on the page
      await bs.page.setCookie({
        name: ${ parser.stringify( name ) },
        value: ${ parser.stringify( value ) },
        domain: ${ parser.stringify( domain ) },
        path: ${ path || "undefined" },
        expires: ${ expires || "undefined" },
        httpOnly: ${ httpOnly || "undefined" },
        secure: ${ secure || "undefined" },
        sameSite: ${ sameSite || "undefined" }
      });
    `;
  },

  toLabel: ({ params }) => `(${ params.name }, "${ truncate( params.value, 60 ) }")`,
  toText: ({ params }) => `(${ params.name }, "${ params.value }")`,
  commonly: "set page cookies",

  description: "Sets [cookies](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie) on the page",

  params: [
    {
      legend: "",
      description: "",
      tooltip: "",
      span: { label: 4, input: 18 },
      fields: [
        {
          name: "params.name",
          template: true,
          control: INPUT,
          inputStyle: { maxWidth: 200 },
          label: "Name",
          placeholder: "e.g. foo",
          rules: [{
            required: true,
            message: `Field is required.`
          }]
        },
        {
          name: "params.value",
          template: true,
          control: INPUT,
          label: "Value",
          placeholder: "e.g. FOO",
          rules: [{
            required: true,
            message: `Field is required.`
          }]
        },
        {
          name: "params.domain",
          template: true,
          control: INPUT,
          label: "Domain",
          inputStyle: { maxWidth: 200 },
          rules: [{
            required: true,
            message: `Field is required.`
          }]
        }
      ]
    },
    {
      collapsed: true,
      span: { label: 4, input: 18 },
      description: "",
      tooltip: "",

      fields: [

        {
          name: "params.path",
          control: INPUT,
          label: "Path"
        },
        {
          name: "params.expires",
          control: INPUT_NUMBER,
          describe: "Unix time in seconds.",
          label: "Expires"
        },
        {
          name: "params.httpOnly",
          control: SELECT,
          inputStyle: { maxWidth: 200 },
          label: "HTTP-only",
          initialValue: "",
          options: [ "", "true", "false" ]
        },
        {
          name: "params.secure",
          control: SELECT,
          inputStyle: { maxWidth: 200 },
          label: "Secure",
          initialValue: "",
          options: [ "", "true", "false" ]
        },
        {
          name: "params.sameSite",
          control: SELECT,
          inputStyle: { maxWidth: 200 },
          label: "Same site",
          initialValue: "",
          options: [ "", "Strict", "Lax" ]
        }
      ]
    }
  ]
};
