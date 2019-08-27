import { getSchema } from "component/Schema/schema";

function buildAddon( record ) {

  try {
    const schema = getSchema( record.target === "page" ? "page" : "target", record.method ),
          val = typeof schema.toLabel === "function" ? schema.toLabel( record ) : "";
    return val.replace( /`/g, " " ).replace( /\"/g, "" );
  } catch ( err ) {
    log.warn( `Renderer process: CommandRowLabel::buildTargetAddon: ${ err }` );
  }
}


function renderCommands( commands ) {
  return Object.values( commands )
    .filter( test => test.disabled !== true )
    .reduce(( carry, command ) => {
      return `${ carry }<li class='__PUPPETRY_C_LI' data-puppetry-cid='${ command.id }'>`
        + `<span><b>${ command.target }</b>.${ command.method }`
        + `<i>${ buildAddon( command ) }</i></span></li>`;
  }, "");
}

function renderTestCases( tests ) {
  return Object.values( tests )
    .filter( test => test.disabled !== true )
    .reduce(( carry, test ) => `${ carry }<li><span>${ test.title }</span>`
    + `<ul>${ renderCommands( test.commands ) }</ul></li>`, "" );
}

export function renderSuiteHtml( suite ) {
  return Object.values( suite.groups )
    .filter( group => group.disabled !== true )
    .reduce(( carry, group ) => `${ carry }<li><span>${ group.title }</span>`
      + `<ul>${ renderTestCases( group.tests ) }</ul></li>`, "" );
}