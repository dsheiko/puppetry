import React from "react";
import PropTypes from "prop-types";
import { Form, Input } from "antd";
import { ruleValidateNotEmptyString, ruleValidateVariable } from "service/utils";
import { AbstractEditableCell } from "./EditableCell/AbstractEditableCell";
const FormItem = Form.Item,
      connectForm = Form.create();

@connectForm
export class EditableCell extends AbstractEditableCell {

}