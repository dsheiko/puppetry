import { createActions } from "redux-actions";
import { validate } from "bycontract";
import * as I from "interface";

const actions = createActions({
  SET_ERROR: ( options ) => validate( options, I.ERROR_OPTIONS )
});

export default actions;