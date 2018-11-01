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