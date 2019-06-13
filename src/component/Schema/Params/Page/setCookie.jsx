import React from "react";
import { SELECT, CHECKBOX, INPUT, INPUT_NUMBER } from "../../constants";
import { isEveryValueMissing } from "service/utils";
import Link from "component/Global/Link";
import ExpressionParser from "service/ExpressionParser";

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

  description: "Set cookies on the page",

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
          label: "HTTP-only",
          initialValue: "",
          options: [ "", "true", "false" ]
        },
        {
          name: "params.secure",
          control: SELECT,
          label: "Secure",
          initialValue: "",
          options: [ "", "true", "false" ]
        },
        {
          name: "params.sameSite",
          control: SELECT,
          label: "Same site",
          initialValue: "",
          options: [ "", "Strict", "Lax" ]
        }
      ]
    }
  ]
};
