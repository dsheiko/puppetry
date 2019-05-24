import PropTypes from "prop-types";

export const suitePropTypes = PropTypes.shape({
  title: PropTypes.string.isRequired,
  timeout: PropTypes.number.isRequired,
  savedAt: PropTypes.any.isRequired, // Date, ""
  loadedAt: PropTypes.any.isRequired, // Date, ""
  modified: PropTypes.bool.isRequired,
  filename: PropTypes.string.isRequired,
  targets: PropTypes.object.isRequired,
  groups: PropTypes.object.isRequired
});


export const ID_REF = "string=";

export const ERROR_OPTIONS = {
  visible: "boolean",
  message: "string",
  description: "string="
};


export const UPDATE_SUITE_OPTIONS = {
  title: "string=",
  modified: "boolean=",
  editing: "boolean="
};


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
  disabled: "boolean="
};

export const TEST_REF = {
  groupId: "string"
};

export const COMMAND_REF = {
  groupId: "string",
  testId: "string"
};

export const TARGET = {
  target: "string=",
  selector: "string="
};

export const GROUP = {
  title: "string=",
  tests: "object="
};

export const TEST = {
  title: "string=",
  commands: "object=",
  ...TEST_REF
};

export const COMMAND = {
  title: "string=",
  ...COMMAND_REF
};

