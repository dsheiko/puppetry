// @see https://github.com/facebook/jest/issues/6766
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
// More settings if needed
configure({ adapter: new Adapter() });

global.snapshot = ( str ) => {
  return str.replace( /\s/gm, "" );
};