import React from "react";
import PropTypes from "prop-types";
import AbstractForm from "component/AbstractForm";
import { Form, Modal, Button, Input } from "antd";
import ErrorBoundary from "component/ErrorBoundary";
import * as classes from "./classes";
import { MODAL_DEFAULT_PROPS } from "constant";
import actions from "action";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import classNames from "classnames";

/*eslint no-useless-escape: 0*/

const FormItem = Form.Item,
      connectForm = Form.create(),
      { TextArea } = Input;

function targetToCsvLine( row ) {
  return `${ row.target },${ row.selector }`
   + ( row.ref ? `,${ row.ref }` : `` )
   + ( row.parentType ? `,${ row.parentType }` : `` );
}

// Mapping state to the props
const mapStateToProps = ( state ) => ({
        isVisible: state.app.editTargetsAsCsvModal,
        targets: state.suite.targets
      }),
      // Mapping actions to the props
      mapDispatchToProps = ( dispatch ) => ({
        action: bindActionCreators( actions, dispatch )
      });

@connect( mapStateToProps, mapDispatchToProps )
@connectForm
export class EditTargetsAsCsvModal extends AbstractForm {

  static propTypes = {
    isVisible: PropTypes.bool.isRequired
  }

  state = {
    displayFilename: ""
  };

  close() {
    this.props.action.setApp({ editTargetsAsCsvModal: false });
  }

  onClickCancel = ( e ) => {
    e.preventDefault();
    this.close();
  }

  onClickOk = ( e ) => {
    const { clearTarget, addTarget, updateSuite } = this.props.action,
          { validateFields } = this.props.form;

    e.preventDefault();
    validateFields( ( err, values ) => {
      if ( err ) {
        return;
      }
      const data = values.csv.split( "\n" )
        .filter( line => line.trim() )
        .map( line => {
          const chunks = line.split( "," ),
                [ target, selector, ref, parentType ] = chunks;

          return {
            target,
            selector,
            ref,
            parentType
          };
        });

      clearTarget();
      data.forEach( chunk => {
        addTarget( chunk );
      });
      updateSuite({
        modified: true
      });
      this.close();
    });
  }

  // Do not update until visible
  shouldComponentUpdate( nextProps ) {
    if ( this.props.targets !== nextProps.targets ) {
      return true;
    }
    if ( this.props.isVisible !== nextProps.isVisible ) {
      return true;
    }
    if ( !nextProps.isVisible ) {
      return false;
    }
    return true;
  }

  render() {
    const { isVisible, targets } = this.props,
          initialValue = !targets ? [] : Object.values( targets )
            .map( targetToCsvLine ).join( "\n" ),
          { getFieldDecorator, getFieldsError } = this.props.form;

    return (
      <ErrorBoundary>
        <Modal
          title="Edit targets as CSV"
          visible={ isVisible }

          className={ classNames({
            "is-opaque": !isVisible
          }) }

          disabled={ this.hasErrors( getFieldsError() )  }
          closable
          { ...MODAL_DEFAULT_PROPS }
          onCancel={this.onClickCancel}
          footer={[
            ( <Button
              autoFocus={ true }
              className={ classes.BTN_OK }
              key="submit"
              type="primary"
              onClick={this.onClickOk}>
              Save
            </Button> ) ]}
        >

          { isVisible ? <Form>
            <div className="markdown">
              Here you can edit targets in CSV (comma-separated values) format.
              Please, define lines representing simple targets as <code>TARGET,SELECTOR</code>
              and chained targets as <code>TARGET,SELECTOR,PARENT_TARGET,PARENT_TYPE</code>
            </div>
            <FormItem  label="Targets">
              { getFieldDecorator( "csv", {
                initialValue
              })(
                <TextArea rows="8" />
              )}
            </FormItem>
          </Form> : null }

        </Modal>
      </ErrorBoundary>
    );
  }
}

