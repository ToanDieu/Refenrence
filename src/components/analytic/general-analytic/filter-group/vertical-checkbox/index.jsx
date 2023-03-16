import React, { Component } from "react";
import PropTypes from "prop-types";

import { Checkbox } from "element-react";

import ss from "classnames";
import c from "./vertical-checkbox.comp.scss";

export default class VerticalCheckbox extends Component {
  static propTypes = {
    children: PropTypes.node
  };

  constructor(props) {
    super(props);
  }

  render = () => (
    <Checkbox.Group className={ss(c["container"])} {...this.props}>
      {this.props.children}
    </Checkbox.Group>
  );
}
