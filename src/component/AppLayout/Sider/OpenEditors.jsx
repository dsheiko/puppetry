import React from "react";
import PropTypes from "prop-types";
import { Icon } from "antd";
import { FileIcon } from "./FileIcon";

const TAB_LABELS = {
  testReport:       "Test report",
  projectVariables: "Template variables",
  projectTargets:   "Shared Locators",
  settings:         "Settings"
};

export function OpenEditors({ open, tabs, suiteFilename, suiteSnippets, onToggle, onTabClick }) {
  const suiteLabel = suiteFilename
    ? ( suiteSnippets ? "Shared Flows" : suiteFilename )
    : "Loading...";

  const labels = { suite: suiteLabel, ...TAB_LABELS };

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
      { open && Object.keys( tabs.available )
          .filter( key => tabs.available[ key ] )
          .map( key => (
            <div key={ key }
              role="button"
              tabIndex={0}
              className={ `vsc-explorer-item${ key === tabs.active ? " is-active" : "" }` }
              onClick={ () => onTabClick( key ) }
            >
              <FileIcon tabKey={ key } />
              { labels[ key ] }
            </div>
          ) )
      }
    </div>
    </>
  );
}

OpenEditors.propTypes = {
  open:          PropTypes.bool.isRequired,
  onToggle:      PropTypes.func.isRequired,
  onTabClick:    PropTypes.func.isRequired,
  tabs:          PropTypes.object.isRequired,
  suiteFilename: PropTypes.string,
  suiteSnippets: PropTypes.any
};
