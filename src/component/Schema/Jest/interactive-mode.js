function buildAddon() {
  return "";
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
