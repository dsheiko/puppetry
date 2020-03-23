import { FILE, INPUT, INPUT_NUMBER } from "../../constants";
import { renderTarget, result } from "service/utils";
import fs from "fs";
import { join } from "path";

export const upload = {
  template: ({ target, params, targetObj, projectDirectory }) => {
    const { path, name, size } = params,
          resolvedPath = path ? ( fs.existsSync( path ) ? path : join( projectDirectory, path ) ) : null;

    return `
      // Upload input[type=file]
      ${ ( name && size )
    ? `result = util.generateTmpUploadFile( "${ name }", ${ size } );`
    : `result = "${ resolvedPath }";` }
      await ( ${ renderTarget( target ) } ).uploadFile( result );
      // workaround https://github.com/puppeteer/puppeteer/issues/5420
      if ( ${ JSON.stringify( targetObj.css ) } ) {
        await bs.page.evaluate(( inputSelector ) => {
          document.querySelector( inputSelector ).dispatchEvent(new Event('change', { bubbles: true }));
        }, ${ JSON.stringify( targetObj.selector ) } );
      }`;
  },

  toLabel: ({ params }) => ( params.name && params.size )
    ? `(\`${ params.name }\` of \`${ params.size }kB\` size)` : `(\`${ params.path }\`)`,
  toGherkin: ({ target, params }) => ( params.name && params.size )
    ? `Attach file \`${ params.name }\` of \`${ params.size }kB\` size to file input \`${ target }\``
    : `Attach file \`${ params.path }\` to file input \`${ target }\``,

  commonly: "attach a file to file input",

  description: `Sets the value of a file input. Note that the target element must be INPUT of FILE type.
   It is also recommended to emulate click on the target (or clickable element calling the file browser)
   before going with this command.`,

  validate: ( values ) => {
    const path = String( result( values.params, "path", "" ) ).trim(),
          name = String( result( values.params, "name", "" ) ).trim(),
          size = result( values.params, "size", 0 );

    if ( !path && ( !name || !size ) ) {
      return "You have to provide either attachment file path or name and size in Advanced options";
    }

    return null;
  },

  params: [

    {
      inline: true,
      fields: [
        {
          name: "params.path",
          control: FILE,
          label: "Select a file",
          tooltip: "",
          placeholder: "",
          rules: [{
            message: "Select a file path to attach to the input"
          }]
        }

      ]
    },

    {
      collapsed: true,
      description: "Alternatively you can generate a file on the fly",
      tooltip: "",

      fields: [
        {
          name: "params.size",
          control: INPUT_NUMBER,
          label: "File Size (Kb)",
          initialValue: 0,
          placeholder: ""
        },
        {
          name: "params.name",
          control: INPUT,
          label: "File name",
          initialValue: "attachment.txt",
          placeholder: ""
        }
      ]
    }

  ],

  testTypes: {
    "params": {
      "size": "INPUT",
      "name": "INPUT"
    }
  },

  test: [
    {
      valid: true,
      "params": {
        "size": "10",
        "name": "attachment.txt"
      }
    }
  ]
};
