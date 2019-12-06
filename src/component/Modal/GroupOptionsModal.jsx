import React from "react";
import PropTypes from "prop-types";
import { Form, Spin, Button, Input } from "antd";
import { InstantModal } from "component/Global/InstantModal";
import ErrorBoundary from "component/ErrorBoundary";

const FormItem = Form.Item,
      connectForm = Form.create();

@connectForm
export class GroupOptionsModal extends React.Component {

  static propTypes = {

  }

  state = {
    loading: false,
    submitted: false
  }

  onOK = () => {
    this.setState({ submitted: true });
  }

  resetSubmitted = () => {
    this.setState({ submitted: false });
  }

  onCancel = ( record ) => {
    const { setApp } = this.props.action;
    this.setState({ submitted: false });
    setApp({
      groupOptionsModal: {
        isVisible: false,
        record: null
      }
    });
  }

  render() {
    const { loading, submitted } = this.state,
          { record, isVisible } = this.props,
          { getFieldDecorator } = this.props.form,

          deferCommandForm = () => <Form>
            <FormItem  label="Start page to crawl">
              { getFieldDecorator( "index", {
                initialValue: "",
                rules: [{
                  required: true,
                  message: "Please enter URL"
                }
                ]
              })(
                <Input placeholder="https://www.acme.com" />
              )}
            </FormItem>
            <FormItem  label="Repeat test cases for every page like">
              { getFieldDecorator( "url", {
                initialValue: "",
                rules: [{
                  required: true,
                  message: "Please enter URL"
                }
                ]
              })(
                <Input placeholder="/news/**" />
              )}
            </FormItem>
            <p>Puppetry will crawl site starting with a given page for internal links. The test cases of the group will applied for every page matching the specified critera.</p>

          </Form>;

    return ( <ErrorBoundary>
      <InstantModal
        className="modal--instant-group-options"
        visible={ isVisible }
        title="Group Options"
        id="cGroupOptionsModal"
        onOk={this.onOK}
        onCancel={() => this.onCancel( record )}
        footer={[
          <Button key="back"
            className="btn--modal-command-cancel"
            onClick={() => this.onCancel( record )}>Cancel</Button>,
          <Button key="submit" type="primary"
            className="btn--modal-command-ok"
            loading={ loading }
            onClick={this.onOK}>
              Save
          </Button>
        ]}
      >
        { true /*record !== null */
          ? deferCommandForm()
          : ( <div className="row--centered"><Spin size="large" tip="Loading..." /></div> )
        }
      </InstantModal>
    </ErrorBoundary> );
  }
}
