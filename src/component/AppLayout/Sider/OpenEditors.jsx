import React from "react";
import PropTypes from "prop-types";
import { Icon } from "antd";

export function OpenEditors({ open, suiteFilename, suiteModified, onToggle }) {
  return (
    <>
    <div className="vsc-explorer-heading">Explorer</div>
    <div className="vsc-explorer-section">
      <div
        className="vsc-explorer-section__header"
        role="button"
        tabIndex={0}
        onClick={ onToggle }
      >
        <Icon type={ open ? "caret-down" : "caret-right" } />
        Open Editors
      </div>
      { open && suiteFilename && (
        <div className="vsc-explorer-item is-active">
          <Icon type="file" />
          { suiteFilename }
          { suiteModified && <span className="vsc-explorer-item__dot" title="Unsaved changes">●</span> }
        </div>
      ) }
    </div>
    </>
  );
}

OpenEditors.propTypes = {
  open:          PropTypes.bool.isRequired,
  onToggle:      PropTypes.func.isRequired,
  suiteFilename: PropTypes.string,
  suiteModified: PropTypes.bool
};
