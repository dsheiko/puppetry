import PropTypes from "prop-types";

export * from "./settings";
export * from "./app";
export * from "./project";
export * from "./suite";

export const suitePropTypes = PropTypes.shape({
  title: PropTypes.string.isRequired,
  timeout: PropTypes.number.isRequired,
  savedAt: PropTypes.any.isRequired,
  loadedAt: PropTypes.any.isRequired,
  modified: PropTypes.bool.isRequired,
  filename: PropTypes.string.isRequired,
  targets: PropTypes.object.isRequired,
  tests: PropTypes.object.isRequired
});


export const ID_REF = "string=";

export const SWAP_BASE_OPTIONS = {
  sourceInx: "number",
  targetInx: "number"
};

export const UPDATE = {
  id: "string"
};

export const ENTITY = {
  editing: "boolean=",
  id: "string=",
  disabled: "boolean=",
  expanded: "boolean="
};

export const TEST_REF = {};

export const COMMAND_REF = {
  testId: "string"
};

export const TARGET = {
  target: "string=",
  selector: "string="
};

export const VARIABLE = {
  name: "string=",
  value: "string=",
  env: "string="
};

export const TEST = {
  title: "string=",
  commands: "object="
};

export const COMMAND = {
  title: "string=",
  target: "string=",
  method: "string=",
  assert: "object=",
  params: "object=",
  failure: "string=",
  variables: "object=",
  ref: "string=",
  isRef: "boolean=",
  ...COMMAND_REF
};
