import { getSchema } from "component/Schema/schema";

function buildAddon( record ) {
  try {
    const schema = getSchema( record.target === "page" ? "page" : "target", record.method ),
          val = typeof schema.toLabel === "function" ? schema.toLabel( record ) : "";

    return val
      .replace( /\n/gm, " " )
      .replace( /`/g, " " )
      .replace( /"/g, "" );
  } catch ( err ) {
    console.warn( `Renderer process: CommandRowLabel::buildTargetAddon: ${ err }` );
  }
}

function renderRef( ref, snippets ) {
  const tests = snippets.tests;
  if ( !tests || !tests.hasOwnProperty( ref ) ) {
    return ``;
  }
  const test = tests[ ref ];
  return renderCommands( test.commands, snippets );
}


function renderCommands( commands, snippets ) {
  return Object.values( commands )
    .filter( test => test.disabled !== true )
    .reduce( ( carry, command ) => {
      if ( command.isRef ) {
        return carry + renderRef( command.ref, snippets );
      }
      return `${ carry }<li class='__PUPPETRY_C_LI' data-puppetry-cid='${ command.id }'>`
        + `<span><b>${ command.target }</b>.${ command.method }`
        + `<i>${ buildAddon( command ) }</i></span></li>`;
    }, "" );
}

function renderTestCases( tests, snippets ) {
  return Object.values( tests )
    .filter( test => test.disabled !== true )
    .reduce( ( carry, test ) => `${ carry }<li><span>${ test.title }</span>`
    + `<ul>${ renderCommands( test.commands, snippets ) }</ul></li>`, "" );
}

export function renderSuiteHtml( suite, snippets ) {
  return renderTestCases( suite.tests, snippets );
}
