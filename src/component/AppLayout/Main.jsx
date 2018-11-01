import React from "react";
import PropTypes from "prop-types";
import { Collapse } from "antd";
import { GroupTable  } from "./Main/GroupTable";
import { SuiteForm  } from "./Main/SuiteForm";
import { TargetTable  } from "./Main/TargetTable";
import ErrorBoundary from "component/ErrorBoundary";
const Panel = Collapse.Panel;

export class Main extends React.Component {

  static propTypes = {
    store: PropTypes.object.isRequired,
    action: PropTypes.shape({
      setProject: PropTypes.func.isRequired
    })
  }

  onChangeCollapse = ( panels ) => {
    this.props.action.setProject({ panels });
  }

  render() {
    const { action, store } = this.props;
    return (
      <ErrorBoundary>
        <div>
          <SuiteForm  action={action} title={store.suite.title} />
          <Collapse bordered={false} activeKey={ [ ...store.project.panels ] }
            onChange={ this.onChangeCollapse }>
            <Panel header="Test targets" key="targets">
              <p>Target constants used to address an element on the page.
              One can use DevTools to inspect the DOM and copy selectors</p>
              <TargetTable action={action} targets={store.suite.targets} />
            </Panel>
            <Panel header="Test groups" key="groups">
              <p>You can use drag&apos;n&apos;drop to re-arrange rows representing tests or test groups.</p>
              <GroupTable
                action={action}
                expanded={store.project.groups}
                groups={store.suite.groups}
                targets={store.suite.targets} />
            </Panel>
          </Collapse>
        </div>
      </ErrorBoundary>
    );
  }
}
