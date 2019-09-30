import { SelectorParserException } from "error";
import { SELECTOR_CHAIN_DELIMITER, SELECTOR_CSS, SELECTOR_XPATH } from "constant";

export function validateSelector( rawSelectorChain ) {
  const selectorChain = ( rawSelectorChain || "" ).trim();
  if ( !selectorChain ) {
    throw new SelectorParserException( "Selector cannot be empty" );
  }

  if ( !selectorChain.includes( SELECTOR_CHAIN_DELIMITER ) ) {
    // Not a chain
    return validateSimpleSelector( selectorChain );
  }

  selectorChain
    .split( SELECTOR_CHAIN_DELIMITER )
    .forEach(( sel ) => {
      if ( !validateCss( sel ) ) {
        throw new SelectorParserException( `Shadow DOM query must consist of valid CSS selectors` );
      }
    });
}


export function validateSimpleSelector( selector ) {
  const isCssValid = validateCss( selector ),
        isXpathValid = validateXpath( selector );

  if ( !isCssValid && !isXpathValid ) {
    throw new SelectorParserException( `The value is neither a valid CSS nor XPath` );
  }

  return isCssValid ? SELECTOR_CSS : SELECTOR_XPATH;
}

function validateCss( selector ) {
  try {
    document.querySelector( selector );
  } catch ( e ) {
    if ( e instanceof DOMException ) {
      return false;
    }
  }
  return true;
}

function validateXpath( selector ) {
  try {
    document.evaluate( selector, document.body, null, XPathResult.ANY_TYPE, null );
  } catch ( e ) {
    if ( e instanceof DOMException ) {
      return false;
    }
  }
  return true;
}


