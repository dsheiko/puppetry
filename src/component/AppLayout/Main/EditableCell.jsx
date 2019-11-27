/*eslint no-unused-vars: 0*/
import React from "react";
import { Form } from "antd";
import { AbstractEditableCell } from "./EditableCell/AbstractEditableCell";
const connectForm = Form.create();

@connectForm
export class EditableCell extends AbstractEditableCell {

}