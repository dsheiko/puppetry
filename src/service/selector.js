import { SelectorParserException } from "error";
import { SELECTOR_CHAIN_DELIMITER, SELECTOR_CSS, SELECTOR_XPATH } from "constant";

export function validateSelector( rawSelectorChain ) {
  const selectorChain = ( rawSelectorChain || "" ).trim();
  if ( !selectorChain ) {
    throw new SelectorParserException( "Selector cannot be empty" );
  }
  return validateSimpleSelector( selectorChain );
}

export function validateSimpleSelector( selector ) {
  const isCssValid = validateCss( selector ),
        isXpathValid = validateXpath( selector );

  if ( !isCssValid && !isXpathValid ) {
    throw new SelectorParserException( `The value "${ selector }" is neither a valid CSS nor XPath` );
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

export function mapSelectors( targetArr ) {
  return targetArr.map( target => ({
      target: target.target,
      selector: target.selector,
      ref: target.ref,
      parentType: target.parentType,
      css: validateSimpleSelector( target.selector ) === SELECTOR_CSS
  }));
}