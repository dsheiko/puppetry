import React from "react";
import PropTypes from "prop-types";
import { Icon, Select } from "antd";
import { connect } from "react-redux";
import eventEmitter from "service/eventEmitter";
import * as selectors from "selector/selectors";
import {
  HomeOutlined,
  LoadingOutlined,
  SettingFilled,
  SmileOutlined,
  SyncOutlined,
} from '@ant-design/icons';

// Mapping state to the props
const mapStateToProps = ( state ) => ({
        targets: selectors.getAllTargetsMemoized( state )        
      }),
      // Mapping actions to the props
      mapDispatchToProps = () => ({
      }),
      Option = Select.Option,

      showModal = () => eventEmitter.emit( "showEditTargetsModal" ),

      onEditTargets = ( e ) => {
        e.preventDefault();
        showModal();
      };

const TargetSelect = React.forwardRef(( props, ref ) => {
    const { targets, initialValue } = props,
          
          onSelect = ( value ) => {
            if ( value === null ) {
              props.setFieldsValue({ target: initialValue });
              return showModal();
            }
            props.changeTarget( value );
            props.setFieldsValue({ target: value });
          };
    return (<>
      <Select
        ref={ ref }
        showSearch
        className="select--target"
        defaultValue={ initialValue }
        placeholder="Select a target"
        optionFilterProp="children"
        onSelect={ onSelect }
        filterOption={( input, option ) => {
          const optNode = option.props.children,
                // <option>keyword OR <option><span className="method-title" data-keyword="keyword">
                keyword = typeof optNode === "string" ? optNode : optNode.props[ "data-keyword" ];
          return keyword
            .toLowerCase()
            .indexOf( input.toLowerCase() ) >= 0;
        }}>
        <Option value="page"><span data-keyword="page"><Icon type="file" /> page</span></Option>
        { targets
          .filter( item => item.target )
          .map( ( item, inx ) => ( <Option key={inx} value={ item.target }>
            <span data-keyword={ item.target }><Icon type="scan" /> { item.target }</span>
          </Option> ) ) }
        <Option value={ null } className="edit-option"><span data-keyword="null"><Icon type="plus-square" /> add target</span></Option>
      </Select>
      <a className="edit-targets-link" onClick={ onEditTargets }>Edit targets</a>
    </>);
  });

TargetSelect.propTypes = {
  suiteTargets: PropTypes.object,
  sharedTargets: PropTypes.object,
  changeTarget: PropTypes.func.isRequired,
  setFieldsValue: PropTypes.func.isRequired,
  initialValue: PropTypes.string
}

export default connect( mapStateToProps, mapDispatchToProps, null, { forwardRef: true } )( TargetSelect );