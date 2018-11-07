// @see https://github.com/facebook/jest/issues/6766
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
const esprima = require( "esprima" );

// More settings if needed
configure({ adapter: new Adapter() });

global.snapshot = ( str ) => {
  return str.replace( /\s/gm, "" );
};

global.validateAsyncFuncBody = ( code ) => {
  return esprima.parse( "async function fooBarBaz() {\n " + code + "\n}", { tolerant: true } );
};